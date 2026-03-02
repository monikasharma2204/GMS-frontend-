import React, { useReducer } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Paper, Grid } from '@mui/material';

const data = [
  { name: 'Item A', serial: { serialNumber: 'LO58FG40R3', str1: 'First', str2: 'Item 1', str3: 'Group 1', num1: 10, num2: 20 }},
  { name: 'Item B', serial: { serialNumber: 'PQ92KL10S5', str1: 'Second', str2: 'Item 2', str3: 'Group 2', num1: 30, num2: 40 }},
  { name: 'Item C', serial: { serialNumber: 'XY77AB20C9', str1: 'Third', str2: 'Item 3', str3: 'Group 3', num1: 50, num2: 60 }}
];

const initialState = {
  selectedRows: [],
  selectedData: [],
  sum: 0,
  discount: 0,
  discountPercentage: 0,
  vatPercentage: 7, // VAT percentage, adjust as needed
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_ROW':
      const selectedRows = state.selectedRows.includes(action.payload)
        ? state.selectedRows.filter((i) => i !== action.payload)
        : [...state.selectedRows, action.payload];
      return {
        ...state,
        selectedRows
      };
    case 'SUBMIT':
      const selectedItems = state.selectedRows.map((rowIndex) => data[rowIndex].serial);
      const totalSum = selectedItems.reduce((acc, item) => acc + item.num1 + item.num2, 0);
      return {
        ...state,
        selectedData: selectedItems,
        sum: totalSum
      };
    case 'UPDATE_DISCOUNT':
      const discountValue = parseFloat(action.payload) || 0; // Ensure discountValue is a number
      return {
        ...state,
        discount: discountValue
      };
    case 'UPDATE_DISCOUNT_PERCENTAGE':
      const discountPercentageValue = parseFloat(action.payload) || 0; // Ensure discountPercentageValue is a number
      return {
        ...state,
        discountPercentage: discountPercentageValue
      };
    case 'UPDATE_VAT_PERCENTAGE':
      const vatPercentageValue = parseFloat(action.payload) || 0; // Ensure vatPercentageValue is a number
      return {
        ...state,
        vatPercentage: vatPercentageValue
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleCheckboxChange = (index) => {
    dispatch({ type: 'TOGGLE_ROW', payload: index });
  };

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT' });
  };

  const handleChangeDiscount = (event) => {
    dispatch({ type: 'UPDATE_DISCOUNT', payload: event.target.value });
  };

  const handleChangeDiscountPercentage = (event) => {
    dispatch({ type: 'UPDATE_DISCOUNT_PERCENTAGE', payload: event.target.value });
  };

  const handleChangeVATPercentage = (event) => {
    dispatch({ type: 'UPDATE_VAT_PERCENTAGE', payload: event.target.value });
  };

  const calculateTotalWithDiscount = () => {
    const totalDiscount = state.discount + (state.sum * (state.discountPercentage / 100));
    return state.sum - totalDiscount;
  };

  const calculateTotalWithVAT = () => {
    const totalAfterDiscount = calculateTotalWithDiscount();
    const vatAmount = totalAfterDiscount * (state.vatPercentage / 100);
    return totalAfterDiscount + vatAmount;
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Checkbox</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Serial Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.selectedRows.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.serial.serialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 20 }}>
          Submit
        </Button>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          label="Sum of Numbers"
          value={state.sum}
          variant="outlined"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Discount"
          value={state.discount}
          onChange={handleChangeDiscount}
          variant="outlined"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Discount (%)"
          value={state.discountPercentage}
          onChange={handleChangeDiscountPercentage}
          variant="outlined"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Total after Discount"
          value={calculateTotalWithDiscount()}
          variant="outlined"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="VAT (%)"
          value={state.vatPercentage}
          onChange={handleChangeVATPercentage}
          variant="outlined"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Total after VAT"
          value={calculateTotalWithVAT()}
          variant="outlined"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </Grid>
      
      

      {state.selectedData.length > 0 && (
        <Grid item xs={12}>
          {state.selectedData.map((item, index) => (
            <Paper key={index} style={{ padding: 10, marginTop: 20 }}>
              <TextField
                label={`Serial String 1 (Row ${index + 1})`}
                value={item.str1}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />
              <TextField
                label={`Serial String 2 (Row ${index + 1})`}
                value={item.str2}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />
              <TextField
                label={`Serial String 3 (Row ${index + 1})`}
                value={item.str3}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />
              <TextField
                label={`Serial Number 1 (Row ${index + 1})`}
                value={item.num1}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />
              <TextField
                label={`Serial Number 2 (Row ${index + 1})`}
                value={item.num2}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 10 }}
              />
            </Paper>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default App;
