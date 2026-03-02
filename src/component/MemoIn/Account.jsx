import React, { useEffect, useState, useRef } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";
import { getVendorInfo } from "recoil/selector/VendorSelector";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  QuotationSelectedInvoiceAddressState,
  DayBookQuotationState,
} from "recoil/MemoIn/MemoInState";
import {  memoInfoState, editMemoState } from "recoil/MemoIn/MemoState";
import { QuotationtableRowsState } from "recoil/MemoIn/MemoInState";
import { memoInFSMState } from "recoil/state/MemoInFSMState";

const Account = ({ }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const customerData = useRecoilValueLoadable(getVendorInfo);
  const [customerList, setCustomerList] = useState([]);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );
  const [shippingAddress, setShippingAddress] = useRecoilState(
    QuotationShippingAddressState
  );
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );

    const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
      const [rows, setRows] = useRecoilState(QuotationtableRowsState);
      const editMemoStatus = useRecoilValue(editMemoState);
      const [fsmState] = useRecoilState(memoInFSMState);
      const isSettingFromDaybookRef = useRef(false);
      const processedDaybookRef = useRef(null);

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
    
    if (isSettingFromDaybookRef.current) {
      isSettingFromDaybookRef.current = false;
      return;
    }
    
    setSelectedAccount(newValue);
    setMemoInfo((prev) => ({
      ...prev,
      account: newValue,
    }));

    if (newValue) {
     
      const addresses = (newValue.invoiceAddress || []).filter((addr, index, self) =>
        index === self.findIndex((a) => (a.label || "").trim() === (addr.label || "").trim())
      );
      setInvoiceAddress(addresses);
     
      setSelectedInvoiceAddress(addresses.length > 0 ? addresses[0] : null);
      setShippingAddress(newValue.shippingAddress || []);
    } else {
      setInvoiceAddress([]); // Reset if no account is selected
      setSelectedInvoiceAddress(null);
      setShippingAddress([]);
    }
  };

  useEffect(() => {
   
    if (dayBookQuotation) {
      const daybookKey = `${dayBookQuotation.vendor_code_id}_${dayBookQuotation.invoice_address}`;
      if (processedDaybookRef.current !== daybookKey) {
        processedDaybookRef.current = null; 
      }
    } else {
      processedDaybookRef.current = null; // Reset when daybook is cleared
    }
  }, [dayBookQuotation]);
  
  useEffect(() => {
    console.log(dayBookQuotation, "dayBookQuotation");
    if (dayBookQuotation && customerList.length > 0) {
     
      const daybookKey = `${dayBookQuotation.vendor_code_id}_${dayBookQuotation.invoice_address}`;
      if (processedDaybookRef.current === daybookKey) {
        
        return;
      }
      
      
      const matchedAccount = customerList.find(
        (acc) => acc.code === dayBookQuotation.vendor_code_id
      );
      
      if (matchedAccount) {
   
        processedDaybookRef.current = daybookKey;
        
       
        isSettingFromDaybookRef.current = true;
        
        
        setSelectedAccount(matchedAccount);
        setMemoInfo((prev) => ({
          ...prev,
          account: matchedAccount,
        }));
        
       
        let addresses = (matchedAccount.invoiceAddress || []).filter((addr, index, self) =>
          index === self.findIndex((a) => (a.label || "").trim() === (addr.label || "").trim())
        );
        
      
        const savedAddressText = (dayBookQuotation.invoice_address || "").trim();
        
        // IMPORTANT: Do NOT add the saved address to the list if it doesn't exist
        // Only use addresses that are already in the account's invoiceAddress array
        // Find the saved address in the existing list
        const savedAddress = addresses.find(
          (addr) => (addr.label || "").trim() === savedAddressText
        );
        
       
        setInvoiceAddress(addresses);
        
        // Set the selected address
        if (savedAddress) {
          // Use the saved address from daybook if it exists in the account's addresses
          setSelectedInvoiceAddress(savedAddress);
        } else if (addresses.length > 0) {
         
          setSelectedInvoiceAddress(addresses[0]);
        } else {
          setSelectedInvoiceAddress(null);
        }
        
        setShippingAddress(matchedAccount.shippingAddress || []);
      } else {
        
        const basicAccount = {
          code: dayBookQuotation.vendor_code_id,
          label: dayBookQuotation.account,
        };
        setSelectedAccount(basicAccount);
        setMemoInfo((prev) => ({
          ...prev,
          account: basicAccount,
        }));
        
        // Use only the saved address from daybook
        if (dayBookQuotation.invoice_address) {
          const fallbackAddress = {
            label: dayBookQuotation.invoice_address,
            code: "",
          };
          setInvoiceAddress([fallbackAddress]);
          setSelectedInvoiceAddress(fallbackAddress);
        } else {
          setInvoiceAddress([]);
          setSelectedInvoiceAddress(null);
        }
        setShippingAddress([]);
      }
    } else if (dayBookQuotation) {
      // If customerList is not loaded yet, set basic account info
      const basicAccount = {
        code: dayBookQuotation.vendor_code_id,
        label: dayBookQuotation.account,
      };
      setSelectedAccount(basicAccount);
      setMemoInfo((prev) => ({
        ...prev,
        account: basicAccount,
      }));
    }
  }, [dayBookQuotation, customerList]);

     const disabled = () => {
        return rows.some(r => r.isFromMemoPending);
      }
  
  const isApproved = ((memoInfo?.status || "") + "").toLowerCase() === "approved" || ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
  const shouldDisableFields = (fsmState === "saved" && !editMemoStatus) || (memoInfo?.isDayBookEdit && !editMemoStatus);

      const FilterOption = customerList.filter((item) => item?.account_status === "active")

  return (
    <Autocomplete
      id="account-select"
      options={FilterOption}
      getOptionLabel={(option) => option?.label ?? ""}
      value={memoInfo?.account}
      disabled={shouldDisableFields || isApproved || disabled()}
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
