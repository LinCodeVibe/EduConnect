import React, { useState } from "react";
import Layout from "../components/Layout";
import { Box, Typography, MenuItem, TextField, Button } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const UserProfile = () => {
  // State for learning preferences
  const [learningPreferences, setLearningPreferences] = useState({
    styles: "",
    methods: "",
    additionalNotes: "",
  });

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
    try {
      await setDoc(
        doc(db, "users", userId),
        { learningPreferences: preferences },
        { merge: true }
      );
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save preferences (e.g., send to backend or Firebase)
    console.log("Saved Preferences:", learningPreferences);
  };

  return (
    <Layout>
      {/* <h1>This is the user profile page!</h1> */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
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
          Save Preferences
        </Button>
      </Box>
    </Layout>
  );
};