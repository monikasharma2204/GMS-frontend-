import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import PayableHeader from "../../component/Finance/Payable/PayableHeader";
import PayableBody from "../../component/Finance/Payable/PayableBody";
import PayableFooter from "../../component/Finance/Payable/PayableFooter";
import PayableDaybook from "../../component/Finance/Payable/PayableDaybook";
import OutstandingPayableModal from "../../component/Finance/Payable/OutstandingPayableModal";

const Payable = () => {
  return (
    <Box sx={{ display: "flex", bgcolor: "#F8F8F8" }}>
      <NavBar />
      <Box sx={{ marginLeft: "222px", flexGrow: 1, minHeight: "100vh", width: "calc(100% - 222px)" }}>
        <Header />
        <PayableHeader />
        <PayableBody />
        <PayableFooter />
        <PayableDaybook />
        <OutstandingPayableModal />
      </Box>
    </Box>
  );
};

export default Payable;
