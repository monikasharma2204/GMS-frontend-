import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { getVendorInfo } from "recoil/selector/VendorSelector";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState,
} from "recoil/Purchase/PurchaseState";
import {  memoInfoState, keyEditState, editMemoState } from "recoil/Purchase/MemoState";
import { QuotationtableRowsState } from "recoil/Purchase/PurchaseState";
import { useRecoilValue } from "recoil";

const Account = ({ shouldDisableFields = false }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const customerData = useRecoilValueLoadable(getVendorInfo);
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
  const [keyEdit, setKeyEdit] = useRecoilState(keyEditState);
  const editMemoStatus = useRecoilValue(editMemoState);

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
    setMemoInfo({
          ...memoInfo,
          account:newValue,
          
        });

      // const filteredRows = rows.filter(row => !row?.isFromMemoPending);

      //   // Update the state with the filtered rows
      //   setRows(filteredRows);

    if (newValue) {
      setInvoiceAddress(newValue.invoiceAddress || []);
      setShippingAddress(newValue.shippingAddress || []);
    } else {
      setInvoiceAddress([]); // Reset if no account is selected
      setShippingAddress([]);
    }
  };

  useEffect(() => {
    console.log(dayBookQuotation, "dayBookQuotation");
    if (dayBookQuotation) {
      setSelectedAccount({
        code: dayBookQuotation.vendor_code_id,
        label: dayBookQuotation.account,
      });
    }
  }, [dayBookQuotation]);

   const disabled = () => {
      return rows.some(r => r.isFromMemoPending || r.isFromPO);
    }

    const FilterOption = customerList.filter((item) => item?.account_status === "active")

  
  return (
    <Autocomplete
      id="account-select"
      options={FilterOption}
      getOptionLabel={(option) => option?.label ?? ""}
      value={memoInfo?.account}
      disabled={
        shouldDisableFields ||
        (memoInfo?.isDayBookEdit 
          ? (!editMemoStatus || disabled())
          : (memoInfo?.isPOEdit || (!keyEdit && !memoInfo?.isDayBookEdit && !memoInfo?.isPOEdit) || disabled()))
      }
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
