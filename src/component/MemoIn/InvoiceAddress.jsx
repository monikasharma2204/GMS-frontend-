import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { QuotationInvoiceAddressState, QuotationSelectedInvoiceAddressState } from "recoil/MemoIn/MemoInState";
import { useRecoilState } from "recoil";



const InvoiceAddress = ({disabled}) => {
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );

  const handleInvoiceChange = (event, newValue) => {
    setSelectedInvoiceAddress(newValue);
  };

  useEffect(() => {
    // Only auto-select first address if no address is currently selected OR
    // if the currently selected address is not in the new list
    if (Array.isArray(invoiceAddress) && invoiceAddress.length > 0) {
      // Check if current selected address exists in the new list (using trimmed comparison)
      const isSelectedAddressValid = selectedInvoiceAddress && 
        invoiceAddress.some(addr => 
          (addr.label || "").trim() === (selectedInvoiceAddress.label || "").trim()
        );
      
      if (!isSelectedAddressValid) {
        // Only set to first if no valid selection exists
        setSelectedInvoiceAddress(invoiceAddress[0]);
      }
    } else {
      setSelectedInvoiceAddress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceAddress]);
  return (
    <Autocomplete
      id="account-select"
      options={Array.isArray(invoiceAddress) ? invoiceAddress : []}
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
              backgroundColor: "#FFF",
              width: "425px",
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
            marginLeft: "35px",
          }}
        />
      )}
    />
  );
};

export default InvoiceAddress;
