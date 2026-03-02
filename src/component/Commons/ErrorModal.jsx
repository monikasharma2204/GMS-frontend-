import React from "react";
import { Box, Typography, Dialog } from "@mui/material";

const ErrorModal = ({ open, onClose, message = "Unsuccessfully!" }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "15px",
          width: "590px",
          height: "361px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ marginBottom: "24px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="112"
            height="112"
            viewBox="0 0 112 112"
            fill="none"
          >
            <g clipPath="url(#clip0_2788_204916)">
              <path
                d="M56 0C25.0723 0 0 25.0723 0 56C0 86.9295 25.0723 112 56 112C86.9295 112 112 86.9295 112 56C112 25.0723 86.9295 0 56 0ZM56 105.11C28.9818 105.11 7 83.0182 7 55.9998C7 28.9815 28.9818 6.99978 56 6.99978C83.0182 6.99978 105 28.9816 105 55.9998C105 83.0179 83.0182 105.11 56 105.11ZM75.7978 36.2023C74.431 34.8355 72.2155 34.8355 70.8488 36.2023L56 51.051L41.1512 36.2023C39.7845 34.8355 37.569 34.8355 36.2005 36.2023C34.8338 37.569 34.8338 39.7845 36.2005 41.1512L51.0492 56L36.2005 70.8488C34.8338 72.2138 34.8338 74.4329 36.2005 75.7979C37.5673 77.1646 39.7827 77.1646 41.1512 75.7979L56 60.9491L70.8488 75.7979C72.2155 77.1646 74.431 77.1646 75.7978 75.7979C77.1645 74.4329 77.1645 72.2138 75.7978 70.8488L60.949 56L75.7978 41.1512C77.1663 39.7827 77.1663 37.5672 75.7978 36.2023Z"
                fill="#E00410"
              />
            </g>
            <defs>
              <clipPath id="clip0_2788_204916">
                <rect width="112" height="112" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Box>
        <Typography sx={{ marginBottom: "24px", color: "#343434", textAlign: "center", fontFamily: "Calibri", fontSize: "24px", fontWeight: 700 }}>
          {message}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default ErrorModal;

