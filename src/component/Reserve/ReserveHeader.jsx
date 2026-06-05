import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import ModalDayBook from "./ModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";
import { useRecoilState } from "recoil";
import { editMemoState, memoInfoState } from "recoil/Reserve/MemoState.js";
import ApprovalModal from "../Commons/ApprovalModal";
import SuccessModal from "../Commons/SuccessModal";

import { DayBookQuotationState } from "recoil/Reserve/ReserveState";

const SalerHeader = ({
  state,
  handleSaveMemo,
  setDueDate,
  handleEdit,
  open,
  setOpen,
  hasUnsavedData,
  handleDataSelection,
}) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [editMemoStatus, setEditMemoStatus] = useRecoilState(editMemoState);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [isDisableDayBook, setIsDisableDayBook] = useState(false);
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );
  const [isOpenApprovalModal, setIsOpenApprovalModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [currentReserveId, setCurrentReserveId] = useState(null);


  const getInventoryData = async () => {
    try {
      const response = await apiRequest("GET", "/reserves");
      const inventoryData = response.map((el) => {
        return {
          ...el,
          vendor_code_id: el.vendor_code_id, // add vendor_code_id here
          inventory_item: el.items.map((inventory) => {
            return {
              ...inventory,
            };
          }),
        };
      });

      setInventoryData(inventoryData);
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    if (open) {
      getInventoryData();
    }

  }, [open]);

  // reflect memoInfo into approve button state
  useEffect(() => {
    if (memoInfo?.id) {
      setCurrentReserveId(memoInfo.id);
      const statusValue = typeof memoInfo?.status === 'string' ? memoInfo.status.toLowerCase() : '';
      const statusApproveValue = typeof memoInfo?.status_approve === 'string' ? memoInfo.status_approve.toLowerCase() : '';
      setIsApproved(statusValue === "approved" || statusApproveValue === "approved");
    } else {
      setCurrentReserveId(null);
      setIsApproved(false);
    }
  }, [memoInfo]);

  // auto close success dialog
  useEffect(() => {
    if (isOpenSuccessModal) {
      const t = setTimeout(() => setIsOpenSuccessModal(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isOpenSuccessModal]);

  const handleCheckboxChange = (inventory) => {
    const newInventoryData = inventoryData.map((item) => {
      if (item._id == inventory._id) {
        return {
          ...item,
          checked: !inventory.checked,
        };
      } else {
        return item;
      }
    });
    setInventoryData(newInventoryData);
  };

  const handleDayBookSubmit = () => {
    const inventoryDataSelected = [];
    console.log(inventoryData, "jjkkjj");
    inventoryData.map((item) => {
      return item.inventory_item
        .filter((el) => el.checked)
        .map((inventory) => {
          const inventoryData = {
            ...item,
            ...inventory,
            lot_no: inventory.lot_no,
            stone: inventory.stone,
            size: inventory.size,
            color: inventory.color,
            cutting: inventory.cutting,
            quality: inventory.quality,
            clarity: inventory.clarity,
            cer_type: inventory.cer_type,
            cer_no: inventory.cer_no,
            disabled: true,
          };
          delete inventoryData.inventory_item;
          // inventoryDataSelected.push(inventoryData)
          inventoryDataSelected[0] = inventoryData;
        });
    });

    let selectedItems = state.selectedItems;
    selectedItems.filter(
      (el) =>
        !el._id || inventoryDataSelected.map((el) => el._id).includes(el._id)
    );

    const remainSelected = inventoryDataSelected.filter(
      (el) => !selectedItems.map((el) => el._id).includes(el._id)
    );
    selectedItems = selectedItems.concat(remainSelected);

    // setDueDate(doc_date)
    setDayBookQuotation(selectedItems[0]);
    console.log("account", selectedItems[0].account);
    console.log("selectedItems", selectedItems);

    setIsDisableDayBook(true);
    handleSaveMemo(selectedItems);
  };
  const calculateSums = (dataArray) =>
    dataArray.reduce(
      (totals, item) => {
        totals.weight += item.weight || 0;
        totals.pcs += item.pcs || 0;
        totals.amount += item.amount || 0;
        return totals;
      },
      { amount: 0, pcs: 0, weight: 0 }
    );

  return (
    <>
      <Box
        sx={{
          width: "1697px",
          height: "64px",
          flexShrink: 0,
          backgroundColor: "#FFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
        }}
      >
        <Box
          sx={{
            width: "388px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#05595B",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginLeft: "32px",
            }}
          >
            Reserve (Order)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Approve button */}
          <Box sx={{ marginRight: "12px" }}>
            <Button
              disabled={!currentReserveId || isApproved || editMemoStatus}
              onClick={() => {
                if (currentReserveId && !isApproved && !editMemoStatus) {
                  setIsOpenApprovalModal(true);
                }
              }}
              sx={{
                textTransform: "none",
                height: "35px",
                width: "100px",
                padding: "12px",
                borderRadius: "4px",
                gap: "8px",
                backgroundColor: (!currentReserveId || editMemoStatus)
                  ? "#E6E6E6"
                  : isApproved
                    ? "#00AA3A33"
                    : "#C6A96933",
                border: (!currentReserveId || editMemoStatus)
                  ? "1px solid #BFBFBF"
                  : isApproved
                    ? "1px solid #00AA3A80"
                    : "1px solid #C6A96980",
                color: (!currentReserveId || editMemoStatus)
                  ? "#57646E"
                  : isApproved
                    ? "#00AA3A"
                    : "#C6A969",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "1px",
                "&:hover": {
                  backgroundColor: (!currentReserveId || editMemoStatus)
                    ? "#E6E6E6"
                    : isApproved
                      ? "#00AA3A33"
                      : "#C6A96933",
                },
                "&.Mui-disabled": {
                  backgroundColor: (!currentReserveId || editMemoStatus)
                    ? "#E6E6E6"
                    : isApproved
                      ? "#00AA3A33"
                      : "#C6A96933",
                  color: (!currentReserveId || editMemoStatus)
                    ? "#57646E"
                    : isApproved
                      ? "#00AA3A"
                      : "#C6A969",
                  border: (!currentReserveId || editMemoStatus)
                    ? "1px solid #BFBFBF"
                    : isApproved
                      ? "1px solid #00AA3A80"
                      : "1px solid #C6A96980",
                },
              }}
            >
              {isApproved ? "Approved" : "Approve"}
            </Button>
          </Box>

          <Box>
            <ModalDayBook
              data={inventoryData}
              handleEdit={handleEdit}
              state={state}
              handleCheckboxChange={handleCheckboxChange}
              handleSubmit={handleDayBookSubmit}
              setDueDate={setDueDate}
              isDisableDayBook={isDisableDayBook}
              calculateSums={calculateSums}
              open={open}
              setOpen={setOpen}
              hasUnsavedData={hasUnsavedData}
              handleDataSelection={handleDataSelection}
              currentInvoiceId={memoInfo?._id || memoInfo?.id}
              isEditMode={editMemoStatus}
            />
          </Box>


        </Box>
      </Box>

      {/* Approval Confirmation Modal */}
      <ApprovalModal
        open={isOpenApprovalModal}
        onClose={() => setIsOpenApprovalModal(false)}
        onConfirm={async () => {
          setIsOpenApprovalModal(false);
          try {
            const resp = await apiRequest("PUT", `/reserves/${currentReserveId}/approve`, { status: "approved", invoice_no: memoInfo?.invoice_no || "" });
            if (resp) {
              setIsApproved(true);
              setMemoInfo(prev => ({ ...prev, status: "approved", status_approve: "approved" }));
              setIsOpenSuccessModal(true);
              // Refresh the page after showing success modal (2.5 seconds delay)
              setTimeout(() => {
                window.location.reload();
              }, 2500);
            }
          } catch (e) { }
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        open={isOpenSuccessModal}
        onClose={() => setIsOpenSuccessModal(false)}
      />
    </>
  );
};

export default SalerHeader;
