import React from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import ReceivableHeader from "../../component/Finance/Receivable/ReceivableHeader";
import ReceivableBody from "../../component/Finance/Receivable/ReceivableBody";
import ReceivableFooter from "../../component/Finance/Receivable/ReceivableFooter";
import ReceivableDaybook from "../../component/Finance/Receivable/ReceivableDaybook";
import OutstandingReceivableModal from "../../component/Finance/Receivable/OutstandingReceivableModal";

const Receivable = () => {
  return (
    <Box sx={{ display: "flex", bgcolor: "#F8F8F8" }}>
      <NavBar />
      <Box sx={{ marginLeft: "222px", flexGrow: 1, minHeight: "100vh", width: "calc(100% - 222px)" }}>
        <Header />
        <ReceivableHeader />
        <ReceivableBody />
        <ReceivableFooter />
        <ReceivableDaybook />
        <OutstandingReceivableModal />
      </Box>
    </Box>
  );
};

export default Receivable;
