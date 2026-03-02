import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const CommonDashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("buy");

  useEffect(() => {
    if (location.pathname === "/dashboard-second") {
      setActiveButton("sell");
    } else if (location.pathname === "/dashboard") {
      setActiveButton("buy");
    }
  }, [location.pathname]);

  return (
    <Box
      sx={{
        height: "44px",
        marginBottom: "25px",
        borderBottom: "1px solid #e2d784",
        backgroundColor: "#FFF",
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
        padding: "0 5px",
        paddingBottom: "2px",
      }}
    >
      <Typography
        sx={{
          color: "#05595B",
          fontFamily: "Calibri",
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        Dashboard
      </Typography>

      <Box>
        <Button
          onClick={() => navigate("/dashboard-second")}
          sx={{
            borderRadius: "5px 0px 0px 5px",
            minWidth: "55px",
            border: "1px solid #bcbfc3",
            borderRight: "none",
            fontFamily: "Calibri",
            fontWeight: activeButton === "sell" ? 900 : 400,
            fontSize: "14px",
            backgroundColor: activeButton === "sell" ? "#D1D5DB" : "transparent",
            color: "#000",
            padding: "4px 0px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#E5E7EB",
            },
          }}
        >
          ขาย
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            borderRadius: "0px 5px 5px 0px",
            minWidth: "55px",
            border: "1px solid #bcbfc3",
            fontFamily: "Calibri",
            fontWeight: activeButton === "buy" ? 900 : 400,
            fontSize: "14px",
            backgroundColor: activeButton === "buy" ? "#D1D5DB" : "transparent",
            color: "#000",
            padding: "4px 0px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#E5E7EB",
            },
          }}
        >
          ซื้อ
        </Button>
      </Box>
    </Box>
  );
};

export default CommonDashboardHeader;
