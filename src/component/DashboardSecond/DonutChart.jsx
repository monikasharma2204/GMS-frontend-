import React, { useState } from 'react';
import { Paper, Typography, Select, MenuItem, Box } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const pieData = [
  { name: 'Ruby', value: 400 },
  { name: 'Sapphire', value: 300 },
  { name: 'Emerald', value: 300 },
  { name: 'Diamond', value: 200 },
];

const COLORS = ['#322c77', '#a155b9', '#f765a3', '#7987ff'];

const DonutChart = ({ onSliceClick }) => {
  const [period, setPeriod] = useState('This Month');

  const handleClick = (data, index) => {
    if (onSliceClick) {
      onSliceClick(data);
    }
  };

  return (
    <Paper sx={{ padding: "20px  30px" , boxShadow : "none"}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: '500'  , fontSize : "16px" , letterSpacing : "0" ,  fontFamily: "Calibri",}}>
          ประเภทของ Stone ที่ขายได้เยอะ
        </Typography>

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
          <MenuItem  sx ={{fontSize : "12px"}} value="This Month">This Month</MenuItem>
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

      <Typography  color="#165baa" sx={{ fontWeight: '500' ,  fontFamily: "Calibri",  fontSize : "33px" , lineHeight : "1" , letterSpacing : "0" , paddingBottom : "8px"}}>
        5,000.00
      </Typography>
      <Typography  color = "#000"  sx={{ mb: 2 , fontSize : "16px" , fontFamily: "Calibri" }}>
        50 Orders
      </Typography>
      <PieChart width={510} height={300}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={105}
          outerRadius={140}
          fill="#8884d8"
          paddingAngle={0}
          cornerRadius={0}
          stroke="none"
          dataKey="value"
          label={false}
          onClick={handleClick}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ paddingLeft: 110 ,  lineHeight : 1.7 }}
          formatter={(value) => <span style={{ color: '#666' , fontFamily: 'Calibri', fontSize: 15 }}>{value}</span>}
        />
      </PieChart>
    </Paper>
  );
};

export default DonutChart;
