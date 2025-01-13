import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom"; // Import useLocation from react-router-dom

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const location = useLocation(); // Get the current location
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    // Set the active tab based on the current route
    if (location.pathname === "/profile") {
      setValue(1); // User Profile page
    } else {
      setValue(0); // Dashboard page
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Dashboard"
            component={Link}
            to="/dashboard"
            {...a11yProps(0)}
            sx={{ fontSize: "1.5rem" }}
          />
          <Tab
            label="User Profile"
            component={Link}
            to="/profile"
            {...a11yProps(1)}
            sx={{ fontSize: "1.5rem" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}></CustomTabPanel>
    </Box>
  );
}
