import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import StockMovementReportHeader from "../../../component/Inventory/Report/StockMovementReportHeader.jsx"
import StockMovementReportBody from "../../../component/Inventory/Report/StockMovementReportBody.jsx"

const StockMovementReportPage = () => {
    const [exportTrigger, setExportTrigger] = React.useState(0);

    const handleExportExcel = () => {
        setExportTrigger(prev => prev + 1);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavBar />
            <Box sx={{ marginLeft: "222px", minHeight: "100vh", paddingBottom: "130px", width: "100%" }}>
                <Header />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }}>
                        <StockMovementReportHeader onExportExcel={handleExportExcel} />
                        <StockMovementReportBody exportTrigger={exportTrigger} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StockMovementReportPage;
