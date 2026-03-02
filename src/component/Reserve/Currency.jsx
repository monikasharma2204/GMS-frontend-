import React, { useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import apiRequest from "../../helpers/apiHelper.js";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import { QuotationtableRowsState } from "recoil/Reserve/ReserveState";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/Reserve/MemoState.js";
import { useRecoilState, useRecoilValue } from "recoil";
import Decimal from "decimal.js";
import { currencyState, exchnageState } from "recoil/state/CommonState.js";
import { getCompanyCurrencyId, getBuyingRateById } from "../../helpers/currencyCache.js";
import { editMemoState } from "recoil/Reserve/MemoState.js";

const Currency = ({ initialValue, disabled = false }) => {
  const [currencies, setCurrencies] = useState(false);

  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [keyEdit, setKeyEdit] = useRecoilState(keyEditState);
  const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);
  const editMemoStatus = useRecoilValue(editMemoState);

  const currenciesData = async () => {
    try {
      const data = await apiRequest("GET", "/currencies/active", {}, {});
      setCurrencies(data);
    } catch (e) {
      console.log(e);
    }
  };

  const currenciesDataById = async (_id) => {
    try {
      const data = await apiRequest("GET", "/currencies/" + _id, {}, {});
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  useEffectOnce(() => {
    if (!currencies) {
      currenciesData();
    }
  }, []);


  const isApproved = ((memoInfo?.status || "") + "").toLowerCase() === "approved" || ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
  const isApprovedDocStatus =
    ((memoInfo?.status || "") + "").toLowerCase() === "approved" ||
    ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";

  const shouldDisableFields = disabled || isApproved || (memoInfo?.isDayBookEdit && !editMemoStatus);

  return (
    <TextField
      required
      disabled={shouldDisableFields}
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
        const companyCurrencyId = await getCompanyCurrencyId(apiRequest);
        const newExchangeRate = await getBuyingRateById(apiRequest, selectedCurrencyId);

        setMemoInfo((prev) => ({
          ...prev,
          currency: selectedCurrencyId,
          currencyCode: currency_data.code,
          exchange_rate: selectedCurrencyId === companyCurrencyId ? "" : newExchangeRate,
        }));

        setBuyingRate(selectedCurrencyId === companyCurrencyId ? "" : newExchangeRate);
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
