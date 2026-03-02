import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { QuotationInvoiceAddressState as CustomerInvoiceAddressState, QuotationSelectedInvoiceAddressState } from "recoil/Sale/SaleState";
import { useRecoilState } from "recoil";

const InvoiceAddress = ({ disabled }) => {
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(QuotationSelectedInvoiceAddressState);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    CustomerInvoiceAddressState
  );

  const handleInvoiceChange = (event, newValue) => {
    setSelectedInvoiceAddress(newValue);
  };

  useEffect(() => {
    if (Array.isArray(invoiceAddress) && invoiceAddress.length > 0) {
        const isSelectedValid = selectedInvoiceAddress && invoiceAddress.some(addr => (addr.label || "").trim() === (selectedInvoiceAddress.label || "").trim());
        if (!isSelectedValid) {
            setSelectedInvoiceAddress(invoiceAddress[0]);
        }
    } else {
        setSelectedInvoiceAddress(null);
    }
  }, [invoiceAddress]);
  return (
    <Autocomplete
      id="account-select"
      options={invoiceAddress}
      getOptionLabel={(option) => option.label}
      value={selectedInvoiceAddress}
      onChange={handleInvoiceChange}
      disabled={disabled}
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
              backgroundColor: disabled ? "#F0F0F0" : "#FFF",
              width: "281px",
              height: "42px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&:hover": {
                backgroundColor: disabled ? "#F0F0F0" : "#F5F8FF",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
            },
            marginLeft: "20px",
          }}
        />
      )}
    />
  );
};

export default InvoiceAddress;
