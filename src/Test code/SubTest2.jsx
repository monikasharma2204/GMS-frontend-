import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box } from '@mui/material';
import {API_URL} from "config/config.js";
const DataFetcher = ({ onDataSelect }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(API_URL + "/master?master_type=master_stone_name")
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleButtonClick = (item) => {
    if (selectedItemId === item._id) {
      setSelectedItemId(null);
      onDataSelect(null);
    } else {
      setSelectedItemId(item._id);
      onDataSelect(item);
    }
  };

  return (
    <Box mb={2}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {data.length > 0 && data.map((item) => (
        <Button
          key={item._id}
          variant="contained"
          color={selectedItemId === item._id ? 'secondary' : 'primary'}
          onClick={() => handleButtonClick(item)}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          {item.name}
        </Button>
      ))}
    </Box>
  );
};

export default DataFetcher;
