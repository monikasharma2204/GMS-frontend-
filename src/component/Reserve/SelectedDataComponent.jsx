import React, { useEffect, useState, useMemo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import TableHeaderComponent from "./items/TableHeaderComponent";
import TableForTotalComponent from "./items/TableForTotalComponent";
import TableRowComponent from "./items/TableRowComponent";
import AddRowButtonComponent from "./items/AddRowButtonComponent";
import apiRequest from "../../helpers/apiHelper.js";
import { editMemoState } from "recoil/Reserve/MemoState.js";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  QuotationtableRowsState,
  QuotationtableRowsDropdownData,
} from "recoil/Reserve/ReserveState";
import QuotationModalFromStock from "./QuotationModalFromStock";
import { API_URL } from "config/config.js";



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
  onChange,
  rows,
  setRows,
  remark,
  disabled = false,
  triggerFSMDirty,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState({});
  const editMemoStatus = useRecoilValue(editMemoState);

  const [rowData, setRowData] = useState([])

  const fetchData = async () => {
    try {
      const data = await apiRequest("GET", "/master/all", {}, {});
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  // const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  // console.log(rows,"rows");
  const [allDropdownOptions, setAllDropdownOptions] = useRecoilState(
    QuotationtableRowsDropdownData
  );

  useEffect(() => {
    fetchData().then((data) => {
      setAllDropdownOptions(data);
    });
  }, []);

  const handleStockSubmit = (selectedStockRows) => {
    // Map the stock data to match your table structure
    const newRows = selectedStockRows.map((stockRow, index) => {
      const imageUrl = stockRow.image
        ? (/^https?:\/\//.test(stockRow.image) ? stockRow.image : `${API_URL}${stockRow.image}`)
        : null;
      return ({
      _id: `stock_${stockRow._id}_${Date.now()}_${index}`, // Generate unique ID
      stock_id: stockRow.stock_id,
      stone_code: stockRow.stone_code,
      account:stockRow.account,
    id: stockRow._id,
      stone: stockRow.stone,
      shape: stockRow.shape,
      size: stockRow.size,
      color: stockRow.color,
      cutting: stockRow.cutting,
      quality: stockRow.quality,
      clarity: stockRow.clarity,
      cer_type: stockRow.cer_type,
      cer_no: stockRow.cer_no,
      location: stockRow.location_name || stockRow.location, // Use location_name if available, fallback to location ID
      type: stockRow.type,
      lot_no: stockRow.lot_no,
      pcs: stockRow.pcs,
      weight: stockRow.weight,
      // Conditional pricing: Use price for Cons. type, sale_price for Pmr. type
      price: stockRow.type === "Cons." ? stockRow.price : stockRow.sale_price,
      unit: stockRow.unit,
      amount: stockRow.amount,
      remark: stockRow.remark,
      // Add any other fields needed with default values
      discount_percent: 0,
      discount_amount: 0,
      totalAmount: stockRow.amount,
      labour: "",
      labour_price: 0,
      isFromStock:true,
      image: stockRow.image || null, // relative path for saving
      image_preview: imageUrl, // absolute for display
    })});


    setRows((prevRows) => {
      
      const existingStockIds = new Set(
        prevRows
          .filter(row => row.isFromStock && (row.id || row.stock_id)) // Only check rows from stock that have an ID
          .map(row => row.id || row.stock_id) // Use id (original stock _id) or stock_id
      );
      
      // Filter out rows that already exist in the table (only check stock items)
      const uniqueNewRows = newRows.filter(
        (newRow) => {
          
          if (newRow.isFromStock) {
            return !existingStockIds.has(newRow.id) && !existingStockIds.has(newRow.stock_id);
          }
         
          return true;
        }
      );
      
    
      return [...prevRows, ...uniqueNewRows];
    });
  
    if (triggerFSMDirty) {
      triggerFSMDirty();
    }
  };
  const dropdownOpts = useMemo(() => {
    const options = {
      stone: [],
      shape: [],
      size: [],
      color: [],
      cutting: [],
      quality: [],
      clarity: [],
      cerType: [],
      unit: [
        { label: "Cts", value: "cts" },
        { label: "Pcs", value: "pcs" },
      ],
      labour: [],
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
          // options.unit.push({
          //   label: item.master_info?.price_pcs,
          //   value: item.master_info?.price_pcs,
          // });
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
    { label: "", width: "20px" , className: "sticky-col-5 sticky-col "},
    { label: "#", width: "40px" , className: "sticky-col-1 sticky-col " },
    { label: "Pic", width: "40px"  , className: "sticky-col-2 sticky-col " },
    { label: "Stock ID", width: "142px", className: "sticky-col-3 sticky-col "  },
    { label: "Stone Code", width: "142px",  className: "sticky-col-4 sticky-col  " },
    { label: "Stone", width: "142px"  , className : "sticky-col sticky-col-6" },
    { label: "Shape", width: "142px"  , className: "sticky-col sticky-col-7" },
    { label: "Size", width: "142px" },
    { label: "Color", width: "142px" },
    { label: "Cutting", width: "142px" },
    { label: "Quality", width: "142px" },
    { label: "Clarity", width: "142px" },
    { label: "Cer Type", width: "142px" },
    { label: "CerNumber", width: "142px" },
    { label: "location", width: "142px" },
     { label: "Type", width: "142px" },
    { label: "lot", width: "142px" },
    { label: "Pcs", width: "142px" },
    // { label: "Wt/Pc", width: "142px" },
    { label: "Weight", width: "142px" },
    { label: "Sale Price", width: "142px" },
    { label: "Unit", width: "142px" },
    { label: "Amount", width: "142px" },
    { label: "Discount(%)", width: "142px" },
    { label: "Discount Amt", width: "142px" },
    { label: "Total Amount", width: "142px" },
    { label: "Labour", width: "142px" },
    { label: "Labour Price", width: "142px" },
    { label: "Remark", width: "358px" },
  ];

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        <QuotationModalFromStock rowData={rowData} setRowData={setRowData} handleSubmit={handleStockSubmit} disabled={disabled} />
      </Box>

      <Box
        sx={{
          height: "294px",
          overflowX: "scroll",
          overflowY: "scroll",
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


          <Box
            sx={{
              position: "relative",
              minHeight: "278px",
            }}
          >
            <TableHeaderComponent headers={headers} />
            <Box
              sx={{ 
                // height: "200px", height: "200px", overflowX : "hidden", overflowY : "scroll" 
                minHeight: "200px"
              }}
              className="pikachuuuu"
            >
              {rows.map((item, index) => (
                <TableRowComponent
                  key={index}
                  item={item || {}}
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
                  rows={rows}
                  setRows={setRows}
                  rowData={rowData}
                  disabled={disabled}
                  triggerFSMDirty={triggerFSMDirty}
                  formatNumberWithCommas={formatNumberWithCommas}
                />
              ))}
            </Box>

            <TableForTotalComponent parentHeight={278} formatNumberWithCommas={formatNumberWithCommas} />
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
        <AddRowButtonComponent handleAddRow={handleAddRow} disabled={disabled} />
      </Box>
      <TextField
        label="Remark"
        value={remark}
        placeholder="This remark will be shown on document"
        onChange={(e) => onRemarkChange(e.target.value)}
        variant="outlined"
        disabled={disabled}
        InputLabelProps={{}}
        multiline
        rows={3}
        sx={{
          width: "1022px",
          "& .MuiOutlinedInput-root": { borderRadius: "8px" },
          marginTop: "5px",
          bgcolor: "#FFF",
          textAlign: "left",
        }}
      />
    </>
  );
};

export default SelectedDataComponent;
