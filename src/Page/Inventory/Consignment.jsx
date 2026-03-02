import React, { useReducer } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar.jsx";
import Header from "../../component/Layout/Header.jsx";
import InventoryConsignmentHeader from "../../component/Inventory/InventoryConsignmentHeader.jsx"
import InventoryConsignmentBody from "../../component/Inventory/InventoryConsignmentBody.jsx"

const Consignment = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px", width: "100%"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "100%" }}> 
            <InventoryConsignmentHeader/>
            <InventoryConsignmentBody/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Consignment;
