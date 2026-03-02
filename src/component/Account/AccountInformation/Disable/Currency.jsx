import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { VendorDataSelector } from "recoil/selector/VendorSelector";
import { vendorViewInfoState, enableEditState } from "recoil/state/VendorState";
import apiRequest from "../../../../helpers/apiHelper";

const Currency = () => {
  const [vendorData, setVendorData] = useRecoilState(VendorDataSelector);
  const vendorViewInfo = useRecoilValue(vendorViewInfoState);
  const editStatus = useRecoilValue(enableEditState);
  const [currenciesList, setCurrenciesList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await apiRequest("GET", "/currencies/active");
      setCurrenciesList(Array.isArray(response) ? response : []);
    } catch (err) {
      console.log(err);
    }
  };

  const setViewEdit = async (data) => {
    if (data.currency) {
      setVendorData({
        type: "account_infomation",
        currency: data.currency,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setViewEdit(vendorViewInfo);
  }, [vendorViewInfo]);

  return (
    <TextField
      disabled={!editStatus}
      required
      id="outlined-select-currency"
      select
      label="Currency :"
      value={vendorData.currency || ""}
      onChange={(e) => {
        setVendorData({
          type: "account_infomation",
          currency: e.target.value,
        });
      }}
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
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "235px",
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
      }}
    >
      {currenciesList.map((option) => (
        <MenuItem key={option._id} value={option._id}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
      ))}
    </TextField>
  );
};

export default Currency;
