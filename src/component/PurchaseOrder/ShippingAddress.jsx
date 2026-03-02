import React, { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { CustomerShippingAddressState } from "recoil/PurchaseOrder/VendorState";
import { useRecoilState } from "recoil";



const ShippingAddress = () => {
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useRecoilState(CustomerShippingAddressState);


  const handleShippingChange = (event, newValue) => {
    setSelectedShippingAddress(newValue);
  };


   useEffect(() => {
     if (shippingAddress) {
       setSelectedShippingAddress(shippingAddress[0])
     }
   }, [shippingAddress])
 

  return (
    <Autocomplete
      id="account-select"
      options={shippingAddress}
      getOptionLabel={(option) => option.label}
      value={selectedShippingAddress}
      onChange={handleShippingChange}
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
              backgroundColor: "#FFF",
              width: "281px",
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
            marginLeft: "20px"
          }}
        />
      )}
    />
  );
};

export default ShippingAddress;
