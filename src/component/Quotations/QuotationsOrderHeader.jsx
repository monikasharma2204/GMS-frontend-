import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import ModalDayBook from "./ModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";
import { useRecoilState } from "recoil";
import { editMemoState, memoInfoState } from "recoil/MemoState.js";

import { DayBookQuotationState } from "recoil/state/QuotationState";

const QuotationsOrderHeader = ({
  state,
  handleSaveMemo,
  setDueDate,
  handleEdit,
  handleDataSelection,
  handleDayBookOpen,
  hasUnsavedQuotationData,
  open,
  setOpen,  
}) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [editMemoStatus, setEditMemoStatus] = useRecoilState(editMemoState);
  const [memoInfo] = useRecoilState(memoInfoState);
  const [isDisableDayBook, setIsDisableDayBook] = useState(false);
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );

  const getInventoryData = async () => {
    try {
      const response = await apiRequest("GET", "/quotations");
      console.log(response, "response day ");
      const inventoryData = response.map((el) => {
        return {
          ...el,
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
    if(open){
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
    console.log("account", selectedItems[0].account);
    console.log("selectedItems", selectedItems);

    setIsDisableDayBook(true);
    
    
    if (handleDataSelection && selectedItems[0]) {
      handleDataSelection(selectedItems[0]);
    }
    
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
            Quotation
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
              handleDayBookOpen={handleDayBookOpen}
              hasUnsavedData={hasUnsavedQuotationData}
              handleDataSelection={handleDataSelection}
              open={open}
              setOpen={setOpen}
              currentInvoiceId={memoInfo?._id || memoInfo?.id}
              isEditMode={editMemoStatus}
            />
          </Box>

      
          
        </Box>
      </Box>
    </>
  );
};

export default QuotationsOrderHeader;
