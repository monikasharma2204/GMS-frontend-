import React from "react";
import { Box, Typography, Checkbox, TextField } from "@mui/material";

const CalculationComponent = ({
  state,
  calculateTotalAmountAfterDiscount,
  handleDiscountPercentToggle,
  handleDiscountPercentChange,
  handleDiscountAmountToggle,
  handleDiscountAmountChange,
  handleVATToggle,
  handleVATChange,
  handleOtherChargeChange,
  onNoteChange,
  calculateTotalAfterDiscountPercent,
  calculateTotalAfterDiscount,
  calculateTotalAfterVAT,
  calculateGrandTotal,
  formatNumberWithCommas,
  selectedCurrency
}) => (
  <>
    <Box sx={{ width: "456px", height: "485px" }}>
      <Typography
        sx={{
          color: "var(--HeadPage, #05595B)",
          fontFamily: "Calibri",
          fontSize: "21px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
        }}
      >
        Summary Value
      </Typography>
      <Box sx={{ marginTop: "16px", marginLeft: "30px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              color: "var(--Main-Text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Sub Total
          </Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              disabled
              value={formatNumberWithCommas(calculateTotalAmountAfterDiscount())}
              variant="outlined"
              fullWidth
              InputProps={{
                sx: {
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexShrink: 0,
                  borderRadius: "4px",
                  background: "#F0F0F0",
                  height: "24px",
                  "& input": {
                    textAlign: "right",
                    color: "var(--Text-Dis-Field, #9A9A9A)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  },
                  width: "120px",
                },
              }}
            />
            <Typography sx={{ marginLeft: "8px" }}>{selectedCurrency}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
            alignItems: "center",
            marginLeft: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft : "25px"
            }}
          >
            <Checkbox
              sx={{
                color: "#E6E6E6",
                "&.Mui-checked": {
                  color: "#1B84FF",
                },
              }}
              checked={state.useDiscountPercent}
              onChange={handleDiscountPercentToggle}
            />
            <Typography
              sx={{
                color: "var(--Main-Text, #343434)",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              Discount
            </Typography>
            <Box sx={{ display: "flex" }}>
              <TextField
                value={state.discountPercent}
                onChange={handleDiscountPercentChange}
                disabled={!state.useDiscountPercent}
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    marginLeft: "8px",
                    borderRadius: "4px",
                    background: "#FFF",
                    height: "24px",
                    "& input": {
                      textAlign: "center",
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    },
                    width: "62px",
                  },
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: 0,
                  max: 100,
                }}
              />
            </Box>
            <Typography
              sx={{
                color: "var(--Main-Text, #343434)",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                marginLeft: "8px",
              }}
            >
              %
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <TextField
              value={formatNumberWithCommas(calculateTotalAfterDiscountPercent())}
              variant="outlined"
              fullWidth
              disabled
              InputProps={{
                sx: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  borderRadius: "4px",
                  background: "var(--Fill-Dis-Field, #F0F0F0)",
                  height: "24px",
                  "& input": {
                    textAlign: "right",
                    color: "var(--Text-Dis-Field, #9A9A9A)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  },
                  width: "120px",
                },
              }}
            />
            <Typography sx={{ marginLeft: "8px" }}>{selectedCurrency}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "24px",
            alignItems: "center",
            marginTop: "-6px",
            
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" , marginLeft : "25px" }}>
            <Checkbox
              sx={{
                color: "#E6E6E6",
                "&.Mui-checked": {
                  color: "#1B84FF",
                },
              }}
              checked={state.useDiscountAmount}
              onChange={handleDiscountAmountToggle}
            />
            <Typography
              sx={{
                color: "var(--Main-Text, #343434)",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              Discount Amount
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <TextField
              value={state.discountAmount}
              onChange={handleDiscountAmountChange}
              disabled={!state.useDiscountAmount}
              variant="outlined"
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              InputProps={{
                sx: {
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexShrink: 0,
                  borderRadius: "4px",
                  background: "#FFF",
                  height: "24px",
                  "& input": {
                    textAlign: "right",
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  },
                  width: "120px",
                },
              }}
            />
            <Typography sx={{ marginLeft: "8px" }}>{selectedCurrency}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <Typography
            sx={{
              color: "var(--Main-Text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Total after Discount
          </Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              disabled
              value={formatNumberWithCommas(calculateTotalAfterDiscount())}
              variant="outlined"
              fullWidth
              InputProps={{
                sx: {
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexShrink: 0,
                  borderRadius: "4px",
                  background: "var(--Fill-Dis-Field, #F0F0F0)",
                  height: "24px",
                  "& input": {
                    textAlign: "right",
                    color: "var(--Text-Dis-Field, #9A9A9A)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  },
                  width: "120px",
                },
              }}
            />
            <Typography sx={{ marginLeft: "8px" }}>{selectedCurrency}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "24px",
            marginTop: "6px",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: "25px",
            }}
          >
            <Checkbox
              sx={{
                color: "#E6E6E6",
                "&.Mui-checked": {
                  color: "#1B84FF",
                },
              }}
              checked={state.useVAT}
              onChange={handleVATToggle}
            />
            <Typography
              sx={{
                color: "var(--Main-Text, #343434)",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              VAT
            </Typography>
            <Box sx={{ display: "flex" }}>
              <TextField
                value={state.vatAmount}
                onChange={handleVATChange}
                disabled={!state.useVAT}
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginLeft: "42px",
                    flexShrink: 0,
                    borderRadius: "4px",
                    background: "#FFF",
                    height: "24px",
                    "& input": {
                      textAlign: "center",
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    },
                    width: "62px",
                  },
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: 0,
                  max: 100
                }}
              />
              <Typography
                sx={{
                  color: "var(--Main-Text, #343434)",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  marginLeft: "8px",
                }}
              >
                %
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex" }}>
            <TextField
              value={calculateTotalAfterVAT().toFixed(2)}
              variant="outlined"
              fullWidth
              disabled
              InputProps={{
                sx: {
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexShrink: 0,
                  borderRadius: "4px",
                  background: "var(--Fill-Dis-Field, #F0F0F0)",
                  height: "24px",
                  "& input": {
                    textAlign: "right",
                    color: "var(--Text-Dis-Field, #9A9A9A)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  },
                  width: "120px",
                },
              }}
            />
            <Typography sx={{ marginLeft: "8px" }}>{selectedCurrency}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <Typography
            sx={{
              color: "var(--Main-Text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Other Charge
          </Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              value={state.otherCharge}
              onChange={handleOtherChargeChange}
              variant="outlined"
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              InputProps={{
                sx: {
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexShrink: 0,
                  borderRadius: "4px",
                  background: "#FFF",
                  height: "24px",
                  "& input": {
                    textAlign: "right",
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  },
                  width: "120px",
                },
              }}
            />
            <Typography sx={{ marginLeft: "8px" }}>{selectedCurrency}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            height: "90px",
            justifyContent: "space-between",
            marginTop: "16px",
            alignItems: "center",
            padding: "0px 16px",
            bgcolor: "#F3F3F3",
            border: "1px solid #E6E6E6",
            borderRadius: "4px",
          }}
        >
          <Typography
            sx={{
              color: "var(--Main-Text, #343434)",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Grand Total
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
                         sx={{
                           width: "200px",
                           fontSize: "32px",
                           fontWeight: 700,
                           fontFamily: "Calibri",
                           color: "var(--Main-Text, #343434)",
                           textAlign: "right",
                           whiteSpace: "normal",
                           wordBreak: "break-word",
                           marginRight:"12px"
                         }}
                       >
                         {formatNumberWithCommas(calculateGrandTotal())}
                       </Box>
                     
            <Typography
              sx={{
                color: "var(--Main-Text, #343434)",
                fontSize: "32px",
                fontFamily: "Calibri",
                fontStyle: "normal",
                fontWeight: 700,
              }}
            >
              {selectedCurrency}
            </Typography>
          </Box>
        </Box>

        <TextField
          label="Note"
          placeholder="This note will be shown on document"
          onChange={(e) => onNoteChange(e.target.value)}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          multiline
          rows={3}
          sx={{
            width: "410px",
            "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            marginTop: "12px",
          }}
        />
      </Box>
    </Box>
  </>
);

export default CalculationComponent;
