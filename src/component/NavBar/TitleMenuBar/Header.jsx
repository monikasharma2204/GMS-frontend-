import React from "react";
import CodthLogo from "../../../Assets/image/Codth-logo-main.png";
import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "14px",
      }}
    >
      <img src={CodthLogo} alt="CodthLogo"  />
      
    </Box>
  );
};

export default Header;
