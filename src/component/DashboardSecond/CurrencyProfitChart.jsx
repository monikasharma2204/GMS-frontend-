import React, { useState } from 'react';
import { Paper, Typography, Select, MenuItem, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', pink: 0.26, blue: 0.12 },
  { month: 'Feb', pink: 0.26, blue: 0.12 },
  { month: 'Mar', pink: 0.12, blue: 0.26 },
  { month: 'Apr', pink: 0.26, blue: 0.12 },
  { month: 'May', pink: 0.12, blue: 0.26 },
  { month: 'Jun', pink: 0.26, blue: 0.12 },
  { month: 'Jul', pink: 0.12, blue: 0.26 },
  { month: 'Aug', pink: 0.26, blue: 0.12 },
  { month: 'Sep', pink: 0.26, blue: 0.26 },
   { month: 'Oct', pink: 0.22, blue: 0.15 },
  { month: 'Nov', pink: 0.18, blue: 0.21 },
  { month: 'Dec', pink: 0.19, blue: 0.22 },
];

const circleStyle = (color) => ({
  display: 'inline-block',
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  verticalAlign: 'middle',
});



const CurrencyProfitChart = () => {
  const [period, setPeriod] = useState('Month');

  return (
    
    <Paper sx={{ padding: "20px  30px", boxShadow: "none" }}>

      <Box>
        <Box sx={{ display: 'flex', mb: 1, flexDirection: 'column' , marginTop : "20px"  , marginLeft : "6px" }}>
          <Typography variant="subtitle1" sx={{   fontFamily: "Calibri" , fontSize : "16px"   }}>
            เดือนนี้รับ currency มาเท่าไร
          </Typography>

          <Box sx={{ display: 'flex' , alignItems : "center"  , marginTop : "15px"}}>
            <Box sx={{ ...circleStyle('#ff82a9'), marginRight: "6px"    }} />
            <Typography sx={{ lineHeight : "0" , marginRight : "40px",   fontSize : "12px" , fontFamily: "Calibri" }} >
              Content
            </Typography>
            <Box sx={{ ...circleStyle('#8884d8'), marginRight: "6px"  }} />
            <Typography  sx={{  lineHeight : "0",  fontSize : "12px" , fontFamily: "Calibri" }} >
              Content
            </Typography>
          </Box>
        </Box>
      </Box>

    <Box  sx={{ overflowX: 'auto'   , marginLeft : "5px" }}>
      <Box sx={{ width: `${data.length * 90}px` , height :"460px" , paddingLeft :"10px" ,    marginTop: "-35px" , marginLeft : "-17px"}} >
<ResponsiveContainer width="100%" height={455}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 , stroke : "b" }}    barCategoryGap="10%" 
  barGap={0}>
          <XAxis dataKey="month"    axisLine={false} 
  tickLine={false}  />
         <YAxis hide domain={[0, 0.3]} />
          <Tooltip  cursor={false} />
          <Bar dataKey="pink" fill="#f765a3" name="Content" label={{ position: 'insideTop'  , fill: 'white', fontSize: 10 }}  />
          <Bar dataKey="blue" fill="#7987ff" name="Content" label={{ position: 'top' , fontSize: 10   }} />
        </BarChart>
      </ResponsiveContainer>
      </Box>
    </Box>
      
    </Paper>
  );
};

export default CurrencyProfitChart;
