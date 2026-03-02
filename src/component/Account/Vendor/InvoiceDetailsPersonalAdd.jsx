import React from "react";
import Name from "../InvoiceDetails/Name";
import TaxID from "../InvoiceDetails/TaxID";
import Address from "../InvoiceDetails/Address";
import Country from "../InvoiceDetails/Country";
import City from "../InvoiceDetails/City";
import StateProvince from "../InvoiceDetails/StateProvince";
import PostCode from "../InvoiceDetails/PostCode";
import { Box, Typography } from "@mui/material";

const InvoiceDetailsPersonal = ({}) => {
  return (
    <>
      <Box>
        <Name />
      </Box>
      <Box>
        <TaxID/>
      </Box>
      <Box>
        <Address />
      </Box>
      <Box>
        <Country />
      </Box>
      <Box>
        <City />
      </Box>
      <Box>
        <StateProvince />
      </Box>
      <Box>
        <PostCode />
      </Box>
    </>
  );
};

export default InvoiceDetailsPersonal;
