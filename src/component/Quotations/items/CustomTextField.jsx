import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({
  value,
  onChange,
  width = 136,
  disabled = false,
  placeholder = "",
  type = "text",
  noDecimal = false,
  alignLeft = false,
  bgHighlight = false,
  decimal = 2,
  formatWithCommas = false,
  formatNumberWithCommas,
  sx = {},
  InputProps = {},
  inputProps = {},
  onBlur,
}) => {
  const [internalValue, setInternalValue] = useState(() => {
    if (type === "number" && value !== "" && value !== null && value !== undefined) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (noDecimal) {
          const formatted = Math.round(num).toString();
          return formatWithCommas && formatNumberWithCommas ? formatNumberWithCommas(parseInt(formatted)) : formatted;
        } else {
          const formatted = num.toFixed(decimal);
          return formatWithCommas && formatNumberWithCommas ? formatNumberWithCommas(formatted) : formatted;
        }
      }
    }
    return value ?? "";
  });
  const isTypingRef = useRef(false);
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(null);

  useLayoutEffect(() => {
    if (cursorPositionRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  });

  useEffect(() => {
    if (isTypingRef.current) {
      return;
    }

    if (type === "number" && value !== "" && value !== null && value !== undefined) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (noDecimal) {
          const formatted = Math.round(num).toString();
          setInternalValue(formatWithCommas && formatNumberWithCommas ? formatNumberWithCommas(parseInt(formatted)) : formatted);
        } else {
          const formatted = num.toFixed(decimal);
          setInternalValue(formatWithCommas && formatNumberWithCommas ? formatNumberWithCommas(formatted) : formatted);
        }
      } else {
        setInternalValue(value ?? "");
      }
    } else {
      const stringValue = value ?? "";
      setInternalValue(stringValue);
    }
  }, [value, decimal, noDecimal, type, formatWithCommas, formatNumberWithCommas]);

  const handleInputChange = (e) => {
    isTypingRef.current = true;
    const input = e.target;
    const cursorPosition = input.selectionStart;
    let newValue = e.target.value;

    let cursorPosInUnformatted = cursorPosition;
    if (formatWithCommas) {
      const beforeCursor = newValue.substring(0, cursorPosition);
      const commasBefore = (beforeCursor.match(/,/g) || []).length;
      cursorPosInUnformatted = cursorPosition - commasBefore;
      newValue = newValue.replace(/,/g, "");
    }

    if (noDecimal) {
      newValue = newValue.replace(/[^0-9]/g, "");
    } else if (type === "number") {
      newValue = newValue.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    }

    if (cursorPosInUnformatted > newValue.length) {
      cursorPosInUnformatted = newValue.length;
    }

    onChange(newValue);

    let formattedValue = newValue;
    if (formatWithCommas && formatNumberWithCommas && newValue !== "") {
      if (noDecimal) {
        const num = parseInt(newValue);
        if (!isNaN(num)) {
          formattedValue = formatNumberWithCommas(num);
        }
      } else {
        const parts = newValue.split(".");
        if (parts[0] && parts[0] !== "") {
          const integerPart = formatNumberWithCommas(parseInt(parts[0]));
          const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : (newValue.endsWith(".") ? "." : "");
          formattedValue = integerPart + decimalPart;
        }
      }
    }

    if (formatWithCommas && formatNumberWithCommas && newValue !== "") {
      let newCursorPos = cursorPosInUnformatted;
      
      if (!noDecimal && newValue.includes(".")) {
        const decimalIndex = newValue.indexOf(".");
        const integerPart = newValue.substring(0, decimalIndex);
        
        if (cursorPosInUnformatted <= decimalIndex) {
          const digitsBeforeCursor = integerPart.substring(0, cursorPosInUnformatted);
          if (digitsBeforeCursor) {
            newCursorPos = formatNumberWithCommas(parseInt(digitsBeforeCursor)).length;
          }
        } else {
          const formattedInteger = formatNumberWithCommas(parseInt(integerPart));
          newCursorPos = formattedInteger.length + 1 + (cursorPosInUnformatted - decimalIndex - 1);
        }
      } else if (newValue && !isNaN(parseInt(newValue))) {
        const digitsBeforeCursor = newValue.substring(0, cursorPosInUnformatted);
        if (digitsBeforeCursor) {
          newCursorPos = formatNumberWithCommas(parseInt(digitsBeforeCursor)).length;
        }
      }
      
      cursorPositionRef.current = Math.min(Math.max(0, newCursorPos), formattedValue.length);
    }

    setInternalValue(formattedValue);
  };

  const handleBlur = () => {
    isTypingRef.current = false;
    if (type === "number" && internalValue !== "") {
      const cleanValue = formatWithCommas ? internalValue.replace(/,/g, "") : internalValue;
      const num = parseFloat(cleanValue);
      
      if (!isNaN(num)) {
        if (noDecimal) {
          const rounded = Math.round(num).toString();
          const formatted = formatWithCommas && formatNumberWithCommas ? formatNumberWithCommas(parseInt(rounded)) : rounded;
          setInternalValue(formatted);
          onChange(rounded);
        } else {
          const formatted = num.toFixed(decimal);
          const displayValue = formatWithCommas && formatNumberWithCommas ? formatNumberWithCommas(formatted) : formatted;
          setInternalValue(displayValue);
          onChange(formatted);
        }
      }
    }
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <TextField
      inputRef={inputRef}
      value={internalValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (["e", "E", "+", "-"].includes(e.key) && type === "number") {
          e.preventDefault();
        }
        if ([".", "e", "E", "+", "-"].includes(e.key) && noDecimal) {
          e.preventDefault();
        }
      }}
      type="text"
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      disabled={disabled}
      inputProps={{
        ...inputProps,
        sx: {
          textAlign: alignLeft ? "left" : "right",
          color: "black",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          "&::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&[type=number]": {
            MozAppearance: "textfield",
          },
          ...inputProps?.sx,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          width: `${width}px`,
          height: "34px",
          borderRadius: "4px",
          backgroundColor: bgHighlight ? "#F0F0F0" : "inherit",
        },
        "& .MuiInputBase-root.Mui-disabled": {
          "& > fieldset": {
            borderColor: "#E6E6E6",
          },
          bgcolor: "#F0F0F0",
          borderRadius: "4px",
        },
        ...sx,
      }}
      {...InputProps}
    />
  );
};

export default CustomTextField;
