import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";

export const UserProfile = () => {
  const [learningPreferences, setLearningPreferences] = useState({
    styles: "",
    methods: "",
    additionalNotes: "",
  });

  const [savedPreferences, setSavedPreferences] = useState(null); // State to hold saved preferences
  const [userId, setUserId] = useState(null);
  const [isPreferencesSaved, setIsPreferencesSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  const history = useHistory();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        // Fetch preferences after authentication is confirmed
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.learningPreferences) {
              setLearningPreferences(data.learningPreferences);
              setSavedPreferences(data.learningPreferences);
              setIsPreferencesSaved(true);
            }
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      }
      setIsLoading(false); // Authentication and data fetching completed
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePreferencesToFirebase = async (preferences, userId) => {
    if (!userId) return;

    try {
      if (isPreferencesSaved) {
        await setDoc(
          doc(db, "users", userId),
          { learningPreferences: preferences },
          { merge: true }
        );
        alert("Changes saved successfully!");
      } else {
        await setDoc(doc(db, "users", userId), {
          learningPreferences: preferences,
        });
        alert("Preferences saved successfully!");
        setIsPreferencesSaved(true);
      }
      setSavedPreferences(preferences); // Update saved preferences after saving
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    savePreferencesToFirebase(learningPreferences, userId);
  };

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5">Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <p
          onClick={() => history.push("/dashboard")} // Navigate to the landing page
          style={{ cursor: "pointer" }}
        >
          ← Back to Dashboard
        </p>

        <Typography variant="h5" sx={{ fontSize: "2.5rem", mb: 2 }}>
          Learning Preferences
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mb: 4,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "1.2rem", // Apply font size to the form container
          }}
        >
          <TextField
            fullWidth
            select
            label="Learning Style"
            name="styles"
            value={learningPreferences.styles}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ style: { fontSize: "1.2rem" } }}
            inputProps={{ style: { fontSize: "1.2rem" } }}
          >
            <MenuItem value="Visual">Visual</MenuItem>
            <MenuItem value="Auditory">Auditory</MenuItem>
            <MenuItem value="Kinesthetic">Kinesthetic</MenuItem>
            <MenuItem value="Reading/Writing">Reading/Writing</MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Preferred Methods of Learning"
            placeholder="e.g., Group discussions, video tutorials"
            name="methods"
            value={learningPreferences.methods}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ style: { fontSize: "1.2rem" } }}
            inputProps={{ style: { fontSize: "1.2rem" } }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Additional Notes"
            name="additionalNotes"
            value={learningPreferences.additionalNotes}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ style: { fontSize: "1.2rem" } }}
            inputProps={{ style: { fontSize: "1.2rem" } }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, fontSize: "1.2rem", padding: "0.5rem 1.5rem" }}
          >
            {isPreferencesSaved ? "Save Changes" : "Save Preferences"}
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
