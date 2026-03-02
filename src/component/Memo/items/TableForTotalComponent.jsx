import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
// import { QuotationtableRowsState, QuotationtableRowsDropdownData } from "recoil/state/QuotationState";
import { tableRowsState, tableRowsDropdownData } from "recoil/state/CustomerState";
import { useRecoilState } from "recoil";

const TableForTotalComponent = ({ parentHeight }) => {

  

    const [position, setPosition] = useState("absolute");
    const [totalPcs, setTotalPcs] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [rows, setRows] = useRecoilState(tableRowsState);


    const calculateAmount = (currItem) => {
      return currItem.unit === "pcs"
        ? (currItem.pcs || 0) * (currItem.price || 0)
        : (currItem.weight || 0) * (currItem.price || 0);
    };
  
    // Function to calculate discount
    const calculateDiscount = (item) => {
      return ((item.discountPercentage || 0) / 100) * calculateAmount(item || {});
    };
  
    // Function to calculate subtotal after discount
    const calculateAmountAfterDiscount = (currItem) => {
      return parseFloat(
        calculateAmount(currItem || {}) - calculateDiscount(currItem || {}) + (currItem.labour_price || 0)
      ).toFixed(2);
    };
  
    useEffect(() => {
      const total = rows.reduce((acc, row) => acc + (Number(row.pcs) || 0), 0);
      const weightSum = rows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0);
  
      const amountSum = rows.reduce((sum, row) => sum + calculateAmount(row), 0);
      const discountSum = rows.reduce((sum, row) => sum + parseFloat(calculateAmountAfterDiscount(row)), 0);
  
      setTotalPcs(total);
      setTotalWeight(weightSum);
      setTotalAmount(amountSum);
      setTotalAfterDiscount(discountSum);
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
   
         <Box sx={{ width: "1519px", display: "flex", justifyContent: "center", alignItems: "center", }} >
         </Box>
   
   
   <Box sx={{ width: "136px", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <TextField
      value={totalPcs} 
      variant="outlined"
      fullWidth
      disabled={true} // Read-only total field
      sx={{
        "& .MuiOutlinedInput-root": {
          width: "139px",
          height: "34px",
          borderRadius: "4px",
          backgroundColor: "#F2F2F2",
         
        },
        "& .MuiInputBase-root.Mui-disabled": {
          "& > fieldset": {
            borderColor: "#E6E6E6",
          },
          bgcolor: "#F0F0F0",
          borderRadius: "4px",
        },
      }}
      InputProps={{
        inputProps: {
            style: { textAlign: "right" },
        }
    }}
    />
  </Box>
        
   


         <Box sx={{ width: "40px", display: "flex", justifyContent: "center", alignItems: "center", }} >
           <TextField
   
             variant="outlined"
             fullWidth
             disabled={true}
             value={totalWeight}
             sx={{
               "& .MuiOutlinedInput-root": {
                 width: "131px",
                 height: "34px",
                 marginLeft : "8px",
                 borderRadius: "4px",
                 backgroundColor: "#F2F2F2",
               },
               "& .MuiInputBase-root.Mui-disabled": {
                 "& > fieldset": {
                   borderColor: "#E6E6E6",
                 },
                 bgcolor: "#F0F0F0",
                 borderRadius: "4px",
               },
             }}
             InputProps={{
              inputProps: {
                  style: { textAlign: "right" },
              }
          }}
           />
         </Box>
         <Box sx={{ width: "385px", display: "flex", justifyContent: "center", alignItems: "center", }} >
         </Box>
   
   


         <Box sx={{ width: "40px", display: "flex", justifyContent: "center", alignItems: "center", }} >
           <TextField
   
             value={totalAmount} 
             variant="outlined"
             fullWidth
             disabled={true} 

             sx={{
               "& .MuiOutlinedInput-root": {
                 width: "145px",
                 height: "34px",
                 borderRadius: "4px",
                 backgroundColor: "#F2F2F2",
               },
               "& .MuiInputBase-root.Mui-disabled": {
                 "& > fieldset": {
                   borderColor: "#E6E6E6",
                 },
                 bgcolor: "#F0F0F0",
                 borderRadius: "4px",
               },
             }}
             InputProps={{
              inputProps: {
                  style: { textAlign: "right" },
              }
          }}
           />
         </Box>
         <Box sx={{ width: "380px", display: "flex", justifyContent: "center", alignItems: "center", }} >
       </Box>
   


       <Box sx={{ width: "40px", display: "flex", justifyContent: "center", alignItems: "center", }} >
           <TextField
   
             variant="outlined"
             fullWidth
             disabled
             value={totalAfterDiscount}
             sx={{
               "& .MuiOutlinedInput-root": {
                 width: "145px",
                 height: "34px",
                 borderRadius: "4px",
                 backgroundColor: "#F2F2F2",
               },
               "& .MuiInputBase-root.Mui-disabled": {
                 "& > fieldset": {
                   borderColor: "#E6E6E6",
                 },
                 bgcolor: "#F0F0F0",
                 borderRadius: "4px",
               },
             }}
             InputProps={{
              inputProps: {
                  style: { textAlign: "right" },
              }
          }}
           />
         </Box>
   
       </Box>
      
  );
};

export default TableForTotalComponent;