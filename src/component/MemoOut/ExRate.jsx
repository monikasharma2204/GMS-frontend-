import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { grandTotalState, memoInfoState , keyEditState, selectedCurrencyState } from "recoil/MemoOut";
import { useRecoilState } from "recoil";
import {
  QuotationtableRowsState,
} from "recoil/state/MemoOutState";
import { exchnageState } from "recoil/state/CommonState";
import { currencyState } from "recoil/state/CommonState";
import apiRequest from "helpers/apiHelper";


const ExRate = ({ onExchangeRateChange , exchangeRate, disabled = false}) => {
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
    const [rows, setRows] = useRecoilState(QuotationtableRowsState);
       const [currency,setCurrency] = useRecoilState(currencyState);
       const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);




          const getCompanyInfo = async () => {
                     try {
                       const companyInfoData = await apiRequest("GET", "/companyProfile");
                       // setMemoInfo((prev)=>({...prev,currency:companyInfoData.currency})) 
                       setCurrency(companyInfoData.currency)
                     } catch (error) {
                       console.error("Error fetching company info:", error);
                     }
                   }
                   useEffect(() => {
                     getCompanyInfo();
                   }, []);
             


  useEffect(() => {
    if (memoInfo?.currency  === currency) {
      onExchangeRateChange("");

    } else {
      onExchangeRateChange(buyingRate);
    }
  }, [memoInfo?.currency , currency]);

 
  const handleChange = (e) => {
    onExchangeRateChange(e.target.value)
  };

  return (
    <TextField
      disabled={disabled || (memoInfo?.currency===currency)}
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
          backgroundColor: memoInfo?.currency === currency ? "#F0F0F0" : "#FFF",
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
