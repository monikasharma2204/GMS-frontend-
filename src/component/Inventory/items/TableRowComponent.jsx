import React from "react";
import { TableRow, TableCell, Typography, IconButton } from "@mui/material";
import { formatNumberWithCommas } from "../../../helpers/numberHelper.js";

const TableRowComponent = React.memo(
  ({
    item,
    index,
    handleDelete,
    operationType = "merge",
    selectedRowIndex = null,
    onRowClick = () => {},
  }) => {
    const isSelected = selectedRowIndex === index && operationType !== "merge";

    const cellStyle = {
      textAlign: "center",
      padding: "8px",
      backgroundColor: isSelected ? "#05595B1A" : "transparent",
      border: "none",
    };

    const typographyStyle = {
      color: "var(--Main-Text, #343434)",
      fontFamily: "Calibri",
      fontSize: "16px",
      fontWeight: 400,
    };

    return (
      <TableRow
        onClick={() => onRowClick(index)}
        sx={{
          height: "42px",

          backgroundColor: isSelected
            ? "#05595B1A"
            : index === 0
            ? "#F8F8F8"
            : "#FFF",
          cursor: operationType !== "merge" ? "pointer" : "default",
          "&:hover": {
            backgroundColor:
              operationType !== "merge"
                ? isSelected
                  ? "#05595B1A"
                  : "#F0F0F0"
                : index === 0
                ? "#F8F8F8"
                : "#FFF",
          },
        }}
      >
        {/* Row Number */}
        <TableCell
          sx={{
            ...cellStyle,
            width: "40px",
            borderLeft: isSelected ? "1px solid #05595B55" : "none",
          }}
        >
          <Typography sx={typographyStyle}>{index + 1}</Typography>
        </TableCell>

        {/* Stone */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.stone || ""}</Typography>
        </TableCell>

        {/* Shape */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.shape || ""}</Typography>
        </TableCell>

        {/* Size */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.size || ""}</Typography>
        </TableCell>

        {/* Color */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.color || ""}</Typography>
        </TableCell>

        {/* Cutting */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.cutting || ""}</Typography>
        </TableCell>

        {/* Quality */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.quality || ""}</Typography>
        </TableCell>

        {/* Clarity */}
        <TableCell sx={{ ...cellStyle, width: "100px" }}>
          <Typography sx={typographyStyle}>{item?.clarity || ""}</Typography>
        </TableCell>

        {/* Pcs */}
        <TableCell sx={{ ...cellStyle, width: "100px" }}>
          <Typography sx={typographyStyle}>{item?.pcs || ""}</Typography>
        </TableCell>

        {/* Weight */}
        <TableCell sx={{ ...cellStyle, width: "100px" }}>
          <Typography sx={typographyStyle}>
            {item?.weight
              ? formatNumberWithCommas(Number(item.weight).toFixed(3))
              : ""}
          </Typography>
        </TableCell>

        {/* Price */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>
            {item?.price
              ? formatNumberWithCommas(Number(item.price).toFixed(2))
              : ""}
          </Typography>
        </TableCell>

        {/* Unit */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>{item?.unit || ""}</Typography>
        </TableCell>

        {/* Amount */}
        <TableCell sx={{ ...cellStyle, width: "120px" }}>
          <Typography sx={typographyStyle}>
            {item?.amount
              ? formatNumberWithCommas(Number(item.amount).toFixed(2))
              : ""}
          </Typography>
        </TableCell>

        {/* PU No. */}
        <TableCell sx={{ ...cellStyle, width: "145px" }}>
          <Typography sx={typographyStyle}>{item?.pu_no || ""}</Typography>
        </TableCell>

        {/* Delete Button */}
        <TableCell sx={{ ...cellStyle, width: "40px" }}>
          <IconButton
          onClick={() => handleDelete(item._id)}
            size="small"
            sx={{ color: "#E00410", padding: "4px" }}
        >
          <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M0.800049 3.91617H14.3M4.73755 3.91617V3.39694C4.73755 2.70839 5.03386 2.04805 5.56131 1.56118C6.08876 1.0743 6.80413 0.800781 7.55005 0.800781C8.29597 0.800781 9.01134 1.0743 9.53879 1.56118C10.0662 2.04805 10.3625 2.70839 10.3625 3.39694V3.91617M5.86255 7.03259V11.1885M9.23755 7.03259V9.11055V11.1885M2.48755 3.91617H12.6125V13.2623C12.6125 13.5377 12.494 13.8019 12.283 13.9966C12.0721 14.1914 11.7859 14.3008 11.4875 14.3008H3.61255C3.31418 14.3008 3.02803 14.1914 2.81705 13.9966C2.60608 13.8019 2.48755 13.5377 2.48755 13.2623V3.91617Z"
                stroke="#E00410"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </svg>
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
);

export default TableRowComponent;
