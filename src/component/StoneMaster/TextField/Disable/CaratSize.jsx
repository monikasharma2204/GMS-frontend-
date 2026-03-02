import { Box, TextField, Typography } from "@mui/material";

const CaratSize = ({ selectedData, isEditing, onCaratSizeChange }) => {
  const handleNameChange = (event) => {
    onCaratSizeChange(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
      <Box sx={{ display: "flex", marginRight: "44px" }}>
        <Typography
          sx={{
            color: "#343434",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          Carat Size :
        </Typography>
        <Typography
          sx={{
            color: "var(--Red, #E00410)",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            marginLeft: "2px",
            marginTop: "2px"
          }}
        >
          *
        </Typography>
      </Box>

      <TextField
        required
        disabled={!isEditing}
        value={selectedData?.master_info?.carat_size || ''}
        onChange={handleNameChange}
        id="outlined-required"
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: isEditing ? "#FFF" : "#F0F0F0",
            width: "328px",
            height: "42px",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8BB4FF",
            },
          },
        }}
      />
    </Box>
  );
};

export default CaratSize;
