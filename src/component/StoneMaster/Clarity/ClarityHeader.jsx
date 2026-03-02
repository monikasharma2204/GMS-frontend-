import React from "react";
import { Box, Typography } from "@mui/material";
import ModalListStoneMaster from "../StoneMaster/ModalListStoneMaster";

const ClarityHeader = () => {
  return (
    <>
      <Box
        sx={{
          width: "1395px",
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
            Clarity
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box>
            <ModalListStoneMaster  master_type="master_stone_clarity" modal_heading="Clarity" modal_subheading="Clarity List" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClarityHeader;
