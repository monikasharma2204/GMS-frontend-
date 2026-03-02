import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal, Dialog } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useRecoilState } from "recoil";
import apiRequest from "helpers/apiHelper.js";
import { QuotationtableRowsState } from "recoil/Sale/SaleState";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/Sale/MemoState.js";
import dayjs from "dayjs";

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
const textStyle = {
  color: "var(--Main-Text, #343434)",
  fontFamily: "Calibri",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
};
const ReturnReserve = ({ data, state, handleSubmit, handleEdit, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);

  const [openSelectAccountModal, setOpenSelectAccountModal] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const isOkButtonEnabled = selectedRows.length === 1;

  useEffect(() => {

    const fetchMemoIn = async () => {
      try {
        setLoading(true); // Set loading to true before fetch
        const response = await apiRequest(
          "GET",
          `/reserves/by-account?account=${memoInfo?.account?.label || ""}`
        );

        setRowData(response);
        setMemoInfo({ ...memoInfo, memoPendingData: response });

      } catch (error) {
        console.error("Error fetching stock:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (open && memoInfo?.account?.label) {
      // Only fetch when modal is open
      fetchMemoIn();
    }
  }, [open, memoInfo?.account]); // Add open as dependency

  const toggleRow = (row) => {
    setSelectedRows((prev) => {
      const exists = prev.some((r) => r._id === row._id);
      return exists ? prev.filter((r) => r._id !== row._id) : [...prev, row];
    });
  };

  const toggleAll = () => {
    if (selectedRows.length === rowData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rowData);
    }
  };

  const handleOkClick = () => {
    if (selectedRows.length === 1) {
      handleEdit(selectedRows[0]);
      handleClose();
    }
  };

  const handleOpen = () => {
    if (!memoInfo?.account?.label) {
      setOpenSelectAccountModal(true);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };



  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };


  return (
    <>
      <Box>

        <Button
          onClick={handleOpen}
          disabled={disabled}
          sx={{
            textTransform: "none",
            height: "9px",
            width: "130px",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #000",
            gap: "8px",
            marginRight: "24px",
            backgroundColor: "#fff",


          }}

        >
          <Typography
            sx={{
              color: "#000",
              textAlign: "center",
              fontFamily: "Calibri",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            From Reserve
          </Typography>
        </Button>


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

        <Modal
          open={open}
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
                  fontWeight: 700,
                  marginLeft: "32px",
                  marginTop: "10px",
                }}
              >
                Return Reserve
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
                overflow: "hidden",
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
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Inventory All
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
                  width: "1232px",
                  marginTop: "24px",
                  marginLeft: "32px",
                  borderRadius: "5px 5px 5px 5px",
                  border: "1px solid var(--Line-Table, #C6C6C8)",
                  overflowX: "auto",
                  maxHeight: "565px",
                  "&::-webkit-scrollbar": {
                    height: "10px",
                    width: "10px"
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#F8F8F8",
                    borderRadius: "5px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#919191",
                    borderRadius: "5px",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "fit-content",
                    height: "42px",
                    bgcolor: "#EDEDED",
                    display: "flex",
                    borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                    gap: "4px",
                  }}
                >
                  <Box
                    sx={{
                      width: "60px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedRows.length === rowData.length && rowData.length > 0}
                      onChange={toggleAll}
                    />
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      #
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Doc Date
                    </Typography>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_2622_213943)">
                        <path
                          d="M2 1.5H10C10.1326 1.5 10.2598 1.55268 10.3536 1.64645C10.4473 1.74021 10.5 1.86739 10.5 2V2.793C10.5 2.9256 10.4473 3.05275 10.3535 3.1465L7.1465 6.3535C7.05273 6.44725 7.00003 6.5744 7 6.707V9.8595C7 9.9355 6.98267 10.0105 6.94933 10.0788C6.91599 10.1471 6.86752 10.2069 6.80761 10.2537C6.74769 10.3004 6.6779 10.3329 6.60355 10.3486C6.52919 10.3644 6.45222 10.363 6.3785 10.3445L5.3785 10.0945C5.27038 10.0674 5.1744 10.005 5.10583 9.9171C5.03725 9.82923 5 9.72096 5 9.6095V6.707C4.99997 6.5744 4.94727 6.44725 4.8535 6.3535L1.6465 3.1465C1.55273 3.05275 1.50003 2.9256 1.5 2.793V2C1.5 1.86739 1.55268 1.74021 1.64645 1.64645C1.74021 1.55268 1.86739 1.5 2 1.5Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2622_213943">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Due Date
                    </Typography>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                    >
                      <path
                        d="M6.5 12H3.5L8 16.5V1.5H6.5V12ZM11 3.75V16.5H12.5V6H15.5L11 1.5V3.75Z"
                        fill="#343434"
                      />
                    </svg>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Reserve No.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Account
                    </Typography>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                    >
                      <path
                        d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                        stroke="#666666"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Ref 1
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Ref 2
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "12px 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Pcs
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "12px 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Weight
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Amount
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Currency
                    </Typography>
                  </Box>




                  <Box
                    sx={{
                      width: "286px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Remark
                    </Typography>
                  </Box>
                </Box>

                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#666666",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                      }}
                    >
                      Loading...
                    </Typography>
                  </Box>
                ) : rowData.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#666666",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                      }}
                    >
                      No data available
                    </Typography>
                  </Box>
                ) : (

                  rowData.map((row, rowIndex) => (

                    <Box
                      key={row._id} // Use _id instead of index for key
                      sx={{
                        width: "fit-content",
                        height: "42px",
                        bgcolor: "#FFF",
                        display: "flex",
                        borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                        gap: "4px",
                      }}
                    >
                      {/* Checkbox + Row number */}
                      <Box
                        sx={{
                          width: "60px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          checked={selectedRows.some((r) => r._id === row._id)}
                          onChange={() => toggleRow(row)}
                        />
                        <Typography sx={textStyle}>{rowIndex + 1}</Typography>
                      </Box>

                      {/* Display fields in order matching the table headers */}
                      <Box
                        sx={{
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 8px",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {dayjs(row.doc_date || "").format("DD/MM/YYYY")}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px 0px",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {dayjs(row.due_date || "").format("DD/MM/YYYY")}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 0px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>{row.invoice_no || ""}</Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 0px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {typeof row.account === 'object' ? (row.account?.vendor_code_name || row.account?.label) : (row.account || "")}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 0px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>{row.ref_1 || ""}</Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 0px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>{row.ref_2 || ""}</Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          padding: "12px 8px",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {row.items && row.items.length > 0
                            ? row.items.reduce((total, item) => total + (item.pcs || 0), 0)
                            : 0
                          }
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          padding: "12px 8px",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {row.items && row.items.length > 0
                            ? row.items.reduce((total, item) => total + (item.weight || 0), 0)
                            : 0
                          }
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {row.items && row.items.length > 0
                            ? row.items.reduce((total, item) => total + (item.amount || 0), 0)
                            : 0
                          }
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>
                          {row.currency?.code || ""}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "286px",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 8px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={textStyle}>{row.remark || ""}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            {/* Save&Cancel */}
            <Box
              sx={{
                display: "flex",
                padding: "24px 32px",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                borderRadius: "0px 0px 4px 4px",
              }}
            >
              <Button
                onClick={handleClose}
                sx={{
                  width: "79px",
                  height: "35px",
                  padding: "12px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                  borderRadius: "4px",
                  border: "1px solid #BFBFBF",
                  bgcolor: "var(--Fill, #FFF)",
                  textTransform: "none",
                }}
              >
                <Typography
                  sx={{
                    color: "#343434",
                    fontSize: "16px",
                    fontFamily: "Calibri",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </Typography>
              </Button>
              <Button
                onClick={handleOkClick}
                disabled={!isOkButtonEnabled}
                sx={{
                  width: "79px",
                  height: "35px",
                  padding: "12px 24px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                  borderRadius: "4px",
                  border: "1px solid #BFBFBF",
                  bgcolor: isOkButtonEnabled ? "#17C653" : "#E6E6E6",
                  textTransform: "none",
                  "&.Mui-disabled": {
                    bgcolor: "#E6E6E6",
                    color: "#9A9A9A",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#FFF",
                    fontSize: "16px",
                    fontFamily: "Calibri",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  OK
                </Typography>
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ReturnReserve;
