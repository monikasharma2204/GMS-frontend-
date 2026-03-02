import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { QuotationShippingAddressState as CustomerShippingAddressState, QuotationSelectedShippingAddressState } from "recoil/Sale/SaleState";
import { useRecoilState } from "recoil";

// const shippingAddress = [
//   { code: "InvoiceAd-01", label: "1250/138E, 15th Floor, Gems Tower..." },
//   { code: "InvoiceAd-02", label: "1251/139E, 16th Floor, Gems Tower..." },
//   { code: "InvoiceAd-03", label: "1252/140E, 17th Floor, Gems Tower..." },
//   { code: "InvoiceAd-04", label: "1252/141E, 18th Floor, Gems Tower..." },
// ];

const ShippingAddress = ({ disabled }) => {
  const [selectedShippingAddress, setSelectedShippingAddress] = useRecoilState(QuotationSelectedShippingAddressState);
  const [shippingAddress, setShippingAddress] = useRecoilState(CustomerShippingAddressState);


  const handleShippingChange = (event, newValue) => {
    setSelectedShippingAddress(newValue);
  };


   useEffect(() => {
     if (Array.isArray(shippingAddress) && shippingAddress.length > 0) {
        const isSelectedValid = selectedShippingAddress && shippingAddress.some(addr => (addr.label || "").trim() === (selectedShippingAddress.label || "").trim());
        if (!isSelectedValid) {
            setSelectedShippingAddress(shippingAddress[0]);
        }
    } else {
        setSelectedShippingAddress(null);
    }
   }, [shippingAddress])
 

  return (
    <Autocomplete
      id="account-select"
      options={shippingAddress}
      getOptionLabel={(option) => option.label}
      value={selectedShippingAddress}
      onChange={handleShippingChange}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Shipping Address :"
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
            marginLeft: "20px"
          }}
        />
      )}
    />
  );
};

export default ShippingAddress;
