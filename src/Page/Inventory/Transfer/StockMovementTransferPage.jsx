import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import StockMovementTransferHeader from "../../../component/Inventory/Transfer/StockMovementTransferHeader.jsx"
import StockMovementTransferBody from "../../../component/Inventory/Transfer/StockMovementTransferBody.jsx"

const StockMovementTransferPage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <NavBar />
            <Box sx={{ marginLeft: "222px", minHeight: "100vh", paddingBottom: "130px", width: "100%" }}>
                <Header />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }}>
                        <StockMovementTransferHeader />
                        <StockMovementTransferBody />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StockMovementTransferPage;
