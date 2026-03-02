import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal, Dialog } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useRecoilState } from "recoil";
import apiRequest from "helpers/apiHelper.js";
import { memoInfoState } from "recoil/Load/MemoState";
import dayjs from "dayjs";
import { QuotationtableRowsState } from "recoil/Purchase/PurchaseState";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  // height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
};
const textStyle = {
  color: "var(--Main-Text, #343434)",
  fontFamily: "Calibri",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
};
const PurchasePUModal = ({ handleSubmit = () => { }, disabledItems = [], isApproved = false, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);

  const [openSelectAccountModal, setOpenSelectAccountModal] = useState(false);
  const [openOperationModal, setOpenOperationModal] = useState(false);
  const [operationType, setOperationType] = useState("merge");

  useEffect(() => {
    const fetchApprovedItems = async () => {
      try {
        setLoading(true);

        //  const accountValue = memoInfo?.account?.label || memoInfo?.account?.code || "";

        let accountValue = "";
        const acc = memoInfo?.account;
        if (typeof acc === "string") {
          accountValue = acc;
        } else if (acc && typeof acc === "object") {
          accountValue = acc._id || acc.id || acc.value || acc.code || acc.label || "";
        }
        const response = await apiRequest(
          "GET",
          `/pu/approved-items/by-account?account=${accountValue}`
        );
        setRowData(response);
      } catch (error) {
        console.error("Error fetching approved items:", error);
        setRowData([]);
      } finally {
        setLoading(false);
      }
    };


    const hasAccountData = memoInfo?.account && (
      memoInfo?.account?.code ||
      memoInfo?.account?.label ||
      typeof memoInfo?.account === 'string'
    );

    if (open && hasAccountData) {
      fetchApprovedItems();
    } else {
    }
  }, [open, memoInfo?.account]);

  const handlePOModalSubmit = (selectedStockRows) => {

    const newRows = selectedStockRows.map((item) => ({
      stone_code: item.stone,
      stock_id: item.stock_id || "",
      account: item.account,
      _id: item._id,
      stone: item.stone,
      shape: item.shape,
      size: item.size,
      color: item.color,
      cutting: item.cutting,
      quality: item.quality,
      clarity: item.clarity,
      cer_type: item.cer_type,
      cer_no: item.cer_no,
      location: "",
      type: "approved",
      lot_no: item.lot_no,
      pcs: item.pcs,
      weight: item.weight,
      price: item.price,
      unit: item.unit,
      amount: item.amount,
      remark: item.remark || "",
      ref_no: item.ref_no,
      pu_no: item.invoice_no, // Map invoice_no to pu_no

      discount_percent: item.discount_percent,
      discount_amount: item.discount_amount,
      totalAmount: item.total_amount,
      labour: "",
      labour_price: item.labour_price || 0,
      isFromPU: true, // Changed from isFromPO to isFromPU
      doc_date: item.doc_date,
      vendor_code_id: item.vendor_code_id,
      currency: item.currency,
    }));

    setRows((prevRows) => [...prevRows, ...newRows]);
  };

  const handleOkClick = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one item");
      return;
    }
    setOpenOperationModal(true);
  };

  const handleOperationConfirm = () => {

    handlePOModalSubmit(selectedRows);
    handleSubmit(selectedRows, operationType);
    setOpenOperationModal(false);
    handleClose();
  };

  const handleOperationCancel = () => {
    setOpenOperationModal(false);
  };

  const handleCheckboxChange = (row, rowIndex) => {
    setSelectedRows((prev) => {

      const rowUniqueId = row._id || `${row.pu_item_id || 'unknown'}-${rowIndex}`;


      if (row._id) {
        const isSelected = prev.some((selectedRow) => selectedRow._id === row._id);
        if (isSelected) {
          return prev.filter((selectedRow) => selectedRow._id !== row._id);
        } else {
          return [...prev, { ...row, __uniqueId: rowUniqueId }];
        }
      }


      const isSelected = prev.some((selectedRow) => {

        const selectedUniqueId = selectedRow.__uniqueId ||
          (selectedRow.pu_item_id ? `${selectedRow.pu_item_id}-${prev.indexOf(selectedRow)}` : null);
        return selectedUniqueId === rowUniqueId;
      });

      const newSelection = isSelected
        ? prev.filter((selectedRow) => {
          const selectedUniqueId = selectedRow.__uniqueId ||
            (selectedRow.pu_item_id ? `${selectedRow.pu_item_id}-${prev.indexOf(selectedRow)}` : null);
          return selectedUniqueId !== rowUniqueId;
        })
        : [...prev, { ...row, __uniqueId: rowUniqueId }];

      return newSelection;
    });
  };

  const handleCheckboxSelectAllChange = () => {
    if (selectedRows.length === rowData.length) {

      setSelectedRows([]);
    } else {

      setSelectedRows(rowData);
    }
  };

  const handleOpen = () => {
    if (!memoInfo) {
      setOpenSelectAccountModal(true);
      return;
    }
    const hasAccount = memoInfo?.account && (
      memoInfo?.account?.code ||
      memoInfo?.account?.label ||
      typeof memoInfo?.account === 'string'
    );

    if (!hasAccount) {
      setOpenSelectAccountModal(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };

  const handleCloseSelectAccountModal = () => {
    setOpenSelectAccountModal(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={isApproved || disabled}
        sx={{
          width: "80px",
          height: "25px",
          marginLeft: "8px",
          padding: "6px 12px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "4px",
          bgcolor: "#000000",
          textTransform: "none",
          "&:hover": {
            bgcolor: "#333333",
          },
          "&.Mui-disabled": {
            bgcolor: "#000000",
            color: "#FFFFFF",
            cursor: "not-allowed",
          },
        }}
      >
        <Typography
          sx={{
            color: "#FFFFFF",
            fontSize: "14px",
            fontFamily: "Calibri",
            fontStyle: "normal",
            fontWeight: 500,
          }}
        >
          PU
        </Typography>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                // width: "100%",
                height: "56px",
                backgroundColor: "var(--HeadPage, #05595B)",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  fontFamily: "Calibri",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                }}
              >
                Purchase
              </Typography>
              <Button
                onClick={handleClose}
                sx={{
                  minWidth: "auto",
                  padding: "8px",
                  color: "#FFF",
                }}
              >
                ✕
              </Button>
            </Box>

            {/* Content */}
            <Box
              sx={{
                // width: "100%",
                height: "calc(100% - 56px)",
                display: "flex",
                flexDirection: "column",
                padding: "24px",
              }}
            >
              {/* Controls */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  paddingTop: "45px",
                  alignItems: "center",
                  marginBottom: "26px",
                }}
              >

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

                    >
                      <MenuItem
                        value={10}
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        10
                      </MenuItem>
                      <MenuItem
                        value={20}
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        20
                      </MenuItem>
                      <MenuItem
                        value={30}
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        30
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      "&:hover svg path": {
                        fill: "#E9B238",
                      },
                      marginTop: "6px",
                      "& svg path": {
                        fill: "#666666",
                      },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                    >
                      <path
                        d="M8.16671 2.33398C7.85729 2.33398 7.56054 2.4569 7.34175 2.67569C7.12296 2.89449 7.00004 3.19123 7.00004 3.50065V8.16732H4.66671C4.04787 8.16732 3.45438 8.41315 3.01679 8.85074C2.57921 9.28832 2.33337 9.88181 2.33337 10.5007V19.834C2.33337 20.4528 2.57921 21.0463 3.01679 21.4839C3.45438 21.9215 4.04787 22.1673 4.66671 22.1673H7.00004V24.5007C7.00004 24.8101 7.12296 25.1068 7.34175 25.3256C7.56054 25.5444 7.85729 25.6673 8.16671 25.6673H19.8334C20.1428 25.6673 20.4395 25.5444 20.6583 25.3256C20.8771 25.1068 21 24.8101 21 24.5007V22.1673H23.3334C23.9522 22.1673 24.5457 21.9215 24.9833 21.4839C25.4209 21.0463 25.6667 20.4528 25.6667 19.834V10.5007C25.6667 9.88181 25.4209 9.28832 24.9833 8.85074C24.5457 8.41315 23.9522 8.16732 23.3334 8.16732H21V3.50065C21 3.19123 20.8771 2.89449 20.6583 2.67569C20.4395 2.4569 20.1428 2.33398 19.8334 2.33398H8.16671ZM19.8334 16.334H8.16671C7.85729 16.334 7.56054 16.4569 7.34175 16.6757C7.12296 16.8945 7.00004 17.1912 7.00004 17.5007V19.834H4.66671V10.5007H23.3334V19.834H21V17.5007C21 17.1912 20.8771 16.8945 20.6583 16.6757C20.4395 16.4569 20.1428 16.334 19.8334 16.334ZM18.6667 8.16732H9.33337V4.66732H18.6667V8.16732ZM5.83337 11.6673V14.0007H9.33337V11.6673H5.83337ZM18.6667 18.6673V23.334H9.33337V18.6673H18.6667Z"
                        fill="white"
                      />
                    </svg>
                  </Box>

                  <Box
                    sx={{
                      "&:hover svg path": {
                        fill: "#00AA3A",
                      },
                      marginTop: "6px",
                      "& svg path": {
                        fill: "#666666",
                      },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M19.4175 1.7L17.8862 0H5.8275C4.9575 0 4.62125 0.645 4.62125 1.14875V5.68625H6.3125V2.06625C6.3125 1.87375 6.475 1.71125 6.6625 1.71125H15.2913C15.4812 1.71125 15.5763 1.745 15.5763 1.90125V7.92625H21.7175C21.9587 7.92625 22.0525 8.05125 22.0525 8.23375V22.9463C22.0525 23.2537 21.9275 23.3 21.74 23.3H6.6625C6.56952 23.2977 6.48106 23.2595 6.41576 23.1932C6.35047 23.127 6.31345 23.038 6.3125 22.945V21.6H4.6325V23.7188C4.61 24.4688 5.01 25 5.8275 25H22.575C23.45 25 23.7488 24.3663 23.7488 23.7887V6.48375L23.3113 6.00875L19.4175 1.7ZM17.295 1.9L17.7787 2.4425L21.0238 6.00875L21.2025 6.225H17.8862C17.6362 6.225 17.4775 6.18375 17.4112 6.1C17.345 6.01875 17.3062 5.8875 17.295 5.70875V1.9ZM15.9325 13.3337H21.6537V15.0013H15.9312L15.9325 13.3337ZM15.9325 10.0013H21.6537V11.6675H15.9312L15.9325 10.0013ZM15.9325 16.6675H21.6537V18.335H15.9312L15.9325 16.6675ZM1.25 7.0325V20.3662H14.3313V7.0325H1.25ZM7.79125 14.7875L6.99125 16.01H7.79125V17.5H3.77L6.6875 13.1125L4.1025 9.1675H6.2625L7.7925 11.4625L9.32125 9.1675H11.48L8.89 13.1125L11.8113 17.5H9.57L7.79125 14.7875Z"
                        fill="white"
                      />
                    </svg>
                  </Box>
                </Box>
              </Box>

              {/* Table */}
              <Box
                sx={{
                  backgroundColor: "#F8F8F8",
                  width: "100%",
                  height: "638px",
                  borderRadius: "8px",
                  overflow: "auto",
                }}
              >
                {/* Table Header */}
                <Box
                  sx={{
                    width: "2000px",
                    height: "42px",
                    backgroundColor: "var(--Head-Table, #EDEDED)",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                  }}
                >
                  {/* # */}
                  <Box
                    sx={{
                      width: "60px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Checkbox
                      checked={
                        selectedRows.length === rowData.length &&
                        rowData.length > 0
                      }
                      onChange={() => handleCheckboxSelectAllChange()}
                      disabled={rowData.every(row =>
                        disabledItems.some(
                          (disabledItem) => {
                            const disabledId = disabledItem.pu_item_id || disabledItem._id || disabledItem.stock_id;
                            const rowId = row.pu_item_id || row._id || row.stock_id;
                            return disabledId === rowId;
                          }
                        )
                      )}
                      sx={{
                        '&.Mui-disabled': {
                          color: '#E0E0E0',
                        }
                      }}
                    />
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      #
                    </Typography>
                  </Box>

                  {/* Doc Date */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Doc Date
                    </Typography>
                  </Box>

                  {/* PU No. */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      PU No.
                    </Typography>
                  </Box>

                  {/* Stone */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Stone
                    </Typography>
                  </Box>

                  {/* Shape */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Shape
                    </Typography>
                  </Box>

                  {/* Size */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Size
                    </Typography>
                  </Box>

                  {/* Color */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Color
                    </Typography>
                  </Box>

                  {/* Cutting */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Cutting
                    </Typography>
                  </Box>

                  {/* Quality */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Quality
                    </Typography>
                  </Box>

                  {/* Clarity */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Clarity
                    </Typography>
                  </Box>

                  {/* Pcs */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Pcs
                    </Typography>
                  </Box>

                  {/* Weight */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Weight
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Price
                    </Typography>
                  </Box>

                  {/* Unit */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Unit
                    </Typography>
                  </Box>

                  {/* Amount */}
                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Amount
                    </Typography>
                  </Box>

                </Box>

                {/* Table Body */}
                <Box
                  sx={{
                    width: "2000px",
                    height: "calc(100% - 42px)",
                    // overflow: "auto",
                  }}
                >
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                    >
                      <Typography sx={textStyle}>Loading...</Typography>
                    </Box>
                  ) : rowData.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                    >
                      <Typography sx={textStyle}>No data available</Typography>
                    </Box>
                  ) : (
                    rowData.map((row, rowIndex) => {
                      const isDisabled = disabledItems.some(
                        (disabledItem) => {
                          const disabledId = disabledItem.pu_item_id || disabledItem._id || disabledItem.stock_id;
                          const rowId = row.pu_item_id || row._id || row.stock_id;
                          return disabledId === rowId;
                        }
                      );

                      return (
                        <Box
                          key={row.pu_item_id || row._id || rowIndex}
                          sx={{
                            width: "100%",
                            height: "42px",
                            backgroundColor: isDisabled ? "#F5F5F5" : "#FFF",
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? "not-allowed" : "default",
                          }}
                        >
                          {/* # */}
                          <Box
                            sx={{
                              width: "60px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Checkbox
                              checked={selectedRows.some(
                                (selectedRow) => {
                                  // First try to match by _id if both have it
                                  if (row._id && selectedRow._id) {
                                    return row._id === selectedRow._id;
                                  }
                                  // Otherwise, use the uniqueId we stored
                                  const rowUniqueId = row._id || `${row.pu_item_id || 'unknown'}-${rowIndex}`;
                                  const selectedUniqueId = selectedRow.__uniqueId ||
                                    (selectedRow._id || `${selectedRow.pu_item_id || 'unknown'}-${selectedRows.indexOf(selectedRow)}`);
                                  return selectedUniqueId === rowUniqueId;
                                }
                              )}
                              onChange={() => handleCheckboxChange(row, rowIndex)}
                              disabled={isDisabled}
                              sx={{
                                '&.Mui-disabled': {
                                  color: '#E0E0E0',
                                }
                              }}
                            />
                            <Typography sx={textStyle}>{rowIndex + 1}</Typography>
                          </Box>

                          {/* Doc Date */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>
                              {row.doc_date ? dayjs(row.doc_date).format("DD/MM/YYYY") : ""}
                            </Typography>
                          </Box>

                          {/* PU No. */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.invoice_no || ""}</Typography>
                          </Box>

                          {/* Stone */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.stone || ""}</Typography>
                          </Box>

                          {/* Shape */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.shape || ""}</Typography>
                          </Box>

                          {/* Size */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.size || ""}</Typography>
                          </Box>

                          {/* Color */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.color || ""}</Typography>
                          </Box>

                          {/* Cutting */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.cutting || ""}</Typography>
                          </Box>

                          {/* Quality */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.quality || ""}</Typography>
                          </Box>

                          {/* Clarity */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.clarity || ""}</Typography>
                          </Box>

                          {/* Pcs */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.pcs || ""}</Typography>
                          </Box>

                          {/* Weight */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.weight || ""}</Typography>
                          </Box>

                          {/* Price */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.price || ""}</Typography>
                          </Box>

                          {/* Unit */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.unit || ""}</Typography>
                          </Box>

                          {/* Amount */}
                          <Box
                            sx={{
                              width: "140px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 8px",
                            }}
                          >
                            <Typography sx={textStyle}>{row.amount || ""}</Typography>
                          </Box>
                        </Box>
                      );
                    })
                  )}
                </Box>
              </Box>

              {/* Footer Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                <Button
                  onClick={handleClose}
                  sx={{
                    width: "85px",
                    height: "33px",
                    backgroundColor: "#FFF",
                    color: "var(--Main-Text, #343434)",
                    border: "1px solid var(--Line-Table, #C6C6C8)",
                    borderRadius: "4px",
                    textTransform: "none",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOkClick}
                  sx={{
                    width: "80px",
                    height: "33px",
                    backgroundColor: "var(--HeadPage, #05595B)",
                    color: "#FFF",
                    borderRadius: "4px",
                    textTransform: "none",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontWeight: 400,
                    "&:hover": {
                      backgroundColor: "#044A4F",
                    },
                  }}
                >
                  OK
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Select Account Modal */}
      <Dialog
        open={openSelectAccountModal}
        onClose={() => setOpenSelectAccountModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box
          onClick={() => setOpenSelectAccountModal(false)}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover svg path": {
              fill: "#E00410",
            },
          }}
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
              fill="#343434"
            />
          </svg>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
            >
              <g clipPath="url(#clip0_472_206411)">
                <path
                  d="M50.4 89.6H61.6V78.4H50.4V89.6ZM56 0C48.646 0 41.364 1.44848 34.5697 4.26275C27.7755 7.07701 21.6021 11.2019 16.402 16.402C5.89998 26.9041 0 41.1479 0 56C0 70.8521 5.89998 85.0959 16.402 95.598C21.6021 100.798 27.7755 104.923 34.5697 107.737C41.364 110.552 48.646 112 56 112C70.8521 112 85.0959 106.1 95.598 95.598C106.1 85.0959 112 70.8521 112 56C112 48.646 110.552 41.364 107.737 34.5697C104.923 27.7755 100.798 21.6021 95.598 16.402C90.3979 11.2019 84.2245 7.07701 77.4303 4.26275C70.636 1.44848 63.354 0 56 0ZM56 100.8C31.304 100.8 11.2 80.696 11.2 56C11.2 31.304 31.304 11.2 56 11.2C80.696 11.2 100.8 31.304 100.8 56C100.8 80.696 80.696 100.8 56 100.8ZM56 22.4C50.0592 22.4 44.3616 24.76 40.1608 28.9608C35.96 33.1616 33.6 38.8591 33.6 44.8H44.8C44.8 41.8296 45.98 38.9808 48.0804 36.8804C50.1808 34.78 53.0296 33.6 56 33.6C58.9704 33.6 61.8192 34.78 63.9196 36.8804C66.02 38.9808 67.2 41.8296 67.2 44.8C67.2 56 50.4 54.6 50.4 72.8H61.6C61.6 60.2 78.4 58.8 78.4 44.8C78.4 38.8591 76.04 33.1616 71.8392 28.9608C67.6384 24.76 61.9408 22.4 56 22.4Z"
                  fill="#0072EC"
                />
              </g>
              <defs>
                <clipPath id="clip0_472_206411">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Box>
          <Typography
            sx={{
              marginBottom: "24px",
              color: "#343434",
              textAlign: "center",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Please select the account
          </Typography>
          <Box sx={{ display: "flex", gap: "14px" }}>
            <Button
              onClick={() => setOpenSelectAccountModal(false)}
              sx={{
                height: "44px",
                padding: "12px 40px",
                borderRadius: "4px",
                backgroundColor: "#05595B",
                "&:hover": {
                  backgroundColor: "#05595B",
                },
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  color: "#FFF",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                OK
              </Typography>
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Operation Modal */}
      <Dialog
        open={openOperationModal}
        onClose={handleOperationCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            maxWidth: "500px",
            padding: "40px",
            margin: "auto",
          }
        }}
      >
        <Box
          sx={{
            padding: "24px",
            textAlign: "center",
            position: "relative",
            backgroundColor: "#FFF",
            borderRadius: "8px",
          }}
        >
          <Button
            onClick={handleOperationCancel}
            sx={{
              position: "absolute",
              top: "12px",
              right: "12px",
              minWidth: "auto",
              padding: "4px",
              color: "#000",
              fontSize: "18px",
              // "& .MuiButton-label": {
              //   fontWeight: 800,
              // },
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <span style={{ fontWeight: 800 }}>✕</span>
          </Button>

          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              marginBottom: "34px",
              fontFamily: "Calibri",
              color: "#333",
              marginTop: "8px",
              textAlign: "left"
            }}
          >
            How would you like to perform this operation?
          </Typography>

          <Box sx={{ marginBottom: "16px", textAlign: "left" }}>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
              <input
                type="radio"
                id="normal"
                name="operation"
                value="normal"
                checked={operationType === "normal"}
                onChange={(e) => setOperationType(e.target.value)}
                style={{
                  marginRight: "8px",
                  width: "18px",
                  height: "18px",
                  accentColor: "#2196F3"
                }}
              />
              <label
                htmlFor="normal"
                style={{
                  fontFamily: "Calibri",
                  fontSize: "18px",
                  color: "#333",
                  cursor: "pointer"
                }}
              >
                Normal
              </label>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                id="merge"
                name="operation"
                value="merge"
                checked={operationType === "merge"}
                onChange={(e) => setOperationType(e.target.value)}
                style={{
                  marginRight: "8px",
                  width: "18px",
                  height: "18px",
                  accentColor: "#2196F3"
                }}
              />
              <label
                htmlFor="merge"
                style={{
                  fontFamily: "Calibri",
                  fontSize: "18px",
                  color: "#333",
                  cursor: "pointer",
                  margin: "18px 0px"
                }}
              >
                Merge
              </label>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "14px",
              color: "#343434",
              marginBottom: "20px",
              fontFamily: "Calibri",
              // fontStyle: "italic",
              textAlign: "left"
            }}
          >
            <span style={{ color: "#f00", fontSize: "15px" }}>* </span>If you choose to merge, all data will be combined.
          </Typography>

          <Box sx={{ display: "flex", gap: "12px", justifyContent: "center", }}>
            <Button
              onClick={handleOperationCancel}
              sx={{
                height: "36px",
                width: "100px",
                padding: "12px 34px",
                borderRadius: "4px",
                backgroundColor: "#FFF",
                border: "1px solid #ccc",
                color: "#000",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                minWidth: "80px",
                "&:hover": {
                  backgroundColor: "#B41E38",
                  color: "#FFF",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOperationConfirm}
              sx={{
                height: "36px",
                width: "100px",
                padding: "12px 34px",
                borderRadius: "4px",
                backgroundColor: "#05595B",
                color: "#FFF",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                minWidth: "80px",
                "&:hover": {
                  backgroundColor: "#044A4F",
                  color: "#FFF",
                },
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default PurchasePUModal;
