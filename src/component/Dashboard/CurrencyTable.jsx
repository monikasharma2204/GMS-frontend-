import React, { useState } from 'react';
import { Paper, Typography, Select, MenuItem, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


const currencyData = [
  { countryCode: 'us', code: 'USD', rate: 33.4761, value: '$10,000.00' },
  { countryCode: 'th', code: 'THB', rate: '-', value: '$9,000.00' },
  { countryCode: 'jp', code: 'JPY', rate: 22.7433, value: '$8,000.00' },
  { countryCode: 'cn', code: 'CNY', rate: 4.7725, value: '$7,000.00' },
  { countryCode: 'eu', code: 'EUR', rate: 36.7713, value: '$6,000.00' },
  { countryCode: 'gb', code: 'GBP', rate: 43.9104, value: '$5,000.00' },
  { countryCode: 'sg', code: 'SGD', rate: 25.8093, value: '$4,000.00' },
  { countryCode: 'hk', code: 'HKD', rate: 4.3262, value: '$3,000.00' },
  { countryCode: 'in', code: 'INR', rate: 0.4274, value: '$2,000.00' },
  { countryCode: 'my', code: 'MYR', rate: 7.8957, value: '$1,000.00' },
];

const CurrencyTable = ({ onRowClick }) => {
  const [period, setPeriod] = useState('Day');

  const renderFlag = (code) => (
    <img
      src={`/flags/${code}.svg`}
      alt={code}
      style={{ width: 20, height: 15, marginRight: 8, verticalAlign: 'middle', borderRadius: 2, cursor: 'pointer' }}
      onClick={() => onRowClick && onRowClick(code)}
    />
  );

  const handleCellClick = (code) => {
    onRowClick && onRowClick(code);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, padding: '0px 0px', borderBottom: '1px solid #e1e3e5' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: '600', fontSize: '16px', letterSpacing: '0', fontFamily: 'Calibri', color: '#7d7c7c' }}>
          Currency ที่รับเข้ามา
        </Typography>

        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
          sx={{
            fontSize: '14px',
            fontFamily: 'Calibri',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
              fontFamily: 'Calibri',
            },
          }}
        >
          <MenuItem sx={{ fontSize: '12px' }} value="Day">Day</MenuItem>
          <MenuItem sx={{ fontSize: '12px' }} value="Month">Month</MenuItem>
          <MenuItem sx={{ fontSize: '12px' }} value="Year">Year</MenuItem>
        </Select>
      </Box>

      <TableContainer>
        <Table size="small" aria-label="currency table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '600', fontSize: '16px', letterSpacing: '0', fontFamily: 'Calibri', borderBottom: '1px solid #e1e3e5'  , padding : "" }}>
                สกุลเงิน
              </TableCell>
              <TableCell sx={{ fontWeight: '600', fontSize: '16px', letterSpacing: '0', fontFamily: 'Calibri', borderBottom: '1px solid #e1e3e5' }} align="center">
                อัตราแลกเปลี่ยน
              </TableCell>
              <TableCell sx={{ fontWeight: '600', fontSize: '16px', letterSpacing: '0', fontFamily: 'Calibri', borderBottom: '1px solid #e1e3e5'  , textAlign : "right" }}>
                มูลค่า
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currencyData.map((row) => (
              <TableRow key={row.code}>

                <TableCell sx={{ borderBottom: 'none', padding: '10px 8px'  , marginLeft : "20px" }} component="th" scope="row">
                  {renderFlag(row.countryCode)} {row.code}
                </TableCell>


                <TableCell
                  sx={{ borderBottom: 'none', padding: '10px 8px', cursor: 'pointer' }}
                  align="center"
                  onClick={() => handleCellClick(row.countryCode)}
                >
                  {row.rate}
                </TableCell>


                <TableCell
                  sx={{ borderBottom: 'none', padding: '10px 8px', cursor: 'pointer' }}
                  align="right"
                  onClick={() => handleCellClick(row.countryCode)}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CurrencyTable;
