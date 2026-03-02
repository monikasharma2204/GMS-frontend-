import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Typography, Grid, TextField } from "@mui/material";
import Account from "./Account"
import SelectedDataComponentMemoReturn from "./SelectedDataComponentMemoReturn";
import CalculationComponent from "./CalculationComponent";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Ref1 from "./Ref1";
import Ref2 from "./Ref2";
import Currency from "./Currency";
import ExRate from "./ExRate";

const MemoReturnBody = ({
  state = { state },
  handleAddRow = { handleAddRow },
  handleNumberChange = { handleNumberChange },
  handleSelectChange = { handleSelectChange },
  calculateAmount = { calculateAmount },
  calculateOtherPrice = { calculateOtherPrice },
  handleDiscountPercenChangeInTalble = {
    handleDiscountPercenChangeInTalble,
  },
  handleDiscountAmountChangeInTable = {
    handleDiscountAmountChangeInTable,
  },
  calculateAmountAfterDiscount = { calculateAmountAfterDiscount },
  handleDelete = { handleDelete },
  calculateTotalAmountAfterDiscount = {
    calculateTotalAmountAfterDiscount,
  },
  handleDiscountPercentToggle = { handleDiscountPercentToggle },
  handleDiscountPercentChange = { handleDiscountPercentChange },
  handleDiscountAmountToggle = { handleDiscountAmountToggle },
  handleDiscountAmountChange = { handleDiscountAmountChange },
  handleVATToggle = { handleVATToggle },
  handleVATChange = { handleVATChange },
  handleOtherChargeChange = { handleOtherChargeChange },
  calculateTotalAfterDiscountPercent = {
    calculateTotalAfterDiscountPercent,
  },
  calculateTotalAfterDiscount = { calculateTotalAfterDiscount },
  calculateTotalAfterVAT = { calculateTotalAfterVAT },
  calculateGrandTotal = { calculateGrandTotal },
  formatNumberWithCommas = { formatNumberWithCommas },
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState("THB");
  return (
    <>
      <Box
        sx={{
          width: "1632px",
          height: "540px",
          padding: "9px 24px 32px 24px",
        }}
      >
        <Box sx={{ width: "1640px", height: "540px" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography
              sx={{
                color: "var(--Text-Dis-Field, #9A9A9A)",
                fontFamily: "Calibri",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              Transaction Date : 29/01/2024 By : Super Admin
            </Typography>
            <Typography
              sx={{
                color: "var(--Text-Dis-Field, #9A9A9A)",
                fontFamily: "Calibri",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                marginLeft: "24px",
              }}
            >
              Last Update :29/01/2024 By : Super Admin
            </Typography>
          </Box>
          <Grid
            sx={{
              width: "1648px",
              padding: "17px 32px 24px 32px",
              borderRadius: "5px 5px 0px 0px",
              bgcolor: "#FFF",
              borderTop: "1px solid var(--Line-Table, #C6C6C8)",
              borderRight: "1px solid var(--Line-Table, #C6C6C8)",
              borderLeft: "1px solid var(--Line-Table, #C6C6C8)",
            }}
          >
            <Box
              sx={{
                width: "1567px",
                height: "49px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  width: "175px",
                  height: "49px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Text-Field, #666)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "1",
                    marginBottom: "2px",
                  }}
                >
                  Memo In No.:
                </Typography>
                <Typography
                  sx={{
                    color: "var(--HeadPage, #05595B)",
                    fontFamily: "Calibri",
                    fontSize: "28px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "1",
                  }}
                >
                  MI2024010022
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Doc Date "
                    defaultValue={dayjs()}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    sx={{
                      "& .MuiInputLabel-asterisk": {
                        color: "red",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "220px",
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
                      marginRight: "24px",
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date "
                    defaultValue={dayjs()}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    sx={{
                      "& .MuiInputLabel-asterisk": {
                        color: "red",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "220px",
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
                </LocalizationProvider>
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: "24px",
                width: "1567px",
                height: "42px",
                // bgcolor: "purple",
              }}
            >
              <Account />
              <Ref1 />
              <Ref2 />
              <Currency selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency}/>
              <ExRate selectedCurrency={selectedCurrency}/>
            </Box>
          </Grid>

          <Box sx={{ display: "flex", width: "1648px" }}>
            <Box
              sx={{
                width: "1117px",
                padding: "24px 24px 64px 32px",
                borderTop: "1px solid var(--Line-Table, #C6C6C8)",
                borderLeft: "1px solid var(--Line-Table, #C6C6C8)",
                borderRight: "1px solid var(--Line-Table, #C6C6C8)",
                bgcolor: "#F8F8F8",
              }}
            >
              <SelectedDataComponentMemoReturn
                state={state}
                handleAddRow={handleAddRow}
                handleNumberChange={handleNumberChange}
                handleSelectChange={handleSelectChange}
                calculateAmount={calculateAmount}
                calculateOtherPrice={calculateOtherPrice}
                handleDiscountPercenChangeInTalble={
                  handleDiscountPercenChangeInTalble
                }
                handleDiscountAmountChangeInTable={
                  handleDiscountAmountChangeInTable
                }
                calculateAmountAfterDiscount={calculateAmountAfterDiscount}
                handleDelete={handleDelete}
              />
            </Box>
            <Box
              sx={{
                width: "533px",
                padding: "24px 32px 64px 32px",
                borderTop: "1px solid var(--Line-Table, #C6C6C8)",
                borderRight: "1px solid var(--Line-Table, #C6C6C8)",
                bgcolor: "var(--BG-Paper, #FFF)",
              }}
            >
              <CalculationComponent
                state={state}
                calculateTotalAmountAfterDiscount={
                  calculateTotalAmountAfterDiscount
                }
                handleDiscountPercentToggle={handleDiscountPercentToggle}
                handleDiscountPercentChange={handleDiscountPercentChange}
                handleDiscountAmountToggle={handleDiscountAmountToggle}
                handleDiscountAmountChange={handleDiscountAmountChange}
                handleVATToggle={handleVATToggle}
                handleVATChange={handleVATChange}
                handleOtherChargeChange={handleOtherChargeChange}
                calculateTotalAfterDiscountPercent={
                  calculateTotalAfterDiscountPercent
                }
                calculateTotalAfterDiscount={calculateTotalAfterDiscount}
                calculateTotalAfterVAT={calculateTotalAfterVAT}
                calculateGrandTotal={calculateGrandTotal}
                formatNumberWithCommas={formatNumberWithCommas}
                selectedCurrency={selectedCurrency}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MemoReturnBody;
