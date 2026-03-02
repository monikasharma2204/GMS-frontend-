import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { getCustomerInfo } from "recoil/selector/CustomerSelector";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState, QuotationtableRowsState
} from "recoil/Sale/SaleState";

import { memoInfoState } from "recoil/Sale/MemoState";

const Account = ({ account, onAccountChange, disabled: externalDisabled }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const customerData = useRecoilValueLoadable(getCustomerInfo);
  const [customerList, setCustomerList] = useState([]);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [shippingAddress, setShippingAddress] = useRecoilState(
    QuotationShippingAddressState
  );
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);

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
    if (onAccountChange) {
      onAccountChange(newValue);
    }


    setMemoInfo({
      ...memoInfo,
      account: newValue,
    });

    if (newValue) {
      setInvoiceAddress(newValue.invoiceAddress || []);
      setShippingAddress(newValue.shippingAddress || []);
    } else {
      setInvoiceAddress([]); // Reset if no account is selected
      setShippingAddress([]);
    }
  };

  useEffect(() => {
    if (dayBookQuotation) {
      const acc = dayBookQuotation.account;
      const isObj = typeof acc === "object" && acc !== null;

      // Simple extraction of vendor name
      const vendorName =
        dayBookQuotation.vendor_code_name ||
        acc?.vendor_code_name ||
        acc?.label ||
        (typeof acc === "string" ? acc : "") ||
        "";

      // Construct simplified account data
      const accountData = {
        ...(isObj ? acc : {}), // Keep existing properties if it's an object
        _id: acc?._id || (typeof acc === "string" ? acc : "") || "",
        label: vendorName, // Ensure label is the string name
        vendor_code_name: vendorName,

        // Ensure addresses are array
        invoiceAddress: acc?.invoice_address || [],
        shippingAddress: acc?.shipping_address || [],
      };

      // Handle matching with customer list if needed (optional optimization)
      const matched = customerList.find(c => c.label === vendorName || c.code === acc?.vendor_code_id);
      if (matched) {
        Object.assign(accountData, {
          ...matched,
          label: matched.label || vendorName
        });
      }

      setSelectedAccount(accountData);

      setMemoInfo((prev) => ({
        ...prev,
        account: accountData,
      }));

      // Update address states
      setInvoiceAddress(accountData.invoiceAddress || []);
      setShippingAddress(accountData.shippingAddress || []);
    }
  }, [dayBookQuotation, customerList]);

  useEffect(() => {
    if (memoInfo?.account && customerList.length > 0) {
      const selected = customerList.find(c =>
        c.label === (typeof memoInfo.account === 'object' ? memoInfo.account.label : memoInfo.account) ||
        c.vendor_code_name === (typeof memoInfo.account === 'object' ? memoInfo.account.label : memoInfo.account) ||
        c._id === (typeof memoInfo.account === 'object' ? memoInfo.account._id : "")
      );

      if (selected) {
        setInvoiceAddress(selected.invoiceAddress || []);
        setShippingAddress(selected.shippingAddress || []);


        if (memoInfo.account._id !== selected._id) {
          setMemoInfo(prev => ({
            ...prev,
            account: selected
          }));
        }
      }
    }
  }, [memoInfo?.account?.label, customerList]);

  const disabled = () => {
    return rows.some(r => r.isFromMemoPending);
  }

  const FilterOption = customerList.filter((item) => item?.account_status === "active")

  return (
    <Autocomplete
      id="account-select"
      options={FilterOption}
      isOptionEqualToValue={(option, value) => {
        if (!value) return false;
        return option._id === value._id || option.label === value.label;
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;

        // Return label if it's a valid string
        if (option?.label && typeof option.label === 'string') return option.label;

        // Handle nested object structure (DayBook artifact)
        if (typeof option?.label === 'object') {
          return option.label.vendor_code_name || option.label.label || "";
        }

        // Fallback checks
        return option?.vendor_code_name || option?.vendor_code_id || "";
      }}
      value={memoInfo?.account || null}
      disabled={disabled() || externalDisabled}
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
              backgroundColor: disabled() || externalDisabled ? "#F0F0F0" : "#FFF",
              width: "281px",
              height: "42px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&:hover": { backgroundColor: disabled() || externalDisabled ? "#F0F0F0" : "#F5F8FF" },
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
