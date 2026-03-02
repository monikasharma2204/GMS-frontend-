import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  TextField,
  Paper,
  Button,
  InputAdornment,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';

const data = [
  {
    name: 'Ruby',
    details: [
      { shape: 'Round', size: '2.0 mm', qty: 90, cts: 2.7, value: '$84,000.00' },
      { shape: 'Emerald', size: '4 x 2 mm', qty: 80, cts: 7.2, value: '$5,593.27' },
      { shape: 'Round', size: '3.0 mm', qty: 70, cts: 7.0, value: '$783.33' },
      { shape: 'Oval', size: '6 x 4 mm', qty: 60, cts: 30.0, value: '$666.27' },
      { shape: 'Oval', size: '7 x 5 mm', qty: 50, cts: 45.0, value: '$600.00' },
      { shape: 'Emerald', size: '5 x 3 mm', qty: 40, cts: 10.4, value: '$593.27' },
      { shape: 'Round', size: '3 mm', qty: 30, cts: 3.0, value: '$555.00' },
      { shape: 'Round', size: '4 mm', qty: 20, cts: 5.0, value: '$499.00' },
      { shape: 'Emerald', size: '6 x 4 mm', qty: 10, cts: 5.6, value: '$200.00' },
    ],
  },
  {
    name: 'Sapphire',
    details: [
      { shape: 'Round', size: '2.5 mm', qty: 50, cts: 3.0, value: '$40,000.00' },
      { shape: 'Oval', size: '5 x 3 mm', qty: 30, cts: 8.0, value: '$10,000.00' },
    ],
  },
  {
    name: 'Emerald',
    details: [
      { shape: 'Round', size: '3.0 mm', qty: 40, cts: 6.0, value: '$20,000.00' },
      { shape: 'Oval', size: '6 x 4 mm', qty: 25, cts: 12.0, value: '$15,000.00' },
    ],
  },
];

const MultiDetailTable = () => {
  const [openRows, setOpenRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRow = (name) => {
    setOpenRows((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredData = data.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export CSV function
  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Group,Shape,Size,Qty,Cts,Value\n';
    data.forEach((group) => {
      group.details.forEach((item) => {
        const row = `${group.name},${item.shape},${item.size},${item.qty},${item.cts},${item.value}`;
        csvContent += row + '\n';
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'donut_detail_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ mt: 4 }}>

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





      <Box sx={{ backgroundColor: "#efefef", borderRadius: "15px", padding: "12px" }}>

        <Box
          sx={{
            display: 'flex',
            padding: "0px 18px",
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: "8px",
            borderBottom: "1px solid #e5e5e5",
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
              onClick={exportCSV}
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

        <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: "transparent", }}>
          <Table aria-label="donut detail table" sx={{ borderCollapse: 'separate', borderSpacing: '0 0px' }}>
            <TableHead>
              {/* Removed header row to show only on group expand */}
            </TableHead>
            <TableBody>
              {filteredData.map((group) => (

                <React.Fragment key={group.name}>
                  <TableRow
                    sx={{
                      backgroundColor: 'transparent',
                      borderRadius: 1, border: "none ",
                      '& > *': { margin: "5px 0px ", backgroundColor: '#fff', border: "none", borderBottom: "0px" },

                    }}
                  >

                <TableCell
  sx={{
    padding: "5px 0px",
    display: "flex",
    alignItems: "center",
    boxShadow: "none",
    borderBottom: "none",
    marginBottom: "0px",
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems : "center",
      width: "100%",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton size="small" onClick={() => toggleRow(group.name)}>
        {openRows[group.name] ? (
          <ArrowDropDownIcon
            sx={{ fontSize: 28, strokeWidth: 2, fontWeight: "700", color: "#000" }}
          />
        ) : (
          <ArrowDropUpIcon
            sx={{
              fontSize: 28,
              strokeWidth: 2,
              fontWeight: "700",
              transform: "rotate(90deg)",
              color: "#000",
            }}
          />
        )}
      </IconButton>

      <Box
        sx={{
          fontSize: "18px",
          width : "200px",
          fontWeight: "500",
          marginLeft: "10px",
          color: "#000",
          fontFamily: "Calibri",
        }}
      >
        {group.name}
      </Box>
    </Box>

    <Typography sx={{ color: "#3bc539", fontFamily: "Calibri", fontWeight: 500 , fontSize : "18px"   }}>
      $150,000.00
    </Typography>
  </Box>
</TableCell>


                    {/* <TableCell colSpan={5} sx={{ fontWeight: 'bold', fontFamily: 'Calibri', fontSize: 16  , padding : "0px"}}>
                    {group.name}
                  </TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0, borderBottom: "none", backgroundColor: "#fff" }} colSpan={6}>
                      <Collapse in={openRows[group.name]} timeout="auto" unmountOnExit>
                        <Table size="small" aria-label={`${group.name} details`} sx={{ width: "100%", marginTop: "0px" }}>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5', padding: "5px 0px", borderBottom: "1px solid #e5e5e5" }}>
                              {['Shape', 'Size', 'Qty', 'Cts', 'Value'].map((label) => (
                                <TableCell
                                  key={label}
                                  sx={{ fontWeight: '500', fontFamily: 'Calibri', fontSize: 17, borderBottom: "none", padding: "8px 16px 14px 70px", color: "#898989" }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, borderBottom: "none" }}>
                                    {label}
                                    <SwapVertOutlinedIcon sx={{ fontSize: 18, ml: 0.5 }} />
                                  </Box>
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ borderBottom: "none" }}>
                            {group.details.map((item, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  backgroundColor: '#fff',
                                  borderRadius: 1,
                                  borderBottom: "none",




                                }}
                              >
                                <TableCell sx={{ fontFamily: 'Calibri', fontSize: 16, borderBottom: "none", padding: "7px 16px", paddingLeft: "70px", width: "200px" }}>{item.shape}</TableCell>
                                <TableCell sx={{ fontFamily: 'Calibri', fontSize: 16, borderBottom: "none", padding: "7px 16px", paddingLeft: "70px", width: "200px" }}>{item.size}</TableCell>
                                <TableCell sx={{ fontFamily: 'Calibri', fontSize: 16, borderBottom: "none", padding: "7px 16px", paddingLeft: "70px", width: "200px" }}>{item.qty}</TableCell>
                                <TableCell sx={{ fontFamily: 'Calibri', fontSize: 16, borderBottom: "none", padding: "7px 16px", paddingLeft: "70px", width: "200px" }}>{item.cts}</TableCell>
                                <TableCell sx={{ fontFamily: 'Calibri', fontSize: 16, borderBottom: "none", padding: "px 16px", paddingLeft: "70px" }}>{item.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    </Box>
  );
};

export default MultiDetailTable;
