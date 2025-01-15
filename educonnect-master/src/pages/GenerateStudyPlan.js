import React, { useState } from "react";
import Layout from "../components/Layout";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { generateStudyPlan } from "../services/openai";
import { Loader2 } from "lucide-react";

export const GenerateStudyPlan = () => {
  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const subject = e.target.subject.value;
    const duration = e.target.duration.value;
    const focusTopics = e.target.focusTopics.value;

    try {
      // Generate study plan using OpenAI
      const plan = await generateStudyPlan(subject, duration, focusTopics);
      setGeneratedPlan(plan);

      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        const studyPlansRef = collection(
          doc(db, "users", userUid),
          "studyPlans"
        );

        // Save both user preferences and generated plan
        await addDoc(studyPlansRef, {
          subject,
          duration,
          focusTopics,
          generatedPlan: plan,
          createdAt: new Date(),
        });

        alert("Study plan generated and saved successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate or save study plan. Please try again.");
    } finally {
      setLoading(false);
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
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" />
                    Generating Plan...
                  </span>
                ) : (
                  "Generate Study Plan"
                )}
              </button>
            </form>
            {/* Output Section */}
            {generatedPlan && (
              <div
                className="mt-8 p-6 bg-white rounded-lg shadow-md col-md-8 col-md-offset-2"
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3 className="text-xl font-semibold mb-4">Your Study Plan</h3>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {generatedPlan}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
