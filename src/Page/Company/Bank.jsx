import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import BankHeader from "../../component/CompanyProfile/Bank/BankHeader";
import SearchBarBank from "component/CompanyProfile/Bank/SearchBarBank";
import BankBody from "component/CompanyProfile/Bank/BankBody";

const Bank = () => {


  
  return (
    <Box sx={{ display: "flex" }}>
    <NavBar />

    <Box sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
      <Header />
       <Box sx={{ display: "flex" }}>
          <Box>
            <BankHeader />
            <BankBody />
          </Box>

          <SearchBarBank  />
        </Box>
      <Footer/>
    </Box>
  </Box>
  );
};

export default Bank;
