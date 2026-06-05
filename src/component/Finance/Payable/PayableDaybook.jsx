import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import moment from "moment";
import { useRecoilState, useSetRecoilState } from "recoil";
import { payableDaybookOpenState, payableFormDataState, payableFSMState } from "../../../recoil/state/FinanceState";
import apiRequest from "../../../helpers/apiHelper";
import { formatNumberWithCommas } from "../../../helpers/numberHelper.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
  outline: "none",
};

const PayableDaybook = () => {
  const [open, setOpen] = useRecoilState(payableDaybookOpenState);
  const [daybookData, setDaybookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const setFormData = useSetRecoilState(payableFormDataState);
  const setFsmState = useSetRecoilState(payableFSMState);

  useEffect(() => {
    if (open) {
      fetchDaybook();
    }
  }, [open]);

  const fetchDaybook = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("GET", "/payables");
      if (response) {
        const rawData = Array.isArray(response) ? response : (response.data || []);
        const sortedData = [...rawData].sort((a, b) => {
          if (a.status === "cancelled" && b.status !== "cancelled") return 1;
          if (a.status !== "cancelled" && b.status === "cancelled") return -1;
          return 0;
        });
        setDaybookData(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch daybook data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemIds([]);
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === daybookData.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(daybookData.map((item) => item._id || item.id));
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOk = async () => {
    if (selectedItemIds.length !== 1) return;

    setLoading(true);
    try {
      const response = await apiRequest("GET", `/payables/${selectedItemIds[0]}`);
      if (response) {
        const data = response.data || response;

        setFormData({
          id: data._id || data.id,
          payableNo: data.invoice_no || data.payable_no || "",
          docDate: data.doc_date || null,
          account: data.account || null,
          ref1: data.ref_1 || data.ref1 || "",
          ref2: data.ref_2 || data.ref2 || "",
          currency: typeof data.currency === 'object' ? data.currency.code : (data.currency || ""),
          currencyId: typeof data.currency === 'object' ? data.currency._id : null,
          exchangeRate: data.exchange_rate || 1,
          note: data.note || "",
          status: data.status || "active",
          items: (data.items || []).map(item => ({
            _id: item._id,
            purchaseNo: item.purchase_no || "",
            outstanding: item.out_standing || 0,
            paid: item.paid || 0,
            balance: item.balance || 0,
            remark: item.remark || ""
          })),
          paymentMethods: {
            cash: { amount: data.payment_method?.cash || 0, note: "" },
            bankTransfer: {
              amount: data.payment_method?.internet_banking || 0,
              note: data.payment_method?.internet_banking_comment || "",
              slip_image: data.payment_method?.slip_image || null
            },
            creditCard: {
              amount: data.payment_method?.credit || 0,
              note: data.payment_method?.credit_comment || ""
            },
            other: {
              amount: data.payment_method?.other || 0,
              note: data.payment_method?.other_comment || ""
            },
          }
        });
        setFsmState("view");
        handleClose();
      }
    } catch (error) {
      console.error("Failed to fetch payable details:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAllSelected = daybookData.length > 0 && selectedItemIds.length === daybookData.length;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            width: "100%",
            height: "56px",
            backgroundColor: "#05595B",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <Typography sx={{ color: "#FFF", fontFamily: "Calibri", fontSize: "24px", fontWeight: 900 }}>
            DayBook
          </Typography>
          <Box onClick={handleClose} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z" fill="white" />
            </svg>
          </Box>
        </Box>

        {/* Body Container */}
        <Box
          sx={{
            backgroundColor: "#F8F8F8",
            width: "1296px",
            height: "720px",
            margin: "33px",
            padding: "32px",
            boxSizing: "border-box",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "20px", fontWeight: 700 }}>
              Payable
            </Typography>
            <Box sx={{ display: "flex", gap: "12px" }}>
              <Box sx={{ width: "113px", height: "38px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400 }}>
                  Rows per page
                </Typography>
              </Box>

              <FormControl sx={{ height: "40px", width: "69px", marginRight: "10px" }}>
                <Select
                  sx={{
                    height: "40px",
                    width: "69px",
                    backgroundColor: "#FFF",
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value)}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ "&:hover svg path": { fill: "#E9B238" }, marginTop: "6px", "& svg path": { fill: "#666666" } }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M8.16671 2.33398C7.85729 2.33398 7.56054 2.4569 7.34175 2.67569C7.12296 2.89449 7.00004 3.19123 7.00004 3.50065V8.16732H4.66671C4.04787 8.16732 3.45438 8.41315 3.01679 8.85074C2.57921 9.28832 2.33337 9.88181 2.33337 10.5007V19.834C2.33337 20.4528 2.57921 21.0463 3.01679 21.4839C3.45438 21.9215 4.04787 22.1673 4.66671 22.1673H7.00004V24.5007C7.00004 24.8101 7.12296 25.1068 7.34175 25.3256C7.56054 25.5444 7.85729 25.6673 8.16671 25.6673H19.8334C20.1428 25.6673 20.4395 25.5444 20.6583 25.3256C20.8771 25.1068 21 24.8101 21 24.5007V22.1673H23.3334C23.9522 22.1673 24.5457 21.9215 24.9833 21.4839C25.4209 21.0463 25.6667 20.4528 25.6667 19.834V10.5007C25.6667 9.88181 25.4209 9.28832 24.9833 8.85074C24.5457 8.41315 23.9522 8.16732 23.3334 8.16732H21V3.50065C21 3.19123 20.8771 2.89449 20.6583 2.67569C20.4395 2.4569 20.1428 2.33398 19.8334 2.33398H8.16671ZM19.8334 16.334H8.16671C7.85729 16.334 7.56054 16.4569 7.34175 16.6757C7.12296 16.8945 7.00004 17.1912 7.00004 17.5007V19.834H4.66671V10.5007H23.3334V19.834H21V17.5007C21 17.1912 20.8771 16.8945 20.6583 16.6757C20.4395 16.4569 20.1428 16.334 19.8334 16.334ZM18.6667 8.16732H9.33337V4.66732H18.6667V8.16732ZM5.83337 11.6673V14.0007H9.33337V11.6673H5.83337ZM18.6667 18.6673V23.334H9.33337V18.6673H18.6667Z" fill="white" />
                </svg>
              </Box>

              <Box sx={{ "&:hover svg path": { fill: "#00AA3A" }, marginTop: "6px", "& svg path": { fill: "#666666" }, cursor: "pointer" }}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path d="M19.4175 1.7L17.8862 0H5.8275C4.9575 0 4.62125 0.645 4.62125 1.14875V5.68625H6.3125V2.06625C6.3125 1.87375 6.475 1.71125 6.6625 1.71125H15.2913C15.4812 1.71125 15.5763 1.745 15.5763 1.90125V7.92625H21.7175C21.9587 7.92625 22.0525 8.05125 22.0525 8.23375V22.9463C22.0525 23.2537 21.9275 23.3 21.74 23.3H6.6625C6.56952 23.2977 6.48106 23.2595 6.41576 23.1932C6.35047 23.127 6.31345 23.038 6.3125 22.945V21.6H4.6325V23.7188C4.61 24.4688 5.01 25 5.8275 25H22.575C23.45 25 23.7488 24.3663 23.7488 23.7887V6.48375L23.3113 6.00875L19.4175 1.7ZM17.295 1.9L17.7787 2.4425L21.0238 6.00875L21.2025 6.225H17.8862C17.6362 6.225 17.4775 6.18375 17.4112 6.1C17.345 6.01875 17.3062 5.8875 17.295 5.70875V1.9ZM15.9325 13.3337H21.6537V15.0013H15.9312L15.9325 13.3337ZM15.9325 10.0013H21.6537V11.6675H15.9312L15.9325 10.0013ZM15.9325 16.6675H21.6537V18.335H15.9312L15.9325 16.6675ZM1.25 7.0325V20.3662H14.3313V7.0325H1.25ZM7.79125 14.7875L6.99125 16.01H7.79125V17.5H3.77L6.6875 13.1125L4.1025 9.1675H6.2625L7.7925 11.4625L9.32125 9.1675H11.48L8.89 13.1125L11.8113 17.5H9.57L7.79125 14.7875Z" fill="white" />
                </svg>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "560px",
              bgcolor: "#FFF",
              borderRadius: "5px",
              border: "1px solid #C6C6C8",
              overflow: "auto",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", bgcolor: "#EDEDED", height: "42px", position: "sticky", top: 0, zIndex: 1, borderBottom: "1px solid #C6C6C8" }}>
              <Box sx={{ width: "60px", display: "flex", alignItems: "center" }}>
                <Checkbox size="small" checked={isAllSelected} onChange={handleSelectAll} />
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434" }}>#</Typography>
              </Box>
              <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434" }}>Status</Typography>
              </Box>
              <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434" }}>Doc Date</Typography>
              </Box>
              <Box sx={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434" }}>Payable No.</Typography>
              </Box>
              <Box sx={{ width: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434" }}>Vendor Name</Typography>
              </Box>
              <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434" }}>Paid</Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: "Calibri", fontWeight: 700, fontSize: "16px", color: "#343434", }}>Remark</Typography>
              </Box>
            </Box>

            <Box>
              {daybookData.length > 0 ? (
                daybookData.map((row, index) => (
                  <Box key={index} sx={{ display: "flex", height: "42px", borderBottom: "1px solid #EDEDED", "&:hover": { bgcolor: "#F5F5F5" } }}>
                    <Box sx={{ width: "60px", display: "flex", alignItems: "center" }}>
                      <Checkbox size="small" checked={selectedItemIds.includes(row._id || row.id)} onChange={() => handleCheckboxChange(row._id || row.id)} />
                      <Typography sx={{ fontWeight: 400, fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>{index + 1}</Typography>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Box
                        sx={{
                          width: "87px",
                          height: "27px",
                          bgcolor: row.status === "cancelled" ? "rgba(180, 30, 56, 0.2)" : "rgba(0, 170, 58, 0.2)",
                          color: row.status === "cancelled" ? "#B41E38" : "#00AA3A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "5px",
                          fontFamily: "Calibri",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        {row.status === "cancelled" ? "Cancelled" : "Completed"}
                      </Box>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontWeight: 400, fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>{moment(row.doc_date).format("DD/MM/YYYY")}</Typography>
                    </Box>
                    <Box sx={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontWeight: 400, fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>{row.invoice_no || row.payable_no}</Typography>
                    </Box>
                    <Box sx={{ width: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontWeight: 400, fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>{row.account}</Typography>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center", pr: 2 }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{formatNumberWithCommas(parseFloat(row.payment_method?.grand_total || 0).toFixed(2))}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", pl: 2, justifyContent: "center" }}>
                      <Typography sx={{ fontWeight: 400, fontFamily: "Calibri", fontSize: "16px", color: "#343434" }}>{row.remark || row.note}</Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", py: 10 }}>
                  <Typography sx={{ color: "#9A9A9A", fontFamily: "Calibri", fontSize: "18px" }}>No data found</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              height: "64px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "0 24px",
              gap: "12px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              backgroundColor: "#FFF",
              borderTop: "1px solid #EDEDED",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                textTransform: "none",
                height: "32px",
                width: "96px",
                borderRadius: "4px",
                backgroundColor: "#E0E0E0",
                color: "#666",
                fontFamily: "Calibri",
                fontSize: "14px",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#D0D0D0" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOk}
              disabled={selectedItemIds.length !== 1 || loading}
              sx={{
                textTransform: "none",
                height: "32px",
                width: "96px",
                borderRadius: "4px",
                backgroundColor: selectedItemIds.length === 1 ? "#05595B" : "#E0E0E0",
                color: "white",
                fontFamily: "Calibri",
                fontSize: "14px",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#04484A" },
                "&.Mui-disabled": { backgroundColor: "#E0E0E0", color: "#A0A0A0" }
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PayableDaybook;
