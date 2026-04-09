import React, { useMemo } from "react";
import { Box, Typography, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableFooter } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.625 2.5V4.375M14.375 2.5V4.375M2.5 15.625V6.25C2.5 5.75272 2.69754 5.27581 3.04917 4.92417C3.40081 4.57254 3.87772 4.375 4.375 4.375H15.625C16.1223 4.375 16.5992 4.57254 16.9508 4.92417C17.3025 5.27581 17.5 5.75272 17.5 6.25V15.625M2.5 15.625C2.5 16.1223 2.69754 16.5992 3.04917 16.9508C3.40081 17.3025 3.87772 17.5 4.375 17.5H15.625C16.1223 17.5 16.5992 17.3025 16.9508 16.9508C17.3025 16.5992 17.5 16.1223 17.5 15.625M2.5 15.625V9.375C2.5 8.87772 2.69754 8.40081 3.04917 8.04917C3.40081 7.69754 3.87772 7.5 4.375 7.5H15.625C16.1223 7.5 16.5992 7.69754 16.9508 8.04917C17.3025 8.40081 17.5 8.87772 17.5 9.375V15.625M10 10.625H10.0067V10.6317H10V10.625ZM10 12.5H10.0067V12.5067H10V12.5ZM10 14.375H10.0067V14.3817H10V14.375ZM8.125 12.5H8.13167V12.5067H8.125V12.5ZM8.125 14.375H8.13167V14.3817H8.125V14.375ZM6.25 12.5H6.25667V12.5067H6.25V12.5ZM6.25 14.375H6.25667V14.3817H6.25V14.375ZM11.875 10.625H11.8817V10.6317H11.875V10.625ZM11.875 12.5H11.8817V12.5067H11.875V12.5ZM11.875 14.375H11.8817V14.3817H11.875V14.375ZM13.75 10.625H13.7567V10.6317H13.75V10.625ZM13.75 12.5H13.7567V12.5067H13.75V12.5Z" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
  </svg>


);

