import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import ModalDayBook from "./ModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";
import { useRecoilState } from "recoil";
import { editMemoState, memoInfoState } from "recoil/MemoOut.js";

import { DayBookQuotationState } from "recoil/state/MemoOutState";

const MemoOutHeader = ({
  state,
  handleSaveMemo,
  setDueDate,
  handleEdit,
  open,
  setOpen,
  fsmState,
  hasUnsavedData,
}) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [editMemoStatus, setEditMemoStatus] = useRecoilState(editMemoState);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [isDisableDayBook, setIsDisableDayBook] = useState(false);
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );

  const getInventoryData = async () => {
    try {
      const response = await apiRequest("GET", "/memo-outs");
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
    setDayBookQuotation(selectedItems[0]);
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
            Memo Out
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              fsmState={fsmState}
              hasUnsavedData={hasUnsavedData}
              currentInvoiceId={memoInfo?._id || memoInfo?.id}
              isEditMode={editMemoStatus}
            />
          </Box>

        </Box>
      </Box>
    </>
  );
};

export default MemoOutHeader;
