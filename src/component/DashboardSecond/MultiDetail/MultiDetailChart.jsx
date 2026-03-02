import React, { useState } from 'react';
import { Paper, Typography, Box, Select, MenuItem } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const data = [
  { day: 1, value: 140000 },
  { day: 2, value: 145000 },
  { day: 3, value: 150000 },
  { day: 4, value: 155000 },
  { day: 5, value: 160000 },
  { day: 6, value: 165000 },
  { day: 7, value: 170000 },
  { day: 8, value: 175000 },
  { day: 9, value: 180000 },
  { day: 10, value: 185000 },
  { day: 11, value: 190000 },
  { day: 12, value: 192000 },
  { day: 13, value: 194000 },
  { day: 14, value: 196000 },
  { day: 15, value: 198000 },
  { day: 16, value: 200000 },
  { day: 17, value: 202000 },
  { day: 18, value: 204000 },
  { day: 19, value: 206000 },
  { day: 20, value: 208000 },
  { day: 21, value: 210000 },
  { day: 22, value: 212000 },
  { day: 23, value: 214000 },
  { day: 24, value: 216000 },
  { day: 25, value: 218000 },
  { day: 26, value: 220000 },
  { day: 27, value: 225000 },
  { day: 28, value: 230000 },
  { day: 29, value: 235000 },
  { day: 30, value: 240000 },
  { day: 31, value: 245000 },
];

const formatToK = (num) => {
  if (num === 0) return '0';
  return `${num / 1000}K`;
};

const MultiDetailChart = ({ onBack }) => {

  const [period, setPeriod] = useState('This Month');



  return (
    <Paper sx={{ borderRadius: 2, boxShadow: "none" }}>

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
          style={{ marginRight: 8 }}
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

      <Box sx={{ padding: "20px 30px 30px 30px", mb: 1 }}>


        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: '500', fontSize: "16px", letterSpacing: "0", fontFamily: "Calibri" }}>
              ยอดสั่งซื้อเข้าเดือนกรกฎาคม
            </Typography>

            <Typography color="#165baa" sx={{ marginTop: "10px", fontWeight: '500', fontFamily: "Calibri", fontSize: "33px", lineHeight: "1", letterSpacing: "0", paddingBottom: "8px" }}>
              ฿ 300,000.00
            </Typography>
          </Box>


          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
            sx={{
              fontSize: "14px",
              fontFamily: "Calibri",
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                fontFamily: "Calibri",
              },
            }}
          >
            <MenuItem sx={{ fontSize: "12px" }} value="This Month">This Month</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="January">January</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="February">February</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="March">March</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="April">April</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="May">May</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="June">June</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="July">July</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="August">August</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="September">September</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="October">October</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="November">November</MenuItem>
            <MenuItem sx={{ fontSize: "12px" }} value="December">December</MenuItem>

          </Select>


        </Box>






        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 30, right: 30, left: -40, bottom: 5 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              type="number"
              domain={[1, 31]}
              scale="linear"
              interval={0}
              padding={{ left: 20, right: 20 }}
              tick={{
                dx: 6,
                dy: 0,
                textAnchor: 'end',
                style: { fontSize: 12, fontFamily: 'Calibri' }
              }}
            />
            <YAxis
              domain={[0, 500000]}
              ticks={[0, 100000, 200000, 500000]}
              tickFormatter={formatToK}
              axisLine={false}
              tickLine={false}
              tick={{
                dx: -10,
                textAnchor: 'start',
              }}
            />
            <Tooltip formatter={(value) => formatToK(value)} />
            <Legend
              verticalAlign="bottom"
              align="left"
              iconSize={7}
              wrapperStyle={{
                paddingTop: 10,
                marginLeft: 40,
                fontSize: 10,
                fontFamily: "Calibri"
              }}
              payload={[
                {
                  value: 'Content',
                  type: 'circle',
                  color: '#8b0000',
                  id: 'custom-legend-item',
                },
              ]}
              formatter={() => <span style={{ color: '#000', fontSize: "14px" }}>Content</span>}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8B0000"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#8B0000' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

    </Paper>
  );
};

export default MultiDetailChart;
