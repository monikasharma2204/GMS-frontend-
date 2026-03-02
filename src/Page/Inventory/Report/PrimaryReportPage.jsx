import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import PrimaryReportHeader from "../../../component/Inventory/Report/PrimaryReportHeader.jsx"
import PrimaryReportBody from "../../../component/Inventory/Report/PrimaryReportBody.jsx"

const PrimaryReportPage = () => {
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
                        <PrimaryReportHeader onExportExcel={handleExportExcel} />
                        <PrimaryReportBody exportTrigger={exportTrigger} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PrimaryReportPage;
