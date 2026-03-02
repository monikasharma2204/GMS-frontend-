import React, { useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import {
  QuotationInvoiceAddressState,
  QuotationSelectedInvoiceAddressState,
} from "recoil/Reserve/ReserveState";
import { memoInfoState, editMemoState } from "recoil/Reserve/MemoState.js";
import { useRecoilState, useRecoilValue } from "recoil";

const InvoiceAddress = ({ disabled = false }) => {
  const [invoiceAddress] = useRecoilState(QuotationInvoiceAddressState);
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );
  const [memoInfo] = useRecoilState(memoInfoState);
  const editMemoStatus = useRecoilValue(editMemoState);

  useEffect(() => {
    if (Array.isArray(invoiceAddress) && invoiceAddress.length > 0) {
      const trimmedSelected = (selectedInvoiceAddress?.label || "").trim();
      const existing = invoiceAddress.find(
        (addr) => (addr.label || "").trim() === trimmedSelected
      );
      if (!existing) {
        setSelectedInvoiceAddress(invoiceAddress[0]);
      }
    } else if (selectedInvoiceAddress) {
      setSelectedInvoiceAddress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceAddress]);

  const handleInvoiceChange = (event, newValue) => {
    setSelectedInvoiceAddress(newValue);
  };

  const isApproved =
    ((memoInfo?.status || "") + "").toLowerCase() === "approved" ||
    ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
 
  const shouldDisableFields = disabled || isApproved || (memoInfo?.isDayBookEdit && !editMemoStatus);

  return (
    <Autocomplete
      id="invoice-address-select"
      options={Array.isArray(invoiceAddress) ? invoiceAddress : []}
      getOptionLabel={(option) => option?.label || ""}
      value={selectedInvoiceAddress}
      disabled={isApproved || shouldDisableFields}
      onChange={handleInvoiceChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Invoice Address :"
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

export default InvoiceAddress;

