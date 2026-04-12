import React from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import { formatNumberWithCommas } from "../../../../helpers/numberHelper.js";
import { MERGE_SPLIT_TARGET_HEADERS } from "../constants/mergeSplitHeaders";
import { API_URL } from "../../../../config/config.js";

const MergeSplitTargetTableRow = React.memo(({ item, index, onUpdate, onRemove, dropdownOptions = {}, disabled = false }) => {
  const rowStyle = {
    height: "42px",
    display: "flex",
    alignItems: "center",
    bgcolor: "#FFF",
    borderBottom: "1px solid #EDEDED",
    "&:hover": { bgcolor: "#F5F5F5" }
  };

  const cellStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid #EDEDED",
    px: 1,
  };

  const inputStyle = {
    "& .MuiInputBase-input": {
      padding: "4px 8px",
      fontSize: "13px",
      fontFamily: "Calibri",
      textAlign: "center",
    },
    "& .MuiOutlinedInput-root": {
      height: "32px",
      borderRadius: "4px",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    }
  };

  const getWidth = (label) => {
    const header = MERGE_SPLIT_TARGET_HEADERS.find(h => h.label.trim() === label);
    return header ? header.width : "100px";
  };

  const renderEditableCell = (field, label) => (
    <Box sx={{
      ...cellStyle,
      width: getWidth(label),
      borderRight: (label === "Lot" || label.includes("Weight")) ? "1px solid #C6C6C8" : "1px solid #EDEDED"
    }}>
      <TextField
        size="small"
        fullWidth
        value={item[field] || ""}
        disabled={disabled}
        onChange={(e) => onUpdate(item.id, field, e.target.value)}
        sx={inputStyle}
        placeholder={label.includes("*") ? "..." : ""}
      />
    </Box>
  );

  const DropdownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.3307 6.00004L7.9974 9.33337L4.66406 6.00004" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderAutocompleteCell = (field, label, options = []) => (
    <Box sx={{
      ...cellStyle,
      width: getWidth(label),
      borderRight: "1px solid #EDEDED"
    }}>
      <Autocomplete
        size="small"
        fullWidth
        disabled={disabled}
        options={options}
        getOptionLabel={(option) => option.label || option || ""}
        value={options.find(opt => opt.value === item[field]) || (item[field] ? { label: item[field], value: item[field] } : null)}
        onChange={(event, newValue) => {
          onUpdate(item.id, field, newValue ? newValue.value : "");
        }}
        popupIcon={<DropdownIcon />}
        forcePopupIcon={true}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={inputStyle}
            placeholder="..."
          />
        )}
        sx={{
          width: "100%",
          "& .MuiAutocomplete-endAdornment": {
            right: "4px",
            top: "calc(50% - 8px)"
          },
        }}
        disableClearable
      />
    </Box>
  );

  const renderStaticCell = (field, label) => (
    <Box sx={{
      ...cellStyle,
      width: getWidth(label),
      borderRight: (label === "Lot" || label.includes("Weight")) ? "1px solid #C6C6C8" : "1px solid #EDEDED"
    }}>
      <Typography sx={{ fontSize: "14px", fontFamily: "Calibri", color: "#343434", textAlign: "center", width: "100%" }}>
        {field === "amount"
          ? (item[field] ? formatNumberWithCommas(Number(item[field]).toFixed(2)) : "")
          : (item[field] || "")}
      </Typography>
    </Box>
  );

  return (
    <Box sx={rowStyle}>
      {/* Remove Icon */}
      <Box sx={{ ...cellStyle, width: getWidth("") }}>
        <Box
          onClick={() => !disabled && onRemove(item.id)}
          sx={{
            width: "16px",
            height: "16px",
            bgcolor: "#FCEBEC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.14149 7.25H10.697C10.8444 7.25 10.9857 7.32024 11.0899 7.44526C11.1941 7.57029 11.2526 7.73986 11.2526 7.91667C11.2526 8.09348 11.1941 8.26305 11.0899 8.38807C10.9857 8.5131 10.8444 8.58333 10.697 8.58333H5.14149C4.99415 8.58333 4.85284 8.5131 4.74866 8.38807C4.64447 8.26305 4.58594 8.09348 4.58594 7.91667C4.58594 7.73986 4.64447 7.57029 4.74866 7.44526C4.85284 7.32024 4.99415 7.25 5.14149 7.25Z" fill="#B41E38" />
            <path d="M7.91406 14.7738C8.81456 14.7738 9.70623 14.5964 10.5382 14.2518C11.3701 13.9072 12.1261 13.4021 12.7628 12.7654C13.3995 12.1286 13.9046 11.3727 14.2492 10.5407C14.5938 9.70879 14.7712 8.81712 14.7712 7.91663C14.7712 7.01613 14.5938 6.12446 14.2492 5.29251C13.9046 4.46056 13.3995 3.70464 12.7628 3.06789C12.1261 2.43115 11.3701 1.92606 10.5382 1.58145C9.70623 1.23685 8.81456 1.05948 7.91406 1.05948C6.09544 1.05948 4.35129 1.78193 3.06533 3.06789C1.77937 4.35386 1.05692 6.098 1.05692 7.91663C1.05692 9.73525 1.77937 11.4794 3.06533 12.7654C4.35129 14.0513 6.09544 14.7738 7.91406 14.7738ZM7.91406 15.9166C5.79233 15.9166 3.7575 15.0738 2.25721 13.5735C0.756917 12.0732 -0.0859375 10.0384 -0.0859375 7.91663C-0.0859375 5.79489 0.756917 3.76006 2.25721 2.25977C3.7575 0.759481 5.79233 -0.083374 7.91406 -0.083374C10.0358 -0.083374 12.0706 0.759481 13.5709 2.25977C15.0712 3.76006 15.9141 5.79489 15.9141 7.91663C15.9141 10.0384 15.0712 12.0732 13.5709 13.5735C12.0706 15.0738 10.0358 15.9166 7.91406 15.9166Z" fill="#B41E38" />
          </svg>
        </Box>
      </Box>

      {/* # */}
      <Box sx={{ ...cellStyle, width: getWidth("#") }}>
        <Typography sx={{ fontSize: "14px", fontFamily: "Calibri", color: "#343434" }}>{index + 1}</Typography>
      </Box>

      {/* Img Cell with Upload */}
      <Box sx={{
        ...cellStyle,
        width: getWidth("Img"),
        cursor: "pointer",
        position: "relative"
      }}>
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          style={{ display: "none" }}
          id={`image-upload-${item.id}`}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                onUpdate(item.id, "image", reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label htmlFor={`image-upload-${item.id}`} style={{ cursor: disabled ? "not-allowed" : "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.image ? (
            <Box
              component="img"
              src={item.image.startsWith("data:") ? item.image : (item.image.startsWith("/") ? `${API_URL}${item.image}` : item.image)}
              alt=""
              sx={{
                width: "28px",
                height: "28px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid #EDEDED"
              }}
            />
          ) : (
            <Box sx={{
              width: "24px",
              height: "24px",
              border: "1px dashed #CCC",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#CCC",
              fontSize: "18px",
              "&:hover": { borderColor: "#05595B", color: "#05595B" }
            }}>
              +
            </Box>
          )}
        </label>
      </Box>

      {/* Data Cells */}
      {renderStaticCell("stock_id", "Stock ID")}
      {renderAutocompleteCell("location", "Location *", dropdownOptions.location || [])}
      {renderEditableCell("lot", "Lot")}
      {renderStaticCell("stone_code", "Stone Code")}
      {renderStaticCell("stone", "Stone")}
      {renderAutocompleteCell("shape", "Shape", dropdownOptions.shape || [])}
      {renderAutocompleteCell("size", "Size", dropdownOptions.size || [])}
      {renderAutocompleteCell("color", "Color", dropdownOptions.color || [])}
      {renderAutocompleteCell("cutting", "Cutting", dropdownOptions.cutting || [])}
      {renderAutocompleteCell("quality", "Quality", dropdownOptions.quality || [])}
      {renderAutocompleteCell("clarity", "Clarity", dropdownOptions.clarity || [])}
      {renderAutocompleteCell("cer_type", "Cer Type", dropdownOptions.cerType || [])}
      {renderEditableCell("cer_no", "Cer No.")}
      {renderEditableCell("pcs", "Pcs *")}
      {renderEditableCell("weight", "Weight *")}
      {renderEditableCell("price", "Price *")}
      {renderAutocompleteCell("unit", "Unit *", dropdownOptions.unit || [])}
      {renderStaticCell("amount", "Amount *")}
      {renderEditableCell("remark", "Remark")}
    </Box>
  );
});

export default MergeSplitTargetTableRow;
