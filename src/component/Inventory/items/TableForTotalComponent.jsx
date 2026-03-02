import React from "react";
import { Box, Typography } from "@mui/material";
import { formatNumberWithCommas } from "../../../helpers/numberHelper.js";

const TableForTotalComponent = ({ 
  totalAmount, 
  totalPcs, 
  totalWeight, 
  totalPrice 
}) => {
  return (
    <Box
      sx={{
        width: "1583px",
        height: "42px",
        bgcolor: "#F8F8F8",
        display: "flex",
        alignItems: "center",
        border : "1px solid var(--Line-Table, #C6C6C8)",
        borderRadius : "0px 0px 7px 7px",
        marginTop: "1px",
      }}
    >

      

      <Box sx={{
        width: "844px",
        height: "42px",
        // bgcolor: "#F8F8F8",
        display: "flex",
        alignItems: "center",
        // padding: "0 16px",
        marginTop: "1px",
      }}>

      </Box>
  

 

          {/* Pcs Total */}
      <Typography
        sx={{
          color: "var(--Main-Text, #343434)",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontWeight: 700,
          // marginRight: "16px",
          maxWidth: "100px",
          minWidth: "95px",
          textAlign: "center"
        }}
      >
        {totalPcs || ""}
      </Typography>

      
     
      {/* Weight Total */}
      <Typography
        sx={{
          color: "var(--Main-Text, #343434)",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontWeight: 700,
          // marginRight: "16px",
          maxWidth: "101px",
          minWidth: "100px",
          textAlign: "center"
        }}
      >
        {totalWeight ? formatNumberWithCommas(totalWeight.toFixed(3)) : ""}
      </Typography>

   
     
    

         {/* Average Price */}
      <Typography
         sx={{
          color: "var(--Main-Text, #343434)",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontWeight: 700,
          // marginRight: "16px",
          maxWidth: "120px",
          minWidth: "115px",
          textAlign: "center"
        }}
      >
        {totalPrice ? `AVG. ${formatNumberWithCommas(totalPrice.toFixed(2))}` : ""}
      </Typography>
      

   
   
      <Box sx={{
        width: "110px",
        height: "42px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        marginTop: "1px",
      }}>
   
       </Box>
      
      {/* Amount Total */}
      <Typography
        sx={{
          color: "var(--Main-Text, #343434)",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontWeight: 700,
        }}
      >
        {totalAmount ? formatNumberWithCommas(totalAmount.toFixed(2)) : ""}
      </Typography>
       </Box>
  );
};

export default TableForTotalComponent;
