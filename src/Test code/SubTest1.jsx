import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';

const Calculator = () => {
  const [formData, setFormData] = useState({
    num1: "",
    num2: "",
    num3: "",
  });

  // Update state on text field change
  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Multiply num1 and num2 and update num3
  const multiply = () => {
    const { num1, num2 } = formData;
    const result = parseFloat(num1) * parseFloat(num2) || "";
    setFormData((prevData) => ({
      ...prevData,
      num3: result,
    }));
  };

  // Automatically perform multiplication when num1 or num2 changes
  useEffect(() => {
    multiply();
  }, [formData.num1, formData.num2]);

  // Log values of num1, num2, and num3 to console
  const handleSave = () => {
    const { num1, num2, num3 } = formData;
    console.log("Number 1:", num1);
    console.log("Number 2:", num2);
    console.log("Result (Number 1 * Number 2):", num3);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          label="Number 1"
          type="number"
          value={formData.num1}
          onChange={(e) => handleChange("num1", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Number 2"
          type="number"
          value={formData.num2}
          onChange={(e) => handleChange("num2", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Result (Number 1 * Number 2)"
          value={formData.num3}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default Calculator;
