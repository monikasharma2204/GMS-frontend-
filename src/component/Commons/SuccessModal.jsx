import React, { useEffect } from "react";
import { Box, Typography, Portal, ClickAwayListener } from "@mui/material";


const SuccessModal = ({ open, onClose, message = "Successfully!", autoCloseDelay = 800 }) => {

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [open, autoCloseDelay, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <ClickAwayListener onClickAway={() => { if (open && onClose) onClose(); }}>
        <Box
          sx={{
            position: "fixed",
            top: "100px",
            right: "25px",
            width: "395px",
            height: "42px",
            backgroundColor: "#30A84F",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 99999,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4.5L6.75 12.75L3 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            {message}
          </Typography>
        </Box>
      </ClickAwayListener>
    </Portal>
  );
};

export default SuccessModal;

