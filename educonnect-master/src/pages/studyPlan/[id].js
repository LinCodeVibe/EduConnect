import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use react-router-dom's useParams hook
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Layout from "../../components/Layout";
import { getAuth } from "firebase/auth";
import { useHistory } from "react-router-dom";

const StudyPlanPage = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Use useParams to get the URL parameter
  const db = getFirestore();
  const auth = getAuth();
  const history = useHistory();

  useEffect(() => {
    const fetchStudyPlan = async () => {
      if (id) {
        try {
          const studyPlanRef = doc(
            db,
            "users",
            auth.currentUser.uid,
            "studyPlans",
            id
          );
          const studyPlanDoc = await getDoc(studyPlanRef);
          if (studyPlanDoc.exists()) {
            setStudyPlan(studyPlanDoc.data());
          } else {
            setError("Study plan not found.");
          }
        } catch (err) {
          setError("Error fetching study plan.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchStudyPlan();
    }
  }, [id, auth.currentUser?.uid]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
      <div
        className="mt-8 p-6 bg-white rounded-lg shadow-md col-md-8 col-md-offset-2"
        style={{
          marginTop: "10px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div className="study-plan-container">
          <h2>Your Study Plan for {studyPlan?.subject}</h2>
          <p>
            <strong>Duration:</strong> {studyPlan?.duration}
          </p>
          <p>
            <strong>Focus Topics:</strong>{" "}
            {studyPlan?.focusTopics || "No topics specified."}
          </p>
          <div>
            <h3>Generated Plan</h3>
            <p>{studyPlan?.generatedPlan}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudyPlanPage;
