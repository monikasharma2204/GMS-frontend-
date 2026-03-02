import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, TextField, MenuItem } from "@mui/material";
import { VendorDataSelector, viewVendorInfo } from "recoil/selector/VendorSelector";
import { vendorInfoIDState, vendorViewInfoState, enableEditState, vendorFieldErrorsState } from "recoil/state/VendorState";
import { isEditingState, currencyState } from "recoil/state/CommonState";


import apiRequest from "helpers/apiHelper";

const currencies = [
  {
    value: "THB",
    label: "THB - THAILAND",

  },
  {
    value: "USD",
    label: "USD - USA",

  },
  {
    value: "JPY",
    label: "JPY - JAPAN",

  },
  {
    value: "CNY",
    label: "CNY - CHINA",
    // icon: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="26"
    //     height="18"
    //     viewBox="0 0 26 18"
    //     fill="none"
    //   >
    //     <g clipPath="url(#clip0_1420_68779)">
    //       <path
    //         d="M0.0429688 0.0449219H25.9566V17.9554H0.0429688V0.0449219Z"
    //         fill="#DE2910"
    //       />
    //       <path
    //         d="M4.36202 1.83587L5.88522 6.69587L1.89746 3.6922H6.82658L2.8389 6.69587L4.36202 1.83587ZM7.94026 2.29661L9.01896 1.01172L8.8747 2.70855L8.0294 1.24796L9.54146 1.91449L7.94026 2.29661ZM9.55347 3.75354L11.0286 3.00336L10.2605 4.50918L10.0281 2.82291L11.1721 4.04557L9.55347 3.75354ZM9.578 6.06748L11.22 6.00641L9.92619 7.05632L10.3776 5.41849L10.941 7.01861L9.578 6.06748ZM8.00642 7.54509L9.54379 8.14608L7.95935 8.5967L8.9857 7.26658L8.90951 8.96808L8.00642 7.54509Z"
    //         fill="#FFDE00"
    //       />
    //     </g>
    //     <defs>
    //       <clipPath id="clip0_1420_68779">
    //         <rect width="26" height="18" fill="white" />
    //       </clipPath>
    //     </defs>
    //   </svg>
    // ),
  },
];

const Currency = (props) => {
  const [isEditing, setIsEditing] = useRecoilState(isEditingState)
  const [vendorData, setVendorData] = useRecoilState(VendorDataSelector)
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [currenciesList, setCurrenciesList] = useState([])


  const editStatus = useRecoilValue(enableEditState)
  const vendorViewInfo = useRecoilValue(vendorViewInfoState)
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState)


  const setViewEdit = async (data) => {
    if (data.currency) {
      setVendorData({
        type: "account_infomation",
        currency: data.currency


      })

    }

  }
  const fetchData = async () => {
    try {
      const response = await apiRequest(
        "GET",
        "/currencies/active"
      );
      setCurrenciesList(response);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    setIsEditing(false)
  }, [])

  useEffect(() => {

    fetchData();


  }, []);

  useEffect(() => {
    console.log(currency, 'vendorData.currency')
    setViewEdit(vendorViewInfo)
  }, [vendorViewInfo])


  return (
    <TextField
      value={props.comp_use == "company_profile" ? currency : vendorData.currency}

      disabled={props.comp_use == "company_profile" ? !isEditing : (editStatus || isEditing === true ? false : true)}
      classes={editStatus ? "currency" : "currency disabled_input"}
      onChange={(e) => {
        console.log(e.target.value)
        setVendorData({
          type: "account_infomation",
          currency: e.target.value
        })
        setCurrency(e.target.value)

        if (fieldErrors.currency) {
          setFieldErrors({ ...fieldErrors, currency: "" });
        }
      }}

      defaultValue={props.comp_use == "company_profile" ? currency : vendorData.currency}
      required
      select
      error={props.comp_use == "company_profile" ? (props.error) : (!!fieldErrors.currency || props.error)}
      helperText={props.comp_use == "company_profile" ? (props.helperText) : (fieldErrors.currency || props.helperText)}
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
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "235px",
          height: "42px",
          // "&:hover .MuiOutlinedInput-notchedOutline": {
          //    borderColor: "#8BB4FF",
          // },
          // "&:hover": {
          //  backgroundColor: "#F5F8FF",
          // },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
        },
      }}
    >
      {currenciesList.map((option) => (
        <MenuItem key={option._id} value={option._id}>
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
      ))}
    </TextField>
  );
};

export default Currency;

