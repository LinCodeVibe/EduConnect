import React from "react";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom"; // Use Link for navigation

export default function UserAvatar() {
  return (
    <div title="Go to Profile">
      <Link to="/profile">
        <Avatar
          alt="User Profile"
          src="img/user.png"
          style={{ cursor: "pointer" }}
        />
      </Link>
    </div>
  );
}
