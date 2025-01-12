import React from "react";
import BasicTabs from "./tab";
import UserAvatar from "./avatar";

const Layout = ({ children }) => {
  const layoutStyles = {
    position: "relative", // Allow absolute positioning within this container
    minHeight: "100vh", // Ensure the layout takes up the full height of the viewport
  };

  const avatarContainerStyles = {
    position: "absolute", // Position relative to the layout container
    top: "5px", // Position 10px from the top
    right: "20px", // Position 10px from the right
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
