import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Chart data for different time ranges
const chartData = {
  '1D': {
    color: '#4caf50',
    change: '+0.077%',
    direction: 'up',
    values: [
      { time: '00:00', date: '27 Sep', value: 32.0 },
      { time: '01:00', date: '27 Sep', value: 32.2 },
      { time: '02:00', date: '27 Sep', value: 32.8 },
      { time: '03:00', date: '27 Sep', value: 32.5 },
      { time: '04:00', date: '27 Sep', value: 33.0 },
    ],
  },
  '1M': {
    color: '#f44336',
    change: '-0.077%',
    direction: 'down',
    values: [
      { time: '10:00', date: '01 Sep', value: 32.1 },
      { time: '11:00', date: '08 Sep', value: 32.6 },
      { time: '12:00', date: '15 Sep', value: 33.2 },
      { time: '13:00', date: '20 Sep', value: 32.7 },
      { time: '14:00', date: '25 Sep', value: 32.03 },
      { time: '15:00', date: '30 Sep', value: 33.5 },
    ],
  },
  '1Y': {
    color: '#2196f3',
    change: '+0.077%',
    direction: 'up',
    values: [
      { time: '09:00', date: '05 Jan', value: 32.5 },
      { time: '10:00', date: '12 Feb', value: 33.5 },
      { time: '10:30', date: '12 Mar', value: 33.0 },
      { time: '11:45', date: '20 Jun', value: 33.9 },
      { time: '14:00', date: '10 Sep', value: 34.2 },
      { time: '16:15', date: '18 Oct', value: 34.4 },
      { time: '17:15', date: '18 Nov', value: 31.0 },
      { time: '17:30', date: '25 Dec', value: 32.0 },
    ],
  },
  '5Y': {
    color: '#9c27b0',
    change: '+0.077%',
    direction: 'up',
    values: [
      { time: '08:00', date: 'Feb 2020', value: 32.0 },
      { time: '09:30', date: 'Jul 2021', value: 33.5 },
      { time: '10:45', date: 'Mar 2022', value: 33.3 },
      { time: '12:00', date: 'Sep 2023', value: 34.7 },
      { time: '13:15', date: 'Apr 2024', value: 33.2 },
      { time: '14:30', date: 'Jan 2025', value: 34.9 },
    ],
  },

  Maximum: {
    color: '#ff9800',
    change: '+0.150%',
    direction: 'up',
    values: [
      { time: '08:00', date: 'Feb 2019', value: 35.0 },
      { time: '08:00', date: 'Jul 2020', value: 31.5 },
      { time: '08:00', date: 'Mar 2021', value: 32.7 },
      { time: '08:00', date: 'Sep 2022', value: 33.8 },
      { time: '08:00', date: 'Apr 2023', value: 34.4 },
      { time: '08:00', date: 'Jan 2024', value: 34.9 },
      { time: '08:00', date: 'Jun 2025', value: 32.9 },
    ],
  },


};



// List of available currencies
const currencyData = [
  { countryCode: 'us', code: 'USD' },
  { countryCode: 'th', code: 'THB' },
  { countryCode: 'jp', code: 'JPY' },
  { countryCode: 'cn', code: 'CNY' },
  { countryCode: 'eu', code: 'EUR' },
  { countryCode: 'gb', code: 'GBP' },
  { countryCode: 'sg', code: 'SGD' },
  { countryCode: 'hk', code: 'HKD' },
  { countryCode: 'in', code: 'INR' },
  { countryCode: 'my', code: 'MYR' },
];

const rangeStyles = {
  '1D': { backgroundColor: '#e8f5e9', color: '#4caf50' },      // light green
  '1M': { backgroundColor: '#ffebee', color: '#f44336' },      // light red
  '1Y': { backgroundColor: '#e3f2fd', color: '#2196f3' },      // light blue
  '5Y': { backgroundColor: '#f3e5f5', color: '#9c27b0' },      // light purple
  'Maximum': { backgroundColor: '#fff3e0', color: '#ff9800' }, // light orange
};

