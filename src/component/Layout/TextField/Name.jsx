import { Box, TextField, Typography } from "@mui/material";

const Name = ({ value, onChange }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
      <Box sx={{ display: "flex", marginRight: "71px" }}>
        <Typography
          sx={{
            color: "#343434",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          Name :
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
        value={value}
    onChange={onChange}
        id="outlined-required"
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#FFF",
            width: "328px",
            height: "42px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8BB4FF",
            },
            "&:hover": {
              backgroundColor: "#F5F8FF",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8BB4FF",
            },
          },
        }}
      />
    </Box>
  );
};

export default Name;
