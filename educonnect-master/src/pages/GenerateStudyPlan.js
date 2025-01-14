import React from "react";
import Layout from "../components/Layout";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

export const GenerateStudyPlan = () => {
  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subject = e.target.subject.value;
    const duration = e.target.duration.value;
    const focusTopics = e.target.focusTopics.value;

    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;

      try {
        // Reference to the user's "studyPlans" collection in Firestore
        const studyPlansRef = collection(
          doc(db, "users", userUid),
          "studyPlans"
        );

        // Add the study plan to Firestore
        await addDoc(studyPlansRef, {
          subject,
          duration,
          focusTopics,
          createdAt: new Date(),
        });

        alert("Study plan saved successfully!");
        e.target.reset(); // Clear the form
      } catch (error) {
        console.error("Error saving study plan: ", error);
        alert("Failed to save study plan. Please try again.");
      }
    } else {
      alert("You need to be signed in to save a study plan.");
    }
  };

  return (
    <Layout>
      <p
        onClick={() => history.push("/dashboard")}
        style={{
          cursor: "pointer",
          marginTop: "-20px",
          marginLeft: "40px",
          marginBottom: "30px",
        }}
      >
        ← Back to Dashboard
      </p>
      <div id="study-plan" className="text-center">
        <div className="container">
          <div className="col-md-10 col-md-offset-1 section-title">
            <h2>Generate Your Study Plan</h2>
          </div>
          <div className="row">
            <form onSubmit={handleSubmit} className="col-md-8 col-md-offset-2">
              <div className="form-group">
                <label htmlFor="subject">
                  1. Which subject do you want to master?
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-control"
                  placeholder="e.g., Mathematics, History, Programming"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">
                  2. How long do you want to take to study this subject?
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  className="form-control"
                  placeholder="e.g., 1 month, 6 weeks, 3 days"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="focusTopics">3. Focus Topics (optional)</label>
                <textarea
                  id="focusTopics"
                  name="focusTopics"
                  className="form-control"
                  placeholder="e.g., Algebra, World War II, Data Structures"
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Generate Study Plan
              </button>
            </form>
            {/* Output Section */}
            <div className="row" style={{ marginTop: "30px" }}>
              {GenerateStudyPlan && (
                <div className="col-md-8 col-md-offset-2">
                  <div
                    className="output-box"
                    style={{
                      padding: "20px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <h3>Result of generated Study Plan</h3>
                    <p>{GenerateStudyPlan}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
