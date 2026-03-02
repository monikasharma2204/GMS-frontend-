import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ID from "../AccountInformation/ID";
import CodeName from "../AccountInformation/CodeName";
import ContactPerson from "../AccountInformation/ContactPerson";
import Currency from "../../CompanyProfile/GeneralTitle/Currency";
import PhoneNo from "../AccountInformation/PhoneNo";
import Email from "../AccountInformation/Email";

const AccountInformation = (props) => {


  return (
    <div className={props.parent_class_name}>

      <Box sx={{ display: "flex" }}>


        <ID />
        <Box sx={{ marginLeft: "24px"}}><CodeName /></Box>
        <Box sx={{ marginLeft: "24px", marginTop: "24px"}}><Currency /></Box>
      </Box>
      <Box sx={{ display: "flex", marginTop: "24px" }}>
        <ContactPerson />
        <Box sx={{ marginLeft: "24px"}}><PhoneNo /></Box>
        <Box sx={{ marginLeft: "24px"}}><Email /></Box>



        
      </Box>


    </div>
  );
};

export default AccountInformation;
