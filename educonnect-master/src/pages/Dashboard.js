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
  getDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export const Dashboard = () => {
  const history = useHistory(); // Instantiate the history object
  const [studyPlans, setStudyPlans] = useState([]); // State to hold study plan data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [learningPreferences, setLearningPreferences] = useState(null); // State to hold learning preferences
  const [isPreferencesSaved, setIsPreferencesSaved] = useState(false); // State to track if preferences are saved
  const db = getFirestore(); // Firestore instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Fetch learning preferences
        const userUid = user.uid;
        try {
          const docRef = doc(db, "users", userUid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.learningPreferences) {
              setLearningPreferences(data.learningPreferences);
              setIsPreferencesSaved(true);
            }
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
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

  const navigateToUserProfile = () => {
    history.push("/profile");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      {/* Title Section */}
      <Box
        sx={{
          textAlign: "center",
          borderRadius: "8px", // Optional: Add some rounding for style
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>
          Welcome to EduConnect. <br /> Let's tackle your goals, one step at a
          time.
        </h1>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          marginBottom: "50px",
        }}
      >
        <Grid
          container
          spacing={4} // Adjust spacing between the grid items
          sx={{
            maxWidth: "1400px", // Define maximum width for the content
            margin: "0 auto", // Center align the container
            alignItems: "flex-start", // Align items at the top
          }}
        >
          {/* Left Section - Title and Study Plans */}
          <Grid item xs={12} md={8}>
            {studyPlans.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
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

            {/* Grid layout for study plans */}
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
                      <Button
                        size="small"
                        onClick={() => handleDelete(plan.id)}
                      >
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
          </Grid>

          {/* Right Section - Learning Preferences */}
          <Grid item xs={12} md={3} sx={{ ml: 10 }}>
            <Box sx={{ mt: 6, textAlign: "center" }}>
              {isPreferencesSaved ? (
                <Card
                  sx={{
                    p: 3,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: "20px",
                        fontWeight: "bold",
                        color: "#1976d2",
                        borderBottom: "2px solid #1976d2",
                        pb: 1,
                      }}
                    >
                      Your Learning Preferences
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        textAlign: "left",
                      }}
                    >
                      <Typography sx={{ fontSize: "1.3rem" }}>
                        <strong>Style:</strong>{" "}
                        {learningPreferences.styles || "N/A"}
                      </Typography>
                      <Typography sx={{ fontSize: "1.3rem" }}>
                        <strong>Methods:</strong>{" "}
                        {learningPreferences.methods || "N/A"}
                      </Typography>
                      <Typography sx={{ fontSize: "1.3rem" }}>
                        <strong>Notes:</strong>{" "}
                        {learningPreferences.additionalNotes || "N/A"}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={navigateToUserProfile}
                      sx={{ mt: 2, fontSize: "1.2rem" }}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  sx={{
                    p: 3,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        color: "#1976d2",
                        borderBottom: "2px solid #1976d2",
                        pb: 1,
                      }}
                    >
                      Want better study plans?
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "gray",
                      }}
                    >
                      Share your learning habits so we can better tailor your
                      study plan to your preferences!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={navigateToUserProfile}
                      sx={{ mt: 2, fontSize: "1.2rem" }}
                    >
                      Let's go
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};
