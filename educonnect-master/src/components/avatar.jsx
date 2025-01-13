// import React from "react";
// import Avatar from "@mui/material/Avatar";
// import { Link } from "react-router-dom"; // Use Link for navigation

// export default function UserAvatar() {
//   return (
//     <div title="Go to Profile">
//       <Link to="/profile">
//         <Avatar
//           alt="User Profile"
//           src="img/user.png"
//           style={{ cursor: "pointer" }}
//         />
//       </Link>
//     </div>
//   );
// }

import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useHistory } from "react-router-dom"; // For navigation
import { signOut } from "firebase/auth"; // Firebase authentication
import { auth } from "../config/firebase"; // Firebase config

export default function UserAvatar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    history.push("/profile"); // Navigate to profile page
    handleMenuClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out user
      alert("Successfully signed out!");
      history.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Sign Out Error:", error);
      alert("Error signing out. Please try again.");
    }
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            alt="User Profile"
            src="img/user.png"
            sx={{ cursor: "pointer", width: 32, height: 32 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              mt: 1.5,
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}
