import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import ModalDayBook from "./ModalDayBook";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "#FFF",
  borderRadius: "8px",
};

const MemoReturnHeader = ({
  reducer,
  initialState,
  initialData,
  isOpenPO,
  handleClosePO,
  handleSavePO,
  initialSelectedItems,
  onClickPO,
  initialData2,
  isOpenMemo,
  handleCloseMemo,
  handleSaveMemo,
  onClickMemo,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Box
        sx={{
          width: "1697px",
          height: "64px",
          flexShrink: 0,
          backgroundColor: "#FFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
        }}
      >
        <Box
          sx={{
            width: "388px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#05595B",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginLeft: "32px",
            }}
          >
            Memo In
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <ModalDayBook
            />
          </Box>


          <Box>
            <Button
              sx={{
                textTransform: "none",
                height: "35px",
                width: "84px",
                padding: "12px",
                borderRadius: "4px",
                gap: "8px",
                marginRight: "24px",
                backgroundColor: "#C6A969",
                "&:hover": {
                  backgroundColor: "#C6A969",
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
                  d="M7 17.0134L11.413 16.9984L21.045 7.45839C21.423 7.08039 21.631 6.57839 21.631 6.04439C21.631 5.51039 21.423 5.00839 21.045 4.63039L19.459 3.04439C18.703 2.28839 17.384 2.29239 16.634 3.04139L7 12.5834V17.0134ZM18.045 4.45839L19.634 6.04139L18.037 7.62339L16.451 6.03839L18.045 4.45839ZM9 13.4174L15.03 7.44439L16.616 9.03039L10.587 15.0014L9 15.0064V13.4174Z"
                  fill="white"
                />
                <path
                  d="M5 21H19C20.103 21 21 20.103 21 19V10.332L19 12.332V19H8.158C8.132 19 8.105 19.01 8.079 19.01C8.046 19.01 8.013 19.001 7.979 19H5V5H11.847L13.847 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21Z"
                  fill="white"
                />
              </svg>
              <Typography
                sx={{
                  color: "var(--jw-background-white-textwhite, #FFF)",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                  letterSpacing: "1px",
                }}
              >
                Edit
              </Typography>
            </Button>
          </Box>


        </Box>
      </Box>
    </>
  );
};

export default MemoReturnHeader;
