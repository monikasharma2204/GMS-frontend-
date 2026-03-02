import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState ,useRecoilValue} from "recoil";
import { VendorDataSelector,viewVendorInfo } from "recoil/selector/VendorSelector";
import { vendorInfoIDState,vendorViewInfoState,enableEditState, vendorFieldErrorsState } from "recoil/state/VendorState";

const CodeName = () => {
  const [vendorData,setVendorData] =  useRecoilState(VendorDataSelector)
  const vendorViewInfo = useRecoilValue(vendorViewInfoState)
  const editStatus = useRecoilValue(enableEditState)
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState)

  // const [idVendor,setIdVendor] = useRecoilState(false)


  const setViewEdit = async (data)=> {
    if(data.vendor_code_name){
          setVendorData({
      type:"account_infomation",
      vendor_code_name:data.vendor_code_name


    })

    }

  }

  useEffect(()=>{
    
    setViewEdit(vendorViewInfo)
  },[vendorViewInfo])

   
  return (
    <TextField
    
      value={vendorData.vendor_code_name}
      error={!!fieldErrors.vendor_code_name}
      helperText={fieldErrors.vendor_code_name}
      disabled={editStatus?false:true}
      className={editStatus?"code_name" : "code_name disabled_input"}
      onChange={(e)=>{
        setVendorData({
          type:"account_infomation",
          vendor_code_name:e.target.value})
        if (fieldErrors.vendor_code_name) {
          setFieldErrors({ ...fieldErrors, vendor_code_name: "" });
        }
      }}
      required
      id="outlined-required"
      label="Code Name :"
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
        //   "& fieldset": {
        //     borderColor: borderColor,
        //   },
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "359px",
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
        marginTop: "24px",
      }}
    />
  );
};

export default CodeName;
