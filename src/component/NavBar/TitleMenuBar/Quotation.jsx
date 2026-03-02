import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ProtectedLink from "../../Common/ProtectedLink";
import {
  TextButton,
  SidebarMenuBox,
} from "../../../Assets/styles/NavbarStyles.jsx";

const Quotation = () => {
  const location = useLocation();
  const isActive = location.pathname === "/quotation";

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

        {/* <svg
          className="hovered-svg"
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.29167 6.625H3.29167M7.29167 3.95833H3.29167M0.625 11.7223V4.661C0.625 2.75833 0.625 1.80767 1.211 1.21633C1.79633 0.625 2.73967 0.625 4.625 0.625H7.29167C9.177 0.625 10.1203 0.625 10.7057 1.21633C11.2917 1.807 11.2917 2.75833 11.2917 4.661V11.7223C11.2917 12.7297 11.2917 13.2337 10.9837 13.4323C10.4803 13.7563 9.70233 13.0763 9.311 12.8297C8.98767 12.6257 8.82633 12.5243 8.64633 12.5183C8.453 12.5117 8.28833 12.6097 7.939 12.8297L6.665 13.633C6.321 13.8497 6.14967 13.9583 5.95833 13.9583C5.767 13.9583 5.59567 13.8497 5.25167 13.633L3.97833 12.8297C3.65433 12.6257 3.493 12.5243 3.31367 12.5183C3.11967 12.5117 2.955 12.6097 2.60567 12.8297C2.21433 13.0763 1.43633 13.7563 0.932333 13.4323C0.625 13.2337 0.625 12.7303 0.625 11.7223Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg> */}

        <svg className="hovered-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_21394_2610)">
            <path d="M7.33268 7.33325H5.33268M9.33268 4.66659H5.33268M2.66602 12.4306V5.36925C2.66602 3.46659 2.66602 2.51592 3.25202 1.92459C3.83735 1.33325 4.78068 1.33325 6.66602 1.33325H9.33268C11.218 1.33325 12.1613 1.33325 12.7467 1.92459C13.3327 2.51525 13.3327 3.46659 13.3327 5.36925V12.4306C13.3327 13.4379 13.3327 13.9419 13.0247 14.1406C12.5213 14.4646 11.7433 13.7846 11.352 13.5379C11.0287 13.3339 10.8673 13.2326 10.6873 13.2266C10.494 13.2199 10.3293 13.3179 9.98002 13.5379L8.70602 14.3413C8.36202 14.5579 8.19068 14.6666 7.99935 14.6666C7.80802 14.6666 7.63668 14.5579 7.29268 14.3413L6.01935 13.5379C5.69535 13.3339 5.53402 13.2326 5.35468 13.2266C5.16068 13.2199 4.99602 13.3179 4.64668 13.5379C4.25535 13.7846 3.47735 14.4646 2.97335 14.1406C2.66602 13.9419 2.66602 13.4386 2.66602 12.4306Z"  stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_21394_2610">
              <rect width="16" height="16" fill="#fff" />
            </clipPath>
          </defs>
        </svg>


        <ProtectedLink to="/quotation" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography className="hovered-text" sx={TextButton}>
            Quotation
          </Typography>
        </ProtectedLink>
      </Box>
    </Box>
  );
};

export default Quotation;
