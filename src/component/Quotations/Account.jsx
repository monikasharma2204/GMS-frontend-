import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";
import { getCustomerInfo } from "recoil/selector/CustomerSelector";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState,
  QuotationSelectedInvoiceAddressState,
  QuotationSelectedShippingAddressState,
} from "recoil/state/QuotationState";
import { memoInfoState, editMemoState } from "recoil/MemoState";

const Account = ({ account, setAccount, disabled }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const customerData = useRecoilValueLoadable(getCustomerInfo);
  const [customerList, setCustomerList] = useState([]);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [shippingAddress, setShippingAddress] = useRecoilState(
    QuotationShippingAddressState
  );
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );
  const [selectedShippingAddress, setSelectedShippingAddress] = useRecoilState(
    QuotationSelectedShippingAddressState
  );
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );
  const editMemoStatus = useRecoilValue(editMemoState);
  const [memoInfo] = useRecoilState(memoInfoState);
  const shouldDisableFields = disabled || (memoInfo?.isDayBookEdit && !editMemoStatus);

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
    console.log(newValue, "newValue");
    setSelectedAccount(newValue);
    setAccount(newValue);

    if (newValue) {
      const nextInvoice = newValue.invoiceAddress || [];
      const nextShipping = newValue.shippingAddress || [];
      setInvoiceAddress(nextInvoice);
      setShippingAddress(nextShipping);
      setSelectedInvoiceAddress(
        nextInvoice && nextInvoice.length > 0 ? nextInvoice[0] : null
      );
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
      setSelectedAccount({
        code: dayBookQuotation.vendor_code_id,
        label: dayBookQuotation.account,
      });
    }
  }, [dayBookQuotation]);

  const FilterOption = customerList.filter((item) => item?.account_status === "active")
 
  return (
    <Autocomplete
      id="account-select"
      options={FilterOption}
      getOptionLabel={(option) => option?.label ?? ""}
      value={account}
      onChange={handleAccountChange}
      disabled={shouldDisableFields}
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
