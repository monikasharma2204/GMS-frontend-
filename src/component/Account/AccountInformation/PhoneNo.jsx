import React, {useEffect } from "react";
import { MuiTelInput } from "mui-tel-input";
import { useRecoilState , useRecoilValue} from "recoil";
import { VendorDataSelector,viewVendorInfo } from "recoil/selector/VendorSelector";
import { vendorInfoIDState,vendorViewInfoState,enableEditState, vendorFieldErrorsState } from "recoil/state/VendorState";

const PhoneNo = () => {

  const editStatus = useRecoilValue(enableEditState)
  const[vendorData,setVendorData] =  useRecoilState(VendorDataSelector)
  const vendorViewInfo = useRecoilValue(vendorViewInfoState)
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState)

  const setViewEdit = async (data)=> {
    if(data.phone_no){
          setVendorData({
      type:"account_infomation",
      phone_no:data.phone_no


    })

    }

  }

  useEffect(()=>{
    
    setViewEdit(vendorViewInfo)
  },[vendorViewInfo])

   
  return (
    <MuiTelInput
   
    value={vendorData.phone_no}
    error={!!fieldErrors.phone_no}
    helperText={fieldErrors.phone_no}
    disabled={editStatus?false:true}
    classes={editStatus?"phone_no" : "phone_no disabled_input"}
    onChange={(v)=>{
      setVendorData({
        type:"account_infomation",
        phone_no:v})
  
      if (fieldErrors.phone_no) {
        setFieldErrors({ ...fieldErrors, phone_no: "" });
      }
    }}

      defaultCountry="TH"
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "298px",
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
      label="Phone No. :"
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
        },
      }}
      required
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 300, 
            maxWidth : 300,// reduce max height of dropdown
          },
        },
        MenuListProps: {
          style: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
        sx: {
          '& .MuiMenuItem-root': {
            minHeight: 30, // reduce height of each item
            paddingTop: 1,
            paddingBottom: 1,
          },
        },
      }}
    />
  );
};

export default PhoneNo;
