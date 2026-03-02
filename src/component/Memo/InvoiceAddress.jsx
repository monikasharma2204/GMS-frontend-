import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { CustomerInvoiceAddressState } from "recoil/state/CustomerState";
import { useRecoilState } from "recoil";

// const invoiceAddress = [
//   { code: "InvoiceAd-01", label: "1250/138E, 15th Floor, Gems Tower..." },
//   { code: "InvoiceAd-02", label: "1251/139E, 16th Floor, Gems Tower..." },
//   { code: "InvoiceAd-03", label: "1252/140E, 17th Floor, Gems Tower..." },
//   { code: "InvoiceAd-04", label: "1252/141E, 18th Floor, Gems Tower..." },
// ];

const InvoiceAddress = () => {
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useState(null);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(CustomerInvoiceAddressState);


  const handleInvoiceChange = (event, newValue) => {
    setSelectedInvoiceAddress(newValue);
  };

  useEffect(() => {
    if (invoiceAddress) {
      setSelectedInvoiceAddress(invoiceAddress[0])
    }
  }, [invoiceAddress])

  return (
    <Autocomplete
      id="account-select"
      options={invoiceAddress}
      getOptionLabel={(option) => option.label}
      value={selectedInvoiceAddress}
      onChange={handleInvoiceChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Invoice Address :"
          InputLabelProps={{
            shrink: true,
            sx: {
              color: "var(--Text-Field, #666)",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#FFF",
              width: "420px",
              height: "42px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&:hover": {
                backgroundColor: "#F5F8FF",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
            },
            marginLeft: "35px"
          }}
        />
      )}
    />
  );
};

export default InvoiceAddress;



