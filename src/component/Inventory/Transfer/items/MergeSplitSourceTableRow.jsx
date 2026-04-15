import React from "react";
import { TableRow, TableCell, Typography, Box } from "@mui/material";
import { formatNumberWithCommas } from "../../../../helpers/numberHelper.js";
import { MERGE_SPLIT_SOURCE_HEADERS } from "../constants/mergeSplitHeaders";
import { API_URL } from "../../../../config/config.js";

const MergeSplitSourceTableRow = React.memo(({ item, index, onRemove, onUpdate, disabled = false }) => {


  const firstColumnWidth = parseInt(MERGE_SPLIT_SOURCE_HEADERS[0]?.width);

  const rowStyle = {
    height: "38px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    overflow: "hidden",
    bgcolor: "#FFF",
    borderBottom: "1px solid #EDEDED",
    "&:hover": { bgcolor: "#F5F5F5" }
  };

  const cellStyle = {
    height: "38px",
    minHeight: "38px",
    maxHeight: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    fontFamily: "Calibri",
    fontSize: "14px",
    lineHeight: "1",
    padding: "0 8px",
    color: "#666666",
    fontWeight: 400,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
    boxSizing: "border-box"
  };

  const getWidth = (label) => {
    const header = MERGE_SPLIT_SOURCE_HEADERS.find(h => h.label === label);
    return header ? header.width : "100px";
  };

  const renderCell = (label, content, customStyle = {}) => (
    <Box sx={{
      ...cellStyle,
      flex: "0 0 auto",
      width: getWidth(label),
      minWidth: getWidth(label),
      maxWidth: getWidth(label),
      boxSizing: "border-box",
      borderRight: (label === "Cer No." || label === "Weight") ? "1px solid #C6C6C8" : "1px solid #EDEDED",
      ...customStyle
    }}>
      {content}
    </Box>
  );

  return (
    <Box sx={rowStyle}>
      {/* Remove Icon */}
      <Box sx={{
        ...cellStyle,
        height: "38px", width: firstColumnWidth,
        minWidth: firstColumnWidth,
        maxWidth: firstColumnWidth, borderRight: "1px solid #EDEDED"
      }}>
        <Box
          onClick={() => !disabled && onRemove(item.id)}
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            bgcolor: "#FCEBEC",
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

      {renderCell("#", index + 1)}
      {renderCell("Img", item.image ? (
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
      ) : null)}
      {renderCell("Stock ID", item.stock_id)}
      {renderCell("Location", item.location)}
      {renderCell("Lot", item.lot)}
      {renderCell("Stone Code", item.stone_code)}
      {renderCell("Stone", item.stone)}
      {renderCell("Shape", item.shape)}
      {renderCell("Size", item.size)}
      {renderCell("Cer Type", item.cer_type)}
      {renderCell("Cer No.", item.cer_no)}
      {/* {renderCell("Pcs", item.pcs)} */}

      {/* {renderCell("Weight", item.weight ? formatNumberWithCommas(Number(item.weight).toFixed(3)) : "")} */}


      {/* PCS */}
      {renderCell("Pcs",
        <input
          type="number"
          value={item.pcs}
          disabled={disabled}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            textAlign: "center",
            background: "transparent",

            fontFamily: "Calibri",
            fontSize: "14px",
            lineHeight: "1",
            padding: "0 8px",
            color: "#666666",
            fontWeight: 400,

            appearance: "textfield"
          }}
          onChange={(e) => {
            const val = e.target.value;

            // only allow numbers & prevent negative
            if (!/^\d*$/.test(val)) return;

            onUpdate(item.id, "pcs", val);
          }}
        />
      )}

      {/* WEIGHT */}
      {renderCell("Weight",
        <input
          type="number"
          value={item.weight}
          disabled={disabled}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            textAlign: "center",
            background: "transparent",

            fontFamily: "Calibri",
            fontSize: "14px",
            lineHeight: "1",
            padding: "0 8px",
            color: "#666666",
            fontWeight: 400,

            appearance: "textfield"
          }}
          onChange={(e) => {
            onUpdate(item.id, "weight", e.target.value);
          }}
        />
      )}
      {renderCell("Price", item.price ? formatNumberWithCommas(Number(item.price).toFixed(2)) : "")}
      {renderCell("Unit", item.unit)}
      {renderCell("Amount", item.amount ? formatNumberWithCommas(Number(item.amount).toFixed(2)) : "")}

    </Box>
  );
});

export default MergeSplitSourceTableRow;
