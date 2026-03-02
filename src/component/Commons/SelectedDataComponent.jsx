import React, { useEffect, useState, useMemo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import TableHeaderComponent from "./items/TableHeaderComponent";
import TableRowComponent from "./items/TableRowComponent";
import AddRowButtonComponent from "./items/AddRowButtonComponent";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import apiRequest from "../../helpers/apiHelper.js";
import { editMemoState } from "recoil/MemoState.js";
import { useRecoilState, useRecoilValue } from 'recoil';
import { tableRowsState, tableRowsDropdownData } from "recoil/state/CustomerState";
import ModalMemoPen from "component/Purchase/ModalMemoPen";






const SelectedDataComponent = ({
  state,
  handleAddRow,
  handleNumberChange,
  handleSelectChange,
  onRemarkChange,
  calculateAmount,
  calculateOtherPrice,
  handleDiscountPercenChangeInTalble,
  handleDiscountAmountChangeInTable,
  calculateAmountAfterDiscount,
  handleDelete,
  formatNumberWithCommas,
  onLotChange,
  onStoneChange,
  onChange
}) => {
  const [dropdownOptions, setDropdownOptions] = useState({});
  const editMemoStatus = useRecoilValue(editMemoState);

  const fetchData = async () => {
    try {
      const data = await apiRequest("GET", "/master/all", {}, {});
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const [rows, setRows] = useRecoilState(tableRowsState);
  const [allDropdownOptions, setAllDropdownOptions] = useRecoilState(tableRowsDropdownData);

  useEffect(() => {
    fetchData().then((data) => {
      setAllDropdownOptions(data);
    });
  }, []);

  const dropdownOpts = useMemo(() => {
    const options = {
      stone: [], shape: [], size: [], color: [], cutting: [],
      quality: [], clarity: [], cerType: [], unit: [], labour: []
    };

    allDropdownOptions.forEach((item) => {
      switch (item.master_type) {
        case "master_stone_name":
          options.stone.push({ label: item.name, value: item.code });
          break;
        case "master_stone_size":
          options.size.push({ label: item.name, value: item.code });
          break;
        case "master_stone_color":
          options.color.push({ label: item.name, value: item.code });
          break;
        case "master_labour_type":
          options.labour.push({
            label: item.name,
            value: item.code,

          });
          options.unit.push({
            label: item.master_info?.price_pcs,
            value: item.master_info?.price_pcs,
          });
          break;

        case "master_stone_shape":
          options.shape.push({ label: item.name, value: item.code });
          break;
        case "master_stone_cutting":
          options.cutting.push({ label: item.name, value: item.code });
          break;
        case "master_stone_quality":
          options.quality.push({ label: item.name, value: item.code });
          break;
        case "master_stone_clarity":
          options.clarity.push({ label: item.name, value: item.code });
          break;
        case "master_certificate_type":
          options.cerType.push({ label: item.name, value: item.code });
          break;








        // Add other cases based on master_type
        default:
          break;
      }
    });

    return options;
  }, [allDropdownOptions]);

  useEffect(() => {
    setDropdownOptions(dropdownOpts);
  }, [dropdownOpts]);



  const headers = [

    { label: "", width: "15px" },
    { label: "#", width: "40px" },
    { label: "Pic", width: "40x" },

    { label: "Stone", width: "101px" },
    { label: "Shape", width: "200px" },
    { label: "Size", width: "92px" },
    { label: "Color", width: "190px" },
    { label: "Cutting", width: "110px" },
    { label: "Quality", width: "125px" },
    { label: "Clarity", width: "180px" },
    { label: "Cer Type", width: "130px" },
    { label: "CerNumber", width: "150px" },
    { label: "Pcs", width: "142px" },
    { label: "Wieght", width: "140px" },
    { label: "Price", width: "140px" },
    { label: "Unit", width: "140px" },
    { label: "Amount", width: "140px" },
    { label: "Discount(%)", width: "140px" },
    { label: "Discount Amt", width: "140px" },
    { label: "Total Amount", width: "130px" },
    { label: "Ref No.", width: "170px" },
    { label: "Labour", width: "150px" },

    { label: "Remark", width: "358px" },

  ];


  return (
    <>
      <Typography
        sx={{
          color: "var(--HeadPage, #05595B)",
          fontFamily: "Calibri",
          fontSize: "21px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
        }}
      >
        Item
      </Typography>
      <ModalMemoPen />

      <Box
        sx={{
          width: "1020px",
          alignItems: "flex-start",
          border: "1px solid var(--Line-Table, #C6C6C8)",
          borderRadius: "5px",
          bgcolor: "#FFF",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "294px",
            overflow: "scroll",
            "&::-webkit-scrollbar": {
              height: "5px",
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#FFF",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#919191",
              borderRadius: "5px",
            },
          }}
        >
          <Box>
            <TableHeaderComponent headers={headers} />
            {state.selectedItems.map((item, index) => (
              <TableRowComponent
                key={index}
                item={item}
                index={index}
                handleNumberChange={handleNumberChange}
                handleSelectChange={handleSelectChange}
                onChange={onChange}
                calculateAmount={calculateAmount}
                calculateOtherPrice={calculateOtherPrice}
                calculateAmountAfterDiscount={calculateAmountAfterDiscount}
                editMemoStatus={editMemoStatus}
                TableRowComponent={TableRowComponent}
                handleDelete={handleDelete}
                dropdownOptions={dropdownOptions}
                handleAddRow={handleAddRow}
                selectedItems={state.selectedItems}
              />
            ))}
          </Box>
        </Box>
      </Box>




      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "12px",
        }}
      >
        <AddRowButtonComponent handleAddRow={handleAddRow} />
      </Box>
      <TextField
        label="Remark"
        placeholder="This remark will be shown on document"
        onChange={(e) => onRemarkChange(e.target.value)}
        variant="outlined"
        InputLabelProps={{}}
        multiline
        rows={3}
        sx={{
          width: "1022px",
          "& .MuiOutlinedInput-root": { borderRadius: "8px" },
          marginTop: "24px",
          bgcolor: "#FFF",
        }}
      />
    </>
  );
};

export default SelectedDataComponent;