import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Typography, Grid, TextField } from "@mui/material";
import Account from "./Account";
import SelectedDataComponent from "./SelectedDataComponent";
import CalculationComponent from "./CalculationComponent";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InvoiceAddress from "./InvoiceAddress";
import ShippingAddress from "./ShippingAddress";
import Ref1 from "./Ref1";
import Ref2 from "./Ref2";
import Currency from "./Currency";
import ExRate from "./ExRate";
import moment from "moment";
import apiRequest from "../../helpers/apiHelper.js";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/MemoState.js";
import { useRecoilState } from "recoil";

const QuotationsOrderBody = ({
  state = { state },
  handleAddRow = { handleAddRow },
  handleNumberChange,
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
  calculateSubTotalAfterItemDiscounts = {
    calculateSubTotalAfterItemDiscounts,
  },
  handleDiscountPercentToggle = { handleDiscountPercentToggle },
  handleDiscountPercentChange = { handleDiscountPercentChange },
  handleDiscountAmountToggle = { handleDiscountAmountToggle },
  handleDiscountAmountChange = { handleDiscountAmountChange },
  handleVATToggle = { handleVATToggle },
  handleVATChange = { handleVATChange },
  handleOtherChargeChange = { handleOtherChargeChange },
  onNoteChange,
  onRemarkChange,
  calculateTotalAfterDiscountPercent = {
    calculateTotalAfterDiscountPercent,
  },
  calculateTotalAfterDiscount = { calculateTotalAfterDiscount },
  calculateTotalAfterVAT = { calculateTotalAfterVAT },
  calculateGrandTotal = { calculateGrandTotal },
  formatNumberWithCommas = { formatNumberWithCommas },
  onDocDateChange,
  onDueDateChange,
  onCurrencyChange,
  onExchangeRateChange,
  exchangeRate,
  onRef1Change,
  onRef2Change,
  onAccountChange,
  onLotChange,
  onStoneChange,
  onChange,
  rows,
  setRows,
  handleEdit,
  docDate,
  dueDate,
  account,
  setAccount,
  ref1,
  ref2,
  note,
  remark,
}) => {
  
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);


  const state1 = state?.selectedItems[0];

  const genInvoiceNo = async () => {
    try {
      const data = await apiRequest(
        "GET",
        "/quotations/next-invoice-no",
        {},
        {
          params: {
            inventory_type: "q_tq",
          },
        }
      );

      setMemoInfo({
        ...memoInfo,
        invoice_no: data.next_invoice_no || "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffectOnce(() => {
    if (!memoInfo?.invoice_no) {
      genInvoiceNo();
    }
  }, [!memoInfo?.invoice_no]);

  React.useEffect(() => {
    onCurrencyChange(memoInfo?.currencyCode);
  }, [memoInfo?.currencyCode, onCurrencyChange]);

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
                height: "135px",
                display: "flex",
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
                  Quotation No.:
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
                  {memoInfo?.invoice_no ? memoInfo?.invoice_no : ""}
                </Typography>
               
              </Box>
              <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "5px",
                  height: "110px",
                }}
              >
                <Box sx={{ display: "flex", marginTop: "18px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date "
                      value={docDate ? dayjs(docDate) : null}
                      onChange={(newValue) => {
                        onDocDateChange(newValue);
                      }}
                      format="DD/MM/YY"
                      slotProps={{
                        textField: {
                          required: true,
                          InputLabelProps: {
                            shrink: true,
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#FFF",
                          width: "135px",
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
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                        },

                        marginRight: "20px",
                      }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date "
                      value={dueDate ? dayjs(dueDate) : null}
                      onChange={(newValue) => {
                        onDueDateChange(newValue);
                      }}
                      format="DD/MM/YY"
                      slotProps={{
                        textField: {
                          required: true,
                          InputLabelProps: {
                            shrink: true,
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#FFF",
                          marginLeft: "-10px",
                          width: "135px",
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
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Account
                    account={account}
                    setAccount={setAccount}
                    onAccountChange={onAccountChange}
                  />
                  <InvoiceAddress
                    initialValue={
                      state.selectedItems.length > 0
                        ? state.selectedItems[0].invoice_address
                        : ""
                    }
                  />

                  <ShippingAddress
                    initialValue={
                      state.selectedItems.length > 0
                        ? state.selectedItems[0].shipping_address
                        : ""
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", marginTop: "26px" }}>
                  <Ref1
                    initialValue={
                      state.selectedItems.length > 0
                        ? state.selectedItems[0].ref_1
                        : ""
                    }
                    ref1={ref1}
                    onRef1Change={onRef1Change}
                  />

                  <Ref2
                    initialValue={
                      state.selectedItems.length > 0
                        ? state.selectedItems[0].ref_2
                        : ""
                    }
                    ref2={ref2}
                    onRef2Change={onRef2Change}
                  />
                  <Currency
                    initialValue={
                      state.selectedItems.length > 0
                        ? state.selectedItems[0].currency
                        : ""
                    }
                    
                  />
                  <ExRate
                    initialValue={
                      state.selectedItems.length > 0
                        ? state.selectedItems[0].exchange_rate
                        : ""
                    }
                    onExchangeRateChange={onExchangeRateChange}
                    exchangeRate={exchangeRate}
                   
                  />
                </Box>
              </Box>
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
              <SelectedDataComponent
                remark={remark}
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
                onRemarkChange={onRemarkChange}
                calculateAmountAfterDiscount={calculateAmountAfterDiscount}
                handleDelete={handleDelete}
                onLotChange={onLotChange}
                onStoneChange={onStoneChange}
                onChange={onChange}
                rows={rows}
                setRows={setRows}
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
                calculateSubTotalAfterItemDiscounts={
                  calculateSubTotalAfterItemDiscounts
                }
                calculateSubTotalAfterItemDiscounts={
                  calculateSubTotalAfterItemDiscounts
                }
                handleDiscountPercentToggle={handleDiscountPercentToggle}
                handleDiscountPercentChange={handleDiscountPercentChange}
                handleDiscountAmountToggle={handleDiscountAmountToggle}
                handleDiscountAmountChange={handleDiscountAmountChange}
                handleVATToggle={handleVATToggle}
                handleVATChange={handleVATChange}
                handleOtherChargeChange={handleOtherChargeChange}
                onNoteChange={onNoteChange}
                calculateTotalAfterDiscountPercent={
                  calculateTotalAfterDiscountPercent
                }
                calculateTotalAfterDiscount={calculateTotalAfterDiscount}
                calculateTotalAfterVAT={calculateTotalAfterVAT}
                calculateGrandTotal={calculateGrandTotal}
                formatNumberWithCommas={formatNumberWithCommas}
                selectedCurrency={memoInfo?.currencyCode}
                note={note}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default QuotationsOrderBody;
