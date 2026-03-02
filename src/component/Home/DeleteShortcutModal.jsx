import React from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";

const DeleteShortcutModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal 
    open={open} 
    onClose={onClose} 
    slotProps={{
      backdrop: {
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.25)",
        },
      },
    }}
    sx={{}}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "185px",
          bgcolor: "#FFF",
          borderRadius: "4px",
          boxShadow: 24,
          outline: "none",

        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            lineHeight: "normal",
            padding: "24PX",
           
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 11V17" stroke="#B41E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11V17" stroke="#B41E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="#B41E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6H21" stroke="#B41E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="#B41E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <Typography
              sx={{
                fontFamily: "Calibri",
                fontSize: "24px",
                fontWeight: 700,
                color: "#343434",
              }}
            >
              Delete Shortcut
            </Typography>
          </Box>
          {/* <IconButton onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#57646E"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </IconButton> */}
        </Box>

        <Box sx={{ padding: "0px 24px 24px 24px" }}>
          <Typography
            sx={{
              fontFamily: "Calibri",
              fontSize: "16px",
              fontWeight: 400,
              color: "#343434",
              lineHeight: "20px"
            }}
          >
            Do you want to remove this shortcut from your list?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            padding: "16px 24px",
            
          }}
        >
          <Box sx={{  width: "200px" }}>

          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: "none",
              height : "32px",
              fontSize: "14px",
              width: "96px",
              fontFamily: "Calibri",
              fontWeight: 700,
              borderColor: " #EDEDED", 
              color: "#343434",
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              textTransform: "none",
              height : "32px",
              width: "96px",
              fontFamily: "Calibri",
              fontSize: "14px",
              fontWeight: 700,
              bgcolor: "#B41E38",
              "&:hover": { bgcolor: "#B41E38" },
            }}
          >
            Delete
          </Button>
          </Box>
        
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteShortcutModal;
