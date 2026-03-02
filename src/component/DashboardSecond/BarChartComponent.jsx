import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';

const data = [
  { name: 'Emerald', content1: 250, content2: 240, content3: 240, content4: 240, total: 2980 },
  { name: 'Round', content1: 250, content2: 139, content3: 221, content4: 139, total: 2980 },
  { name: 'Round', content1: 250, content2: 980, content3: 229, content4: 200, total: 2980 },
  { name: 'Emerald', content1: 258, content2: 390, content3: 200, content4: 400, total: 2850 },
  { name: 'Heart', content1: 250, content2: 480, content3: 218, content4: 189, total: 1980 },
  { name: 'Oval', content1: 250, content2: 380, content3: 250, content4: 239, total: 720 },
  { name: 'Oval', content1: 300, content2: 430, content3: 210, content4: 349, total: 720 },
  { name: 'Heart', content1: 349, content2: 430, content3: 210, content4: 349, total: 720 },
];

const COLORS = ['#9787ff', '#ffa5da', '#fffbd3', '#322c77'];


const renderTick = (props) => {
  const { x, y, width, height } = props;

  return (
    <text
      x={x + width - 10}
      y={y + height / 2 + 4}
      textAnchor="end"
      fill="#fff"
      fontSize={12}
      fontWeight="bold"
    >
      ✓
    </text>
  );
};


const BarChartComponent = () => {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 ,  boxShadow : "none"  }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1  , fontFamily: 'Calibri' ,  color: "#000" , fontSize : "18px"   ,  paddingLeft : "94px"}}>
        Title
      </Typography>
      <ResponsiveContainer width="100%" height={430} minWidth = {600}>
        <BarChart
          layout="vertical"
          fontFamily=  "Calibri"
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 15 }}
          barCategoryGap="40%"
           barSize={15}
        >
          <XAxis type="number"   axisLine={{ stroke: '#cdcdcd', strokeWidth: 1 }}  padding={{ bottom: 20 }}   tick={false}   label={{
    value: 'Qty (Pcs)',
    position: 'insideBottomRight',
    offset: 10,
    fill: '#6c757d',
    fontSize: 12,
    fontFamily: 'Calibri',
    fontWeight: 600
  }} />
          <YAxis dataKey="name" type="category" width={80}    axisLine={{ stroke: '#e1e3e5', strokeWidth: 1 }} 
          tick={{ fill: '#6c757d', fontSize: 12, fontFamily: 'Calibri'  , fontWeight : "600" }}   padding={{ bottom: 15 }}  />

          
          <Tooltip   />
          <Legend
            verticalAlign="bottom"
              content={({ payload }) => (
    <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0  ,   justifyContent: 'center',  marginLeft : "90px"}}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 12 ,  fontSize: 13, fontFamily: 'Calibri',  color: '#868686'   }}>
          <div style={{
            backgroundColor: entry.color,
            width: 13,
            height: 13,
            borderRadius: '30%',
            color: '#fff',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 6
          }}>
            ✓
          </div>
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
                     )}

            height={1}
            formatter={(value) => <span style={{ fontFamily: 'Calibri', fontSize: 15, color: '#868686' }} >{value}</span>}
          />
          <Bar dataKey="content1" stackId="a" fill={COLORS[0]}   radius={[5, 0, 0, 5]} isAnimationActive={false}
  style={{ pointerEvents: 'none' }}  />
          <Bar dataKey="content2" stackId="a" fill={COLORS[1]}  isAnimationActive={false}
  style={{ pointerEvents: 'none' }}  />
          <Bar dataKey="content3" stackId="a" fill=   "#fffbd3"  isAnimationActive={false}
  style={{ pointerEvents: 'none' }}  />
          <Bar dataKey="content4" stackId="a" fill= "#322c77" radius={[0, 5, 5, 0]} isAnimationActive={false}
  style={{ pointerEvents: 'none' }} >
            <LabelList dataKey="total" position="right" fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
 
    </Paper>
  );
};

export default BarChartComponent;
