import { Box, TextField, Typography } from "@mui/material";

const AccountNumber = ({ selectedData, isEditing, onNameChange }) => {
  const handleNameChange = (event) => {
    onNameChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Box sx={{ display: "flex", width: "160px"  }}>
        <Typography
          sx={{
            color: "#343434",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          Account Number :
        </Typography>
        <Typography
          sx={{
            color: "var(--Red, #E00410)",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            marginLeft: "2px",
            marginTop: "2px",
          }}
        >
          *
        </Typography>
      </Box>

      <TextField
        disabled={!isEditing}
        required
        value={selectedData?.name || ""}
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

export default AccountNumber;
