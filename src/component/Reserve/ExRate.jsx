import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { memoInfoState, editMemoState } from "recoil/Reserve/MemoState.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { QuotationtableRowsState } from "recoil/state/QuotationState";
import { exchnageState } from "recoil/state/CommonState";
import apiRequest from "helpers/apiHelper";
import { getCompanyCurrencyId } from "../../helpers/currencyCache.js";

const ExRate = ({ onExchangeRateChange, exchangeRate, disabled = false }) => {
  const [memoInfo] = useRecoilState(memoInfoState);
  const editMemoStatus = useRecoilValue(editMemoState);
  const [rows] = useRecoilState(QuotationtableRowsState);
  const [buyingRate] = useRecoilState(exchnageState);
  const [isDisabled, setIsDisabled] = useState(false);
  const [initialExchangeRate, setInitialExchangeRate] = useState(null);
  const [initialCurrency, setInitialCurrency] = useState(null);

  useEffect(() => {
    if (memoInfo?.isDayBookEdit) {
      if (exchangeRate !== undefined && exchangeRate !== null && `${exchangeRate}` !== "") {
        if (initialCurrency !== null && memoInfo?.currency !== initialCurrency) {
          setInitialExchangeRate(exchangeRate);
          setInitialCurrency(memoInfo?.currency);
        } else if (initialExchangeRate === null) {
          setInitialExchangeRate(exchangeRate);
          setInitialCurrency(memoInfo?.currency);
        }
      }
    } else {
      setInitialExchangeRate(null);
      setInitialCurrency(null);
    }
  }, [memoInfo?.isDayBookEdit, exchangeRate, memoInfo?.currency, initialCurrency, initialExchangeRate]);

  useEffect(() => {
    const checkExchangeRate = async () => {
      const companyCurrencyId = await getCompanyCurrencyId(apiRequest);
      const shouldDisable = memoInfo?.currency === companyCurrencyId;
      setIsDisabled(shouldDisable);

      if (shouldDisable) {
        onExchangeRateChange("");
        return;
      }

      const isApproved =
        ((memoInfo?.status || "") + "").toLowerCase() === "approved" ||
        ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
      const currencyChanged = initialCurrency !== null && memoInfo?.currency !== initialCurrency;

      if (memoInfo?.isDayBookEdit) {
        if (currencyChanged && !isApproved) {
          onExchangeRateChange(buyingRate);
        } else if (currencyChanged && isApproved) {
          onExchangeRateChange(initialExchangeRate || exchangeRate);
        } else {
          if (exchangeRate !== undefined && exchangeRate !== null && `${exchangeRate}` !== "") {
            onExchangeRateChange(exchangeRate);
          } else if (initialExchangeRate !== null) {
            onExchangeRateChange(initialExchangeRate);
          } else {
            onExchangeRateChange(buyingRate);
          }
        }
      } else {
        onExchangeRateChange(buyingRate);
      }
    };
    checkExchangeRate();
  }, [
    memoInfo?.currency,
    memoInfo?.isDayBookEdit,
    memoInfo?.status,
    memoInfo?.status_approve,
    buyingRate,
    initialCurrency,
    initialExchangeRate,
    exchangeRate,
    onExchangeRateChange,
  ]);

  const handleChange = (e) => {
    onExchangeRateChange(e.target.value);
  };

  const isApproved =
    ((memoInfo?.status || "") + "").toLowerCase() === "approved" ||
    ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
  // In daybook mode, disable if Edit button is not clicked (view mode)
  const shouldDisableFields = disabled || isApproved || (memoInfo?.isDayBookEdit && !editMemoStatus);
  const isLocked = isDisabled || shouldDisableFields;

  return (
    <TextField
      disabled={isLocked}
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
          backgroundColor: isLocked ? "#F0F0F0" : "#FFF",
          width: "135px",
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
