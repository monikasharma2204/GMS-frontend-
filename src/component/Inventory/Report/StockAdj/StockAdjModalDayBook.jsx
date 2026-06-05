import React, { useState, useEffect } from "react";
import apiRequest from "helpers/apiHelper";
import { Box, Button, Typography, Modal, Checkbox } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment";
import * as XLSX from "xlsx";
import { formatNumberWithCommas } from "helpers/numberHelper";
import { API_URL } from "config/config";
import useTableSort from "hooks/useTableSort";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
};

const StockAdjModalDayBook = ({
  open,
  setOpen,
  onLoadSelect,
}) => {
  const [loadData, setLoadData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [age, setAge] = useState(10);

  const { sortedData, requestSort, sortConfig } = useTableSort(loadData, { key: 'createdAt', direction: 'desc' });

  const handleOpen = () => {
    setOpen(true);
    fetchLoadData();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const hasData = Array.isArray(filteredData) && filteredData.length > 0;

  const formatDateValue = (value) => {
    if (!value) return "";
    const date = moment(value);
    return date.isValid() ? date.format("DD/MM/YYYY") : "";
  };

  const getLoadSummary = (load) => {
    const items = load?.stockadj_items || [];
    return items.reduce((sum, item) => {
      const amount = item.total_amount ||
        (item.unit === "pcs" ? (item.price * item.physical_pcs) : (item.price * item.physical_cts)) ||
        0;
      return {
        pcs: sum.pcs + (item.physical_pcs || 0),
        weight: sum.weight + (item.physical_cts || 0),
        amount: sum.amount + amount
      };
    }, { pcs: 0, weight: 0, amount: 0 });
  };

  const buildExportRows = () => {
    const rowsToExport = sortedData.filter((item) => item.checked) || [];
    const effectiveRows = rowsToExport.length > 0 ? rowsToExport : sortedData;

    return effectiveRows.map((item, exportIndex) => {
      const rowIndex = exportIndex + 1;
      const summary = getLoadSummary(item);

      return {
        "#": rowIndex,
        Status: item.status?.toLowerCase() === "adjust" ? "Adjusted" : "Pending",
        TranDate: formatDateValue(item?.createdAt),
        "Doc Date": formatDateValue(item?.doc_date),

        "Invoice No.": item?.invoice_no || "",
        Account: "---",
        "Ref 1": item?.ref_1 || "",
        "Ref 2": item?.ref_2 || "",
        Pcs: summary?.pcs ?? 0,
        Weight: summary?.weight ?? 0,
        Amount: summary?.amount ?? 0,
        Note: item?.note || "---",
      };
    });
  };

  const handleDownloadExcel = () => {
    if (!hasData) return;
    const exportRows = buildExportRows();
    if (!exportRows.length) return;

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Adj DayBook");

    const timestamp = moment().format("YYYYMMDD_HHmmss");
    XLSX.writeFile(workbook, `stock_adj_daybook_${timestamp}.xlsx`);
  };

  const fetchLoadData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("GET", "/stock-adj", {});
      const dataWithCheckbox = (Array.isArray(response) ? response : (response?.data || [])).map(item => ({
        ...item,
        checked: false
      }));
      setLoadData(dataWithCheckbox);
      setFilteredData(dataWithCheckbox);
    } catch (error) {
      console.error("Failed to fetch stock adj data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoadData();
    }
  }, [open]);

  useEffect(() => {
    const count = sortedData.filter(item => item.checked).length;
    setSelectedItemsCount(count);
  }, [sortedData]);

  const isOkButtonEnabled = selectedItemsCount === 1;

  const handleCheckboxChange = (item) => {
    setLoadData(prev => prev.map(load =>
      load._id === item._id
        ? { ...load, checked: !load.checked }
        : load
    ));
  };

  const handleSelectAll = () => {
    if (!Array.isArray(sortedData) || sortedData.length === 0) return;

    const allSelected = sortedData.every(item => item.checked);
    const newCheckedState = !allSelected;

    setLoadData(prev =>
      prev.map(item => ({
        ...item,
        checked: newCheckedState,
      }))
    );
  };

  const handleSubmit = () => {
    const selectedLoads = sortedData.filter(item => item.checked);
    if (onLoadSelect) {
      onLoadSelect(selectedLoads);
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            width: "100%",
            height: "56px",
            backgroundColor: "var(--HeadPage, #05595B)",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 900,
              marginLeft: "32px",
              marginTop: "10px",
            }}
          >
            Stock Adj Day Book
          </Typography>
          <Box
            sx={{
              marginTop: "16px",
              marginRight: "16px",
              cursor: "pointer",
              "&:hover svg path": {
                fill: "#E00410",
              },
            }}
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
                fill="white"
              />
            </svg>
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            backgroundColor: "#F8F8F8",
            width: "95.2%",
            height: "638px",
            marginLeft: "33px",
            marginTop: "33px",
            paddingTop: "32px",
          }}
        >
          {/* Title */}
          <Box
            sx={{
              width: "1232px",
              height: "40px",
              marginLeft: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#343434",
                  fontFamily: "Calibri",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "12px" }}>
              <Box
                sx={{
                  width: "113px",
                  height: "38px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                >
                  Rows per page
                </Typography>
              </Box>

              <FormControl
                defaultValue="10"
                sx={{
                  height: "40px",
                  width: "69px",
                  marginRight: "10px",
                }}
              >
                <Select
                  sx={{
                    height: "40px",
                    width: "69px",
                    backgroundColor: "#FFF",
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                  value={age}
                  onChange={handleChange}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ "&:hover svg path": { fill: "#00AA3A" }, marginTop: "6px", cursor: "pointer" }} onClick={handleDownloadExcel}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    d="M19.4175 1.7L17.8862 0H5.8275C4.9575 0 4.62125 0.645 4.62125 1.14875V5.68625H6.3125V2.06625C6.3125 1.87375 6.475 1.71125 6.6625 1.71125H15.2913C15.4812 1.71125 15.5763 1.745 15.5763 1.90125V7.92625H21.7175C21.9587 7.92625 22.0525 8.05125 22.0525 8.23375V22.9463C22.0525 23.2537 21.9275 23.3 21.74 23.3H6.6625C6.56952 23.2977 6.48106 23.2595 6.41576 23.1932C6.35047 23.127 6.31345 23.038 6.3125 22.945V21.6H4.6325V23.7188C4.61 24.4688 5.01 25 5.8275 25H22.575C23.45 25 23.7488 24.3663 23.7488 23.7887V6.48375L23.3113 6.00875L19.4175 1.7ZM17.295 1.9L17.7787 2.4425L21.0238 6.00875L21.2025 6.225H17.8862C17.6362 6.225 17.4775 6.18375 17.4112 6.1C17.345 6.01875 17.3062 5.8875 17.295 5.70875V1.9ZM15.9325 13.3337H21.6537V15.0013H15.9312L15.9325 13.3337ZM15.9325 10.0013H21.6537V11.6675H15.9312L15.9325 10.0013ZM15.9325 16.6675H21.6537V18.335H15.9312L15.9325 16.6675ZM1.25 7.0325V20.3662H14.3313V7.0325H1.25ZM7.79125 14.7875L6.99125 16.01H7.79125V17.5H3.77L6.6875 13.1125L4.1025 9.1675H6.2625L7.7925 11.4625L9.32125 9.1675H11.48L8.89 13.1125L11.8113 17.5H9.57L7.79125 14.7875Z"
                    fill="#666"
                  />
                </svg>
              </Box>
            </Box>
          </Box>
          {/* Table */}
          <Box
            sx={{
              width: "1232px",
              marginTop: "24px",
              marginLeft: "32px",
              borderRadius: "5px 5px 5px 5px",
              border: "1px solid var(--Line-Table, #C6C6C8)",
              overflowX: "auto",
              height: "560px",
              bgcolor: "#FFF"
            }}
          >
            <Box
              sx={{
                width: "fit-content",
                height: "42px",
                bgcolor: "#EDEDED",
                display: "flex",
                borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
              }}
            >
              <Box sx={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Checkbox
                  checked={sortedData.length > 0 && sortedData.every(item => item.checked)}
                  onChange={handleSelectAll}
                />
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>#</Typography>
              </Box>
              <Box sx={{ width: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Status</Typography>
              </Box>
              <Box
                onClick={() => requestSort('createdAt')}
                sx={{
                  width: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>TranDate</Typography>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  style={{
                    transform: sortConfig.key === 'createdAt' && sortConfig.direction === 'asc' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                >
                  <path d="M6.5 12H3.5L8 16.5V1.5H6.5V12ZM11 3.75V16.5H12.5V6H15.5L11 1.5V3.75Z" fill="#343434" />
                </svg>
              </Box>

              <Box
                onClick={() => requestSort('doc_date')}
                sx={{
                  width: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Doc Date</Typography>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  style={{
                    transform: sortConfig.key === 'doc_date' && sortConfig.direction === 'asc' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                >
                  <path d="M6.5 12H3.5L8 16.5V1.5H6.5V12ZM11 3.75V16.5H12.5V6H15.5L11 1.5V3.75Z" fill="#343434" />
                </svg>
              </Box>

              <Box sx={{ width: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Invoice No.</Typography>
              </Box>
              <Box sx={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Location</Typography>
              </Box>
              <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Ref 1</Typography>
              </Box>
              <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Ref 2</Typography>
              </Box>
              <Box sx={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Pcs</Typography>
              </Box>
              <Box sx={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Weight</Typography>
              </Box>
              <Box sx={{ width: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Amount</Typography>
              </Box>
              <Box sx={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Note</Typography>
              </Box>
            </Box>

            <Box sx={{ width: "fit-content" }}>
              {sortedData.map((item, index) => {
                const summary = getLoadSummary(item);
                return (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      height: "42px",
                      borderBottom: "1px solid #EDEDED",
                      "&:hover": { bgcolor: "#F5F8FF" },
                    }}
                  >
                    <Box sx={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Checkbox checked={item.checked} onChange={() => handleCheckboxChange(item)} />
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{index + 1}</Typography>
                    </Box>
                    <Box sx={{ width: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Box
                        sx={{
                          backgroundColor: item.status?.toLowerCase() === "adjust" ? "#00AA3A33" : "#C6A96933",
                          color: item.status?.toLowerCase() === "adjust" ? "#00AA3A" : "#C6A969",
                          padding: "6px 10px",
                          borderRadius: "5px",
                          fontFamily: "Calibri",
                          fontSize: "14px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {item.status?.toLowerCase() === "adjust" ? "Adjusted" : "Pending"}
                      </Box>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{formatDateValue(item.createdAt)}</Typography>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{formatDateValue(item.doc_date)}</Typography>
                    </Box>
                    <Box sx={{ width: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", }}>{item.invoice_no}</Typography>
                    </Box>
                    <Box sx={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{item.location || "---"}</Typography>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{item.ref_1 || "---"}</Typography>
                    </Box>
                    <Box sx={{ width: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{item.ref_2 || "---"}</Typography>
                    </Box>
                    <Box sx={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{summary.pcs}</Typography>
                    </Box>
                    <Box sx={{ width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{formatNumberWithCommas(summary.weight.toFixed(3))}</Typography>
                    </Box>
                    <Box sx={{ width: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{formatNumberWithCommas(summary.amount.toFixed(2))}</Typography>
                    </Box>
                    <Box sx={{ width: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>{item.note || "---"}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ height: "78px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", paddingRight: "32px" }}>
          <Button
            onClick={handleClose}
            sx={{
              height: "44px", width: "100px", bgcolor: "#FFF", border: "1px solid #BFBFBF", color: "#343434",
              textTransform: "none", fontFamily: "Calibri", fontSize: "18px", fontWeight: 700
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isOkButtonEnabled}
            sx={{
              height: "44px", width: "100px", bgcolor: isOkButtonEnabled ? "#05595B" : "#E6E6E6", color: isOkButtonEnabled ? "#FFF" : "#57646E",
              textTransform: "none", fontFamily: "Calibri", fontSize: "18px", fontWeight: 700,
              "&:hover": { bgcolor: isOkButtonEnabled ? "#05595B" : "#E6E6E6" }
            }}
          >
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default StockAdjModalDayBook;
