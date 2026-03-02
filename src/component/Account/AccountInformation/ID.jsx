import { TextField } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import { VendorDataSelector, viewVendorInfo } from "recoil/selector/VendorSelector";
import { vendorInfoIDState, vendorViewInfoState, enableEditState, vendorFieldErrorsState } from "recoil/state/VendorState";


const ID = () => {
  const editStatus = useRecoilValue(enableEditState)

  const [vendorData, setVendorData] = useRecoilState(VendorDataSelector)
  const vendorViewInfo = useRecoilValue(vendorViewInfoState)
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState)

  const setViewEdit = async (data) => {
    if (data.vendor_code_id) {
      setVendorData({
        type: "account_infomation",
        vendor_code_id: data.vendor_code_id


      })

    }

  }

  useEffect(() => {

    setViewEdit(vendorViewInfo)
  }, [vendorViewInfo])


  return (

    <TextField
      value={vendorData.vendor_code_id}
      error={!!fieldErrors.vendor_code_id}
      helperText={fieldErrors.vendor_code_id}
      disabled={editStatus ? false : true}
      className={editStatus ? "code_name" : "code_name disabled_input"}
      required
      onChange={(e) => {
        setVendorData({
          type: "account_infomation",
          vendor_code_id: e.target.value
        })
        if (fieldErrors.vendor_code_id) {
          setFieldErrors({ ...fieldErrors, vendor_code_id: "" });
        }
      }}
      id="outlined-required"
      label="ID :"
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
          width: "384px",
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

export default ID;
