import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import ConsignmentMovementReportHeader from "../../../component/Inventory/Report/ConsMove/ConsignmentMovementReportHeader.jsx"
import ConsignmentMovementReportBody from "../../../component/Inventory/Report/ConsMove/ConsignmentMovementReportBody.jsx"

const ConsignmentMovementReportPage = () => {
    const [exportTrigger, setExportTrigger] = React.useState(0);

    const handleExportExcel = () => {
        setExportTrigger(prev => prev + 1);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavBar />
            <Box sx={{ marginLeft: "222px", minHeight: "100vh", width: "100%" }}>
                <Header />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }}>
                        <ConsignmentMovementReportHeader onExportExcel={handleExportExcel} />
                        <ConsignmentMovementReportBody exportTrigger={exportTrigger} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ConsignmentMovementReportPage;
