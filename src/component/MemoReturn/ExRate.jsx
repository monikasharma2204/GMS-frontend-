import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import {
  grandTotalState,
  memoInfoState,
  keyEditState,
  selectedCurrencyState,
} from "recoil/MemoReturn/MemoState";
import { useRecoilState } from "recoil";
import { QuotationtableRowsState } from "recoil/MemoReturn/MemoReturn";
import { currencyState, exchnageState } from "recoil/state/CommonState";
import apiRequest from "helpers/apiHelper";
import { getCompanyCurrencyId } from "../../helpers/currencyCache.js";

const ExRate = ({ onExchangeRateChange, exchangeRate, disabled = false }) => {
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const checkExchangeRate = async () => {
      const companyCurrencyId = await getCompanyCurrencyId(apiRequest);
      const shouldDisable = memoInfo?.currency === companyCurrencyId;
      setIsDisabled(shouldDisable);
      if (shouldDisable) {
        onExchangeRateChange("");
        return;
      }
      // Preserve DB value in Daybook edit; otherwise use current buying rate
      if (memoInfo?.isDayBookEdit && exchangeRate !== undefined && exchangeRate !== null && `${exchangeRate}` !== "") {
        onExchangeRateChange(exchangeRate);
      } else {
        onExchangeRateChange(buyingRate);
      }
    };
    checkExchangeRate();
  }, [memoInfo?.currency, memoInfo?.isDayBookEdit, buyingRate, exchangeRate, onExchangeRateChange]);

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
