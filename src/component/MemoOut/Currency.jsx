import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import apiRequest from "../../helpers/apiHelper.js";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/MemoOut.js";
import { useRecoilState } from "recoil";
import Decimal from "decimal.js";

import { exchnageState } from "../../recoil/state/CommonState.js";

const Currency = ({ initialValue, disabled = false, triggerFSMDirty }) => {
  const [currencies, setCurrencies] = useState(false);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [keyEdit, setKeyEdit] = useRecoilState(keyEditState);
  const [buyingRate, setBuyingRate] = useRecoilState(exchnageState);

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

    // if (initialValue) {
    //   setMemoInfo((prev) => ({
    //     ...prev,
    //     currency: initialValue,
    //   }));

    //   currenciesDataById(initialValue).then((currency_data) => {
    //     if (currency_data) {
    //       setMemoInfo((prev) => ({
    //         ...prev,
    //         exchange_rate: parseFloat(currency_data.selling_rate).toFixed(2),
    //       }));
    //       setMemoInfo((prev) => ({
    //         ...prev,
    //         currencyCode: currency_data.code,
    //       }));
    //     }
    //   });
    // }
  }, [currencies]);

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
      value={memoInfo?.currency}
      onChange={async (e) => {
        const selectedCurrencyId = e.target.value;

        const currency_data = await currenciesDataById(selectedCurrencyId);

        const newExchangeRate = parseFloat(currency_data.buying_rate).toFixed(
          2
        );

        setMemoInfo((prev) => ({
          ...prev,
          currency: selectedCurrencyId,
          currencyCode: currency_data.code,
          exchange_rate: newExchangeRate,
        }));

        setBuyingRate(
          memoInfo?.currency === currency_data?._id ? "" : newExchangeRate
        );

        if (triggerFSMDirty) {
          triggerFSMDirty();
        }
      }}
      disabled={disabled}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "204px",
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
        marginLeft: "35px",
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
