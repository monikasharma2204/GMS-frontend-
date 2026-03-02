import React, { useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import {
  QuotationInvoiceAddressState,
  QuotationSelectedInvoiceAddressState,
} from "recoil/state/QuotationState";
import { useRecoilState , useRecoilValue} from "recoil";
import { editMemoState, memoInfoState } from "recoil/MemoState";

const InvoiceAddress = ({ disabled }) => {
  const [invoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );

  const handleInvoiceChange = (event, newValue) => {
    setSelectedInvoiceAddress(newValue);
  };
  const editMemoStatus = useRecoilValue(editMemoState);
  const [memoInfo] = useRecoilState(memoInfoState);
  const shouldDisableFields = disabled || (memoInfo?.isDayBookEdit && !editMemoStatus);

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

  return (
    <Autocomplete
      id="account-select"
      disabled={shouldDisableFields}
      options={Array.isArray(invoiceAddress) ? invoiceAddress : []}
      getOptionLabel={(option) => option?.label || ""}
      value={selectedInvoiceAddress}
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
