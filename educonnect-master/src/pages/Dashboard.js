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
  updateDoc,
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
            completed: doc.data().completed || false,
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

  const handleMarkComplete = async (id) => {
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;

      try {
        const studyPlanRef = doc(
          collection(doc(db, "users", userUid), "studyPlans"),
          id
        );

        await updateDoc(studyPlanRef, {
          completed: true,
        });

        // Update local state
        setStudyPlans((prevPlans) => {
          // Filter out the plan that is marked as complete from the current plans
          const updatedPlans = prevPlans.map((plan) =>
            plan.id === id
              ? { ...plan, completed: true, completedAt: new Date() }
              : plan
          );

          return updatedPlans;
        });

        console.log("Study plan marked as complete!");
      } catch (error) {
        console.error("Error marking study plan as complete: ", error);
      }
    }
  };

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

  // Filter plans by completion status
  const currentPlans = studyPlans.filter((plan) => !plan.completed);
  const completedPlans = studyPlans.filter((plan) => plan.completed);

  return (
    <Layout>
      {/* Title Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 40px", // Add padding for spacing
          borderRadius: "12px", // Rounded corners for a soft appearance
          textAlign: "center",
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "2.5rem", // Large font size for emphasis
              fontWeight: "700", // Bold the font for prominence
              color: "#FF6B6B", // Warm color for the title (matching the friendly tone)
              marginRight: "20px", // Space between the text and the icon
            }}
          >
            Welcome to EduConnect!
          </Typography>

          <Typography
            sx={{
              fontSize: "2rem", // Slightly smaller font size for the sub-message
              color: "#333", // Neutral color for the sub-message
              marginTop: "10px", // Space between the two lines
              fontWeight: "500",
            }}
          >
            Let's tackle your goals, one step at a time!
          </Typography>
        </Box>

        <img
          src="/img/studyplanner1.png"
          alt="Greeting illustration"
          style={{
            width: "150px",
            height: "auto",
            marginLeft: "60px",
          }}
        />
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: "1400px",
            margin: "0 auto",
            alignItems: "flex-start",
          }}
        >
          {/* Left Section - Current and Completed Study Plans */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Current Study Plans */}
              <Box sx={{ mb: 3 }}>
                {currentPlans.length === 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "20px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "10px",
                      marginBottom: "30px",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: "1.8rem",
                        color: "#4caf50",
                        marginBottom: "20px",
                      }}
                    >
                      Looks like your study plans are on break!
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                      <strong>
                        Hit that "+" button to get a head start on your study
                        goals!
                      </strong>
                    </Typography>
                  </div>
                )}

                {currentPlans.length > 0 && (
                  <h3 style={{ marginBottom: "20px" }}>
                    Your current study plans:
                  </h3>
                )}

                {/* Grid layout for current study plans */}
                <Grid container spacing={3}>
                  {currentPlans.map((plan) => (
                    <Grid item xs={12} sm={6} md={4} key={plan.id}>
                      <Card
                        sx={{
                          minWidth: 275,
                          height: "100%",
                          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)", // Soft shadow for card
                          borderRadius: "12px", // Rounded corners
                          transition: "transform 0.3s ease-in-out", // Add hover effect
                          "&:hover": {
                            transform: "scale(1.05)", // Scale card on hover
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="div"
                            sx={{
                              fontSize: "1.5rem",
                              fontWeight: "600", // Bold subject text
                              color: "#1976d2", // Blue color for emphasis
                            }}
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
                        <CardActions
                          style={{ marginBottom: "10px", marginLeft: "5px" }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ marginRight: "5px" }}
                            onClick={() =>
                              history.push(`/studyPlan/${plan.id}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ marginRight: "5px" }}
                            onClick={() => handleMarkComplete(plan.id)}
                          >
                            Mark as Complete
                          </Button>
                          <Button
                            size="small"
                            color="error"
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
                        // marginTop: "20px",
                        cursor: "pointer",
                        textAlign: "center",
                        boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
                        borderRadius: "12px",
                        transition: "transform 0.3s ease-in-out", // Hover effect for the add button
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
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
                            sx={{
                              fontSize: "1.5rem",
                              marginTop: "10px",
                              color: "#333", // Darker text for a stronger contrast
                            }}
                          >
                            One more doesn't hurt, does it?
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Completed Study Plans */}
              {completedPlans.length > 0 && (
                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      marginBottom: "20px",
                      color: "#4caf50",
                      fontWeight: "600",
                    }}
                  >
                    Completed study plans:
                  </Typography>
                  <Grid container spacing={3}>
                    {completedPlans.map((plan) => (
                      <Grid item xs={12} sm={6} md={4} key={plan.id}>
                        <Card
                          sx={{
                            minWidth: 275,
                            height: "100%",
                            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
                            borderRadius: "12px",
                            backgroundColor: "#f8f8f8",
                            opacity: 0.9,
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{
                                fontSize: "1.5rem",
                                fontWeight: "600",
                                color: "#4caf50",
                              }}
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
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1rem" }}
                            >
                              {plan.focusTopics || "No topics specified."}
                            </Typography>
                          </CardContent>
                          <CardActions
                            style={{ marginBottom: "10px", marginLeft: "5px" }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleMarkComplete(plan.id)}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDelete(plan.id)}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Section - Study Preferences */}
          <Grid item xs={12} md={3} sx={{ ml: 10 }}>
            <Box sx={{ mt: 6, textAlign: "center" }}>
              {isPreferencesSaved ? (
                <Card
                  sx={{
                    p: 3,
                    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
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
                    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
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
