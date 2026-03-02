import * as React from "react";
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
  selectedData,
  isEditing,
  onPriceTypeChange,
  onPricePcsChange,
  onPriceCtsChange,
}) => {
  const handlePriceTypeChange = (event) => {
    onPriceTypeChange(event.target.value);
  };
  const handlePricePcsChange = (event) => {
    onPricePcsChange(event.target.value);
  };
  const handlePriceCtsChange = (event) => {
    onPriceCtsChange(event.target.value);
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
              disabled={!isEditing}
              required
              value={selectedData?.master_info?.price_pcs?.$numberDecimal || ""}
              onChange={handlePricePcsChange}
              id="outlined-required"
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: isEditing ? "#FFF" : "#F0F0F0",
                  width: "328px",
                  height: "42px",
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
              disabled={!isEditing}
              required
              value={selectedData?.master_info?.price_cts?.$numberDecimal || ""}
              id="outlined-required"
              onChange={handlePriceCtsChange}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: isEditing ? "#FFF" : "#F0F0F0",
                  width: "328px",
                  height: "42px",
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
              value={selectedData?.master_info?.price_type || ""}
              name="radio-buttons-group"
              onChange={handlePriceTypeChange}
            >
              <FormControlLabel
                disabled={!isEditing}
                value="on_issue_weight"
                control={<Radio />}
                label="On Issue Weight"
              />
              <FormControlLabel
                disabled={!isEditing}
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
