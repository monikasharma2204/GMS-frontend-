import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import { useRecoilState } from "recoil";
import { tableRowsState, tableRowsDropdownData } from "recoil/state/CustomerState";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getItemAmount} from "helpers/puHelper";










// Reusable TextField Component
const CustomTextField = ({ value, onChange, width = 136, disabled = false, placeholder = "" }) => (
  <TextField
    value={value}
    onChange={(e)=>onChange(e.target.value)}
    placeholder={placeholder}
    variant="outlined"
    fullWidth
    disabled={disabled}
    inputProps={{
      sx: {
        textAlign: "right",
        color: "black",
        fontFamily: "Calibri",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
      },
    }}

    sx={{
      "& .MuiOutlinedInput-root": {
        width: `${width}px`,
        height: "34px",
        borderRadius: "4px",
       
      },
      "& .MuiInputBase-root.Mui-disabled": {
        "& > fieldset": {
          borderColor: "#E6E6E6",
        },
        bgcolor: "#F0F0F0",
        borderRadius: "4px",
      },
    }}
  />
);

const CustomSelectInput = ({ value, onChange, options = [], width = 138, disabled = false,onDropdownClick=()=>{} }) => {
  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <Autocomplete
      value={selectedOption} // Controlled value
      onChange={(_, newValue) => {
        console.log(newValue, "newValue")
        onChange(newValue ? newValue.value : ""); // Update the parent state
      }}
      onBlur={(event) => {
        // Ensure the value is retained on blur
        if (!event.target.value && selectedOption) {
          onChange(selectedOption.value);
        }
      }}
      
      options={options}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option.value === value.value} // Compare options by value
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          disabled={disabled}
          onClick={onDropdownClick}
          sx={{
            "& .MuiOutlinedInput-root": {
              width: `${width}px`,
              height: "34px",
              borderRadius: "4px",
         
            },
            "& .MuiInputBase-root.Mui-disabled": {
              "& > fieldset": {
                borderColor: "#E6E6E6",
              },
              bgcolor: "#F0F0F0",
              borderRadius: "4px",
            },
          }}
        />
      )}
    />
  );
};

