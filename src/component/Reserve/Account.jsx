import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { getCustomerInfo } from "recoil/selector/CustomerSelector";
import {
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState,
  QuotationSelectedInvoiceAddressState,
  QuotationSelectedShippingAddressState,
} from "recoil/Reserve/ReserveState";
import { memoInfoState } from "recoil/Reserve/MemoState";

const Account = ({ account, setAccount, disabled = false }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);


  useEffect(() => {
    if (!account || account === "") {
      setSelectedAccount(null);
    } else if (account && typeof account === 'object') {
      setSelectedAccount(account);
    }
  }, [account]);
  const customerData = useRecoilValueLoadable(getCustomerInfo);
  const [customerList, setCustomerList] = useState([]);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [memoInfo] = useRecoilState(memoInfoState);
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );
  const [shippingAddress, setShippingAddress] = useRecoilState(
    QuotationShippingAddressState
  );
  const [selectedShippingAddress, setSelectedShippingAddress] = useRecoilState(
    QuotationSelectedShippingAddressState
  );
  const [dayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );

  useEffect(() => {
    if (
      customerData.state === "hasValue" &&
      Array.isArray(customerData.contents)
    ) {
      setCustomerList(customerData.contents);
    } else {
      setCustomerList([]); // Ensure it remains an array
    }
  }, [customerData]);

  const handleAccountChange = (event, newValue) => {
    setSelectedAccount(newValue);
    setAccount(newValue);

    if (newValue) {
      const nextAddresses = newValue.invoiceAddress || [];
      setInvoiceAddress(nextAddresses);
      setShippingAddress(newValue.shippingAddress || []);
      setSelectedInvoiceAddress(
        nextAddresses && nextAddresses.length > 0 ? nextAddresses[0] : null
      );
      const nextShipping = newValue.shippingAddress || [];
      setSelectedShippingAddress(
        nextShipping && nextShipping.length > 0 ? nextShipping[0] : null
      );
    } else {
      setInvoiceAddress([]); // Reset if no account is selected
      setShippingAddress([]);
      setSelectedInvoiceAddress(null);
      setSelectedShippingAddress(null);
    }
  };

  useEffect(() => {
    if (dayBookQuotation) {
      const prefilled = {
        code: dayBookQuotation.vendor_code_id,
        label: dayBookQuotation.account,
      };
      setSelectedAccount(prefilled);
      setAccount(prefilled);
    }
  }, [dayBookQuotation, setAccount]);


  const FilterOption = customerList.filter((item) => item?.account_status === "active")
  const isApproved = ((memoInfo?.status || "") + "").toLowerCase() === "approved" || ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";

  return (
    <Autocomplete
      id="account-select"
      options={FilterOption}
      getOptionLabel={(option) => option?.label ?? ""}
      value={selectedAccount || account}
     disabled={memoInfo?.isDayBookEdit || isApproved || disabled}
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
              width: "281px",
              height: "42px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&:hover": { backgroundColor: "#F5F8FF" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
            },
            marginLeft: "24px",
          }}
        />
      )}
    />
  );
};

export default Account;