const MergeSplitBody = ({
  docDate,
  setDocDate,
  ref1,
  setRef1,
  ref2,
  setRef2,
  invoiceNo,
  sourceRows,
  targetRows,
  onAddTargetRow,
  onUpdateTargetRow,
  note,
  setNote,
  onStockClick,
  onRemoveSourceRow,
  onRemoveTargetRow
}) => {
  const totalSourcePcs = useMemo(() => sourceRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0), [sourceRows]);
  const totalTargetPcs = useMemo(() => targetRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0), [targetRows]);
  const totalSourceWeight = useMemo(() => sourceRows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0), [sourceRows]);
  const totalSourceAmount = useMemo(() => sourceRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0), [sourceRows]);
  const totalTargetWeight = useMemo(() => targetRows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0), [targetRows]);
  const totalTargetAmount = useMemo(() => targetRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0), [targetRows]);




  return (
    <Box
      sx={{

        padding: "22px 24px",
      }}
    >
      <Box>
        {/* Transaction Info */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "4px" }}>
          <Typography sx={{ color: "#9A9A9A", fontFamily: "Calibri", fontSize: "12px" }}>
            Transaction Date : {dayjs().format("DD/MM/YYYY")} By : Super Admin
          </Typography>
          <Typography sx={{ color: "#9A9A9A", fontFamily: "Calibri", fontSize: "12px", marginLeft: "24px" }}>
            Last Update : {dayjs().format("DD/MM/YYYY")} By : Super Admin
          </Typography>
        </Box>

        {/* Form Section */}
        <Grid
          sx={{

            padding: "16px 24px",
            borderRadius: "4px 4px 0px 0px",
            bgcolor: "#FFF",
            border: "1px solid #C6C6C8",

          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", }}>
            <Box sx={{ display: "flex", flexDirection: "column", paddingRight: "8px" }}>
              <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, lineHeight: "normal" }}>
                Merge/Split Stock No. :
              </Typography>
              <Typography sx={{ color: "#05595B", fontFamily: "Calibri", fontSize: "28px", fontWeight: 400, lineHeight: "normal", marginTop: "2px" }}>
                {invoiceNo}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", paddingLeft: "24px", alignItems: "center", gap: "15px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Doc Date *"
                  value={docDate}
                  onChange={setDocDate}
                  format="DD/MM/YYYY"
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      InputLabelProps: {
                        shrink: true,
                        sx: {
                          color: "var(--Text-Field, #666)",
                          fontFamily: "Calibri",
                          fontSize: "18px",
                          fontWeight: 400,
                          "& .MuiInputLabel-asterisk": {
                            color: "red",
                            visibility: "visible !important",
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      width: "145px",
                      height: "42px",
                      backgroundColor: "#FFF",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8BB4FF",
                      },
                      "& .MuiInputAdornment-root": {
                        marginLeft: "0px",
                      }
                    }
                  }}
                />
              </LocalizationProvider>

              <TextField
                label="Ref. 1"
                value={ref1}
                onChange={(e) => setRef1(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "var(--Text-Field, #666)",
                    fontFamily: "Calibri",
                    fontSize: "18px",
                    fontWeight: 400,
                  },
                }}
                sx={{
                  "& .MuiInputLabel-asterisk": {
                    color: "#B41E38",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#FFF",
                    width: "342.67px",
                    height: "42px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8BB4FF",
                    },
                  },
                }}
              />

              <TextField
                label="Ref. 2"
                value={ref2}
                onChange={(e) => setRef2(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "var(--Text-Field, #666)",
                    fontFamily: "Calibri",
                    fontSize: "18px",
                    fontWeight: 400,
                  },
                }}
                sx={{
                  "& .MuiInputLabel-asterisk": {
                    color: "#B41E38",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#FFF",
                    width: "342.67px",
                    height: "42px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8BB4FF",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>



        <Box sx={{ borderRadius: "4px 4px 0px 0px", padding: "24px", bgcolor: "#FBFBFB", border: "1px solid #C6C6C8", borderTop: "none", gap: "24px" }}>
          {/*   Main Tables Section */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>


            <Box>

              {/* Item Table */}
              <Box sx={{ paddingBottom: "24px" }}>

                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Typography sx={{ lineHeight: "normal", fontSize: "20px", fontWeight: 700, fontFamily: "Calibri", color: "#05595B" }}>Item</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={onStockClick}
                      sx={{ hover: "none", lineHeight: "normal", fontFamily: "Calibri", width: " 96px", fontSize: "14px", fontWeight: "400", height: "24px", bgcolor: "#000000", color: "#FFF", textTransform: "none", borderRadius: "4px", paddingLeft: "16px" }}
                    >
                      Stock
                    </Button>
                  </Box>


                  <Box sx={{ display: "flex", gap: "16px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.0002 21L16.6602 16.66L21.0002 21Z" fill="#666666" />
                      <path d="M21.0002 21L16.6602 16.66" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 20C5.5 20.1427 5.452 20.2617 5.356 20.357C5.26 20.4523 5.14134 20.5 5 20.5H2.308C2.07934 20.5 1.88734 20.4227 1.732 20.268C1.57667 20.1133 1.49934 19.9213 1.5 19.692V17C1.5 16.858 1.548 16.7393 1.644 16.644C1.74 16.5487 1.859 16.5007 2.001 16.5C2.143 16.4993 2.26167 16.5473 2.357 16.644C2.45234 16.7407 2.5 16.8593 2.5 17V19.5H5C5.142 19.5 5.26067 19.548 5.356 19.644C5.45134 19.74 5.49934 19.858 5.5 20ZM22 16.5C22.1427 16.5 22.2617 16.548 22.357 16.644C22.4523 16.74 22.5 16.8587 22.5 17V19.692C22.5 19.9213 22.4227 20.1133 22.268 20.268C22.1133 20.4227 21.9213 20.5 21.692 20.5H19C18.858 20.5 18.7393 20.452 18.644 20.356C18.5487 20.26 18.5007 20.141 18.5 19.999C18.4993 19.857 18.5473 19.7383 18.644 19.643C18.7407 19.5477 18.8593 19.5 19 19.5H21.5V17C21.5 16.858 21.548 16.7393 21.644 16.644C21.74 16.5487 21.858 16.5007 22 16.5ZM4.404 18C4.296 18 4.20167 17.9597 4.121 17.879C4.04034 17.7983 4 17.704 4 17.596V6.404C4 6.296 4.04034 6.20167 4.121 6.121C4.20167 6.04034 4.296 6 4.404 6H5.596C5.704 6 5.79834 6.04034 5.879 6.121C5.95967 6.20167 6 6.296 6 6.404V17.596C6 17.704 5.95967 17.7983 5.879 17.879C5.79834 17.9597 5.704 18 5.596 18H4.404ZM7.5 18C7.36667 18 7.25 17.95 7.15 17.85C7.05 17.75 7 17.6333 7 17.5V6.5C7 6.36667 7.05 6.25 7.15 6.15C7.25 6.05 7.36667 6 7.5 6C7.63334 6 7.75 6.05 7.85 6.15C7.95 6.25 8 6.36667 8 6.5V17.5C8 17.6333 7.95 17.75 7.85 17.85C7.75 17.95 7.63334 18 7.5 18ZM10.404 18C10.296 18 10.2017 17.9597 10.121 17.879C10.0403 17.7983 10 17.704 10 17.596V6.404C10 6.296 10.0403 6.20167 10.121 6.121C10.2017 6.04034 10.296 6 10.404 6H11.596C11.704 6 11.7983 6.04034 11.879 6.121C11.9597 6.20167 12 6.296 12 6.404V17.596C12 17.704 11.9597 17.7983 11.879 17.879C11.7983 17.9597 11.704 18 11.596 18H10.404ZM13.404 18C13.296 18 13.2017 17.9597 13.121 17.879C13.0403 17.7983 13 17.704 13 17.596V6.404C13 6.296 13.0403 6.20167 13.121 6.121C13.2017 6.04034 13.296 6 13.404 6H15.596C15.704 6 15.7983 6.04034 15.879 6.121C15.9597 6.20167 16 6.296 16 6.404V17.596C16 17.704 15.9597 17.7983 15.879 17.879C15.7983 17.9597 15.704 18 15.596 18H13.404ZM17.5 18C17.3667 18 17.25 17.95 17.15 17.85C17.05 17.75 17 17.6333 17 17.5V6.5C17 6.36667 17.05 6.25 17.15 6.15C17.25 6.05 17.3667 6 17.5 6C17.6333 6 17.75 6.05 17.85 6.15C17.95 6.25 18 6.36667 18 6.5V17.5C18 17.6333 17.95 17.75 17.85 17.85C17.75 17.95 17.6333 18 17.5 18ZM19.5 18C19.3667 18 19.25 17.95 19.15 17.85C19.05 17.75 19 17.6333 19 17.5V6.5C19 6.36667 19.05 6.25 19.15 6.15C19.25 6.05 19.3667 6 19.5 6C19.6333 6 19.75 6.05 19.85 6.15C19.95 6.25 20 6.36667 20 6.5V17.5C20 17.6333 19.95 17.75 19.85 17.85C19.75 17.95 19.6333 18 19.5 18ZM5.5 4C5.5 4.14267 5.452 4.26167 5.356 4.357C5.26 4.45234 5.14134 4.5 5 4.5H2.5V7C2.5 7.142 2.452 7.26067 2.356 7.356C2.26 7.45134 2.141 7.49934 1.999 7.5C1.857 7.50067 1.73834 7.45267 1.643 7.356C1.54767 7.25934 1.5 7.14067 1.5 7V4.308C1.5 4.07934 1.57734 3.88734 1.732 3.732C1.88667 3.57667 2.07867 3.49934 2.308 3.5H5C5.142 3.5 5.26067 3.548 5.356 3.644C5.45134 3.74 5.49934 3.858 5.5 4ZM18.5 3.999C18.5 3.857 18.548 3.73834 18.644 3.643C18.74 3.54767 18.8587 3.5 19 3.5H21.692C21.9213 3.5 22.1133 3.57734 22.268 3.732C22.4227 3.88667 22.5 4.07867 22.5 4.308V7C22.5 7.142 22.452 7.26067 22.356 7.356C22.26 7.45134 22.141 7.49934 21.999 7.5C21.857 7.50067 21.7383 7.45267 21.643 7.356C21.5477 7.25934 21.5 7.14067 21.5 7V4.5H19C18.858 4.5 18.7393 4.452 18.644 4.356C18.5487 4.26 18.5007 4.141 18.5 3.999Z" fill="#666666" />
                    </svg>

                  </Box>
                </Box>
              </Box>



              <TableContainer component={Paper} sx={{ height: "184px", boxShadow: "none", border: "1px solid  #EDEDED", borderRadius: "4px" }}>
                <Table stickyHeader size="small">
                  <TableHead sx={{ height: "32px" }}>
                    <TableRow sx={{ fontSize: "14px", fontWeight: 700, color: "#343434" }}>
                      {[" ", "#", "Img", "Stock ID", "Location", "Lot", "Stone Code", "Stone", "Shape", "Size", "Cer Type", "Cer No.", "Pcs", "Weight", "Price", "Unit", "Amount"].map(h => (
                        <TableCell key={h} sx={{ borderBottom: "none", borderRight: (h === "Lot" || h === "Weight") ? "1px solid #EDEDED" : "none", bgcolor: "#F2F2F2", fontWeight: 600, fontFamily: "Calibri", fontSize: "14px", lineHeight: "normal", padding: "4px 8px" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sourceRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={21} align="center" sx={{ padding: "40px" }}>
                          <Box sx={{ alignItems: "center", display: "flex", flexDirection: "column", color: "#999", textAlign: "center", gap: "10px" }}>
                            <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M55 13.6653L44.854 2.24866C44.367 1.47048 43.656 1 42.907 1H21.093C20.344 1 19.633 1.47048 19.146 2.24767L9 13.6663V22.8367H55V13.6653Z" stroke="#D9D9D9" />
                              <path d="M41.613 16.8128C41.613 15.2197 42.607 13.9046 43.84 13.9036H55V31.9059C55 34.0132 53.68 35.7402 52.05 35.7402H11.95C10.32 35.7402 9 34.0122 9 31.9059V13.9036H20.16C21.393 13.9036 22.387 15.2167 22.387 16.8098V16.8317C22.387 18.4248 23.392 19.7111 24.624 19.7111H39.376C40.608 19.7111 41.613 18.4128 41.613 16.8198V16.8128Z" fill="#FAFAFA" stroke="#D9D9D9" />
                            </svg>

                            <Box sx={{ display: "flex", flexDirection: "column", color: "#999", textAlign: "center", gap: "10px" }}>
                              <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", color: "#343434", fontWeight: 700 }} variant="body2">No data</Typography>
                              <Typography sx={{ fontFamily: "Calibri", fontSize: "12px", color: "#9A9A9A", fontWeight: 700 }} variant="caption">Please add the items by clicking on   <Box component="span" sx={{ color: "#666666", fontWeight: 700 }}>
                                "Stock"
                              </Box>{" "} button</Typography>
                            </Box>

                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sourceRows.map((row, idx) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ borderBottom: "none", borderRight: "none", padding: "4px 8px" }}>
                            <Box
                              onClick={() => onRemoveSourceRow(row.id)}
                              sx={{
                                width: "16px",
                                height: "16px",
                                bgcolor: "#FCEBEC",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                // border: "1px solid #E54C53"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_178_11953)">
                                  <path d="M5.14149 7.25H10.697C10.8444 7.25 10.9857 7.32024 11.0899 7.44526C11.1941 7.57029 11.2526 7.73986 11.2526 7.91667C11.2526 8.09348 11.1941 8.26305 11.0899 8.38807C10.9857 8.5131 10.8444 8.58333 10.697 8.58333H5.14149C4.99415 8.58333 4.85284 8.5131 4.74866 8.38807C4.64447 8.26305 4.58594 8.09348 4.58594 7.91667C4.58594 7.73986 4.64447 7.57029 4.74866 7.44526C4.85284 7.32024 4.99415 7.25 5.14149 7.25Z" fill="#B41E38" />
                                  <path d="M7.91406 14.7738C8.81456 14.7738 9.70623 14.5964 10.5382 14.2518C11.3701 13.9072 12.1261 13.4021 12.7628 12.7654C13.3995 12.1286 13.9046 11.3727 14.2492 10.5407C14.5938 9.70879 14.7712 8.81712 14.7712 7.91663C14.7712 7.01613 14.5938 6.12446 14.2492 5.29251C13.9046 4.46056 13.3995 3.70464 12.7628 3.06789C12.1261 2.43115 11.3701 1.92606 10.5382 1.58145C9.70623 1.23685 8.81456 1.05948 7.91406 1.05948C6.09544 1.05948 4.35129 1.78193 3.06533 3.06789C1.77937 4.35386 1.05692 6.098 1.05692 7.91663C1.05692 9.73525 1.77937 11.4794 3.06533 12.7654C4.35129 14.0513 6.09544 14.7738 7.91406 14.7738ZM7.91406 15.9166C5.79233 15.9166 3.7575 15.0738 2.25721 13.5735C0.756917 12.0732 -0.0859375 10.0384 -0.0859375 7.91663C-0.0859375 5.79489 0.756917 3.76006 2.25721 2.25977C3.7575 0.759481 5.79233 -0.083374 7.91406 -0.083374C10.0358 -0.083374 12.0706 0.759481 13.5709 2.25977C15.0712 3.76006 15.9141 5.79489 15.9141 7.91663C15.9141 10.0384 15.0712 12.0732 13.5709 13.5735C12.0706 15.0738 10.0358 15.9166 7.91406 15.9166Z" fill="#B41E38" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_178_11953">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>


                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "none", borderRight: "none", padding: "4px 8px", fontFamily: "Calibri", fontSize: "14px" }}>{idx + 1}</TableCell>
                          <TableCell sx={{ borderBottom: "none", borderRight: "none", padding: "4px 8px" }}>
                            {row.image && <img src={row.image} alt="" style={{ width: "24px", height: "24px", objectFit: "cover" }} />}
                          </TableCell>
                          {["stock_id", "location", "lot", "stone_code", "stone", "shape", "size", "cer_type", "cer_no", "pcs", "weight", "price", "unit", "amount"].map(f => (
                            <TableCell key={f} sx={{ borderBottom: "none", borderRight: (f === "lot" || f === "weight") ? "1px solid #EDEDED" : "none", padding: "4px 8px", fontFamily: "Calibri", fontSize: "14px" }}>
                              {row[f]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Item Table Sum Row */}
              <Box sx={{ width: "100%", bgcolor: "#F2F2F2", border: "1px solid #EDEDED", borderTop: "none", borderRadius: "0 0 4px 4px", display: "flex", alignItems: "center", height: "32px", overflowX: "auto" }}>
                <Box sx={{ display: "flex", minWidth: "max-content" }}>
                  <Box sx={{ width: "32px", borderRight: "1px solid #EDEDED" }} /> {/* Padding for remove icon */}
                  <Box sx={{ width: "32px", borderRight: "1px solid #EDEDED" }} /> {/* # */}
                  <Box sx={{ width: "32px", borderRight: "1px solid #EDEDED" }} /> {/* Img */}
                  <Box sx={{ width: "120px", borderRight: "1px solid #EDEDED" }} /> {/* Stock ID */}
                  <Box sx={{ width: "120px", borderRight: "1px solid #EDEDED" }} /> {/* Location */}
                  <Box sx={{ width: "60px", borderRight: "1px solid #EDEDED" }} /> {/* Lot */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Stone Code */}
                  <Box sx={{ width: "90px", borderRight: "1px solid #EDEDED" }} /> {/* Stone */}
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Shape */}
                  <Box sx={{ width: "70px", borderRight: "1px solid #EDEDED" }} /> {/* Size */}

                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Cer Type */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Cer No */}
                  <Box sx={{ width: "60px", borderRight: "1px solid #EDEDED", px: 1, fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", display: "flex", alignItems: "center" }}>{totalSourcePcs}</Box>
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED", px: 1, fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", display: "flex", alignItems: "center" }}>{totalSourceWeight.toFixed(3)}</Box>
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Price */}
                  <Box sx={{ width: "60px", borderRight: "1px solid #EDEDED" }} /> {/* Unit */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED", px: 1, fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", display: "flex", alignItems: "center" }}>
                    {totalSourceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Box>
                </Box>
              </Box>
            </Box>


            {/* Merge/Split Stock Table */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "16px" }}>
                <Typography sx={{ lineHeight: "normal", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri", color: "#05595B" }}>
                  Merge/Split Stock
                </Typography>
                {sourceRows.length > 0 && (
                  <Typography sx={{ fontSize: "16px", fontFamily: "Calibri", color: "#343434", fontWeight: 400 }}>
                    {`Pcs fields are required (${totalTargetPcs}/${totalSourcePcs} items)`}
                  </Typography>
                )}
              </Box>

              <TableContainer component={Paper} sx={{ height: "232px", boxShadow: "none", border: "1px solid #EDEDED" }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table stickyHeader size="small" >
                    <TableHead sx={{ height: "32px" }}>
                      <TableRow>
                        {[" ", "#", "Img", "Stock ID", "Location * ", "Lot", "Stone Code", "Stone", "Shape", "Size", "Color", "Cutting", "Quality", "Clarity", "Cer Type", "Cer No.", "Pcs * ", "weight *", "Price *", "Unit *", "Amount *", "Remark"].map(h => (
                          <TableCell key={h} sx={{ borderBottom: "none", borderRight: "1px solid #EDEDED", bgcolor: "#F2F2F2", color: "#343434", fontWeight: 600, fontFamily: "Calibri", fontSize: "14px", lineHeight: "normal", paddingRight: "12px", paddingLeft: "12px" }}>
                            {h.includes("*") ? (
                              <>
                                {h.split("*")[0]}
                                <span style={{ color: "#B41E38" }}>*</span>
                                {h.split("*")[1]}
                              </>
                            ) : h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {targetRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={22} align="center" sx={{ padding: "40px", color: "#999" }}>
                            Please add items to the table above before entering details here.
                          </TableCell>
                        </TableRow>
                      ) : (
                        targetRows.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ borderBottom: "none", borderRight: "1px solid #EDEDED", padding: "4px 8px" }}>
                              <Box
                                onClick={() => onRemoveTargetRow(row.id)}
                                sx={{ width: "16px", height: "16px", bgcolor: "#FCEBEC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.14149 7.25H10.697C10.8444 7.25 10.9857 7.32024 11.0899 7.44526C11.1941 7.57029 11.2526 7.73986 11.2526 7.91667C11.2526 8.09348 11.1941 8.26305 11.0899 8.38807C10.9857 8.5131 10.8444 8.58333 10.697 8.58333H5.14149C4.99415 8.58333 4.85284 8.5131 4.74866 8.38807C4.64447 8.26305 4.58594 8.09348 4.58594 7.91667C4.58594 7.73986 4.64447 7.57029 4.74866 7.44526C4.85284 7.32024 4.99415 7.25 5.14149 7.25Z" fill="#B41E38" />
                                  <path d="M7.91406 14.7738C8.81456 14.7738 9.70623 14.5964 10.5382 14.2518C11.3701 13.9072 12.1261 13.4021 12.7628 12.7654C13.3995 12.1286 13.9046 11.3727 14.2492 10.5407C14.5938 9.70879 14.7712 8.81712 14.7712 7.91663C14.7712 7.01613 14.5938 6.12446 14.2492 5.29251C13.9046 4.46056 13.3995 3.70464 12.7628 3.06789C12.1261 2.43115 11.3701 1.92606 10.5382 1.58145C9.70623 1.23685 8.81456 1.05948 7.91406 1.05948C6.09544 1.05948 4.35129 1.78193 3.06533 3.06789C1.77937 4.35386 1.05692 6.098 1.05692 7.91663C1.05692 9.73525 1.77937 11.4794 3.06533 12.7654C4.35129 14.0513 6.09544 14.7738 7.91406 14.7738ZM7.91406 15.9166C5.79233 15.9166 3.7575 15.0738 2.25721 13.5735C0.756917 12.0732 -0.0859375 10.0384 -0.0859375 7.91663C-0.0859375 5.79489 0.756917 3.76006 2.25721 2.25977C3.7575 0.759481 5.79233 -0.083374 7.91406 -0.083374C10.0358 -0.083374 12.0706 0.759481 13.5709 2.25977C15.0712 3.76006 15.9141 5.79489 15.9141 7.91663C15.9141 10.0384 15.0712 12.0732 13.5709 13.5735C12.0706 15.0738 10.0358 15.9166 7.91406 15.9166Z" fill="#B41E38" />
                                </svg>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none", borderRight: "1px solid #EDEDED", padding: "4px 8px", fontFamily: "Calibri", fontSize: "14px" }}>{idx + 1}</TableCell>
                            <TableCell sx={{ borderBottom: "none", borderRight: "1px solid #EDEDED", padding: "4px 8px" }}>
                              {row.image && <img src={row.image} alt="" style={{ width: "24px", height: "24px", objectFit: "cover" }} />}
                            </TableCell>
                            {["stock_id", "location", "lot", "stone_code", "stone", "shape", "size", "color", "cutting", "quality", "clarity", "cer_type", "cer_no", "pcs", "weight", "price", "unit", "amount", "remark"].map(f => (
                              <TableCell key={f} sx={{ borderBottom: "none", borderRight: "1px solid #EDEDED", padding: "4px 8px" }}>
                                {["stock_id", "stone_code", "stone", "shape", "size", "color", "cutting", "quality", "clarity", "cer_type", "cer_no", "amount"].includes(f) ? (
                                  <Typography sx={{ fontFamily: "Calibri", fontSize: "14px" }}>{row[f]}</Typography>
                                ) : (
                                  <TextField
                                    size="small"
                                    value={row[f]}
                                    onChange={(e) => onUpdateTargetRow(row.id, f, e.target.value)}
                                    sx={{ "& .MuiInputBase-input": { padding: "4px 8px", fontSize: "13px", fontFamily: "Calibri" } }}
                                  />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </TableContainer>

              {/* Merge/Split Sum Row */}
              <Box sx={{ width: "100%", bgcolor: "#F2F2F2", border: "1px solid #EDEDED", borderTop: "none", borderRadius: "0 0 4px 4px", display: "flex", alignItems: "center", height: "32px", overflowX: "auto" }}>
                <Box sx={{ display: "flex", minWidth: "max-content" }}>
                  <Box sx={{ width: "32px", borderRight: "1px solid #EDEDED" }} /> {/* " " */}
                  <Box sx={{ width: "32px", borderRight: "1px solid #EDEDED" }} /> {/* # */}
                  <Box sx={{ width: "32px", borderRight: "1px solid #EDEDED" }} /> {/* Img */}
                  <Box sx={{ width: "120px", borderRight: "1px solid #EDEDED" }} /> {/* Stock ID */}
                  <Box sx={{ width: "120px", borderRight: "1px solid #EDEDED" }} /> {/* Location */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Lot */}
                  <Box sx={{ width: "120px", borderRight: "1px solid #EDEDED" }} /> {/* Stone Code */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Stone */}
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Shape */}
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Size */}
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Color */}
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Cutting */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Quality */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Clarity */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Cer Type */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED" }} /> {/* Cer No */}
                  <Box sx={{ width: "60px", borderRight: "1px solid #EDEDED", px: 1, fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", display: "flex", alignItems: "center" }}>{totalTargetPcs}</Box>
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED", px: 1, fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", display: "flex", alignItems: "center" }}>{totalTargetWeight.toFixed(3)}</Box>
                  <Box sx={{ width: "80px", borderRight: "1px solid #EDEDED" }} /> {/* Price */}
                  <Box sx={{ width: "60px", borderRight: "1px solid #EDEDED" }} /> {/* Unit */}
                  <Box sx={{ width: "100px", borderRight: "1px solid #EDEDED", px: 1, fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", display: "flex", alignItems: "center" }}>
                    {totalTargetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Box>
                  <Box sx={{ width: "120px", borderRight: "1px solid #EDEDED" }} /> {/* Remark */}
                </Box>
              </Box>

              <Button
                onClick={onAddTargetRow}
                startIcon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 12.998H13V17.998C13 18.2633 12.8946 18.5176 12.7071 18.7052C12.5196 18.8927 12.2652 18.998 12 18.998C11.7348 18.998 11.4804 18.8927 11.2929 18.7052C11.1054 18.5176 11 18.2633 11 17.998V12.998H6C5.73478 12.998 5.48043 12.8927 5.29289 12.7052C5.10536 12.5176 5 12.2633 5 11.998C5 11.7328 5.10536 11.4785 5.29289 11.2909C5.48043 11.1034 5.73478 10.998 6 10.998H11V5.99805C11 5.73283 11.1054 5.47848 11.2929 5.29094C11.4804 5.1034 11.7348 4.99805 12 4.99805C12.2652 4.99805 12.5196 5.1034 12.7071 5.29094C12.8946 5.47848 13 5.73283 13 5.99805V10.998H18C18.2652 10.998 18.5196 11.1034 18.7071 11.2909C18.8946 11.4785 19 11.7328 19 11.998C19 12.2633 18.8946 12.5176 18.7071 12.7052C18.5196 12.8927 18.2652 12.998 18 12.998Z" fill="#1B84FF" />
                  </svg>
                }
                sx={{
                  textTransform: "none",
                  fontSize: "18px",
                  fontFamily: "Calibri",
                  color: "#1B84FF",
                  fontWeight: 700,
                  marginTop: "5px",
                }}
              >
                Add Row
              </Button>
            </Box>
          </Box>


          {/* Footer Section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "20px" }}>
            <TextField
              label="Remark"
              placeholder="Write a comment..."
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ width: "600px", bgcolor: "#FFF", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />

            <Box sx={{ textAlign: "right", }}>
              <Typography sx={{ color: "#05595B", fontSize: "14px", fontWeight: 700, marginBottom: "8px", fontFamily: "Calibri" }}>Average Price Per Unit</Typography>
              <Box sx={{ display: "flex", gap: "60px", justifyContent: "flex-end" }}>
                <Box sx={{ width: "150px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri" }}>Original Price</Typography>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri" }}>For Pcs</Typography>
                    <Typography sx={{ color: "#000", fontSize: "12px", fontWeight: 700, fontFamily: "Calibri", marginLeft: "10px" }}>0.00</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri", visibility: "hidden" }}>Original Price</Typography>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri" }}>Per Cts</Typography>
                    <Typography sx={{ color: "#000", fontSize: "12px", fontWeight: 700, fontFamily: "Calibri", marginLeft: "10px" }}>0.00</Typography>
                  </Box>
                </Box>
                <Box sx={{ width: "150px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri" }}>New Stock</Typography>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri" }}>Per Pcs</Typography>
                    <Typography sx={{ color: "#000", fontSize: "12px", fontWeight: 700, fontFamily: "Calibri", marginLeft: "10px" }}>0.00</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "var(--HeadPage, #05595B)", fontSize: "12px", fontFamily: "Calibri" }}>Price</Typography>
                    <Typography sx={{ color: "#666", fontSize: "12px", fontFamily: "Calibri" }}>Per Cts</Typography>
                    <Typography sx={{ color: "#000", fontSize: "12px", fontWeight: 700, fontFamily: "Calibri", marginLeft: "10px" }}>0.00</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  );
};

export default MergeSplitBody;
