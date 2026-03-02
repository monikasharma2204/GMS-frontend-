import React, { useReducer } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar.jsx";
import Header from "../../component/Layout/Header.jsx";
import InventoryPrimaryHeader from "../../component/Inventory/InventoryPrimaryHeader.jsx"
import InventoryPrimaryBody from "../../component/Inventory/InventoryPrimaryBody.jsx"

const Primary = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <InventoryPrimaryHeader/>
            <InventoryPrimaryBody/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Primary;
