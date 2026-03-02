import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { getCustomerInfo } from "recoil/selector/CustomerSelector";
import { useQuotationAccountState ,QuotationInvoiceAddressState , QuotationShippingAddressState} from "recoil/state/QuotationState";


const Account = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const customerData = useRecoilValueLoadable(getCustomerInfo);
  const [customerList, setCustomerList] = useState([]);
  const [account , setAccount ] = useRecoilState(useQuotationAccountState)
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(QuotationInvoiceAddressState);
  const [shippingAddress , setShippingAddress]  = useRecoilState(QuotationShippingAddressState);

  useEffect(() => {
    if (customerData.state === "hasValue" && Array.isArray(customerData.contents)) {
      setCustomerList(customerData.contents);
    } else {
      setCustomerList([]); // Ensure it remains an array
    }
  }, [customerData]);


  const handleAccountChange = (event, newValue) => {
    setSelectedAccount(newValue);
    setAccount(newValue)

    if (newValue) {
      setInvoiceAddress(newValue.invoiceAddress || []);
      setShippingAddress(newValue.shippingAddress || []);
    } else {
      setInvoiceAddress([]); // Reset if no account is selected
      setShippingAddress([]);
    }
  };





  return (
    <Autocomplete
      id="account-select"
      options={customerList}
      getOptionLabel={(option) => option?.label ?? ""}
      value={selectedAccount}
      onChange={handleAccountChange}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label="Account :"
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
            "& .MuiInputLabel-asterisk": { color: "red" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#FFF",
              width: "420px",
              height: "42px",
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
              "&:hover": { backgroundColor: "#F5F8FF" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
            },
            marginLeft: "51px",
          }}
        />
      )}
    />
  );
};

export default Account;







