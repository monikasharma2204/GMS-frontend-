import React from "react";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import {
  TextButton,
  SidebarMenuBox,
} from "../../../Assets/styles/NavbarStyles.jsx";

const Dashboard = () => {
  const location = useLocation();

  const isActive =
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard-second";

  const activeColor = "#fff";
  const inactiveColor = "rgba(255, 255, 255, 0.48)";

  return (
    <Box>
      <Box
        className="sidebar-menu-box"
        sx={[
          SidebarMenuBox,
          {
            color: isActive ? activeColor : inactiveColor,

            "& .hovered-text": {
              color: "currentColor",
            },

            "& .hovered-svg path": {
              stroke: "currentColor",
            },
          },
        ]}
      >
        {/* Icon */}
        <svg
          className="hovered-svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.9997 7.99995C14.3677 7.99995 14.6697 7.70061 14.633 7.33461C14.4793 5.80406 13.8011 4.37375 12.7132 3.28616C11.6254 2.19857 10.1949 1.52064 8.66436 1.36728C8.29769 1.33061 7.99902 1.63261 7.99902 2.00061V7.33395C7.99902 7.51076 8.06926 7.68033 8.19429 7.80535C8.31931 7.93038 8.48888 8.00061 8.66569 8.00061L13.9997 7.99995Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.1399 10.5934C13.7158 11.5964 13.0525 12.4802 12.2079 13.1676C11.3633 13.855 10.3631 14.325 9.2949 14.5366C8.22668 14.7481 7.12289 14.6948 6.08004 14.3813C5.03719 14.0677 4.08703 13.5034 3.31262 12.7378C2.53822 11.9722 1.96315 11.0286 1.6377 9.98935C1.31225 8.95015 1.24632 7.84704 1.44568 6.77647C1.64503 5.70591 2.10361 4.70047 2.78131 3.84807C3.45901 2.99567 4.3352 2.32226 5.33328 1.88672"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Text */}
        <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography className="hovered-text" sx={TextButton}>
            Dashboard
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Dashboard;
