import React, { useMemo } from "react";
import { Box, Typography, Grid, TextField, Skeleton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import MergeSplitSourceTable from "./MergeSplitSourceTable";
import MergeSplitTargetTable from "./MergeSplitTargetTable";

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.625 2.5V4.375M14.375 2.5V4.375M2.5 15.625V6.25C2.5 5.75272 2.69754 5.27581 3.04917 4.92417C3.40081 4.57254 3.87772 4.375 4.375 4.375H15.625C16.1223 4.375 16.5992 4.57254 16.9508 4.92417C17.3025 5.27581 17.5 5.75272 17.5 6.25V15.625M2.5 15.625C2.5 16.1223 2.69754 16.5992 3.04917 16.9508C3.40081 17.3025 3.87772 17.5 4.375 17.5H15.625C16.1223 17.5 16.5992 17.3025 16.9508 16.9508C17.3025 16.5992 17.5 16.1223 17.5 15.625M2.5 15.625V9.375C2.5 8.87772 2.69754 8.40081 3.04917 8.04917C3.40081 7.69754 3.87772 7.5 4.375 7.5H15.625C16.1223 7.5 16.5992 7.69754 16.9508 8.04917C17.3025 8.40081 17.5 8.87772 17.5 9.375V15.625M10 10.625H10.0067V10.6317H10V10.625ZM10 12.5H10.0067V12.5067H10V12.5ZM10 14.375H10.0067V14.3817H10V14.375ZM8.125 12.5H8.13167V12.5067H8.125V12.5ZM8.125 14.375H8.13167V14.3817H8.125V14.375ZM6.25 12.5H6.25667V12.5067H6.25V12.5ZM6.25 14.375H6.25667V14.3817H6.25V14.375ZM11.875 10.625H11.8817V10.6317H11.875V10.625ZM11.875 12.5H11.8817V12.5067H11.875V12.5ZM11.875 14.375H11.8817V14.3817H11.875V14.375ZM13.75 10.625H13.7567V10.6317H13.75V10.625ZM13.75 12.5H13.7567V12.5067H13.75V12.5Z" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
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
  onUpdateSourceRow,
  onRemoveTargetRow,
  dropdownOptions,
  disabled = false,
  onDaybookIconClick,
  showWarning,
  showErrors,
  isLoading
}) => {
  const sourceTotals = useMemo(() => ({
    pcs: sourceRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0),
    weight: sourceRows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0),
    amount: sourceRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  }), [sourceRows]);

  const targetTotals = useMemo(() => ({
    pcs: targetRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0),
    weight: targetRows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0),
    amount: targetRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  }), [targetRows]);

  return (
    <Box sx={{ backgroundColor: "#ffffff", width: "100%", maxWidth: "1632px", padding: "12px 24px 22px 24px", marginTop: "10px" }}>
      <Box sx={{ width: "100%", maxWidth: "1640px" }}>

        {/* Transaction Info - Following Load Structure */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "4px" }}>
          <Typography sx={{ lineHeight: "normal", color: "#9A9A9A", fontFamily: "Calibri", fontSize: "12px", fontWeight: 400 }}>
            Transaction Date : {dayjs().format("DD/MM/YYYY")} By : Super Admin
          </Typography>
          <Typography sx={{ lineHeight: "normal", color: "#9A9A9A", fontFamily: "Calibri", fontSize: "12px", fontWeight: 400, }}>
            Last Update : {dayjs().format("DD/MM/YYYY")} By : Super Admin
          </Typography>
        </Box>


        {/* Tables Section */}
        <Box sx={{ maxWidth: "1650px", width: "100%" }}>



          <Box sx={{
            maxWidth: "1650px",
            width: "100%",
            border: "1px solid var(--Line-Table, #C6C6C8)",
            bgcolor: "#F8F8F8",
          }}>

            <Grid sx={{ width: "100%", maxWidth: "1650px", padding: "16px 24px 15px 24px", borderRadius: "5px 5px 0px 0px", bgcolor: "#FFF", borderBottom: "1px solid #C6C6C8" }}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Typography sx={{ color: "#666", fontFamily: "Calibri", fontSize: "16px", lineHeight: "normal", fontWeight: 400 }}>
                    Merge/Split No. :
                  </Typography>
                  <Typography sx={{ color: "#05595B", fontFamily: "Calibri", fontSize: "28px", fontWeight: 400, lineHeight: "normal", marginTop: "2px" }}>
                    {isLoading ? (
                      <Skeleton variant="rounded" width={192} height={24} sx={{ borderRadius: "20px", background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)", animation: "pulse 1.5s ease-in-out infinite" }} />
                    ) : invoiceNo}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "15px", paddingLeft: "24px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date :"
                      value={docDate}
                      onChange={setDocDate}
                      disabled={disabled}
                      format="DD/MM/YYYY"
                      slots={{ openPickerIcon: CalendarIcon }}
                      slotProps={{
                        textField: {
                          required: true,
                          InputLabelProps: { shrink: true }
                        }
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#FFF",
                          width: "220px",
                          height: "42px",
                        },

                      }}
                    />
                  </LocalizationProvider>

                  <TextField
                    label="Ref. 1"
                    value={ref1}
                    onChange={(e) => setRef1(e.target.value)}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "350px",
                        height: "42px",
                      },

                    }}
                  />

                  <TextField
                    label="Ref. 2"
                    value={ref2}
                    onChange={(e) => setRef2(e.target.value)}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "350px",
                        height: "42px",
                      }
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Box sx={{ padding: "24px" }} >


              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Box>
                  <MergeSplitSourceTable
                    rows={sourceRows}
                    onUpdate={onUpdateSourceRow}
                    onRemove={onRemoveSourceRow}
                    onStockClick={onStockClick}
                    onSearchClick={onDaybookIconClick}
                    totals={sourceTotals}
                    disabled={disabled}
                    isLoading={isLoading}
                  />
                </Box>
                <Box>
                  <MergeSplitTargetTable
                    rows={targetRows}
                    onUpdate={onUpdateTargetRow}
                    onRemove={onRemoveTargetRow}
                    onAddRow={onAddTargetRow}
                    sourceTotals={sourceTotals}
                    targetTotals={targetTotals}
                    dropdownOptions={dropdownOptions}
                    disabled={disabled}
                    showErrors={showErrors}
                    isLoading={isLoading}
                  />
                </Box>
              </Box>

              {/* Footer Section: Remark & Price Calculations */}
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderRadius: "4px",
                bgcolor: "#FFF"
              }}>
                {/* Remark Section */}

                <TextField
                  placeholder="Write a comment..."
                  multiline
                  rows={3.5}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={disabled}

                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "1px solid #EDEDED" },
                      padding: "8px 12px",
                      width: "395px",
                      fontFamily: "Calibri",
                      height: " 105px",
                      fontSize: "16px",
                      color: "#666666",
                      fontWeight: 400
                    },
                  }}
                />


                {/* Price Calculations Section */}
                <Box sx={{ border: "1px solid #EDEDED", padding: "16px" }}>
                  <Typography sx={{ color: "#05595B", fontSize: "14px", fontWeight: 700, marginBottom: "8px", fontFamily: "Calibri", lineHeight: "normal" }}>
                    Average Price Per Unit
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {/* Original Price Stats */}
                    <Box sx={{ display: "flex", gap: "8px", paddingRight: "24px ", borderRight: "1px solid #EDEDED" }}>
                      <Typography sx={{ color: "#333", fontSize: "14px", fontFamily: "Calibri", fontWeight: 400 }}>
                        Original Price
                      </Typography>
                      <Box sx={{ width: "160px", }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0px 14px" }}>
                          <Typography sx={{ fontWeight: 400, lineHeight: "24px", color: "#343434", fontSize: "14px", fontFamily: "Calibri" }}>Per Pcs</Typography>
                          <Typography sx={{ lineHeight: "normal", color: "#343434", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri" }}>
                            {isLoading ? (
                              <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: "20px", background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)", animation: "pulse 1.5s ease-in-out infinite" }} />
                            ) : (
                              (sourceTotals.pcs > 0 ? (sourceTotals.amount / sourceTotals.pcs) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            )}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0px 14px" }}>
                          <Typography sx={{ fontWeight: 400, lineHeight: "24px", color: "#343434", fontSize: "14px", fontFamily: "Calibri" }}>Per Cts</Typography>
                          <Typography sx={{ lineHeight: "normal", color: "#343434", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri" }}>
                            {isLoading ? (
                              <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: "20px", background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)", animation: "pulse 1.5s ease-in-out infinite" }} />
                            ) : (
                              (sourceTotals.weight > 0 ? (sourceTotals.amount / sourceTotals.weight) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* New Stock Price Stats */}
                    <Box sx={{ display: "flex", paddingLeft: "24px " }}>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ color: "#343434", fontSize: "14px", fontFamily: "Calibri", fontWeight: 400 }}>New Stock</Typography>
                        <Typography sx={{ color: "#343434", fontSize: "14px", fontFamily: "Calibri", fontWeight: 400 }}>Price</Typography>
                      </Box>
                      <Box sx={{ width: "160px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0px 14px" }}>
                          <Typography sx={{ fontWeight: 400, lineHeight: "24px", color: "#343434", fontSize: "14px", fontFamily: "Calibri" }}>Per Pcs</Typography>
                          <Typography sx={{ lineHeight: "normal", color: "#343434", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri" }}>
                            {isLoading ? (
                              <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: "20px", background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)", animation: "pulse 1.5s ease-in-out infinite" }} />
                            ) : (
                              (targetTotals.pcs > 0 ? (targetTotals.amount / targetTotals.pcs) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            )}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0px 14px" }}>
                          <Typography sx={{ fontWeight: 400, lineHeight: "24px", color: "#343434", fontSize: "14px", fontFamily: "Calibri" }}>Per Cts</Typography>
                          <Typography sx={{ lineHeight: "normal", color: "#343434", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri" }}>
                            {isLoading ? (
                              <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: "20px", background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)", animation: "pulse 1.5s ease-in-out infinite" }} />
                            ) : (
                              (targetTotals.weight > 0 ? (targetTotals.amount / targetTotals.weight) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

            </Box>
          </Box>






        </Box>
      </Box>
    </Box>

  );
};

export default MergeSplitBody;
