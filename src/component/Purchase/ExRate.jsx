import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import {
  grandTotalState,
  memoInfoState,
  keyEditState,
  selectedCurrencyState,
  isApprovedState,
} from "recoil/Purchase/MemoState";
import { useRecoilState } from "recoil";
import { QuotationtableRowsState } from "recoil/state/QuotationState";
import { exchnageState } from "recoil/state/CommonState";
import apiRequest from "helpers/apiHelper";
import { getCompanyCurrencyId } from "../../helpers/currencyCache.js";

const ExRate = ({ onExchangeRateChange, exchangeRate, disabled = false }) => {
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);
  const [isApproved] = useRecoilState(isApprovedState);
  const [isDisabled, setIsDisabled] = useState(false);
  const [initialExchangeRate, setInitialExchangeRate] = useState(null);
  const [initialCurrency, setInitialCurrency] = useState(null);

  // Track initial exchange rate and currency when daybook data is loaded
  useEffect(() => {
    if (memoInfo?.isDayBookEdit) {
      if (exchangeRate !== undefined && exchangeRate !== null && `${exchangeRate}` !== "") {
        // If currency changed, reset initial values (new document loaded)
        if (initialCurrency !== null && memoInfo?.currency !== initialCurrency) {
          setInitialExchangeRate(exchangeRate);
          setInitialCurrency(memoInfo?.currency);
        } else if (initialExchangeRate === null) {
          // First time loading daybook data
          setInitialExchangeRate(exchangeRate);
          setInitialCurrency(memoInfo?.currency);
        }
      }
    } else {
      // Not in daybook mode - reset initial values
      setInitialExchangeRate(null);
      setInitialCurrency(null);
    }
  }, [memoInfo?.isDayBookEdit, exchangeRate, memoInfo?.currency]);

  useEffect(() => {
    const checkExchangeRate = async () => {
      const companyCurrencyId = await getCompanyCurrencyId(apiRequest);
      const shouldDisable = memoInfo?.currency === companyCurrencyId;
      setIsDisabled(shouldDisable);
      if (shouldDisable) {
        onExchangeRateChange("");
        return;
      }
      
      // In daybook mode:
      // - If currency hasn't changed from initial load, use saved exchange rate from DB
      // - If currency has changed by user, use new buying rate (unless approved, then preserve)
      // - If not approved and currency changed, allow update to new buying rate
      if (memoInfo?.isDayBookEdit) {
        const currencyChanged = initialCurrency !== null && memoInfo?.currency !== initialCurrency;
        
        if (currencyChanged && !isApproved) {
          // User changed currency and not approved - use new buying rate
          onExchangeRateChange(buyingRate);
        } else if (currencyChanged && isApproved) {
          // User changed currency but approved - preserve original exchange rate
          onExchangeRateChange(initialExchangeRate || exchangeRate);
        } else {
          // Currency hasn't changed (or initial load) - use exchangeRate prop from DB
          if (exchangeRate !== undefined && exchangeRate !== null && `${exchangeRate}` !== "") {
            onExchangeRateChange(exchangeRate);
          } else if (initialExchangeRate !== null) {
            onExchangeRateChange(initialExchangeRate);
          } else {
            onExchangeRateChange(buyingRate);
          }
        }
      } else {
        // Not in daybook mode - use buying rate
        onExchangeRateChange(buyingRate);
      }
    };
    checkExchangeRate();
  }, [memoInfo?.currency, memoInfo?.isDayBookEdit, buyingRate, isApproved, initialExchangeRate, initialCurrency, exchangeRate, onExchangeRateChange]);

  const handleChange = (e) => {
    onExchangeRateChange(e.target.value);
  };

  return (
    <TextField
      disabled={isDisabled || disabled}
      id="outlined-required"
      label="Exchange Rate :"
      value={exchangeRate}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 500,
        },
      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: isDisabled ? "#F0F0F0" : "#FFF",
          width: "204px",
          height: "42px",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        marginLeft: "10px",
      }}
    />
  );
};

export default ExRate;
