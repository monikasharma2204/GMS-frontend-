import React from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";

const CustomConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title
}) => {

  const handleKeepEditing = () => {
    if (onConfirm) {
      onConfirm(false);
    } else {
      onClose(false);
    }
  };

  const handleDiscard = () => {
    if (onConfirm) {
      onConfirm(true);
    } else {
      onClose(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose ? onClose(false) : (onConfirm && onConfirm(false))}
      PaperProps={{
        sx: {
          maxWidth: {
            xs: "400px",
            sm: "450px",
            x1024: "500px",
            x1280: "600px",
          },
          width: "100%",
          borderRadius: "4px",

          padding: {
            xs: "0px 16px",
            x1024: "0px 20px",
            x1280: "0px 24px"
          },
          boxShadow: "0px 6px 15px -2px rgba(16, 24, 40, 0.08) ", backgroundColor: "rgba(255, 255, 255, 1)"
        },
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          mb: 0,
          padding: {
            xs: "16px 0px",
            x1024: "20px 0px",
            x1280: "24px 0px"
          }
        }}
      >
        <Typography
          sx={{
            fontFamily: "Calibri",
            fontWeight: 700,
            fontSize: {
              xs: "18px",
              x1024: "20px",
              x1280: "24px"
            },
            color: "#343434",
          }}
        >
          {title || "Confirm save"}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontFamily: "Calibri",
          fontSize: {
            xs: "13px",
            x1024: "14px",
            x1280: "16px"
          },
          color: "#343434",
          fontWeight: 400,
          paddingBottom: {
            xs: "16px",
            x1024: "20px",
            x1280: "24px"
          }
        }}
      >
        Do you want to save all the entered information?
      </Typography>

      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        padding: {
          xs: "12px 0px",
          x1280: "16px 0px"
        }
      }}>
        <Button
          onClick={handleKeepEditing}
          sx={{
            textTransform: "none",
            border: "1px solid #EDEDED",
            color: "#343434",
            fontWeight: 700,
            fontSize: "14px",
            fontFamily: "Calibri",
            borderRadius: "4px",
            minWidth: "96px",
            backgroundColor: "#FFF",
            "&:hover": {
              backgroundColor: "#FFFFFF",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleDiscard}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            fontFamily: "Calibri",
            borderRadius: "4px",
            backgroundColor: "#05595B",
            color: "#FFF",
            fontWeight: 700,
            minWidth: "96px",
            "&:hover": {
              backgroundColor: "#05595B",
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};

export default CustomConfirmDialog;
