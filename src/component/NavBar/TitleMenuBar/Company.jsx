import React from "react";
import { Box, Typography } from "@mui/material";
import { Outlet, Link, useLocation } from "react-router-dom";

import {
  SidebarMenuBox,
  DropdownMenuBox,
  TextButton,
  TextMain,
  Dropdownmenu,
} from "../../../Assets/styles/NavbarStyles.jsx";

const NewTab = {
  top: "191.5px",
  right: "-180px",
  Color: "#FFF",
  height: "76px",
  cursor: "default",
  zIndex: 999,
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  filter:
    "drop-shadow(0px 8px 8px rgba(24, 39, 75, 0.08)) drop-shadow(0px 4px 6px rgba(24, 39, 75, 0.12))",
};

const Company = ({ handleClick, showRedBox }) => {
  const location = useLocation();
  const isCompanyProfileActive = location.pathname === "/company/company-profile";
  const isBankActive = location.pathname === "/company/bank";
  const isActive = location.pathname.startsWith("/company") && !isCompanyProfileActive && !isBankActive;

  const activeColor = "#fff";
  const inactiveColor = "rgba(255, 255, 255, 0.48)";

  return (
    <>
      {/* Main Sidebar Item */}
      <Box
        className="sidebar-menu-box"
        onClick={handleClick}
        sx={[
          SidebarMenuBox,
          DropdownMenuBox(showRedBox, "Company"),
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
        <Box sx={{ display: "flex", alignItems: "center", ml: "12px" }}>
          {/* Arrow */}
          <Box sx={{ mr: "6px" }}>
            {/* <svg
              className="hovered-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="12"
              viewBox="0 0 11 24"
              fill="none"
            >
              <path
                d="M2.25 19.4994C2.15164 19.5006 2.05411 19.4812 1.96369 19.4424C1.87328 19.4037 1.79197 19.3464 1.725 19.2744C1.425 18.9744 1.425 18.5094 1.725 18.2094L7.95 11.9844L1.725 5.77437C1.425 5.47437 1.425 5.00938 1.725 4.70938C2.025 4.40938 2.49 4.40938 2.79 4.70938L9.525 11.4744C9.825 11.7744 9.825 12.2394 9.525 12.5394L2.775 19.2744C2.625 19.4244 2.43 19.4994 2.25 19.4994Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
                <svg className="hovered-svg hovered-svg-arrow" width="4" height="8" viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0 8V0L4 4Z" fill="currentColor" stroke="none" strokeWidth= "0"  />
            </svg>
          </Box>

          {/* Company Icon */}
          <svg
            className="hovered-svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66699 8H9.33366"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.66699 5.33325H9.33366"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33366 14.0001V12.0001C9.33366 11.6465 9.19318 11.3073 8.94313 11.0573C8.69309 10.8072 8.35395 10.6667 8.00033 10.6667C7.6467 10.6667 7.30757 10.8072 7.05752 11.0573C6.80747 11.3073 6.66699 11.6465 6.66699 12.0001V14.0001"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.99967 6.66675H2.66634C2.31272 6.66675 1.97358 6.80722 1.72353 7.05727C1.47348 7.30732 1.33301 7.64646 1.33301 8.00008V12.6667C1.33301 13.0204 1.47348 13.3595 1.72353 13.6096C1.97358 13.8596 2.31272 14.0001 2.66634 14.0001H13.333C13.6866 14.0001 14.0258 13.8596 14.2758 13.6096C14.5259 13.3595 14.6663 13.0204 14.6663 12.6667V6.00008C14.6663 5.64646 14.5259 5.30732 14.2758 5.05727C14.0258 4.80722 13.6866 4.66675 13.333 4.66675H11.9997"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 14V3.33333C4 2.97971 4.14048 2.64057 4.39052 2.39052C4.64057 2.14048 4.97971 2 5.33333 2H10.6667C11.0203 2 11.3594 2.14048 11.6095 2.39052C11.8595 2.64057 12 2.97971 12 3.33333V14"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Text */}
          <Typography className="hovered-text" sx={TextButton}>
            Company
          </Typography>
        </Box>
      </Box>

      {/* Dropdown */}
      {showRedBox === "Company" && (
        <Box 
          sx={NewTab} 
          data-dropdown-menu
          onClick={(e) => e.stopPropagation()}
        >
          <Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/company/company-profile">
                <Typography sx={TextMain} className={isCompanyProfileActive ? "active" : ""}>Company Profile</Typography>
              </Link>
            </Box>

            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/company/bank">
                <Typography sx={TextMain} className={isBankActive ? "active" : ""}>Bank</Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Company;
