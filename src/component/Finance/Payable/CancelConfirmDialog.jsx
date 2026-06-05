import React from "react";
import { Box, Button, Typography, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CancelConfirmDialog = ({ open, onConfirm }) => {
  const handleCancel = () => {
    onConfirm(false);
  };

  const handleConfirm = () => {
    onConfirm(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          borderRadius: "15px",
          width: "590px",
          height: "361px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box",
          position: "relative"
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleCancel}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          color: "#666",
          "&:hover": { color: "#B41E38" }
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Title Section */}
      <Box sx={{ width: "100%", display: "flex", gap: "12px", mb: "24px", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#C6A969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Typography
          sx={{
            fontFamily: "Calibri",
            fontSize: "24px",
            fontWeight: 700,
            color: "#343434",
          }}
        >
          Confirm Receivable Cancellation
        </Typography>
      </Box>

      {/* Warning Content */}
      <Box sx={{ width: "100%", mb: "32px" }}>
        <Typography
          sx={{
            fontFamily: "Calibri",
            fontSize: "18px",
            fontWeight: 700,
            color: "#343434",
            mb: 1.5,
          }}
        >
          Warning
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: "24px", display: "flex", flexDirection: "column", gap: 1 }}>
          <Box component="li">
            <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>
              Document status will be changed to Cancelled.
            </Typography>
          </Box>
          <Box component="li">
            <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>
              This action cannot be undone.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer Buttons */}
      <Box sx={{ display: "flex", gap: "14px" }}>
        <Button
          onClick={handleCancel}
          sx={{
            textTransform: "none",
            height: "44px",
            padding: "12px 40px",
            borderRadius: "4px",
            border: "2px solid #E6E6E6",
            color: "#10002E",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontWeight: 700,
            backgroundColor: "#FFF",
            "&:hover": { bgcolor: "#F5F5F5", border: "2px solid #E6E6E6" }
          }}
        >
          No
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{
            textTransform: "none",
            height: "44px",
            padding: "12px 40px",
            borderRadius: "4px",
            bgcolor: "#05595B",
            color: "#FFF",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontWeight: 700,
            "&:hover": { bgcolor: "#044a4c" }
          }}
        >
          Yes
        </Button>
      </Box>
    </Dialog>
  );
};

export default CancelConfirmDialog;
