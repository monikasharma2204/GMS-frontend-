import React, { useState , useRef , useEffect  } from 'react';
import { Paper, Typography, Box, Button, Grid ,  Select, MenuItem, } from '@mui/material';
import { PieChart, Pie, Cell, Legend  , Tooltip } from 'recharts';
import BarChartComponent from '../BarChartComponent';

const pieData = [
   { name: 'Ruby', value: 200 },
  { name: 'Sapphire', value: 150 },
  { name: 'Emerald', value: 300 },

];

const COLORS = ['#a155b9', '#f765a3', '#7987ff'];

const DonutDetailDonutChart = ({ onBack  , onSliceClick}) => {
    const [period, setPeriod] = useState('This Month');
    const chartRef = useRef(null);

     const handleClick = (data, index) => {
    if (onSliceClick) {
      onSliceClick(data);
    }
  };

  


  
  return (
    <Box>

          <Box
              onClick={onBack}
              sx={{
              height: "44px",
              marginBottom : "25px",
              borderBottom: "1px solid #e2d784",
              flexShrink: 0,
              backgroundColor: "#FFF",
              boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
              padding: "0 5px",
              marginTop: "0px",
              paddingTop: "0px",
              paddingBottom : "2px",
              display : "flex"
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
                style={{ marginRight: 28}}
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
            
    
      <Grid container spacing={2}  >

    <Paper sx={{ padding: "30px 40px 30px 70px" , boxShadow : "none" , width: "49%"}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: '500'  , fontSize : "16px" , letterSpacing : "0" ,  fontFamily: "Calibri",}}>
          Color Stone 
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
          <MenuItem  sx ={{fontSize : "12px"}} value="This Month">Qty</MenuItem>
          <MenuItem  sx ={{fontSize : "12px"}} value="This Month">Qty</MenuItem>
          <MenuItem sx={{ fontSize: "12px" }} value="January">CTS</MenuItem>
          <MenuItem sx={{ fontSize: "12px" }} value="February">Value</MenuItem>
        </Select>

      </Box>

      <Typography  color="#165baa" sx={{ fontWeight: '500' ,  fontFamily: "Calibri",  fontSize : "33px" , lineHeight : "1" , letterSpacing : "0" , paddingBottom : "8px"}}>
        5,000.00
      </Typography>
      <Typography  color = "#000"  sx={{ mb: 2 , fontSize : "16px" , fontFamily: "Calibri" }}>
        50 Orders
      </Typography>
      <PieChart width={645} height={360}  >
        <Pie
          data={pieData}
           cx={180}
          // cx="50%"
          cy="50%"
          innerRadius={105}
          outerRadius={145}
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
       


        <Grid item sx={{ maxWidth:"49%" }}>
        
    <BarChartComponent />
 
        </Grid>


      </Grid>
    </Box>
  );
};

export default DonutDetailDonutChart;
