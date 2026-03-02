import React, { useState,useEffect } from "react";
import { TextField } from "@mui/material";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";


const ContactPersonName = (props) => {


  const [ isEditing,setIsEditing] = useRecoilState(isEditingState)
  useEffect(()=>{
    setIsEditing(false)
  },[])

  return (
    <TextField
      required
      disabled={!isEditing}

      id="outlined-required"
      label="Contact Person Name :"
      placeholder="First name-Last name"
      value={props.value}
      onChange={props.onChange}
      error={props.error}
      helperText={props.helperText}
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
          "& fieldset": {
            borderColor: props.borderColor,
          },
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "434px",
          height: "42px",
          // "&:hover .MuiOutlinedInput-notchedOutline": {
          //   borderColor: "#8BB4FF",
          // },
          // "&:hover": {
          //   backgroundColor: "#F5F8FF",
          // },
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
        marginTop: "24px",
      }}
    />
  );
};

export default ContactPersonName;



// import React from "react";
// import { TextField } from "@mui/material";

// const ContactPersonName = React.memo(({ value, onChange, borderColor, isEditing }) => {
//   return (
//     <TextField
//       required
//       disabled={!isEditing}
//       id="outlined-required"
//       label="Contact Person Name :"
//       placeholder="First name-Last name"
//       value={value}
//       onChange={onChange}
//       InputLabelProps={{
//         shrink: true,
//         sx: {
//           color: "var(--Text-Field, #666)",
//           fontFamily: "Calibri",
//           fontSize: "18px",
//           fontStyle: "normal",
//           fontWeight: 400,
//         },
//       }}
//       sx={{
//         "& .MuiInputLabel-asterisk": {
//           color: "red",
//         },
//         "& .MuiOutlinedInput-root": {
//           "& fieldset": {
//             borderColor: borderColor,
//           },
//           borderRadius: "8px",
//           backgroundColor: "#FFF",
//           width: "434px",
//           height: "42px",
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#8BB4FF",
//           },
//           "&:hover": {
//             backgroundColor: "#F5F8FF",
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#8BB4FF",
//           },
//         },
//         "& .MuiOutlinedInput-input::placeholder": {
//           color: "var(--gbreadcrumbs-and-other-parts-text, var(--Text-Dis-Field, #9A9A9A))",
//           fontFamily: "Calibri",
//           fontSize: "16px",
//           fontStyle: "normal",
//           fontWeight: 400,
//           lineHeight: "normal",
//         },
//         marginTop: "24px",
//       }}
//     />
//   );
// });

// export default ContactPersonName;

