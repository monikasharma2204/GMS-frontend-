import React, { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import apiRequest from "../../helpers/apiHelper.js";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import { QuotationtableRowsState } from "recoil/Sale/SaleState";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/Sale/MemoState.js";
import { useRecoilState } from "recoil";
import Decimal from "decimal.js";
import { exchnageState } from "recoil/state/CommonState.js";
import { getCompanyCurrencyId, getBuyingRateById, getCurrencies } from "../../helpers/currencyCache.js";

const Currency = ({ initialValue, disabled: externalDisabled }) => {
  const [currencies, setCurrencies] = useState(false);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [companyCurrency, setCompanyCurrency] = useState(null);
  const [keyEdit, setKeyEdit] = useRecoilState(keyEditState);
  const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);

  const currenciesData = async () => {
    try {
      const data = await getCurrencies(apiRequest);
      setCurrencies(data);
    } catch (e) {
      console.log(e);
    }
  };

  const currenciesDataById = async (_id) => {
    try {
      const list = await getCurrencies(apiRequest);
      return list.find((c) => c._id === _id);
    } catch (e) {
      console.log(e);
    }
  };

  const getCompanyInfo = async () => {
    try {
      const companyCurrencyId = await getCompanyCurrencyId(apiRequest);
      setCompanyCurrency(companyCurrencyId);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  useEffectOnce(() => {
    if (!currencies) {
      currenciesData();
    }
    getCompanyInfo();

  
  }, [currencies]);

  return (
    <TextField
      required
      disabled={externalDisabled}
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
      value={memoInfo?.currency}
      onChange={async (e) => {
        const selectedCurrencyId = e.target.value;

        const currency_data = await currenciesDataById(selectedCurrencyId);

        const newExchangeRate = await getBuyingRateById(apiRequest, selectedCurrencyId);

        setMemoInfo((prev) => ({
          ...prev,
          currency: selectedCurrencyId,
          currencyCode: currency_data.code,
          exchange_rate: selectedCurrencyId === companyCurrency ? "" : newExchangeRate,
        }));

        setBuyingRate(
          selectedCurrencyId === companyCurrency ? "" : newExchangeRate
        );
      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "135px",
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
        marginLeft: "18px",
      }}
    >
      {currencies ? (
        currencies.map((option) => (
          <MenuItem key={option.code} value={option._id}>
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
        ))
      ) : (
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center" }}></Box>
        </MenuItem>
      )}
    </TextField>
  );
};

export default Currency;
