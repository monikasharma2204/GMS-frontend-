import React, { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import apiRequest from "../../helpers/apiHelper.js"
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import { keyEditState, memoInfoState, selectedCurrencyState } from "recoil/MemoState.js";
import { useRecoilState } from "recoil";
import Decimal from 'decimal.js';



const Currency = () => {
  const [currencies, setCurrencies] = useState(false)
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState)
  const [keyEdit, setKeyEdit] = useRecoilState(keyEditState)
  const [selectedCurrency, setSelectedCurrency] = useRecoilState(selectedCurrencyState)


  const currenciesData = async () => {
    try {
      const data = await apiRequest("GET", "/currencies/active", {}, {})
      console.log(data, 'currencies')
      setCurrencies(data)
    } catch (e) {
      console.log(e)
    }
  }

  const currenciesDataById = async (_id) => {
    try {
      const data = await apiRequest("GET", "/currencies/" + _id, {}, {})
      return data
    } catch (e) {
      console.log(e)
    }
  }
  useEffectOnce(() => {
    if (!currencies) {
      currenciesData()
    }

  }, [currencies])
  return (
    <TextField
      required
      disabled={!keyEdit}
      id="outlined-select-currency"
      select
      label="Currency :"
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          letterSpacing: "0.024px",
        },
      }}
      value={memoInfo.currency}
      onChange={async (e) => {

        const currency_data = await currenciesDataById(e.target.value)

        setMemoInfo((prev) => ({
          ...prev,
          currency: e.target.value,
        }));
        setMemoInfo((prev) => ({
          ...prev,
          exchange_rate: parseFloat(currency_data.selling_rate).toFixed(2)
        }));

        setSelectedCurrency(currency_data.code)


      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "200px",
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
        marginLeft: "35px"
      }}
    >
      {currencies ? currencies.map((option) => (
        <MenuItem key={option.code} value={option._id} >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* {option.icon} */}
            <span
              style={{
                marginLeft: "8px",
                color: "#343434",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {option.code}
            </span>
          </Box>
        </MenuItem>
      )) :
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center" }}>

          </Box>
        </MenuItem>
      }
    </TextField>
  );
};

export default Currency;
