import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  payableFormDataState,
  payableOutstandingModalOpenState,
  payableValidationErrorState,
  payableBankImageModalOpenState,
  payableFSMState
} from "../../../recoil/state/FinanceState";
import BankImageModal from "./BankImageModal";
import apiRequest from "../../../helpers/apiHelper";
import { formatNumberWithCommas } from "../../../helpers/numberHelper.js";
import useTransactionNavigationGuard from "../../../hooks/useTransactionNavigationGuard";
import { useMemo, useCallback } from "react";

import DocDate from "./DocDate";
import Account from "./Account";
import Ref1 from "./Ref1";
import Ref2 from "./Ref2";
import Currency from "./Currency";
import ExRate from "./ExRate";
import { API_URL } from "../../../config/config";

const PayableBody = () => {
  const [formData, setFormData] = useRecoilState(payableFormDataState);
  const setOutstandingOpen = useSetRecoilState(payableOutstandingModalOpenState);
  const [open, setOpen] = useRecoilState(payableBankImageModalOpenState);
  const [fsmState, setFsmState] = useRecoilState(payableFSMState);
  const [validationError, setValidationError] = useRecoilState(payableValidationErrorState);
  const [vendorList, setVendorList] = useState([]);
  const [bankThumbnailUrl, setBankThumbnailUrl] = useState(null);

  const resetFormData = useResetRecoilState(payableFormDataState);
  const resetFsmState = useResetRecoilState(payableFSMState);

  const isDirty = useMemo(() => {
    if (fsmState === "view") return false;
    return (
      formData.account !== null ||
      formData.items.length > 0 ||
      formData.ref1 !== "" ||
      formData.ref2 !== "" ||
      formData.note !== "" ||
      formData.paymentMethods.cash.amount != 0 ||
      formData.paymentMethods.bankTransfer.amount != 0 ||
      formData.paymentMethods.creditCard.amount != 0 ||
      formData.paymentMethods.other.amount != 0
    );
  }, [formData, fsmState]);

  const cleanupCallback = useCallback(() => {
    resetFormData();
    resetFsmState();
  }, [resetFormData, resetFsmState]);

  useTransactionNavigationGuard(isDirty, cleanupCallback);

  useEffect(() => {
    const image = formData.paymentMethods.bankTransfer.slip_image;
    if (image) {
      if (image instanceof File) {
        const url = URL.createObjectURL(image);
        setBankThumbnailUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (typeof image === "string") {
        setBankThumbnailUrl(image.startsWith('http') ? image : `${API_URL}${image}`);
      }
    } else {
      setBankThumbnailUrl(null);
    }
  }, [formData.paymentMethods.bankTransfer.slip_image]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Vendors
        const vendorResponse = await apiRequest("GET", "/account/vendor/list");
        if (Array.isArray(vendorResponse)) {
          const mappedVendors = vendorResponse
            .filter((item) => item?.account_status === "active")
            .map((v) => ({
              ...v,
              label: v.vendor_code_name,
              _id: v._id || v.id,
            }));
          setVendorList(mappedVendors);
        }

        // Fetch Next Payable No
        const codeResponse = await apiRequest("GET", "/payables/next-invoice-no");
        if (codeResponse?.data) {
          setFormData(prev => ({
            ...prev,
            payableNo: codeResponse.data,
            docDate: prev.docDate || new Date()
          }));
        } else if (codeResponse?.invoice_no) {
          setFormData(prev => ({
            ...prev,
            payableNo: codeResponse.invoice_no,
            docDate: prev.docDate || new Date()
          }));
        } else if (typeof codeResponse === "string") {
          setFormData(prev => ({
            ...prev,
            payableNo: codeResponse,
            docDate: prev.docDate || new Date()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDocDateChange = (newValue) => {
    setFormData({ ...formData, docDate: newValue });
  };

  const handleAccountChange = (event, newValue) => {
    setFormData({ ...formData, account: newValue });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const rawValue = field === "paid" ? value.toString().replace(/,/g, "") : value;
    const newItems = [...formData.items];
    const item = { ...newItems[index], [field]: rawValue };

    if (field === "paid") {
      const paidVal = parseFloat(rawValue) || 0;
      const outstandingVal = parseFloat(item.outstanding) || 0;

      if (paidVal > outstandingVal) {
        setValidationError(`Paid amount exceeds outstanding balance for purchase ${item.purchaseNo}`);
      } else {
        setValidationError(null);
      }

      item.balance = (outstandingVal - paidVal).toFixed(2);
    }

    newItems[index] = item;
    setFormData({ ...formData, items: newItems });
  };

  const handlePaymentChange = (method, field, value) => {
    setValidationError(null);
    const rawValue = field === "amount" ? value.toString().replace(/,/g, "") : value;
    setFormData({
      ...formData,
      paymentMethods: {
        ...formData.paymentMethods,
        [method]: {
          ...formData.paymentMethods[method],
          [field]: rawValue
        }
      }
    });
  };

  const calculateTotal = (field) => {
    return formData.items.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0).toFixed(2);
  };

  const grandTotal = calculateTotal("paid");

  const paymentTotal = (
    parseFloat(formData.paymentMethods.cash.amount || 0) +
    parseFloat(formData.paymentMethods.bankTransfer.amount || 0)
  ).toFixed(2);

  const isPaymentMismatch = parseFloat(paymentTotal) !== parseFloat(grandTotal);

  return (
    <Box
      sx={{
        width: "100%",
        padding: "7px 24px",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography sx={{ color: "#9A9A9A", fontSize: "12px", fontFamily: "Calibri" }}>
          Transaction Date : {new Date().toLocaleDateString('en-GB')} By : Super Admin
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          border: "1px solid #C6C6C8",
          borderRadius: "4px",
          backgroundColor: "#FFF",
          boxSizing: "border-box"
        }}
      >
        <Box sx={{ display: "flex", borderBottom: "1px solid #C6C6C8", alignItems: "center", gap: "20px", padding: "16px 24px" }}>
          <Box sx={{ minWidth: "180px" }}>
            <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", mb: 0.5 }}>Payable No. :</Typography>
            <Typography sx={{ fontSize: "28px", color: "#05595B", fontFamily: "Calibri", fontWeight: 400, lineHeight: 1 }}>{formData.payableNo}</Typography>
          </Box>

          <Box sx={{ position: "relative", width: "145px" }}>
            <DocDate value={formData.docDate} onChange={handleDocDateChange} disabled={fsmState === "view"} />
          </Box>

          <Box sx={{ position: "relative", }}>
            <Account value={formData.account} onChange={handleAccountChange} options={vendorList} disabled={fsmState === "view"} />
          </Box>

          <Box sx={{}}>
            <Ref1 value={formData.ref1} onChange={(val) => handleInputChange("ref1", val)} disabled={fsmState === "view"} />
          </Box>

          <Box>
            <Ref2 value={formData.ref2} onChange={(val) => handleInputChange("ref2", val)} disabled={fsmState === "view"} />
          </Box>

          <Box sx={{ width: "145px" }}>
            <Currency
              value={formData.currency}
              disabled={true}
              onChange={(code, id) => setFormData(prev => ({ ...prev, currency: code, currencyId: id }))}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", }}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", borderRight: "1px solid #C6C6C8", overflow: "hidden" }}>
            <Box sx={{}}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <Typography
                    sx={{
                      color: "#05595B",
                      fontFamily: "Calibri",
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                  >
                    Payable
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={!formData.account || fsmState === "view"}
                    onClick={() => setOutstandingOpen(true)}
                    sx={{
                      bgcolor: "#000",
                      width: "177px",
                      height: "24px",
                      color: "#FFF",
                      textTransform: "none",
                      borderRadius: "4px",
                      fontFamily: "Calibri",
                      fontSize: "14px",
                      fontWeight: 400,
                      "&:hover": { bgcolor: "#333" },
                      "&.Mui-disabled": { bgcolor: "#E6E6E6", color: "#57646E", border: "1px solid #BFBFBF" }
                    }}
                  >
                    Outstanding Payable
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: "4px", marginTop: "24px", maxHeight: "516px", border: "1px solid #EDEDED ", overflowX: "hidden", overflowY: "auto" }}>
                <Table size="small" sx={{ minHeight: formData.items.length === 0 ? "256px" : "auto", tableLayout: "fixed", width: "100%" }}>
                  <TableHead sx={{ height: "32px" }}>
                    <TableRow sx={{ bgcolor: "#F2F2F2", }}>
                      <TableCell sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", fontSize: "14px ", fontWeight: 700, borderBottom: "none", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#343434", }}>Purchase No.</TableCell>
                      <TableCell align="right" sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", fontSize: "14px ", fontWeight: 700, borderBottom: "none", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#343434", }}>Outstanding</TableCell>
                      <TableCell align="right" sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", fontSize: "14px ", fontWeight: 700, borderBottom: "none", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#343434", }}>
                        Paid
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", fontSize: "14px ", fontWeight: 700, borderBottom: "none", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#343434", }}>Balance</TableCell>
                      <TableCell sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", fontSize: "14px ", fontWeight: 700, borderBottom: "none", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#343434" }}>Remark</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.length > 0 ? (
                      <>
                        {formData.items.map((item, index) => (
                          <TableRow key={index} sx={{ height: "38px" }}>
                            <TableCell sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", padding: "0 12px" }}>{item.purchaseNo}</TableCell>
                            <TableCell align="right" sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", padding: "0 12px" }}>{formatNumberWithCommas(parseFloat(item.outstanding || 0).toFixed(2))}</TableCell>
                            <TableCell align="right" sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", padding: 0 }}>
                              <NumericFormat
                                customInput={TextField}
                                size="small"
                                fullWidth
                                value={item.paid || 0}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                disabled={fsmState === "view"}
                                onValueChange={(values) => {
                                  handleItemChange(index, "paid", values.value);
                                }}
                                sx={{
                                  width: "100%",
                                  "& .MuiOutlinedInput-root": {
                                    height: "38px",
                                    borderRadius: 0,
                                    fontFamily: "Calibri",
                                    fontSize: "14px",
                                    "& fieldset": { border: "none" },
                                    "&:hover fieldset": { border: fsmState === "view" ? "none" : "1px solid #8BB4FF !important" },
                                    "&.Mui-focused fieldset": { border: "1px solid #8BB4FF !important" },
                                  },
                                  "& input": { textAlign: "right", padding: "4px 8px" }
                                }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", borderRight: "1px solid #EDEDED", fontFamily: "Calibri", padding: "0 12px" }}>{formatNumberWithCommas(parseFloat(item.balance || 0).toFixed(2))}</TableCell>
                            <TableCell sx={{ padding: "6px 10px", width: "192px", minWidth: "192px", maxWidth: "192px", fontFamily: "Calibri", padding: "0 4px" }}>
                              <TextField
                                size="small"
                                fullWidth
                                value={item.remark}
                                disabled={fsmState === "view"}
                                onChange={(e) => handleItemChange(index, "remark", e.target.value)}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "38px",
                                    borderRadius: 0,
                                    fontFamily: "Calibri",
                                    fontSize: "14px",
                                    "& fieldset": { border: "none" },
                                    "&:hover fieldset": { border: fsmState === "view" ? "none" : "1px solid #8BB4FF !important" },
                                    "&.Mui-focused fieldset": { border: "1px solid #8BB4FF !important" },
                                  },
                                  "& input": { padding: "4px 8px" }
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: "#FFFFFF", height: "38px" }}>
                          <TableCell sx={{
                            width: "192px", minWidth: "192px", maxWidth: "192px", borderTop: "none", borderBottom: "none", fontSize: "16px ", fontWeight: 700, borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#666666", padding: "0 12px"
                          }}>Total</TableCell>
                          <TableCell align="right" sx={{ width: "192px", minWidth: "192px", maxWidth: "192px", borderTop: "none", borderBottom: "none", fontSize: "16px ", fontWeight: 700, borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#666666", padding: "0 12px" }}>{formatNumberWithCommas(parseFloat(calculateTotal("outstanding") || 0).toFixed(2))}</TableCell>
                          <TableCell align="right" sx={{ width: "192px", minWidth: "192px", maxWidth: "192px", borderTop: "none", borderBottom: "none", fontSize: "16px ", fontWeight: 700, borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#666666", padding: "0 12px" }}>{formatNumberWithCommas(parseFloat(calculateTotal("paid") || 0).toFixed(2))}</TableCell>
                          <TableCell align="right" sx={{ width: "192px", minWidth: "192px", maxWidth: "192px", borderTop: "none", borderBottom: "none", fontSize: "16px ", fontWeight: 700, borderRight: "1px solid #EDEDED", fontFamily: "Calibri", color: "#666666", padding: "0 12px" }}>{formatNumberWithCommas(parseFloat(calculateTotal("balance") || 0).toFixed(2))}</TableCell>
                          <TableCell sx={{ width: "192px", minWidth: "192px", maxWidth: "192px", borderTop: "none", borderBottom: "none", padding: "0 12px" }}></TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow sx={{ height: "38px" }}>
                        <TableCell colSpan={5} align="center" sx={{ border: "none" }}>
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M55 13.6653L44.854 2.24866C44.367 1.47048 43.656 1 42.907 1H21.093C20.344 1 19.633 1.47048 19.146 2.24767L9 13.6663V22.8367H55V13.6653Z" stroke="#D9D9D9" />
                              <path d="M41.613 16.8128C41.613 15.2197 42.607 13.9046 43.84 13.9036H55V31.9059C55 34.0132 53.68 35.7402 52.05 35.7402H11.95C10.32 35.7402 9 34.0122 9 31.9059V13.9036H20.16C21.393 13.9036 22.387 15.2167 22.387 16.8098V16.8317C22.387 18.4248 23.392 19.7111 24.624 19.7111H39.376C40.608 19.7111 41.613 18.4128 41.613 16.8198V16.8128Z" fill="#FAFAFA" stroke="#D9D9D9" />
                            </svg>
                            <Typography sx={{ color: "#343434", fontSize: "16px", fontWeight: 700, fontFamily: "Calibri", mt: 1 }}>No data</Typography>
                            <Typography sx={{ fontWeight: 400, color: "#9A9A9A", fontSize: "12px", fontFamily: "Calibri" }}>Use the buttons above to add your items.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: "auto", height: "110px", marginBottom: "24px" }}>
              <TextField
                placeholder="Write a comment..."
                multiline
                rows={4}
                fullWidth
                disabled={fsmState === "view"}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                sx={{
                  height: "105px",
                  bgcolor: "#FFF",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#BFBFBF", borderWidth: "1px" }
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: "Calibri",
                    fontSize: "14px",
                  }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ width: "414px", flexShrink: 0, padding: "32px" }}>
            <Box
              sx={{
                bgcolor: "#F3F3F3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "64px",
                padding: "0 16px",
                borderRadius: "4px",
                mb: "24px",
                border: "1px solid #E0E0E0"
              }}
            >
              <Typography sx={{ fontSize: "24px", fontWeight: 700, fontFamily: "Calibri", color: "#343434" }}>Grand Total</Typography>
              <Typography sx={{ fontSize: "24px", fontWeight: 700, color: "#343434", fontFamily: "Calibri" }}>{formatNumberWithCommas(parseFloat(grandTotal || 0).toFixed(2))} {formData.currency}</Typography>
            </Box>
            {validationError && isPaymentMismatch && parseFloat(grandTotal) > 0 && !validationError.includes("exceeds") && (
              <Typography sx={{ paddingLeft: "16px", color: "#D32F2F", fontSize: "14px", fontFamily: "Calibri", fontWeight: 400, marginTop: "-12px", marginBottom: "24px" }}>
                Payment amount does not match the grand total amount.
              </Typography>
            )}

            <Box sx={{ height: "38px", paddingTop: "8px", paddingBottom: "8px", borderBottom: "1px solid #EDEDED" }}>
              <Typography sx={{ color: "#05595B", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri" }}>
                Payment Methods (Option)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", mt: "24px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", borderBottom: "1px solid #E0E0E0", paddingBottom: "24px" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "24px" }}>
                  <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>Cash</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <NumericFormat
                      customInput={TextField}
                      size="small"
                      value={formData.paymentMethods.cash.amount || 0}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      disabled={fsmState === "view"}
                      onValueChange={(values) => {
                        handlePaymentChange("cash", "amount", values.value);
                      }}
                      sx={{
                        width: "120px",
                        "& .MuiOutlinedInput-root": {
                          height: "24px",
                          bgcolor: "#FFF",
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontFamily: "Calibri",
                          "& fieldset": { borderColor: "#E0E0E0" }
                        },
                        "& input": { textAlign: "right", padding: "0 8px" }
                      }}
                    />
                    <Typography sx={{ width: "30px", fontFamily: "Calibri", fontSize: "14px", color: "#666" }}>{formData.currency}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "24px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>Bank / Mobile Transfer</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Box
                      sx={{
                        cursor: fsmState === "view" ? "default" : "pointer",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onClick={() => setOpen(true)}
                    >
                      {bankThumbnailUrl ? (
                        <img
                          src={bankThumbnailUrl}
                          alt="receipt"
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            objectFit: "cover",
                            border: "1px solid #EDEDED"
                          }}
                        />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V22C23.5 22.8284 22.8284 23.5 22 23.5H2C1.17157 23.5 0.5 22.8284 0.5 22V2C0.5 1.17157 1.17157 0.5 2 0.5Z" fill="#FAFAFA" />
                          <path d="M2 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V22C23.5 22.8284 22.8284 23.5 22 23.5H2C1.17157 23.5 0.5 22.8284 0.5 22V2C0.5 1.17157 1.17157 0.5 2 0.5Z" stroke="#EDEDED" />
                          <path d="M14.333 7.91663H17.833" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16.083 6.16663V9.66663" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17.25 11.7083V16.0833C17.25 16.3928 17.1271 16.6895 16.9083 16.9083C16.6895 17.1271 16.3928 17.25 16.0833 17.25H7.91667C7.60725 17.25 7.3105 17.1271 7.09171 16.9083C6.87292 16.6895 6.75 16.3928 6.75 16.0833V7.91667C6.75 7.60725 6.87292 7.3105 7.09171 7.09171C7.3105 6.87292 7.60725 6.75 7.91667 6.75H12.2917" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17.25 13.75L15.4498 11.9499C15.2311 11.7311 14.9344 11.6083 14.625 11.6083C14.3156 11.6083 14.0189 11.7311 13.8002 11.9499L8.5 17.25" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10.2497 11.4167C10.894 11.4167 11.4163 10.8944 11.4163 10.25C11.4163 9.60571 10.894 9.08337 10.2497 9.08337C9.60534 9.08337 9.08301 9.60571 9.08301 10.25C9.08301 10.8944 9.60534 11.4167 10.2497 11.4167Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </Box>
                    <NumericFormat
                      customInput={TextField}
                      size="small"
                      value={formData.paymentMethods.bankTransfer.amount || 0}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      disabled={fsmState === "view"}
                      onValueChange={(values) => {
                        handlePaymentChange("bankTransfer", "amount", values.value);
                      }}
                      sx={{
                        width: "120px",
                        "& .MuiOutlinedInput-root": {
                          height: "24px",
                          bgcolor: "#FFF",
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontFamily: "Calibri",
                          "& fieldset": { borderColor: "#E0E0E0" }
                        },
                        "& input": { textAlign: "right", padding: "0 8px" }
                      }}
                    />
                    <Typography sx={{ width: "30px", fontFamily: "Calibri", fontSize: "14px", color: "#666" }}>{formData.currency}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "24px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", borderBottom: "1px solid #E0E0E0", paddingBottom: "24px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "24px" }}>
                    <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>Credit / Debit Card</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <NumericFormat
                        customInput={TextField}
                        size="small"
                        value={formData.paymentMethods.creditCard.amount || 0}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        disabled={fsmState === "view"}
                        onValueChange={(values) => {
                          handlePaymentChange("creditCard", "amount", values.value);
                        }}
                        sx={{
                          width: "120px",
                          "& .MuiOutlinedInput-root": {
                            height: "24px",
                            bgcolor: "#FFF",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontFamily: "Calibri",
                            "& fieldset": { borderColor: "#E0E0E0" }
                          },
                          "& input": { textAlign: "right", padding: "0 8px" }
                        }}
                      />
                      <Typography sx={{ width: "30px", fontFamily: "Calibri", fontSize: "14px", color: "#666" }}>{formData.currency}</Typography>
                    </Box>
                  </Box>

                  <TextField
                    placeholder="Write a comment..."
                    multiline
                    rows={2}
                    fullWidth
                    disabled={fsmState === "view"}
                    value={formData.paymentMethods.creditCard.note}
                    onChange={(e) => handlePaymentChange("creditCard", "note", e.target.value)}
                    sx={{
                      bgcolor: "#FFF",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: "56px",
                        padding: "8px 12px",
                        "& fieldset": { borderColor: "#E0E0E0" }
                      },
                      "& .MuiInputBase-input": { fontSize: "13px", fontFamily: "Calibri" }
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "24px" }}>
                    <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>Other</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <NumericFormat
                        customInput={TextField}
                        size="small"
                        value={formData.paymentMethods.other.amount || 0}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        disabled={fsmState === "view"}
                        onValueChange={(values) => {
                          handlePaymentChange("other", "amount", values.value);
                        }}
                        sx={{
                          width: "120px",
                          "& .MuiOutlinedInput-root": {
                            height: "24px",
                            bgcolor: "#FFF",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontFamily: "Calibri",
                            "& fieldset": { borderColor: "#E0E0E0" }
                          },
                          "& input": { textAlign: "right", padding: "0 8px" }
                        }}
                      />
                      <Typography sx={{ width: "30px", fontFamily: "Calibri", fontSize: "14px", color: "#666" }}>{formData.currency}</Typography>
                    </Box>
                  </Box>
                  <TextField
                    placeholder="Write a comment..."
                    multiline
                    rows={2}
                    fullWidth
                    value={formData.paymentMethods.other.note}
                    disabled={fsmState === "view"}
                    onChange={(e) => handlePaymentChange("other", "note", e.target.value)}
                    sx={{
                      bgcolor: "#FFF",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        padding: "8px 12px",
                        height: "56px",
                        "& fieldset": { borderColor: "#E0E0E0" }
                      },
                      "& .MuiInputBase-input": { fontSize: "13px", fontFamily: "Calibri" }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <BankImageModal />
    </Box>
  );
};

export default PayableBody;
