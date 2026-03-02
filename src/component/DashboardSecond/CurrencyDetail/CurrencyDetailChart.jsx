import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
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


const data = [
  { currency: 'USD', value: 61060, label: '1800' },
  { currency: 'JPY', value: 42651, label: '1800' },
  { currency: 'CNY', value: 8676, label: '1800' },
  { currency: 'EEE', value: 62000, label: null },
  { currency: 'DDD', value: 56000, label: null },
  { currency: 'FFF', value: 40000, label: null },
  { currency: 'GGG', value: 16000, label: null },
];



// Custom label component to show value inside bar and label above it
const CustomLabel = (props) => {
  const { x, y, width, value, label } = props;
  const centerX = x + width / 2;
  const valueY = y + 15; // inside bar
  const labelY = y - 10; // adjusted above bar for better spacing

  return (
    <>
      <text x={centerX} y={valueY} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={12}>
        {value.toLocaleString()}
      </text>
      {label && (
        <text x={centerX} y={labelY} fill="#000" textAnchor="middle" dominantBaseline="middle" fontSize={12}>
          {label}
        </text>
      )}
    </>
  );
};

const CurrencyDetailChart = ({  onBack }) => {




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


    <ResponsiveContainer width="100%" height={450}>
      <BarChart
        data={data}
        margin={{ top: 60, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="currency" label={{ value: 'Currency', position: 'insideBottomRight', offset: -5 }} />
        <YAxis label={{ value: 'BTH', angle: 0, position: 'top', offset: 20 }}   axisLine={false}
              tickLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#6C63FF" barSize={40} label={<CustomLabel />}/>
      </BarChart>
    </ResponsiveContainer>

   </Paper>

      
  );
};

export default CurrencyDetailChart;
