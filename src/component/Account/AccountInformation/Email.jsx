import { TextField } from "@mui/material";
import { useRecoilState,useRecoilValue } from "recoil";
import { useEffect } from "react";
import { VendorDataSelector,viewVendorInfo } from "recoil/selector/VendorSelector";
import { vendorInfoIDState,vendorViewInfoState,enableEditState, vendorFieldErrorsState } from "recoil/state/VendorState";

const Email = () => {
  const[vendorData,setVendorData] =  useRecoilState(VendorDataSelector)
  const vendorViewInfo = useRecoilValue(vendorViewInfoState)
  const editStatus = useRecoilValue(enableEditState)
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState)

  const setViewEdit = async (data)=> {
    if(data.email){
          setVendorData({
      type:"account_infomation",
      email:data.email


    })

    }

  }

  useEffect(()=>{
    
    setViewEdit(vendorViewInfo)
  },[vendorViewInfo])

  return (
    <TextField
    value={vendorData.email}
    error={!!fieldErrors.email}
    helperText={fieldErrors.email}
    disabled={editStatus?false:true}
    classes={editStatus?"company_name" : "company_name disabled_input"}
    onChange={(e)=>{
      setVendorData({
        type:"account_infomation",
        email:e.target.value})
  
      if (fieldErrors.email) {
        setFieldErrors({ ...fieldErrors, email: "" });
      }
    }}
      required
      id="outlined-required"
      label="Email :"
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
    />
  );
};

export default Email;
