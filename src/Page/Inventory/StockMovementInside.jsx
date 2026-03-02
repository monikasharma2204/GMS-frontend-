import React, { useReducer } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar.jsx";
import Header from "../../component/Layout/Header.jsx";
import Footer from "../../component/Layout/Footer.jsx";
import InventoryStockMovementHeader from "../../component/Inventory/InventoryStockMovementHeader.jsx"
import InventoryStockMovementInSide from "../../component/Inventory/InventoryStockMovementInSide.jsx"

const StockMovementInside = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <InventoryStockMovementHeader/>
            <InventoryStockMovementInSide/>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default StockMovementInside;
