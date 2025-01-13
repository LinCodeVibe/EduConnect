import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useHistory } from "react-router-dom"; // Import useHistory for navigation
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"; // Import Grid for layout
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Import AddCircle icon for the plus sign

export const Dashboard = () => {
  const history = useHistory(); // Instantiate the history object
  const [studyPlans, setStudyPlans] = useState([]); // State to hold study plan data

  // Simulate fetching data from Firebase
  useEffect(() => {
    // This is where you'd normally fetch the data from Firebase
    const fetchedData = [
      {
        id: 1,
        subject: "Mathematics",
        date: "1/12/2025",
        description: "Derivatives, Integrals, Limits",
      },
      {
        id: 2,
        subject: "Physics",
        date: "1/15/2025",
        description: "Kinematics, Thermodynamics",
      },
      {
        id: 3,
        subject: "Chemistry",
        date: "1/18/2025",
        description: "Organic Chemistry, Acids & Bases",
      },
    ];
    setStudyPlans(fetchedData); // Set the fetched data to state
  }, []);

  // Handle navigation to different pages
  const goToGenerateStudyPlan = () => {
    history.push("/generate"); // Navigate to the generate study plan page
  };

  return (
    <Layout>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <div style={{ textAlign: "left", maxWidth: "1000px", width: "100%" }}>
          <h1>
            Welcome to EduConnect. Let's tackle your goals, one step at a time.
            You've got this!
          </h1>

          <h3>In Progress:</h3>

          {/* Grid layout for the cards */}
          <Grid container spacing={3}>
            {studyPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                {" "}
                {/* Responsive layout: 3 columns */}
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontSize: "1.5rem" }}
                    >
                      {plan.subject}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        mb: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Created on: {plan.date}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                      {plan.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Mark as Complete</Button>
                    <Button size="small">Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {/* New card with plus sign to navigate to the generate new study plan page */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  minWidth: 275,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={goToGenerateStudyPlan} // Navigate to generate study plan
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  onClick={goToGenerateStudyPlan} // Navigate to generate study plan
                >
                  <AddCircleIcon sx={{ fontSize: "4rem", color: "#4caf50" }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};
