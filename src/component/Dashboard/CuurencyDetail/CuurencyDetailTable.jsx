import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box  ,  Button,TextField,
  InputAdornment,} from '@mui/material';
import {
  Sort as SortIcon,
  FileDownload as FileDownloadIcon,
   FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const sampleData = [
  { round: 1, rate: 32.43, date: '01/09/2024', value: '$85,000.00', trend: 'up', change: 0.00417 },
  { round: 2, rate: 33.43, date: '08/09/2024', value: '$80,000.00', trend: 'up', change: 0.00417 },
  { round: 3, rate: 32.44, date: '15/09/2024', value: '$5,500.00', trend: 'down', change: 0.00417 },
  { round: 4, rate: 32.43, date: '22/09/2024', value: '$4,700.00', trend: 'up', change: 0.00417 },
  { round: 5, rate: 33.35, date: '29/09/2024', value: '$4,200.00', trend: 'up', change: 0.00417 },
  { round: 6, rate: 32.43, date: '03/10/2024', value: '$3,500.00', trend: 'down', change: 0.00417 },
  { round: 7, rate: 32.47, date: '10/10/2024', value: '$3,000.00', trend: 'up', change: 0.00417 },
  { round: 8, rate: 32.45, date: '17/10/2024', value: '$2,500.00', trend: 'down', change: 0.00417 },
  { round: 9, rate: 32.44, date: '24/10/2024', value: '$2,000.00', trend: 'up', change: 0.00417 },
  { round: 10, rate: 32.43, date: '31/10/2024', value: '$1,500.00', trend: 'down', change: 0.00417 },
];

const averageRate = 32.63;

const CuurencyDetailTable = ({ }) => {

    const [searchTerm, setSearchTerm] = useState('');

  
  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 'none', width: '100%' , mt: 3 }}>
    
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              px: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Calibri',
                fontWeight: 900,
                fontSize: 24,
                color: '#05595b',
                userSelect: 'none',
              }}
            >
              Stone อัตราแลกเปลี่ยน
            </Typography>
          </Box>
    
      <Box
          sx={{
            display: 'flex',
            padding: "0px 18px",
            justifyContent: 'space-between',
            backgroundColor : "#efefef",
            alignItems: 'center',
            marginBottom: "8px",
            borderBottom: "1px solid #e5e5e5",
            paddingTop: "8px",
            paddingBottom: "8px"

          }}
        >
          <Box sx={{ display: "flex", alignItems: "center " }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Calibri',
                fontWeight: 600,
                fontSize: 16,
                color: '#8d9093',
                userSelect: 'none',
              }}
            >
              LOREM
            </Typography>

            <TextField
              size="small"
              placeholder="Search"

              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 300, height: 33, backgroundColor: "#fff", borderRadius: "10px", marginLeft: "60px",
                "& .MuiOutlinedInput-root": {
                  height: 33,
                  "& fieldset": {
                    border: "none",
                  },
                  "& input": {
                    fontSize: "14px", // Reduces text size
                    padding: "4px 0", // Optional: adjust padding
                  },
                },
              }}
              InputProps={{

                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: "22px" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>


          <Box sx={{ marginRight: " 30px" }}>

            <Button
              startIcon={<FilterListIcon />}
              sx={{
                fontFamily: 'Calibri',
                fontWeight: 600,
                fontSize: 13,
                color: '#8d9093', backgroundColor: "#fff", padding: "5px 15px ", border: "1px solid #bbbfc3", borderRadius: "0px"
              }}
            >
              Filter
            </Button>
            <Button
              startIcon={<SortIcon />}
              sx={{
                fontFamily: 'Calibri',
                fontWeight: 600,
                fontSize: 13,
                color: '#8d9093', backgroundColor: "#fff", padding: "5px 15px ", border: "1px solid #bbbfc3", borderRight: "none", borderLeft: "none", borderRadius: "0px"
              }}
            >
              Sort
            </Button>
            <Button
              startIcon={<FileDownloadIcon />}
              sx={{
                fontFamily: 'Calibri',
                fontWeight: 600,
                fontSize: 13,
                color: '#8d9093', backgroundColor: "#fff", padding: "5px 15px ", border: "1px solid #bbbfc3", borderRadius: "0px"
              }}
            >
              Export
            </Button>
          </Box>




        </Box>

      <TableContainer>
        <Table size="small" aria-label="currency detail table">
          <TableHead>
            <TableRow   >  
              <TableCell sx={{ fontWeight: '500', fontSize: '14px' ,  color: "#6d7175" , textAlign : "center"   }}>รอบที่</TableCell>
              <TableCell sx={{ fontWeight: '500', fontSize: '14px' , color: "#6d7175" , textAlign : "center"    }}>อัตราการแลกเปลี่ยน</TableCell>
              <TableCell sx={{ fontWeight: '500', fontSize: '14px' , color: "#6d7175" , textAlign : "center"  }}>วันที่จ่ายออก</TableCell>
              <TableCell sx={{ fontWeight: '500', fontSize: '14px' , color: "#6d7175" , textAlign : "right"  }}>มูลค่า</TableCell>
              <TableCell sx={{ fontWeight: '500', fontSize: '14px'  , color: "#6d7175" , textAlign : "center" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.round}> 
                <TableCell  sx = {{ padding : "0px 16px " ,     borderBottom: "none" , textAlign : "center"  }}>{row.round}</TableCell>
                <TableCell  sx = {{ padding : "0px 16px " ,  borderBottom: "none" , textAlign : "center" }} >{row.rate.toFixed(2)}</TableCell>
                <TableCell   sx = {{ padding : "0px 16px " ,  borderBottom: "none" , textAlign : "center"  }} >{row.date}</TableCell>
                <TableCell  sx = {{ padding : "0px 16px "  , borderBottom: "none" , textAlign : "right" }} >{row.value}</TableCell>
                <TableCell sx={{  display : "flex",  justifyContent : "center" ,  textAlign : "center"  , borderBottom: "none",  padding : "0px 16px " , display: 'flex', alignItems: 'center', color: row.trend === 'up' ? 'green' : 'red' }}>
                  {row.trend === 'up' ? <ArrowDropUpIcon   sx= {{fontSize :"40px" , fontWeight : "600"}} /> : <ArrowDropDownIcon sx= {{fontSize :"40px" , fontWeight : "600"}} />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {row.change.toFixed(5)}
                  </Typography>
                </TableCell>   
              </TableRow>
            ))}
            <TableRow  sx = {{  backgroundColor : "#efefef"}}> 
              <TableCell sx={{ fontWeight: '600' , color: "#6d7175" , textAlign : "center"  }}>ค่าเฉลี่ย</TableCell>
              <TableCell sx={{ fontWeight: '600' , color: "#6d7175" , textAlign : "center"}}>{averageRate.toFixed(2)}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CuurencyDetailTable;
