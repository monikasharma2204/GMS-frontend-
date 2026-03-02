import { TextField } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';

import { enableEditState, vendorFieldErrorsState } from "recoil/state/VendorState";
import { VendorDataSelector, viewVendorInfo } from "recoil/selector/VendorSelector";
import { vendorInfoIDState, vendorViewInfoState } from "recoil/state/VendorState";


const ContactPerson = () => {

  const [vendorData, setVendorData] = useRecoilState(VendorDataSelector)
  const { id } = useParams();
  const vendorViewInfo = useRecoilValue(vendorViewInfoState)
  const editStatus = useRecoilValue(enableEditState)
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState)

  // const [idVendor,setIdVendor] = useRecoilState(false)


  const setViewEdit = async (data) => {
    console.log(data)
    if (data.contact_person) {
      setVendorData({
        type: "account_infomation",
        contact_person: data.contact_person


      })

    }

  }

  useEffect(() => {

    setViewEdit(vendorViewInfo)
  }, [vendorViewInfo])

  return (
    <TextField
      id="outlined-required"
      value={vendorData.contact_person}
      error={!!fieldErrors.contact_person}
      helperText={fieldErrors.contact_person}
      disabled={editStatus ? false : true}
      classes={editStatus ? "contact_person" : "contact_person disabled_input"}
      onChange={(e) => {
        setVendorData({
          type: "account_infomation",
          contact_person: e.target.value
        })
        if (fieldErrors.contact_person) {
          setFieldErrors({ ...fieldErrors, contact_person: "" });
        }
      }}
      label="Contact Person :"
      placeholder="First name-Last name"
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
        "& .MuiOutlinedInput-input::placeholder": {
          color:
            "var(--gbreadcrumbs-and-other-parts-text, var(--Text-Dis-Field, #9A9A9A))",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
      }}
    />
  );
};

export default ContactPerson;
