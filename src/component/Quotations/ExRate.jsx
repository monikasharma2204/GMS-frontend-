import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import {
  grandTotalState,
  memoInfoState,
  keyEditState,
  editMemoState,
  selectedCurrencyState,
} from "recoil/MemoState";
import { useRecoilState, useRecoilValue } from "recoil";
import { QuotationtableRowsState } from "recoil/state/QuotationState";
import { exchnageState } from "recoil/state/CommonState";

import apiRequest from "helpers/apiHelper";
import { getCompanyCurrencyId } from "../../helpers/currencyCache.js";

const ExRate = ({ onExchangeRateChange, exchangeRate, disabled, companyCurrency }) => {
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const editMemoStatus = useRecoilValue(editMemoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [isDisabled, setIsDisabled] = useState(false);

  const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);


  useEffect(() => {
    const checkExchangeRate = async () => {
      // const companyCurrencyId = await getCompanyCurrencyId(apiRequest);
      const shouldDisable = memoInfo?.currency === companyCurrency;
      const isLocked = isDisabled || shouldDisable;

      setIsDisabled(shouldDisable);

      if (shouldDisable) {
        onExchangeRateChange("");
        return;
      }


      if (memoInfo?.isDayBookEdit) {
        if (exchangeRate !== undefined && exchangeRate !== null && `${exchangeRate}` !== "" && exchangeRate !== "0") {

          onExchangeRateChange(exchangeRate);
        } else if (memoInfo?.exchange_rate !== undefined && memoInfo?.exchange_rate !== null && `${memoInfo?.exchange_rate}` !== "" && memoInfo?.exchange_rate !== "0") {

          onExchangeRateChange(memoInfo.exchange_rate);
        } else {

          onExchangeRateChange(buyingRate);
        }
      } else {

        onExchangeRateChange(buyingRate);
      }
    };
    checkExchangeRate();
  }, [memoInfo?.currency, memoInfo?.isDayBookEdit, memoInfo?.exchange_rate, buyingRate, exchangeRate, onExchangeRateChange, companyCurrency]);



  const handleChange = (e) => {
    onExchangeRateChange(e.target.value);
  };


  const shouldDisableFields = disabled || (memoInfo?.isDayBookEdit && !editMemoStatus);
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
          backgroundColor: isDisabled ? "#F0F0F0" : "#FFF",
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
