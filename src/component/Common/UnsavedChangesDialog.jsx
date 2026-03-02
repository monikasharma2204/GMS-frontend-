import React from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";

const UnsavedChangesDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      PaperProps={{
        sx: {
          borderRadius: "15px",
          // width: "100%",
          padding: "10px 40px",
          maxWidth: "833px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Box
        onClick={() => onClose(false)}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover svg path": {
            fill: "#E00410",
          },
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
            fill="#343434"
          />
        </svg>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
       
        }}
      >
        <Box sx={{ display: "flex" }}>
          {/* Warning Icon */}
          <Box sx={{ marginRight: "24px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 112 112"
              fill="none"
            >
              <circle cx="56" cy="56" r="56" fill="#FFC107" />
              <path
                d="M56 28C54.8954 28 54 28.8954 54 30V58C54 59.1046 54.8954 60 56 60C57.1046 60 58 59.1046 58 58V30C58 28.8954 57.1046 28 56 28Z"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path
                d="M56 68C54.8954 68 54 68.8954 54 70V74C54 75.1046 54.8954 76 56 76C57.1046 76 58 75.1046 58 74V70C58 68.8954 57.1046 68 56 68Z"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              marginBottom: "16px",
              color: "#343434",
             
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Unsaved Changes
          </Typography>
        </Box>


        {/* Message */}
        <Typography
          sx={{
            // marginBottom: "8px",
            color: "#343434",
            textAlign: "center",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          You have unsaved changes. If you leave this page, your data will be lost.
        </Typography>
        <Typography
          sx={{
            marginBottom: "32px",
            color: "#343434",
        
            fontFamily: "Calibri",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          Are you sure you want to leave?
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", width: "100%", justifyContent: "end",  gap: "18px" }}>
          <Button
            onClick={() => onClose(false)}
            sx={{
              height: "44px",
              padding: "12px 40px",
              borderRadius: "4px",
              // backgroundColor: "#E6E6E6",
              "&:hover": {
                backgroundColor: "#D1D1D1",
              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                color: "#10002E",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Cancel
            </Typography>
          </Button>
          <Button
            onClick={() => onConfirm(true)}
            sx={{
              height: "44px",
              padding: "12px 40px",
              borderRadius: "4px",
              backgroundColor: "#BA1E38",
              "&:hover": {
                backgroundColor: "#C0030E",
              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                color: "#FFF",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Left without saving
            </Typography>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UnsavedChangesDialog;

