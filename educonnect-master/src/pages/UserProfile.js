import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Box, Typography, MenuItem, TextField, Button } from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

export const UserProfile = () => {
  // State for learning preferences
  const [learningPreferences, setLearningPreferences] = useState({
    styles: "",
    methods: "",
    additionalNotes: "",
  });

  const [userId, setUserId] = useState(null); // State to hold the user ID
  const [isPreferencesSaved, setIsPreferencesSaved] = useState(false); // State to track if preferences are saved

  // Get the current user's ID (UID) from Firebase Authentication
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Store the user UID if they are logged in

      // Fetch existing preferences if available
      const fetchPreferences = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.learningPreferences) {
              setLearningPreferences(data.learningPreferences);
              setIsPreferencesSaved(true); // Mark preferences as already saved
            }
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      };

      fetchPreferences();
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to save preferences to Firebase
  const savePreferencesToFirebase = async (preferences, userId) => {
    if (!userId) return; // Check if userId exists (if the user is logged in)

    try {
      if (isPreferencesSaved) {
        // If preferences are already saved, update the document with new preferences
        await setDoc(
          doc(db, "users", userId),
          { learningPreferences: preferences },
          { merge: true }
        );
        alert("Changes saved successfully!");
      } else {
        // If this is the first time saving preferences, create the new document
        await setDoc(doc(db, "users", userId), {
          learningPreferences: preferences,
        });
        alert("Preferences saved successfully!");
        setIsPreferencesSaved(true); // Mark preferences as saved
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save preferences to Firebase
    savePreferencesToFirebase(learningPreferences, userId);
  };

  return (
    <Layout>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 3, maxWidth: 600, mx: "auto" }}
      >
        <Typography variant="h5" sx={{ fontSize: "2.5rem", mb: 2 }}>
          Learning Preferences
        </Typography>

        {/* Learning Style */}
        <TextField
          fullWidth
          select
          label="Learning Style"
          name="styles"
          value={learningPreferences.styles}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          inputProps={{ style: { fontSize: "1.1rem" } }}
        >
          <MenuItem value="Visual">Visual</MenuItem>
          <MenuItem value="Auditory">Auditory</MenuItem>
          <MenuItem value="Kinesthetic">Kinesthetic</MenuItem>
          <MenuItem value="Reading/Writing">Reading/Writing</MenuItem>
        </TextField>

        {/* Preferred Methods of Learning */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Preferred Methods of Learning (Ex.Group discussions, video tutorials, etc.)"
          name="methods"
          value={learningPreferences.methods}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          inputProps={{ style: { fontSize: "1.1rem" } }}
        />

        {/* Additional Notes */}
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Additional Notes"
          name="additionalNotes"
          value={learningPreferences.additionalNotes}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ style: { fontSize: "1.1rem" } }}
          inputProps={{ style: { fontSize: "1.1rem" } }}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2, fontSize: "1rem", padding: "0.5rem 1.5rem" }}
        >
          {isPreferencesSaved ? "Save Changes" : "Save Preferences"}
        </Button>
      </Box>
    </Layout>
  );
};
