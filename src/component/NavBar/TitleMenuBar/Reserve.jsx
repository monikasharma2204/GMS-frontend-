import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ProtectedLink from "../../Common/ProtectedLink";
import {
  TextButton,
  SidebarMenuBox,
} from "../../../Assets/styles/NavbarStyles.jsx";

const Reserve = () => {
  const location = useLocation();
  const isActive = location.pathname === "/reserve";

  const activeColor = "#fff";
  const inactiveColor = "rgba(255, 255, 255, 0.48)";

  return (
    <Box>
      <Box
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
            d="M10.667 3.99992H5.33366M6.66699 6.66658H5.33366M2.66699 12.4306V5.36925C2.66699 3.46659 2.66699 2.51592 3.25299 1.92459C3.83833 1.33325 4.78166 1.33325 6.66699 1.33325H9.33366C11.219 1.33325 12.1623 1.33325 12.7477 1.92459C13.3337 2.51525 13.3337 3.46659 13.3337 5.36925V12.4306C13.3337 13.4379 13.3337 13.9419 13.0257 14.1406C12.5223 14.4646 11.7443 13.7846 11.353 13.5379C11.0297 13.3339 10.8683 13.2326 10.6883 13.2266C10.495 13.2199 10.3303 13.3179 9.98099 13.5379L8.70699 14.3413C8.36299 14.5579 8.19166 14.6666 8.00033 14.6666C7.80899 14.6666 7.63766 14.5579 7.29366 14.3413L6.02033 13.5379C5.69633 13.3339 5.53499 13.2326 5.35566 13.2266C5.16166 13.2199 4.99699 13.3179 4.64766 13.5379C4.25633 13.7846 3.47833 14.4646 2.97433 14.1406C2.66699 13.9419 2.66699 13.4386 2.66699 12.4306Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.66699 6.58333C9.11499 6.58333 8.66699 6.97533 8.66699 7.45867C8.66699 7.94133 9.11499 8.33333 9.66699 8.33333C10.219 8.33333 10.667 8.72533 10.667 9.20867C10.667 9.69133 10.219 10.0833 9.66699 10.0833M9.66699 6.58333C10.1023 6.58333 10.473 6.82667 10.6103 7.16667M9.66699 6.58333V6M9.66699 10.0833C9.23166 10.0833 8.86099 9.84 8.72366 9.5M9.66699 10.0833V10.6667"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>

        <ProtectedLink to="/reserve" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography className="hovered-text" sx={TextButton}>
            Reserve
          </Typography>
        </ProtectedLink>
      </Box>
    </Box>
  );
};

export default Reserve;