const CurrencyDetailChart = ({ onBack, onSliceClick }) => {

  const handleClick = (data, index) => {
    if (onSliceClick) {
      onSliceClick(data);
    }
  };
  const [range, setRange] = useState('1D');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyData[0]);

  const open = Boolean(anchorEl);
  const data = chartData[range];

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = (currency) => {
    setAnchorEl(null);
    if (currency) setSelectedCurrency(currency);
  };

  const renderFlag = (code) => (
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt={code}
      style={{
        width: 32,
        height: 23,
        marginRight: 8,
        verticalAlign: 'middle',
        borderRadius: 2,
        cursor: 'pointer',
      }}
    />
  );

  return (
    <Paper sx={{ p: 2, m: 2, boxShadow: "none" }}>


      <Box
        onClick={onBack}
        sx={{
          height: "44px",
          marginBottom: "25px",
          borderBottom: "1px solid #e2d784",
          flexShrink: 0,
          backgroundColor: "#FFF",
          boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
          padding: "0 5px",
          marginTop: "0px",
          paddingTop: "0px",
          paddingBottom: "2px",
          display: "flex"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"

          height="24"
          fill="none"
          stroke="#2e5a5a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: 28 }}
        >




          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <Typography
          sx={{
            color: "#05595B",
            fontFamily: "Calibri",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          Dashboard
        </Typography>

      </Box>

      <Box sx={{ width: "95%" }}>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          {renderFlag(selectedCurrency.countryCode)}
          <Typography variant="body1">{selectedCurrency.code}</Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>

        <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose(null)}>
          {currencyData.map((currency) => (
            <MenuItem
              key={currency.code}
              onClick={() => handleMenuClose(currency)}
              selected={currency.code === selectedCurrency.code}
            >
              {renderFlag(currency.countryCode)} {currency.code}
            </MenuItem>
          ))}
        </Menu>

        {/* Info Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mt={2}
        >
          <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "40px" }} >
            {renderFlag(selectedCurrency.countryCode)}

            <Typography fontWeight="bold">{selectedCurrency.code}</Typography>
            <Typography
              sx={{
                marginLeft: "30px", fontSize: 17,
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                fontWeight: 600,
                ...rangeStyles[range],
              }}
            >
              {data.direction === 'up' ? '↑' : '↓'} {data.change}


            </Typography>
          </Box>

      <Box display="flex" alignItems="center" mt={1}>
  <Box
    sx={{
      width: 15,
      height: 15,
      borderRadius: '50%',
      backgroundColor: '#75b67c', // Change color if needed
      marginRight: 1.5,
    }}
  />
  <Typography fontSize={14} sx={{ color: '#343434', fontWeight: '500' }}>
    1 {selectedCurrency.code} = 33.0664 THB on Oct 4, 2024, 04:22 UTC
  </Typography>
</Box>

        </Box>

        {/* Time Range Tabs */}
        <Tabs
          value={range}
          onChange={(e, val) => setRange(val)}
          textColor="primary"
          indicatorColor="primary"
          gap={10}
          sx={{ mt: 2, }}
        >
          {Object.keys(chartData).map((key) => (

            <Tab key={key} label={key} value={key} sx={{
              marginLeft: "100px", marginRight: "50px", fontSize: 17, color: '#343434', textTransform: 'none',
            }} />
          ))}
        </Tabs>

        {/* Chart */}
        <Box height={300} mt={2}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.values}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor={data.color} stopOpacity={0.4} />
                  <stop offset="90%" stopColor={data.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 18,       // font size
                  fill: '#343434',    // color
                }}
                axisLine={false}
                tickFormatter={(value, index) => {
                  const item = data.values[index];
                  switch (range) {
                    case '1D':
                      return item?.time; // e.g., 00:00
                    case '1M':
                      return item?.date; // e.g., 01 Sep
                    case '1Y':
                      return item?.date?.split(' ')[1]; // e.g., Jan from '05 Jan'
                    case '5Y':
                      return item?.date?.split(' ')[1] === undefined
                        ? item?.date // fallback
                        : item?.date?.split(' ')[1];
                    case 'Maximum':
                      return item?.date?.split(' ')[1] || item?.date;
                    default:
                      return value;
                  }
                }}
              />
              <YAxis
                ticks={[32, 33, 34, 35]}
                domain={[32, 35]}
                tick={{
                  fontSize: 18,       // font size
                  fill: '#343434',    // color
                }}
                axisLine={false}

              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={data.color}
                fill="url(#colorArea)"
                strokeWidth={2}
                fillOpacity={1}
                dot
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

      </Box>
      {/* Currency Selector */}

    </Paper>
  );
};

export default CurrencyDetailChart;
