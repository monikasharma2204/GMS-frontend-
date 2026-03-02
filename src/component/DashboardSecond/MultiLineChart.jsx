import React, { useState , useRef , useEffect  } from 'react';
import { Paper, Typography, Select, MenuItem, Box } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';

const lineData = [
  { month: 'Jan', blue: 40, pink: 33, red: 35, darkBlue: 28 },
  { month: 'Feb', blue: 38, pink: 40, red: 41, darkBlue: 30 },
  { month: 'Mar', blue: 42, pink: 29, red: 45, darkBlue: 32 },
  { month: 'Apr', blue: 45, pink: 35, red: 48, darkBlue: 35 },
  { month: 'May', blue: 47, pink: 40, red: 50, darkBlue: 37 },
  { month: 'Jun', blue: 50, pink: 42, red: 52, darkBlue: 38 },
  { month: 'Jul', blue: 52, pink: 44, red: 53, darkBlue: 40 },
  { month: 'Aug', blue: 55, pink: 48, red: 54, darkBlue: 42 },
  { month: 'Sep', blue: 58, pink: 50, red: 56, darkBlue: 43 },
  { month: 'Oct', blue: 54, pink: 52, red: 58, darkBlue: 44 },
  { month: 'Nov', blue: 50, pink: 55, red: 60, darkBlue: 45 },
  { month: 'Dec', blue: 52, pink: 58, red: 62, darkBlue: 47 },
];

const MultiLineChart = ({ onPointClick }) => {
  const [period, setPeriod] = useState('This Year');
    const chartRef = useRef(null);

  const handleClick = (data, index) => {
    if (onPointClick) {
      onPointClick(data);
    }
  };

    useEffect(() => {
    const svg = chartRef.current?.querySelector('svg');
    if (svg) {
      svg.setAttribute('viewBox', '30 0 770 350'); // Custom viewBox
    }
  }, [lineData]);

  return (

    <Paper sx={{ padding: "20px  30px" , boxShadow : "none" , borderBottom : "1px solid #e1e3e5" }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{  marginLeft : "17px" , fontWeight: '500'  , fontSize : "16px" , letterSpacing : "0" ,  fontFamily: "Calibri" }}>
          ยอดขายต่อเดือน
        </Typography>
        <Select
          value={period}
          onChange={(e) =>
             setPeriod(e.target.value)}
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
          <MenuItem  sx ={{fontSize : "12px"}} value="This Year">This Year</MenuItem>
          <MenuItem  sx ={{fontSize : "12px"}} value="Last Year">Last Year</MenuItem>
          <MenuItem  sx ={{fontSize : "12px"}} value="All Time">All Time</MenuItem>
        </Select>


      </Box>
      <Typography color="#165baa" sx={{ marginLeft : "17px" ,  fontWeight: '500' ,  fontFamily: "Calibri",  fontSize : "33px" , lineHeight : "1" , letterSpacing : "0" , paddingBottom : "8px"}} >
        1,000,000.00
      </Typography>
      <Typography  color="#000" sx={{ marginLeft : "17px" , mb: 2  ,  fontSize : "16px" , fontFamily: "Calibri" }}>
        50 Orders
      </Typography>


     <div ref={chartRef}>
<LineChart
        width={770}
        height={340}
        data={lineData}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        style={{ marginRight: '60px' , fontSize : "12px" }}
        onClick={(e) => {
          if (e && e.activePayload && e.activePayload.length > 0) {
            handleClick(e.activePayload[0].payload, e.activeTooltipIndex);
          }
        }}
      >
        <XAxis dataKey="month"   axisLine={false}  tickLine={false}    padding={{ left: 40, right: 0 }} />
       <YAxis domain={[0, 60]} ticks={[0, 20, 40, 60]}   axisLine={false} 
  tickLine={false}   /> 
        {/* Disable default Tooltip */}
        {/* <Tooltip /> */}

 <Legend   verticalAlign="bottom"
  align="left"
  iconType="circle"
  iconSize={7} 
  wrapperStyle={{ paddingLeft: 25  }}
  />
        <Line type="monotone" dataKey="blue" stroke="#8884d8"  dot />
        <Line type="monotone" dataKey="pink" stroke="#f4a1d1"  dot />
        <Line type="monotone" dataKey="red" stroke="#ff82a9"  dot />
        <Line type="monotone" dataKey="darkBlue" stroke="#2e2a5a"  dot />
      </LineChart>
     </div>
      
    </Paper>
  );
};

export default MultiLineChart;