const TableRowComponent = React.memo(({
  item,
  index,
  editMemoStatus,
  dropdownOptions={},
  handleDelete,
  handleAddRow=()=>{},
  selectedItems=[],
}) => {
  const [rows, setRows] = useRecoilState(tableRowsState);
   const [allDropdrownOptions, setAllDropdownOptions] = useRecoilState(tableRowsDropdownData);
  const [stones, setStones] = useState([]);

  console.log("selectedItems",selectedItems);

  const calculateAmount = (currItem,key) => {
        const totalAmount =
        currItem.unit === "pcs"
            ? (currItem.pcs ||0) * (currItem.price||0)
            : (currItem.weight||0) * (currItem.price||0);
    
          // UpdateItem(currItem,key,'amount',totalAmount)
        return totalAmount;
      };

    const calculateAmountAfterDiscount = (currItem) => {
    
      const afterDiscount =
        parseFloat( calculateAmount(currItem || {}) - parseFloat(calculateDiscount(currItem ||{})) + parseFloat((currItem.labour_price ||0)) ).toFixed(2);
  
        
  
      return afterDiscount;
    };

    const calculateDiscount=(item)=>{
      return ((item.discountPercentage || 0) / 100) * calculateAmount(item || {});
    }

  const valueFormat = (value, field, item={})=>{

    if(field==="amount"){

      return calculateAmount(item || {});
    }

    if (field === "discountAmount") {
      return calculateDiscount(item ||{});
    }

    if(field==="totalAmount"){

      return calculateAmountAfterDiscount(item || {})
    }


    return value;

  }


  const selIndex= index;
  const handleChange = useCallback((index, field, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
   
  }, [setRows]);

  const handleAddRowOnClick=(key, index)=>{
   
    if(key==="stone" && selIndex === rows.length-1){
      handleAddRow();
    }
  }

  useEffect(() => {
    if (rows.length > 0) {
      const stoneLists = rows.map((item) => ({ label: item?.name || "", value: item?.code || "" }));
      console.log("stoneLists",stoneLists);
      setStones(stoneLists);
    }
  }, [allDropdrownOptions]);

  const fields = [
  
    { key: "lot", component: CustomTextField },
    { key: "stone", component: CustomSelectInput, options: dropdownOptions?.stone ||[] },
    { key: "shape", component: CustomSelectInput, options: dropdownOptions?.shape || [] },
    { key: "size", component: CustomSelectInput, options: dropdownOptions?.size || [] },
    { key: "color", component: CustomSelectInput, options: dropdownOptions?.color || [] },
    { key: "cutting", component: CustomSelectInput, options: dropdownOptions?.cutting || [] },
    { key: "quality", component: CustomSelectInput, options: dropdownOptions?.quality || [] },
    { key: "clarity", component: CustomSelectInput, options: dropdownOptions?.clarity || [] },
    { key: "cerType", component: CustomSelectInput, options: dropdownOptions?.cerType || [] },
    { key: "certificateNumber", component: CustomTextField },
    { key: "pcs", component: CustomTextField },
    { key: "weight", component: CustomTextField },
    { key: "price", component: CustomTextField },
    { key: "unit", component: CustomSelectInput, options: dropdownOptions?.unit || [] },
    { key: "amount", component: CustomTextField },
    { key: "discountPercentage", component: CustomTextField },
    { key: "discountAmount", component: CustomTextField },
    { key: "totalAmount", component: CustomTextField },
    { key: "Ref No.", component: CustomTextField },
    { key: "labour", component: CustomSelectInput, options: dropdownOptions?.labour || [] },
    // { key: "description", component: CustomTextField, width: 330, placeholder: "Description..........." },
  ];


  

  console.log(rows);

  return (

    
    <Box sx={{ height: "42px", bgcolor: "#FFF", border: "0px solid var(--Line-Table, #C6C6C8)", display: "flex" }}>
      {/* Remove Button */}
      <Box onClick={() => handleDelete(item.account)} sx={{ width: "20px", height: "100%", marginLeft: "2px", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6.1875 8.4375H11.8125C11.9617 8.4375 12.1048 8.49676 12.2102 8.60225C12.3157 8.70774 12.375 8.85082 12.375 9C12.375 9.14918 12.3157 9.29226 12.2102 9.39775C12.1048 9.50324 11.9617 9.5625 11.8125 9.5625H6.1875C6.03832 9.5625 5.89524 9.50324 5.78975 9.39775C5.68426 9.29226 5.625 9.14918 5.625 9C5.625 8.85082 5.68426 8.70774 5.78975 8.60225C5.89524 8.49676 6.03832 8.4375 6.1875 8.4375Z" fill="#E00410" />
          <path d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875Z" fill="#E00410" />
        </svg>
      </Box>
      <Box sx={{ width: "25px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ color: "var(--Main-Text, #343434)", fontFamily: "Calibri", fontSize: "16px", fontStyle: "normal", fontWeight: 400, lineHeight: "normal" }}>
          {index + 1}
        </Typography>
      </Box>

      <Box  sx={{  width: "40px",display: "flex", justifyContent: "center", alignItems: "center",}} >
      <TextField
      
          variant="outlined"
          fullWidth
          disabled="false"
          sx={{
            "& .MuiOutlinedInput-root": {
              width: "34px",
              height: "34px",
              borderRadius: "4px",
              backgroundColor: "#F2F2F2",
            },
            "& .MuiInputBase-root.Mui-disabled": {
              "& > fieldset": {
                borderColor: "#E6E6E6",
              },
              bgcolor: "#F0F0F0",
              borderRadius: "4px",
            },
          }}
        />
      </Box>

      {fields.map(({ key, component: Component, ...rest }) => (
        <Box key={key} sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center", margin: "1px" }}>
          <Component
            value={valueFormat(rows?.[index]?.[key] ?? '',key,rows?.[index])}
            onChange={(value) => handleChange(index, key, value)}
            onDropdownClick={()=>handleAddRowOnClick(key,index)}
            {...rest}
            disabled={editMemoStatus}
          />
        </Box>
      ))}


<Box sx = {{  width: "140px", display: "flex", justifyContent: "center", alignItems: "center", margin: "1px" }}>
<TextField
     variant="outlined"
     fullWidth
     disabled={false}
    inputProps={{
      sx: {
        textAlign: "right",
        color: "black",
        fontFamily: "Calibri",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
      },
    }}

    sx={{
      "& .MuiOutlinedInput-root": {
        width: "339px",
        height: "34px",
        borderRadius: "4px",

      },
      "& .MuiInputBase-input": {
        textAlign: "left", // Ensures input text is left-aligned
      },
      "& .MuiInputBase-root.Mui-disabled": {
        "& > fieldset": {
          borderColor: "#E6E6E6",
        },
        bgcolor: "#F0F0F0",
        borderRadius: "4px",
      },
    }}
  />
</Box>

      
    </Box>
  );
});

export default TableRowComponent;