import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Typography, Grid, TextField } from "@mui/material";
import Account from "./Account";
import SelectedDataComponent1 from "./SelectedDataComponent1";
import SelectedDataComponent2 from "./SelectedDataComponent2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Ref1 from "./Ref1";
import Ref2 from "./Ref2";
import moment from "moment";
import apiRequest from "../../helpers/apiHelper.js";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import { memoInfoState } from "recoil/Load/MemoState";
import { useRecoilState } from "recoil";

const InventoryLoadBody = React.forwardRef(
  (
    {
      state = {},
      handleAddRow = () => { },
      handleNumberChange = () => { },
      handleSelectChange = () => { },
      calculateAmount = () => 0,
      calculateOtherPrice = () => 0,
      handleDiscountPercenChangeInTalble = () => { },
      handleDiscountAmountChangeInTable = () => { },
      calculateAmountAfterDiscount = () => 0,
      handleDelete = () => { },

      onRemarkChange = () => { },

      onCurrencyChange = () => { },

      onAccountChange = () => { },
      onLotChange = () => { },
      onStoneChange = () => { },
      onChange = () => { },
      rows = [],
      setRows = () => { },
      loadItems = [],
      isFromDayBook = false,
      isApproved = false,
      memoInfo: propMemoInfo,
      docDate,
      dueDate,
      account,
      setAccount = () => { },
      ref1,
      ref2,
      note,
      remark,
      onRef1Change = () => { },
      onRef2Change = () => { },
      onNoteChange = () => { },
      operationType: propOperationType = null,
      selectedPUItems = [],
      setSelectedPUItems = () => { },
      isEditMode = false,
      fsmState = "initial",
      triggerFSMDirty = () => { },
      formatNumberWithCommas = { formatNumberWithCommas },
    },
    ref
  ) => {
    const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
    const currentMemoInfo = propMemoInfo || memoInfo;
    React.useEffect(() => { }, [currentMemoInfo]);


    const shouldDisableFields = isApproved || fsmState === "saved";
    const [secondSectionRows, setSecondSectionRows] = useState([]);
    const selectedDataComponent2Ref = React.useRef();
    const [operationType, setOperationType] = useState(
      propOperationType || null
    );
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [isManualAdd, setIsManualAdd] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState("L-10022");


    React.useEffect(() => {
      if (propOperationType) {
        setOperationType(propOperationType);
      }
    }, [propOperationType]);


    React.useEffect(() => { }, [rows, operationType]);


    React.useEffect(() => { }, [selectedRowIndex, operationType]);


    React.useEffect(() => {
      console.log('[InventoryLoadBody] loadItems changed, count:', loadItems?.length || 0);
      console.log('[InventoryLoadBody] Current secondSectionRows count:', secondSectionRows.length);
      console.log('[InventoryLoadBody] fsmState:', fsmState);

      if (loadItems && loadItems.length > 0) {
        console.log('[InventoryLoadBody] Setting secondSectionRows with', loadItems.length, 'items');
        console.log('[InventoryLoadBody] loadItems pu_item_ids:', loadItems.map(item => item.pu_item_id));
        setSecondSectionRows(() => {
          console.log('[InventoryLoadBody] Functional update: setting secondSectionRows to', loadItems.length, 'items');
          return loadItems;
        });
      } else if (loadItems && loadItems.length === 0) {
        if (fsmState === "saved" && secondSectionRows.length > 0) {
          console.log('[InventoryLoadBody] loadItems is empty but secondSectionRows has data, preserving (view mode)');
        } else {
          console.log('[InventoryLoadBody] Clearing secondSectionRows (add/edit mode, loadItems is empty)');
          setSecondSectionRows([]);
        }
      }
    }, [loadItems, isFromDayBook, fsmState]);


    const handleAddRowSecondSection = () => {
      setIsManualAdd(true);

      const selectedPUData =
        selectedRowIndex !== null && rows[selectedRowIndex]
          ? rows[selectedRowIndex]
          : null;


      if (!selectedPUData) {
        console.error(
          "No PU row selected! Please select a PU row first by clicking on the numbered buttons."
        );
        alert(
          "Please select a PU row first by clicking on the numbered buttons in the first section."
        );
        return;
      }

      const newRow = {
        _id: `load-row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pic: "",
        pu_id: selectedPUData?.pu_id || "",
        pu_item_id: selectedPUData?.pu_item_id || "",
        pu_no: selectedPUData?.invoice_no || selectedPUData?.pu_no || "",
        stone_code: selectedPUData
          ? `${selectedPUData.stone_master?.code || ""}${selectedPUData.shape_master?.code || ""
          }${selectedPUData.color_master?.code || ""}${selectedPUData.quality_master?.code || ""
          }${selectedPUData.clarity_master?.code || ""}`
          : "",
        location: "",
        stone: operationType === "merge" ? selectedPUData?.stone || "" : "",
        shape: operationType === "merge" ? selectedPUData?.shape || "" : "",
        size: operationType === "merge" ? selectedPUData?.size || "" : "",
        color: operationType === "merge" ? selectedPUData?.color || "" : "",
        cutting: operationType === "merge" ? selectedPUData?.cutting || "" : "",
        quality: operationType === "merge" ? selectedPUData?.quality || "" : "",
        clarity: operationType === "merge" ? selectedPUData?.clarity || "" : "",
        cer_type:
          operationType === "merge" ? selectedPUData?.cer_type || "" : "",
        cer_no: operationType === "merge" ? selectedPUData?.cer_no || "" : "",
        lot_no: operationType === "merge" ? selectedPUData?.lot_no || "" : "",
        pcs: operationType === "merge" ? selectedPUData?.pcs || "" : "",
        weight: selectedPUData?.weight || "",
        price: selectedPUData?.price || "",
        unit: selectedPUData?.unit || "",
        amount: selectedPUData?.amount || "",
        remark: "",
        totalAmount:
          selectedPUData?.totalAmount || selectedPUData?.amount || "",
        stock_price: "",
        stock_unit: "",
        stock_amount: 0,
        sale_price: "",
        sale_unit: "",
        sale_amount: 0,
      };


      setSecondSectionRows((prevRows) => [...prevRows, newRow]);
    };


    const handleDeleteSecondSection = (id) => {
      setSecondSectionRows((prevRows) =>
        prevRows.filter((row) => row._id !== id)
      );
    };

    const state1 = state?.selectedItems[0];

    const genInvoiceNo = async () => {
      try {
        const data = await apiRequest("GET", "/loads/next-invoice-no", {});

        const nextInvoiceNo = data.next_invoice_no || "L-10022";
        setInvoiceNumber(nextInvoiceNo);

        setMemoInfo(prev => ({
          ...prev,
          invoice_no: nextInvoiceNo,
        }));
      } catch (e) {
        // Handle error silently - keep default invoice number
      }
    };

    useEffectOnce(() => {
      genInvoiceNo();
    });

    React.useEffect(() => {
      onCurrencyChange(memoInfo?.currencyCode);
    }, [memoInfo?.currencyCode, onCurrencyChange]);


    React.useImperativeHandle(ref, () => ({
      getCurrentLoadItems() {
        // Get all load items from SelectedDataComponent2 and flatten them
        const allLoadItems = selectedDataComponent2Ref.current?.getAllLoadItems() || [];
        return allLoadItems;
      },

      genInvoiceNo() {
        genInvoiceNo();
      },

      getSavePayload() {
        let resolvedAccount = "";
        const acc = memoInfo?.account;
        if (typeof acc === "string") {
          resolvedAccount = acc;
        } else if (acc && typeof acc === "object") {
          resolvedAccount = acc.label || acc.code || "";
        }
        if (
          !resolvedAccount &&
          state &&
          state.selectedItems &&
          state.selectedItems[0]?.account
        ) {
          resolvedAccount = state.selectedItems[0]?.account;
        }

        const payload = {
          ...(operationType && { load_type: operationType }),
          account: resolvedAccount,
          doc_date: docDate || new Date(),
          due_date: dueDate || new Date(),
          ref_1: ref1 || "",
          ref_2: ref2 || "",
          note: note || "",
          pu_item:
            rows?.map((puRow) => {
              console.log("getSavePayload - puRow data:", {
                pcs: puRow.pcs,
                original_pcs: puRow.original_pcs,
                using_pcs: puRow.original_pcs || puRow.pcs,
                allKeys: Object.keys(puRow),
                hasOriginalPcs: "original_pcs" in puRow,
                originalPcsValue: puRow.original_pcs,
              });
              return {
                stone: puRow.stone || "",
                shape: puRow.shape || "",
                size: puRow.size || "",
                color: puRow.color || "",
                cutting: puRow.cutting || "",
                Quality: puRow.quality || "",
                clarity: puRow.clarity || "",
                pcs: Number(puRow.original_pcs || puRow.pcs) || 0,
                weight: Number(puRow.weight) || 0,
                price: Number(puRow.price) || 0,
                unit: puRow.unit || "",
                amount: Number(puRow.amount) || 0,
                Pu_no: puRow.pu_no || puRow.invoice_no || "",
              };
            }) || [],
          load_item: (() => {
            const allLoadItems =
              selectedDataComponent2Ref.current?.getAllLoadItems() || [];
            return allLoadItems;
          })().map((item) => {
            let payloadItem = {
              stock_id:
                item.stock_id ||
                `STK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              stone_code: item.stone_code || "",
              location: item.location || "",
              Pu_no: item.pu_no || item.Pu_no || item.invoice_no || "",
              stone: item.stone || "",
              shape: item.shape || "",
              size: item.size || "",
              color: item.color || "",
              cutting: item.cutting || "",
              quality: item.quality || "",
              clarity: item.clarity || "",
              cer_type: item.cer_type || "",
              cer_no: item.cer_no || "",
              lot_no: item.lot_no || "",
              pcs: Number(item.pcs) || 0,
              weight_per_piece: Number(item.weight_per_piece) || 0,
              weight: Number(item.weight) || 0,
              price: Number(item.price) || 0,
              stock_price: Number(item.stock_price) || 0,
              sale_price: Number(item.sale_price) || 0,
              unit: item.unit || "",
              stock_unit: item.stock_unit || "",
              sale_unit: item.sale_unit || "",
              amount: Number(item.amount) || 0,
              stock_amount: Number(item.stock_amount) || 0,
              sale_amount: Number(item.sale_amount) || 0,
              remark: item.remark || "",
              // carry image fields for multipart handling in parent
              image_preview: item.image_preview || null,
              imageFile: item.imageFile || undefined,
            };


            if (!item.imageFile) {
              payloadItem.image = item.image ? (() => {
                const img = item.image;
                if (typeof img === 'string' && /^https?:\/\/.+?\/uploads\//.test(img)) {
                  const match = img.match(/\/uploads\/.+$/);
                  return match ? match[0] : img;
                }
                return img;
              })() : null;
            }

            try {
              const isValidObjectId = typeof item._id === "string" && /^[0-9a-fA-F]{24}$/.test(item._id);
              if (isValidObjectId) {
                payloadItem._id = item._id;
              }
            } catch { }

            // Add PU references based on operation mode
            if (operationType === "merge") {
              // Merge mode: add pu_refs array with all PU references from first section
              if (rows && rows.length > 0) {
                const puRefs = rows
                  .filter((row) => row.pu_id && row.pu_item_id)
                  .map((row) => ({
                    pu_id: row.pu_id,
                    pu_item_id: row.pu_item_id,
                  }));
                if (puRefs.length > 0) {
                  payloadItem.pu_refs = puRefs;
                }
              }
            } else {
              // Normal mode: add individual pu_id and pu_item_id to each load item
              if (item.pu_id && item.pu_item_id) {
                payloadItem.pu_id = item.pu_id;
                payloadItem.pu_item_id = item.pu_item_id;
              }
            }

            return payloadItem;
          }),
        };

        return payload;
      },

      validateBeforeSave() {

        const firstSectionCount = rows?.length || 0;
        const allLoadItems =
          selectedDataComponent2Ref.current?.getAllLoadItems() || [];
        const secondSectionCount = allLoadItems.length;
        if (firstSectionCount > 0 && secondSectionCount === 0) {
          if (operationType === "merge") {
            return {
              isValid: false,
              message: "Please fill the stone field in the load section.",
            };
          }
        }

        if (!memoInfo?.account) {
          return {
            isValid: false,
            message: "Please fill required field: Account",
          };
        }
        if (
          operationType === "normal" &&
          !isFromDayBook &&
          firstSectionCount > 0 &&
          secondSectionCount < firstSectionCount
        ) {
          const missingLoadItems = [];
          for (let i = secondSectionCount; i < firstSectionCount; i++) {
            missingLoadItems.push(`Load ${i + 1}`);
          }
          return {
            isValid: false,
            message: `Please fill ${missingLoadItems.join(", ")}'s PCS, Weight`,
          };
        }


        const missingFields = [];

        if (!isFromDayBook || allLoadItems.length === 0) {
          for (let i = 0; i < allLoadItems.length; i++) {
            const item = allLoadItems[i];
            const loadItemNumber = i + 1;

            // Check required fields for each load item
            if (!item.pcs || item.pcs === "" || Number(item.pcs) <= 0) {
              missingFields.push(`PCS in Load ${loadItemNumber}`);
            }

            if (
              !item.weight ||
              item.weight === "" ||
              Number(item.weight) <= 0
            ) {
              missingFields.push(`Weight in Load ${loadItemNumber}`);
            }

            // In merge mode, stone is required (only check if stone is actually missing)
            if (
              operationType === "merge" &&
              (!item.stone || item.stone === "")
            ) {
              missingFields.push(`Stone`);
            }

            if (!item.location || item.location === "") {
              missingFields.push(`location`);
            }
          }
        }

        // 5. If there are missing fields, show them in popup
        if (missingFields.length > 0) {
          const uniqueMissingFields = [...new Set(missingFields)];
          return {
            isValid: false,
            message: `Please fill all required fields: ${uniqueMissingFields.join(
              ", "
            )}`,
          };
        }

        return {
          isValid: true,
          message: "",
        };
      },
    }));

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
                width: "1650px",
                padding: "24px 32px 24px 32px",
                borderRadius: "5px 5px 0px 0px",
                bgcolor: "#FFF",

              }}
            >
              <Box
                sx={{
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
                    Load No. :
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--HeadPage, #05595B)",
                      fontFamily: "Calibri",
                      fontSize: "28px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "1",
                      width: "170px",
                    }}
                  >
                    {currentMemoInfo?.invoice_no || invoiceNumber}
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
                      label="Doc Date :"
                      defaultValue={dayjs()}
                      format="DD/MM/YYYY"
                      disabled={shouldDisableFields}
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
                        marginLeft: "24px",
                      }}
                    />
                  </LocalizationProvider>
                  <Account
                    disabled={rows.length > 0 || shouldDisableFields}
                    memoInfo={currentMemoInfo}
                  />
                  <Ref1
                    onRef1Change={onRef1Change}
                    ref1={ref1}
                    disabled={shouldDisableFields}
                  />
                  <Ref2
                    onRef2Change={onRef2Change}
                    ref2={ref2}
                    disabled={shouldDisableFields}
                  />
                </Box>
              </Box>
            </Grid>

            <Box sx={{ display: "flex", width: "1650px" }}>
              <Box
                sx={{
                  width: "1584px",
                  padding: "0px 32px",
                  borderTop: "1px solid var(--Line-Table, #C6C6C8)",
                  borderLeft: "1px solid var(--Line-Table, #C6C6C8)",
                  borderRight: "1px solid var(--Line-Table, #C6C6C8)",
                  bgcolor: "#F8F8F8",
                  height: "617px",
                }}
              >
                <Box
                  sx={{
                    marginTop: "10px",
                  }}
                >
                  <SelectedDataComponent1
                    remark={remark}
                    state={state}
                    handleDelete={handleDelete}
                    rows={rows}
                    setRows={setRows}
                    operationType={operationType}
                    selectedRowIndex={selectedRowIndex}
                    setSelectedRowIndex={setSelectedRowIndex}
                    setOperationType={setOperationType}
                    setIsManualAdd={setIsManualAdd}
                    isApproved={isApproved}
                    disabledItems={selectedPUItems}
                    setSelectedPUItems={setSelectedPUItems}
                    fsmState={fsmState}
                    triggerFSMDirty={triggerFSMDirty}
                    disabled={shouldDisableFields}

                  />
                </Box>
                <Box
                  sx={{
                    marginTop: "5px",
                  }}
                >
                  <SelectedDataComponent2
                    ref={selectedDataComponent2Ref}
                    remark={remark}
                    state={state}
                    handleAddRow={handleAddRowSecondSection}
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
                    handleDelete={handleDeleteSecondSection}
                    formatNumberWithCommas={formatNumberWithCommas}
                    onLotChange={onLotChange}
                    onStoneChange={onStoneChange}
                    onChange={onChange}
                    rows={
                      // In view mode (saved), use loadItems directly if available
                      // Otherwise, use secondSectionRows, but ensure it's empty in add mode when loadItems is empty
                      fsmState === "saved" && loadItems && loadItems.length > 0
                        ? loadItems
                        : (fsmState !== "saved" && (!loadItems || loadItems.length === 0)
                          ? []
                          : secondSectionRows)
                    }
                    setRows={setSecondSectionRows}
                    firstSectionRows={rows}
                    selectedRowIndex={selectedRowIndex}
                    operationType={operationType}
                    setSelectedRowIndex={setSelectedRowIndex}
                    setOperationType={setOperationType}
                    isManualAdd={isManualAdd}
                    setIsManualAdd={setIsManualAdd}
                    isFromDayBook={isFromDayBook}
                    isApproved={isApproved}
                    isEditMode={isEditMode}
                    fsmState={fsmState}
                    triggerFSMDirty={triggerFSMDirty}
                    disabled={shouldDisableFields}
                  />
                </Box>

                <TextField
                  label="Remark"
                  placeholder="This remark will be shown on document"
                  variant="outlined"
                  value={note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  disabled={shouldDisableFields}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline
                  rows={2.5}
                  sx={{
                    width: "600px",
                    height: "80px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: "80px",
                    },
                    marginTop: "30px",
                    marginBottom: "85px",
                    bgcolor: "#FFF",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
);

export default InventoryLoadBody;
