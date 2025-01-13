import React from "react";
import { useHistory } from "react-router-dom"; // For navigation
import { signOut } from "firebase/auth"; // For signing out
import { auth } from "../config/firebase"; // Firebase configuration
import BasicTabs from "./tab";
import UserAvatar from "./avatar";

const Layout = ({ children }) => {
  const history = useHistory(); // Instantiate history object for navigation

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      alert("Successfully signed out!");
      history.push("/");
    } catch (error) {
      console.error("Sign Out Error: ", error);
      alert("Error signing out. Please try again.");
    }
  };

  const layoutStyles = {
    position: "relative", // Allow absolute positioning within this container
    minHeight: "100vh", // Ensure the layout takes up the full height of the viewport
  };

  const avatarContainerStyles = {
    position: "absolute",
    top: "5px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px", // Add spacing between avatar and button
    zIndex: 1, // Ensure it is above other elements
  };

  return (
    <div style={layoutStyles}>
      <div style={avatarContainerStyles}>
        <UserAvatar />
      </div>
      <BasicTabs /> {/* Tab navigation */}
      <div>{children}</div> {/* Render the content of the page */}
    </div>
  );
};

export default Layout;
