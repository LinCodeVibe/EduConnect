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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export const Dashboard = () => {
  const history = useHistory(); // Instantiate the history object
  const [studyPlans, setStudyPlans] = useState([]); // State to hold study plan data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const db = getFirestore(); // Firestore instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        history.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [history]);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchStudyPlans = async () => {
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;

        try {
          const studyPlansRef = collection(
            doc(db, "users", userUid),
            "studyPlans"
          );

          const q = query(studyPlansRef); // Query to get all study plans
          const querySnapshot = await getDocs(q);

          const fetchedData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setStudyPlans(fetchedData);
        } catch (error) {
          console.error("Error fetching study plans: ", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchStudyPlans();
    }
  }, [isAuthenticated, db]);

  const handleDelete = async (id) => {
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;

      try {
        const studyPlanRef = doc(
          collection(doc(db, "users", userUid), "studyPlans"),
          id
        );

        await deleteDoc(studyPlanRef);

        setStudyPlans((prevPlans) =>
          prevPlans.filter((plan) => plan.id !== id)
        );
        console.log("Study plan deleted successfully!");
      } catch (error) {
        console.error("Error deleting study plan: ", error);
      }
    }
  };

  const goToGenerateStudyPlan = () => {
    history.push("/generate");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <div style={{ textAlign: "left", maxWidth: "1000px", width: "100%" }}>
          <h1 style={{ marginBottom: "30px" }}>
            Welcome to EduConnect. Let's tackle your goals, one step at a time.
            You've got this!
          </h1>

          {studyPlans.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "30px",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.8rem",
                  color: "#4caf50",
                  marginBottom: "10px",
                }}
              >
                Looks like your study plans are on break!
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                <strong>
                  Hit that "+" button to get a head start on your study goals!
                </strong>
              </Typography>
            </div>
          )}

          {studyPlans.length > 0 && <h3>Your current study plans:</h3>}

          {/* Grid layout for the cards */}
          <Grid container spacing={3}>
            {studyPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
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
                      Created on:{" "}
                      {plan.createdAt
                        ? new Date(
                            plan.createdAt.seconds * 1000
                          ).toLocaleDateString()
                        : "Unknown"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                      {plan.focusTopics || "No topics specified."}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Mark as Complete</Button>
                    <Button size="small" onClick={() => handleDelete(plan.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {/* New card with plus sign */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  minWidth: 275,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={goToGenerateStudyPlan}
              >
                <CardContent>
                  <AddCircleIcon
                    sx={{
                      fontSize: "4rem",
                      color: "#4caf50",
                    }}
                  />
                  {studyPlans.length > 0 && (
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontSize: "1.5rem" }}
                      marginTop="10px"
                    >
                      One more doesn't hurt, does it?
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};
