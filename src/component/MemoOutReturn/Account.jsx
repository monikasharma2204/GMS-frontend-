import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { getMemoOutReturnAccountInfo } from "recoil/selector/MemoOutReturnAccountSelector";

import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState,
  QuotationSelectedInvoiceAddressState,
} from "recoil/MemoOutReturn/MemoReturn";
import { memoInfoState } from "recoil/MemoOutReturn/MemoState";
import { QuotationtableRowsState } from "recoil/MemoOutReturn/MemoReturn";

const Account = ({ account, setAccount ,  disabled, triggerFSMDirty }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const customerData = useRecoilValueLoadable(getMemoOutReturnAccountInfo);
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
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
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
    console.log("Account changed, newValue:", newValue);
    setSelectedAccount(newValue);

    setMemoInfo({
      ...memoInfo,
      account: newValue,
    });

    if (newValue) {
      const nextInvoices = newValue.invoiceAddress || [];
      setInvoiceAddress(nextInvoices);
      setShippingAddress(newValue.shippingAddress || []);
      setSelectedInvoiceAddress(
        nextInvoices && nextInvoices.length > 0 ? nextInvoices[0] : null
      );
    } else {
      console.log("Clearing invoice address");
      setInvoiceAddress([]); // Reset if no account is selected
      setShippingAddress([]);
      setSelectedInvoiceAddress(null);
    }
  };

  useEffect(() => {

    if (dayBookQuotation) {
      setSelectedAccount({
        code: dayBookQuotation.vendor_code_id,
        label: dayBookQuotation.account,
      });
    }
  }, [dayBookQuotation]);

 const shouldDisableAccount = () => {
    return rows.some(r => r.isFromMemoPending);
  }

        const FilterOption = customerList.filter((item) => item?.account_status === "active")



  
  return (
    <Autocomplete
      id="account-select"
      options={FilterOption}
      getOptionLabel={(option) => option?.label ?? ""}
      value={memoInfo?.account}
      disabled={disabled || memoInfo?.isDayBookEdit || shouldDisableAccount()}
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
              width: "425px",
              height: "42px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&:hover": { backgroundColor: "#F5F8FF" },
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

export default Account;
