import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import ModalDayBook from "./ModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";
import { useRecoilState } from "recoil";
import { editMemoState, memoInfoState } from "recoil/MemoReturn/MemoState.js";
import { QuotationtableRowsState } from "recoil/MemoReturn/MemoReturn";

import { DayBookQuotationState } from "recoil/MemoReturn/MemoReturn";

const MemoReturnHeader = ({
  state,
  handleSaveMemo,
  setDueDate,
  handleEdit,
  open,
  setOpen,
  fetchMemoIn,
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
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);

  const getInventoryData = async () => {
    try {
      const response = await apiRequest("GET", "/memo-returns");

      const inventoryData = response.map((el) => {
        return {
          ...el,
          vendor_code_id: el.vendor_code_id, // add vendor_code_id here
          inventory_item: el.items.map((inventory) => {
            return {
              ...inventory,
              // weight: Number(inventory.weight["$numberDecimal"]) || 0,
              // total_amount: Number(inventory.total_amount["$numberDecimal"]) || 0,
              // price: Number(inventory.price["$numberDecimal"]) || 0,
              // discount_percent: Number(inventory.discount_percent["$numberDecimal"]) || 0,
              // discount_amount: Number(inventory.discount_amount["$numberDecimal"]) || 0,
              // amount: Number(inventory.amount["$numberDecimal"]) || 0
            };
          }),
        };
      });

      setInventoryData(inventoryData);
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //     if(inventoryData.length > 0) {
  //       setIsDisableDayBook(true)
  //     }
  // }, [inventoryData])

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

    // {
    //   "code": "",
    //   "label": "",
    //   "invoiceAddress": [
    //     {
    //       "code": "",
    //       "label": ""
    //     }
    //   ],
    //   "shippingAddress": [
    //     {
    //       "code": "",
    //       "label": ""
    //     }
    //   ]
    // }

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

  const handleStockSubmit = (selectedStockRows = []) => {
    // Map the stock data to match your table structure
    const newRows = selectedStockRows?.map((stockRow) => ({
      stone_code: stockRow.stone_code,
      stock_id: stockRow.stock_id,
      account: stockRow.account,
      _id: stockRow._id,
      uniqueId: stockRow._id,
      stone: stockRow.stone,
      shape: stockRow.shape,
      size: stockRow.size,
      color: stockRow.color,
      cutting: stockRow.cutting,
      quality: stockRow.quality,
      clarity: stockRow.clarity,
      cer_type: stockRow.cer_type,
      cer_no: stockRow.cer_no,
      location: stockRow.location,
      type: stockRow.stock_type,
      lot_no: stockRow.lot_no,
      pcs: stockRow.pcs,
      weight: stockRow.weight,
      price: stockRow.price,
      unit: stockRow.unit,
      amount: stockRow.amount,
      remark: stockRow.remark,
      ref_no: stockRow.ref_no,
      // Add any other fields needed with default values
      discount_percent: stockRow.discount_percent,
      discount_amount: stockRow.discount_amount,
      totalAmount: stockRow.amount,
      labour: "",
      labour_price: 0,
      isFromMemoPending: true,
    }));

    // Add the new rows to existing rows
    setRows((prevRows) => [...prevRows, ...newRows]);
  };

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
            Memo Return
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <ModalDayBook
              data={inventoryData}
              handleEdit={handleEdit}
              fetchMemoIn={fetchMemoIn}
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
              editMemoStatus={editMemoStatus}
              currentInvoiceId={memoInfo?._id || memoInfo?.id}
              isEditMode={editMemoStatus}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MemoReturnHeader;
