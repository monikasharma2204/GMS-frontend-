export const genItemListSelectBoxSxProps = ()=>{
    const inputProp = {
        sx: {
          textAlign: "center",
          color: "black",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
        },
      };
      return inputProp;
}

export const genItemListSelectBoxSxValue = (width=138,height=34)=>{
    let sxValue = {
        width: width,
        height: height,
        ".MuiInputLabel-root": {
          display: "none",
        },
        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
        //   WebkitTransform: "inherit !important",
        //   transform: "inherit !important",
        //   transition: "inherit !important",
        // },
        ".MuiSelect-icon": {
          // display: "none",
          color: "#666666",
        },
        ".stone_selectbox_icon_arrow": {
          right: "8px",
          position: "relative",
          cursor: "pointer",
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#C4C4C4",
        },
      }
      return sxValue;
}