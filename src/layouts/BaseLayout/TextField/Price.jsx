import React from "react";
import {
  Box,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const Price = ({
  pricePcs,
  setPricePcs,
  priceCts,
  setPriceCts,
  priceType,
  setPriceType,
}) => {
  const handleNumberChange = (event, setValue) => {
    let value = event.target.value;

    const numericValue = value.replace(/[^0-9.]/g, "");

    if ((numericValue.match(/\./g) || []).length <= 1) {
      const parts = numericValue.split(".");
      let integerPart = parts[0];
      const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : "";

      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const formattedValue = `${integerPart}${decimalPart}`;
    console.log(formattedValue)
      setValue(formattedValue);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "604px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginRight: "50px",
            marginTop: "10px",
            width: "85px",
          }}
        >
          <Typography
            sx={{
              color: "#343434",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Price :
          </Typography>
          <Typography
            sx={{
              color: "var(--Red, #E00410)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              marginLeft: "2px",
              marginTop: "2px",
            }}
          >
            *
          </Typography>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <TextField
              required
              id="outlined-required"
              value={pricePcs} // Use pricePcs prop as value
              onChange={(event) => handleNumberChange(event, setPricePcs)} // Use setPricePcs prop for onChange
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFF",
                  width: "328px",
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
              }}
            />
            <Typography
              sx={{
                marginLeft: "24px",
                color: "#343434",
                fontFamily: "Calibri",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              / Pcs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              marginTop: "24px",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <TextField
              required
              id="outlined-required"
              value={priceCts} // Use priceCts prop as value
              onChange={(event) => handleNumberChange(event, setPriceCts)} // Use setPriceCts prop for onChange
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#FFF",
                  width: "328px",
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
              }}
            />
            <Typography
              sx={{
                marginLeft: "24px",
                color: "#343434",
                fontFamily: "Calibri",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              / Cts.
            </Typography>
          </Box>

          <FormControl sx={{ marginTop: "29px" }}>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              value={priceType} // Use priceType prop as value
              onChange={(event) => setPriceType(event.target.value)} // Use setPriceType prop for onChange
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="on_issue_weight"
                control={<Radio />}
                label="On Issue Weight"
              />
              <FormControlLabel
                value="on_recieve_weight"
                control={<Radio />}
                label="On Receive Weight"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default Price;
