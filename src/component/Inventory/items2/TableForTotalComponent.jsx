import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import { QuotationtableRowsState, QuotationtableRowsDropdownData } from "recoil/Load/LoadState";
import { useRecoilState } from "recoil";
import { formatNumberWithCommas } from "../../../helpers/numberHelper.js";

const TableForTotalComponent = ({ parentHeight, rows = [] }) => {

  

    const [position, setPosition] = useState("absolute");
    const [totalPcs, setTotalPcs] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalStockAmount, setTotalStockAmount] = useState(0);
    const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  


    // Calculate stock amount based on stock price, stock unit, and pcs
    const calculateStockAmount = (currItem) => {
      const stockAmount =
        currItem.stock_unit === "pcs"
          ? (currItem.pcs || 0) * (currItem.stock_price || 0)
          : (currItem.weight || 0) * (currItem.stock_price || 0);
      return parseFloat(stockAmount.toFixed(2));
    };

    // Calculate sale amount based on sale price, sale unit, and pcs
    const calculateSaleAmount = (currItem) => {
      const saleAmount =
        currItem.sale_unit === "pcs"
          ? (currItem.pcs || 0) * (currItem.sale_price || 0)
          : (currItem.weight || 0) * (currItem.sale_price || 0);
      return parseFloat(saleAmount.toFixed(2));
    };
  
  

  
    useEffect(() => {
      const total = rows.reduce((acc, row) => acc + (Number(row.pcs) || 0), 0);
      const weightSum = parseFloat(rows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0).toFixed(2));
  
      const amountSum = parseFloat(rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0).toFixed(2));
      const stockAmountSum = parseFloat(rows.reduce((sum, row) => sum + calculateStockAmount(row), 0).toFixed(2));
      const saleAmountSum = parseFloat(rows.reduce((sum, row) => sum + calculateSaleAmount(row), 0).toFixed(2));
  

      
      setTotalPcs(total);
      setTotalWeight(weightSum);
      setTotalAmount(amountSum);
      setTotalStockAmount(stockAmountSum);
      setTotalSaleAmount(saleAmountSum);
      
    }, [rows]);
  
    useEffect(() => {
      setPosition(parentHeight > 278 ? "sticky" : "absolute");
    }, [parentHeight]);
    





  return (
     <Box
         sx={{
           height: "38px",
           bgcolor: "#fff",
           border: "1px solid var(--Line-Table, #C6C6C8)",
           display: "flex",
           position: "absolute",
           bottom: "0",
           zIndex: "99",
           left: "0",
           width: "100%",
            borderLeft : "none" , borderRight: "none"
         }}
       >

      <Box sx={{ width: "200px", display: "flex", justifyContent: "start", alignItems: "center" , padding : "20px  0px 20px 40px " , fontWeight : "600"}}>
    
          Total Amount
      
     </Box>

      <Box sx={{ width: "1551px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>

      {/* Pcs Total */}
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
          {totalPcs || ""}
        </Typography>
      </Box>

     
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>

      {/* Weight Total */}
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
          {totalWeight ? formatNumberWithCommas(totalWeight.toFixed(3)) : ""}
        </Typography>
      </Box>

     
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>

      {/* Original Amount Total */}
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
          {totalAmount ? formatNumberWithCommas(totalAmount.toFixed(2)) : ""}
        </Typography>
         </Box>

     
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>
      <Box sx={{ width: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>

      {/* Stock Amount Total */}
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
          {totalStockAmount ? formatNumberWithCommas(totalStockAmount.toFixed(2)) : ""}
        </Typography>
      </Box>

     
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>

      {/* Sale Amount Total */}
      <Box sx={{ width: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
          {totalSaleAmount ? formatNumberWithCommas(totalSaleAmount.toFixed(2)) : ""}
        </Typography>
</Box>

      {/* Empty space for Remark column */}
      <Box sx={{ width: "358px", display: "flex", justifyContent: "center", alignItems: "center" }}></Box>
   
       </Box>
      
  );
};

export default TableForTotalComponent;