import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import ModalDayBook from "./ModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";
import { useRecoilState } from "recoil";
import { editMemoState, memoInfoState } from "recoil/MemoOutReturn/MemoState.js";
import { QuotationtableRowsState } from "recoil/MemoOutReturn/MemoReturn";

import { DayBookQuotationState } from "recoil/MemoOutReturn/MemoReturn";

const MemoOutReturnHeader = ({
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
  const [isDisableDayBook, setIsDisableDayBook] = useState(false);
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);

  const getInventoryData = async () => {
    try {
      const response = await apiRequest("GET", "/memo-out-returns");

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

      memo_out_id: stockRow.memo_out_id,
      memo_out_item_id: stockRow._id,
      _id: stockRow._id,
      stone_code: stockRow.stone_code,
      stock_id: stockRow.stock_id,
      account: stockRow.account,
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
      type: stockRow.type,
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

    console.log(newRows, "newwwww")


    // Add the new rows to existing rows
    setRows((prevRows) => [...prevRows, ...newRows]);

    // Capture the single memo_out_id from the selected rows for POST save
    const uniqueMemoOutIds = Array.from(new Set((selectedStockRows || []).map(r => r.memo_out_id).filter(Boolean)));
    if (uniqueMemoOutIds.length === 1) {
      setMemoInfo(prev => ({ ...prev, memo_out_id: uniqueMemoOutIds[0] }));
    }
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
            Memo Out Return
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

export default MemoOutReturnHeader;
