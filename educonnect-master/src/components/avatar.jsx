import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { useHistory } from "react-router-dom"; // For React Router v5

export default function UserAvatar() {
  const history = useHistory(); // For navigation

  const handleProfileClick = () => {
    history.push("/profile"); // Navigate to the /profile page
  };

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={handleProfileClick}
      title="Go to Profile"
    >
      <Avatar alt="User Profile" src="img/user.png" />
    </div>
  );
}
