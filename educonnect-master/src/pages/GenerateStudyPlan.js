import React from "react";

export const GenerateStudyPlan = (props) => {
  return (
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
              console.log({
                subject,
                duration,
                focusTopics,
              });
            }}
            className="col-md-8 col-md-offset-2"
          >
            <div className="form-group">
              <label htmlFor="subject">1. Which subject do you want to master?</label>
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
              <label htmlFor="duration">2. How long do you want to take to study this subject?</label>
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
                3. To help us better tailor the study plan to your goals, give us a few concepts/topics that you
                want to focus on within the subject (optional).
              </label>
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
        </div>
            {/* Output Section */}
        <div className="row" style={{ marginTop: "30px" }}>
          {GenerateStudyPlan && (
            <div className="col-md-8 col-md-offset-2">
              <div className="output-box" style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <h3>Result of generated Study Plan</h3>
                <p>{GenerateStudyPlan}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
  
};