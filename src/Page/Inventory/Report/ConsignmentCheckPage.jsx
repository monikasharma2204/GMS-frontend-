import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import ConsignmentCheckHeader from "../../../component/Inventory/Report/ConsignmentCheckHeader.jsx";
import ConsignmentCheckBody from "../../../component/Inventory/Report/ConsignmentCheckBody.jsx";


const ConsignmentCheckPage = () => {
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
                        <ConsignmentCheckHeader onExportExcel={handleExportExcel} />
                        <ConsignmentCheckBody exportTrigger={exportTrigger} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ConsignmentCheckPage;
