import React from "react";
import { Box, Typography } from "@mui/material";
import { formatNumberWithCommas } from "../../../../helpers/numberHelper.js";
import { MERGE_SPLIT_TARGET_HEADERS } from "../constants/mergeSplitHeaders";
import { API_URL } from "../../../../config/config.js";
import {
  FIELD_WIDTH,
  TransferSelectInput,
  TransferReadonlyField,
  CustomTextField,
} from "./TransferRowInputs";

const MergeSplitTargetTableRow = React.memo(({ item, index, onUpdate, onRemove, dropdownOptions = {}, disabled = false, showErrors = false }) => {
  const firstColumnWidth = parseInt(MERGE_SPLIT_TARGET_HEADERS[0]?.width);

  const rowStyle = {
    height: "42px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    overflow: "hidden",
    bgcolor: index % 2 === 0 ? "#F8F8F8" : "#FFF",

    "&:hover": { bgcolor: "#F0F0F0" }
  };
  const cellStyle = {
    height: "42px",
    minHeight: "42px",
    maxHeight: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    fontFamily: "Calibri",
    fontSize: "16px",
    lineHeight: "1",
    padding: "0 2px !important",
    px: "2px !important",
    color: "#666666",
    fontWeight: 400,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
    boxSizing: "border-box"
  };

  const isFieldInvalid = (value, label) => {
    if (!showErrors || !label.includes("*")) return false;
    return !value || value === 0 || value === "0";
  };

  const getErrorSx = (field, label) => {
    if (isFieldInvalid(item[field], label)) {
      return {
        "& .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #B41E38 !important",
          display: "block !important"
        }
      };
    }
    return {};
  };

  const getWidth = (label) => {
    const header = MERGE_SPLIT_TARGET_HEADERS.find(h => h.label.trim() === label);
    return header ? parseInt(header.width) : 100;
  };

  const renderEditableCell = (field, label) => (
    <Box sx={{
      ...cellStyle,
      flex: "0 0 auto",
      width: getWidth(label),
      minWidth: getWidth(label),
      maxWidth: getWidth(label),
      boxSizing: "border-box",
      borderRight: (label.includes("Cer No.") || label.includes("Size") || label.includes("Weight")) ? "1px solid #D8D8D8" : "1px solid #ECECEC"
    }}>
      <CustomTextField
        value={item[field] || ""}
        disabled={disabled}
        onChange={(value) => onUpdate(item.id, field, value)}
        width={FIELD_WIDTH}
        placeholder={label.includes("*") ? "..." : ""}
        sx={getErrorSx(field, label)}
        hasError={isFieldInvalid(item[field], label)}
      />
    </Box>
  );

  const renderAutocompleteCell = (field, label, options = []) => (
    <Box sx={{
      ...cellStyle,
      width: getWidth(label),
      borderRight: (label.includes("Cer No.") || label.includes("Color") || label.includes("Size") || label.includes("Weight"))
        ? "1px solid #D8D8D8"
        : "1px solid #ECECEC"
    }}>
      <TransferSelectInput
        value={item[field] || ""}
        onChange={(value) => onUpdate(item.id, field, value)}
        disabled={disabled}
        options={options}
        hasError={isFieldInvalid(item[field], label)}
      />
    </Box>
  );

  const renderStaticCell = (field, label) => (
    <Box sx={{
      ...cellStyle,
      width: getWidth(label),
      borderRight: (label.includes("Cer No.") || label.includes("Color") || label.includes("Size") || label.includes("Weight"))
        ? "1px solid #D8D8D8"
        : "1px solid #ECECEC"
    }}>
      <TransferReadonlyField
        value={
          field === "amount"
            ? (item[field] ? formatNumberWithCommas(Number(item[field]).toFixed(2)) : "")
            : (item[field] || "")
        }
        hasError={isFieldInvalid(item[field], label)}
      />
    </Box>
  );

  return (
    <Box sx={rowStyle}>
      {/* Remove Icon */}
      <Box sx={{
        ...cellStyle,
        height: "42px", width: firstColumnWidth,
        minWidth: firstColumnWidth,
        maxWidth: firstColumnWidth, borderRight: "1px solid #EDEDED"
      }}>
        <Box
          onClick={() => !disabled && onRemove(item.id)}
          sx={{
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_412_11953)">
              <path d="M5.14149 7.25H10.697C10.8444 7.25 10.9857 7.32024 11.0899 7.44526C11.1941 7.57029 11.2526 7.73986 11.2526 7.91667C11.2526 8.09348 11.1941 8.26305 11.0899 8.38807C10.9857 8.5131 10.8444 8.58333 10.697 8.58333H5.14149C4.99415 8.58333 4.85284 8.5131 4.74866 8.38807C4.64447 8.26305 4.58594 8.09348 4.58594 7.91667C4.58594 7.73986 4.64447 7.57029 4.74866 7.44526C4.85284 7.32024 4.99415 7.25 5.14149 7.25Z" fill="#B41E38" />
              <path d="M7.91406 14.7738C8.81456 14.7738 9.70623 14.5964 10.5382 14.2518C11.3701 13.9072 12.1261 13.4021 12.7628 12.7654C13.3995 12.1286 13.9046 11.3727 14.2492 10.5407C14.5938 9.70879 14.7712 8.81712 14.7712 7.91663C14.7712 7.01613 14.5938 6.12446 14.2492 5.29251C13.9046 4.46056 13.3995 3.70464 12.7628 3.06789C12.1261 2.43115 11.3701 1.92606 10.5382 1.58145C9.70623 1.23685 8.81456 1.05948 7.91406 1.05948C6.09544 1.05948 4.35129 1.78193 3.06533 3.06789C1.77937 4.35386 1.05692 6.098 1.05692 7.91663C1.05692 9.73525 1.77937 11.4794 3.06533 12.7654C4.35129 14.0513 6.09544 14.7738 7.91406 14.7738ZM7.91406 15.9166C5.79233 15.9166 3.7575 15.0738 2.25721 13.5735C0.756917 12.0732 -0.0859375 10.0384 -0.0859375 7.91663C-0.0859375 5.79489 0.756917 3.76006 2.25721 2.25977C3.7575 0.759481 5.79233 -0.083374 7.91406 -0.083374C10.0358 -0.083374 12.0706 0.759481 13.5709 2.25977C15.0712 3.76006 15.9141 5.79489 15.9141 7.91663C15.9141 10.0384 15.0712 12.0732 13.5709 13.5735C12.0706 15.0738 10.0358 15.9166 7.91406 15.9166Z" fill="#B41E38" />
            </g>
            <defs>
              <clipPath id="clip0_412_11953">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>


        </Box>
      </Box>

      {/* # */}
      <Box sx={{
        ...cellStyle, width: getWidth("#"),
        minWidth: getWidth("#"),
        maxWidth: getWidth("#"), padding: "0 !important",
        borderRight: "1px solid #EDEDED"
      }}>
        < Typography sx={{ fontSize: "16px", fontFamily: "Calibri", color: "#666666", fontWeight: 400 }}>{index + 1}</Typography>
      </Box >

      {/* Img Cell with Upload */}
      < Box sx={{
        ...cellStyle,
        ...cellStyle,
        width: getWidth("Img"),
        minWidth: getWidth("Img"),
        maxWidth: getWidth("Img"),
        borderRight: "1px solid #EDEDED",
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
                border: "1px solid #EDEDED",
                backgroundColor: "#F2F2F2"
              }}
            />
          ) : (
            <Box sx={{
              width: "28px",
              height: "28px",
              border: "1px dashed #D0D0D0",
              borderRadius: "4px",
              backgroundColor: "#F2F2F2",
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
      </Box >

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
    </Box >
  );
});

export default MergeSplitTargetTableRow;
