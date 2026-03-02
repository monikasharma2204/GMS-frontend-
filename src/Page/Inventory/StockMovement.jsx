import React, { useReducer } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar.jsx";
import Header from "../../component/Layout/Header.jsx";
import InventoryStockMovementHeader from "../../component/Inventory/InventoryStockMovementHeader.jsx"
import InventoryStockMovementBody from "../../component/Inventory/InventoryStockMovementBody.jsx"

const StockMovement = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <InventoryStockMovementHeader/>
            <InventoryStockMovementBody/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StockMovement;
