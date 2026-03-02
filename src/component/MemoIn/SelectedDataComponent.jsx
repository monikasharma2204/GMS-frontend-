import React, { useEffect, useState, useMemo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import TableHeaderComponent from "./items/TableHeaderComponent";
import TableForTotalComponent from "./items/TableForTotalComponent";
import TableRowComponent from "./items/TableRowComponent";
import AddRowButtonComponent from "./items/AddRowButtonComponent";
import useEffectOnce from "../../hooks/useEffectOnce.jsx";
import apiRequest from "../../helpers/apiHelper.js";
import { editMemoState } from "recoil/MemoIn/MemoState.js";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  QuotationtableRowsState,
  QuotationtableRowsDropdownData,
} from "recoil/MemoIn/MemoInState";
import MemoInModalFromStock from "./MemoInModalFromStock";
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
  isApproved = false,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [allDropdownOptions, setAllDropdownOptions] = useState([]);
  const editMemoStatus = useRecoilValue(editMemoState);

  const fetchData = async () => {
    try {
      const data = await apiRequest("GET", "/master/all", {}, {});
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  
    // Function to handle shape change and update size options
    const handleShapeChange = async (rowIndex, shapeName) => {
      try {
       
        // Update the shape in the row
        onChange(rowIndex, "shape", shapeName);
        
        // Clear the size field for this row
        onChange(rowIndex, "size", "");
        
        // Wait for allDropdownOptions to be loaded if it's not ready
        if (allDropdownOptions.length === 0) {
          console.log("Waiting for dropdown options to load...");
          const data = await fetchData();
          setAllDropdownOptions(data);
          // Wait a bit for state to update
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (shapeName) {
          // Find the shape code from the name
          const shapeData = allDropdownOptions.find(item => 
            item.master_type === "master_stone_shape" && 
            item.name === shapeName
          );
          
          if (shapeData && shapeData.master_info && shapeData.master_info.size_ids) {
            console.log("Size IDs from shape:", shapeData.master_info.size_ids);
            
            // Get all size data and filter by the size_ids
            const allSizes = allDropdownOptions.filter(item => 
              item.master_type === "master_stone_size" && 
              item.master_status === "active" &&
              shapeData.master_info.size_ids.includes(item._id)
            );
            
            console.log("Sizes for shape:", allSizes);
            
            // Update dropdown options with the new sizes
            setDropdownOptions(prevOptions => {
              const newSizeOptions = allSizes.map(size => ({ label: size.name, value: size.code }));
              console.log("New size options:", newSizeOptions);
              return {
                ...prevOptions,
                size: newSizeOptions
              };
            });
          } else {
            // If no shape data found, show all sizes
            const allSizes = allDropdownOptions.filter(item => item.master_type === "master_stone_size" && item.master_status === "active");
            console.log("All sizes when no shape data found:", allSizes);
            setDropdownOptions(prevOptions => ({
              ...prevOptions,
              size: allSizes.map(size => ({ label: size.name, value: size.code }))
            }));
          }
        } else {
          // If no shape selected, show all sizes
          const allSizes = allDropdownOptions.filter(item => item.master_type === "master_stone_size" && item.master_status === "active");
          console.log("All sizes when no shape selected:", allSizes);
          setDropdownOptions(prevOptions => ({
            ...prevOptions,
            size: allSizes.map(size => ({ label: size.name, value: size.code }))
          }));
        }
      } catch (error) {
        console.error("Error handling shape change:", error);
      }
    };

  // const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  // console.log(rows,"rows");
  // const [allDropdownOptions, setAllDropdownOptions] = useRecoilState(
  //   QuotationtableRowsDropdownData
  // );

  useEffect(() => {
    fetchData().then((data) => {
      setAllDropdownOptions(data);
    });
  }, []);

  const handleStockSubmit = (selectedStockRows) => {
    if (triggerFSMDirty) {
      triggerFSMDirty();
    }
    // Map the stock data to match your table structure
    const newRows = selectedStockRows.map((stockRow) => {
      const imageUrl = stockRow.image
        ? (/^https?:\/\//.test(stockRow.image) ? stockRow.image : `${API_URL}${stockRow.image}`)
        : null;
      return ({
      stone_code: stockRow.stone_code,
      stock_id: stockRow._id, 
      account:stockRow.account,
      _id:stockRow._id,
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
      lot: stockRow.lot_no,
      pcs: stockRow.pcs,
      weight: stockRow.weight,
      weight_per_piece: stockRow.weight_per_piece,
      price: stockRow.price,
      unit: stockRow.unit_price,
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

    // Add the new rows to existing rows
    setRows((prevRows) => [...prevRows, ...newRows]);
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

  // Initialize size options with all available sizes when component loads
  useEffect(() => {
    if (allDropdownOptions.length > 0) {
      const allSizes = allDropdownOptions.filter(item => 
        item.master_type === "master_stone_size" && 
        item.master_status === "active"
      );
      
      if (allSizes.length > 0) {
        setDropdownOptions(prevOptions => ({
          ...prevOptions,
          size: allSizes.map(size => ({ label: size.name, value: size.code }))
        }));
      }
    }
  }, [allDropdownOptions]);

  const headers = [
   { label: "", width: "20px" , className: "sticky-col-5 sticky-col"},
    { label: "#", width: "40px" ,  className: "sticky-col-1 sticky-col " },
    { label: "Pic", width: "40px" , className: "sticky-col-2 sticky-col " },
    { label: "Lot", width: "142px" , className: "sticky-col-3 sticky-col " },
    // { label: "Stone Code", width: "165px" },
 { label: "Stone", width: "142px" , className: "sticky-col-4 sticky-col  "},
    { label: "Shape", width: "142px" ,className : "sticky-col sticky-col-6" },
    { label: "Size", width: "142px" },
    { label: "Color", width: "142px" },
    { label: "Cutting", width: "142px" },
    { label: "Quality", width: "142px" },
    { label: "Clarity", width: "142px" },
    { label: "Cer Type", width: "142px" },
    { label: "CerNumber", width: "142px" },
    // { label: "location", width: "150px" },
    // { label: "type", width: "120px" },

    { label: "Pcs", width: "142px" },
    // { label: "Wt/Pc", width: "142px" },
    { label: "Weight", width: "142px" },
    { label: "Price", width: "142px" },
    { label: "Unit", width: "142px" },
    { label: "Amount", width: "142px" },
    { label: "Discount(%)", width: "142px" },
    { label: "Discount Amt", width: "142px" },
    { label: "Total Amount", width: "142px" },
    { label: "Ref No", width: "142px" },
    // { label: "Labour", width: "150px" },
    // { label: "Labour Price", width: "130px" },
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
        <MemoInModalFromStock handleSubmit={handleStockSubmit} disabled={disabled} isApproved={isApproved} />
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
                //  height: "200px", overflowX: "hidden", overflowY: "scroll"
                minHeight: "200px"
                 }}
              className="pikachuuuu"
            >
              {rows.map((item, index) => (
                <TableRowComponent
                  disabled={disabled}
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
                  handleShapeChange={handleShapeChange}
                    formatNumberWithCommas={formatNumberWithCommas}
                />
              ))}
            </Box>

            <TableForTotalComponent parentHeight={278}   formatNumberWithCommas={formatNumberWithCommas} />
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
        <AddRowButtonComponent handleAddRow={handleAddRow} disabled={disabled || isApproved} />
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
