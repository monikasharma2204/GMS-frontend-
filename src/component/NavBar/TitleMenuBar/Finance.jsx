import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  SidebarMenuBox,
  ButtonOnNavBarWithRightArrow,
  DropdownMenuBox,
  TextButton,
  TextMain,
  Dropdownmenu,
} from "../../../Assets/styles/NavbarStyles.jsx";

// const ButtonOnNavBarWithRightArrow = {
//   display: "flex",
//   width: "222px",
//   height: "51px",
//   alignItems: "center",
//   flexShrink: 0,
//   "&:hover svg path": {
//     stroke: "#FFF",
//   },
//   "&:hover .hovered-text": {
//     color: "#FFF",
//   },
//   "&:hover .hovered-box": {
//     backgroundColor: "#FFF",
//   },
//   cursor: "pointer",
// };

const NewTab = {
  // position: "absolute",
  top: "702px",
  right: "-270px",
  height: "109px",
  cursor: "default",
  // borderLeft: "1px solid #E4E8EC",
  zIndex: 99,
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  filter:
    "drop-shadow(0px 8px 8px rgba(24, 39, 75, 0.08)) drop-shadow(0px 4px 6px rgba(24, 39, 75, 0.12))",
};


const Finance = ({ handleClick, showRedBox }) => {
  const location = useLocation();

  const isActive = location.pathname.startsWith("/finance/outstandingreceivble");
  return (
    <>
      <Box
        onClick={handleClick}
        className="sidebar-menu-box"
        sx={[SidebarMenuBox, DropdownMenuBox]}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "12px" }}>
          <Box
            sx={{
              marginRight: "6px",
            }}
          >
            

            <svg className="hovered-svg hovered-svg-arrow" width="4" height="8" viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0 8V0L4 4Z" fill={isActive ? "#fff" : "rgba(255,255,255,0.48)"} strokeWidth="0" />
            </svg>
          </Box>

          <svg
            className="hovered-svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_21146_2463)">
              <path
                d="M7.99967 14.6666C11.6816 14.6666 14.6663 11.6818 14.6663 7.99992C14.6663 4.31802 11.6816 1.33325 7.99967 1.33325C4.31778 1.33325 1.33301 4.31802 1.33301 7.99992C1.33301 11.6818 4.31778 14.6666 7.99967 14.6666Z"
                stroke="#D0D0D0"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6663 5.33325H6.66634C6.31272 5.33325 5.97358 5.47373 5.72353 5.72378C5.47348 5.97383 5.33301 6.31296 5.33301 6.66659C5.33301 7.02021 5.47348 7.35935 5.72353 7.60939C5.97358 7.85944 6.31272 7.99992 6.66634 7.99992H9.33301C9.68663 7.99992 10.0258 8.14039 10.2758 8.39044C10.5259 8.64049 10.6663 8.97963 10.6663 9.33325C10.6663 9.68687 10.5259 10.026 10.2758 10.2761C10.0258 10.5261 9.68663 10.6666 9.33301 10.6666H5.33301"
                stroke="#D0D0D0"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12V4"
                stroke="#D0D0D0"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_21146_2463">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <Typography
            className="hovered-text"
            sx={[
              TextButton,
              {
                color: showRedBox === "Finance" ? "#05595B" : "#FFF",
              },
            ]}
          >
            Finance
          </Typography>
        </Box>
      </Box>
      {showRedBox === "Finance" && (
        <Box
          sx={NewTab}
          data-dropdown-menu
          onClick={(e) => e.stopPropagation()}
        >
          <Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/finance/outstandingreceivble">
                <Typography sx={TextMain}>Receivable</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Typography sx={TextMain}>Payable</Typography>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Typography sx={TextMain}>Transaction</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Finance;
