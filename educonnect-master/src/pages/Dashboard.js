// import React from "react";
// import Layout from "../components/Layout";

// export const Dashboard = () => {
//   return (
//     <Layout>
//       <h1>This is the dashboard page!</h1>
//     </Layout>
//   );
// };

import React from "react";
import Layout from "../components/Layout";
import { useHistory } from "react-router-dom"; // Import useHistory for navigation

export const Dashboard = () => {
  const history = useHistory(); // Instantiate the history object

  // Handle navigation to different pages
  const goToGenerateStudyPlan = () => {
    history.push("/generate"); // Navigate to the generate study plan page
  };

  const goToUserProfile = () => {
    history.push("/profile"); // Navigate to the user profile page
  };

  return (
    <Layout>
      <h1>This is the dashboard page!</h1>

      {/* Add two buttons for navigation */}
      <div>
        <button onClick={goToGenerateStudyPlan}>Generate New Study Plan</button>
        <button onClick={goToUserProfile}>Go to User Profile</button>
      </div>
    </Layout>
  );
};
