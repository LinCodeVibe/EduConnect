import React, {useState} from "react";
import axios from "axios";
import Layout from "../components/Layout";

export const GenerateStudyPlan = (props) => {
  const [studyPlan, setStudyPlan] = useState(""); // State to store the generated study plan
  const [loading, setLoading] = useState(false); // State to show loading indicator
  const [error, setError] = useState(""); // State to store errors
  
  const generateStudyPlan = async (subject, duration, focusTopics) => {
    setLoading(true);
    setError("");
    setStudyPlan("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003", // Specify the OpenAI model
          prompt: `Create a detailed study plan for the subject "${subject}" over a duration of "${duration}". Focus on the following topics: ${focusTopics || "general concepts"}.\n`,
          max_tokens: 500, // Adjust the token limit as needed
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Replace with your OpenAI API key
          },
        }
      );

      // Extract the study plan from the response
      setStudyPlan(response.data.choices[0].text.trim());
    } catch (err) {
      setError("Failed to generate the study plan. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div id="study-plan" className="text-center">
        <div className="container">
          <div className="col-md-10 col-md-offset-1 section-title">
            <h2>Generate Your Study Plan</h2>
          </div>
          <div className="row">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const subject = e.target.subject.value;
                const duration = e.target.duration.value;
                const focusTopics = e.target.focusTopics.value;

                // Call OpenAI/ChatGPT API or handle the study plan generation logic here
                  generateStudyPlan(subject, duration, focusTopics);

              }}
              className="col-md-8 col-md-offset-2"
            >
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
                <label htmlFor="focusTopics">
                  3.  To better tailor the study plan to your goals, give
                  us a few concepts/topics that you want to focus on within the
                  subject (optional).
                </label>
                <textarea
                  id="focusTopics"
                  name="focusTopics"
                  className="form-control"
                  placeholder="e.g., Algebra, Data Structures"
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? "Generating..." : "Generate Study Plan"}
              </button>
            </form>
          </div>
          {/* Output Section */}
          <div className="row" style={{ marginTop: "30px" }}>
          {loading && <p>Loading...</p>}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {studyPlan && (
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
                  <pre>{studyPlan}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
