import React from "react";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  TextButton,
  SidebarMenuBox,
} from "../../../Assets/styles/NavbarStyles.jsx";

const UserAndPermission = () => {
  const location = useLocation();
  const isActive = location.pathname === "/userandpermission";

  const activeColor = "#fff";
  const inactiveColor = "rgba(255, 255, 255, 0.48)";

  return (
    <>
      <Link to="/userandpermission">
        <Box>
          <Box
            sx={[
              SidebarMenuBox,
              isActive && {
                ".hovered-text": {
                  color: "#fff",
                },
                ".hovered-svg path": {
                  stroke: "#fff",
                },
              },
            ]}
            className="sidebar-menu-box"
          >
            <svg
             className="hovered-svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33301 13.9999C1.33295 12.9734 1.6291 11.9688 2.1859 11.1065C2.74271 10.2442 3.53652 9.56087 4.47207 9.13856C5.40762 8.71626 6.44517 8.57289 7.46018 8.72567C8.4752 8.87845 9.42456 9.32089 10.1943 9.99989"
                stroke={isActive ? "#fff" : "rgba(255, 255, 255, 0.48)"}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66634 8.66667C8.50729 8.66667 9.99967 7.17428 9.99967 5.33333C9.99967 3.49238 8.50729 2 6.66634 2C4.82539 2 3.33301 3.49238 3.33301 5.33333C3.33301 7.17428 4.82539 8.66667 6.66634 8.66667Z"
                stroke={isActive ? "#fff" : "rgba(255, 255, 255, 0.48)"}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.667 12.6666L12.0003 13.9999L14.667 11.3333"
                stroke={isActive ? "#fff" : "rgba(255, 255, 255, 0.48)"}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Typography 
              className="hovered-text" 
              sx={[
                TextButton,
                isActive && {
                  color: "#fff",
                },
              ]}
            >
              User & Permission
            </Typography>
          </Box>
        </Box>
      </Link>
    </>
  );
};

export default UserAndPermission;
