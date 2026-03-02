import React, { useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import {
  QuotationShippingAddressState,
  QuotationSelectedShippingAddressState,
} from "recoil/state/MemoOutState";
import { useRecoilState } from "recoil";

const ShippingAddress = () => {
  const [shippingAddress] = useRecoilState(QuotationShippingAddressState);
  const [selectedShippingAddress, setSelectedShippingAddress] = useRecoilState(
    QuotationSelectedShippingAddressState
  );

  const handleShippingChange = (event, newValue) => {
    setSelectedShippingAddress(newValue);
  };

  useEffect(() => {
    if (Array.isArray(shippingAddress) && shippingAddress.length > 0) {
      const trimmedSelected = (selectedShippingAddress?.label || "").trim();
      const existing = shippingAddress.find(
        (addr) => (addr.label || "").trim() === trimmedSelected
      );
      if (!existing) {
        setSelectedShippingAddress(shippingAddress[0]);
      }
    } else if (selectedShippingAddress) {
      setSelectedShippingAddress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress]);

  return (
    <Autocomplete
      id="account-select"
      options={Array.isArray(shippingAddress) ? shippingAddress : []}
      getOptionLabel={(option) => option?.label || ""}
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
            marginLeft: "20px",
          }}
        />
      )}
    />
  );
};

export default ShippingAddress;
