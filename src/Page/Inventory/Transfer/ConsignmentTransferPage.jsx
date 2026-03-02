import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import ConsignmentTransferHeader from "../../../component/Inventory/Transfer/ConsignmentTransferHeader.jsx"
import ConsignmentTransferBody from "../../../component/Inventory/Transfer/ConsignmentTransferBody.jsx"

const ConsignmentTransferPage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <NavBar />
            <Box sx={{ marginLeft: "222px", minHeight: "100vh", paddingBottom: "130px", width: "100%" }}>
                <Header />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }}>
                        <ConsignmentTransferHeader />
                        <ConsignmentTransferBody />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ConsignmentTransferPage;
