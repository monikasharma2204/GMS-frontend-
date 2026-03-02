import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { getVendorInfo } from "recoil/selector/VendorSelector";
import {


  
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState,
} from "recoil/Load/LoadState";
import { memoInfoState } from "recoil/Load/MemoState";
import { QuotationtableRowsState } from "recoil/Load/LoadState";


const Account = ({ disabled: externalDisabled = false, memoInfo: propMemoInfo }) => {


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
    
    // Use propMemoInfo if provided, otherwise use Recoil state
    const currentMemoInfo = propMemoInfo || memoInfo;
    const [rows, setRows] = useRecoilState(QuotationtableRowsState);
    
    // Set account from memoInfo - prioritize clearing if account is null/empty
    useEffect(() => {
      const account = currentMemoInfo?.account;
      
      // Always clear if account is null/undefined/empty object/empty string
      // This handles both null and the default empty object { label: "", code: "" }
      // Clear immediately, don't wait for customerList
      if (!account || 
          account === null ||
          (typeof account === 'object' && (!account.label || account.label.trim() === "") && (!account.code || account.code.trim() === "")) ||
          (typeof account === 'string' && account.trim() === "")) {
        setSelectedAccount(null);
        return;
      }
      
      // If customerList is not loaded yet, wait for it before setting account
      if (!customerList.length) return;
      
      // Find matching account in customer list
      const accountValue = account;
      const matchingAccount = customerList.find(customer => 
        [customer.code, customer.Label, customer.label].includes(accountValue)
      );
      
      setSelectedAccount(matchingAccount || accountValue);
    }, [currentMemoInfo?.account, customerList]);
  
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
      // Only set account from dayBookQuotation if dayBookQuotation exists and is not null
      if (dayBookQuotation) {
        const accountData = {
          code: dayBookQuotation.vendor_code_id,
          label: dayBookQuotation.account,
        };
        setSelectedAccount(accountData);
        
        // Also update memoInfo.account with the account data
        setMemoInfo(prevMemoInfo => {
          const newMemoInfo = {
            ...prevMemoInfo,
            account: accountData,
          };
          return newMemoInfo;
        });
      } else {
        // If dayBookQuotation is null/undefined, check if account should be cleared
        // Always clear if memoInfo.account is null/empty (this handles reset cases)
        const account = currentMemoInfo?.account;
        if (!account || 
            account === null ||
            (typeof account === 'object' && (!account.label || account.label.trim() === "") && (!account.code || account.code.trim() === "")) ||
            (typeof account === 'string' && account.trim() === "")) {
          setSelectedAccount(null);
          // Also ensure memoInfo.account is cleared if it's the default empty object
          if (account && typeof account === 'object' && (!account.label || account.label.trim() === "") && (!account.code || account.code.trim() === "")) {
            setMemoInfo(prevMemoInfo => ({
              ...prevMemoInfo,
              account: null,
            }));
          }
        }
      }
    }, [dayBookQuotation, setMemoInfo, currentMemoInfo?.account]);
  
    const disabled = () => {
  
      return rows.some(r => r.isFromMemoPending);
    }
    
  return (

    <Autocomplete
          id="account-select"
          options={customerList}
          getOptionLabel={(option) => option?.label ?? ""}
          value={selectedAccount}
          disabled={currentMemoInfo?.isDayBookEdit || disabled() || externalDisabled}
          onChange={handleAccountChange}
          renderInput={(params) => (
            <TextField

               {...params}

            required
           
            label="Account :"
            InputLabelProps={{
              shrink: true,
              sx: {
                color: "#666666",
                fontFamily: "Calibri",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
              },
            }}
            sx={{
              "& .MuiInputLabel-asterisk": {
                color: "red",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#FFF",
                width: "420px",
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
            
            }}
          />
        )}
        />
          )
   
};

export default Account;
