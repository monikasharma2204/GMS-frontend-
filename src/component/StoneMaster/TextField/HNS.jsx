import { Box, TextField, Typography } from "@mui/material";

const HNS = ({ value, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Box sx={{ display: "flex", marginRight: "85px" }}>
        <Typography
          sx={{
            color: "#343434",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          HNS :
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
          &nbsp;
        </Typography>
      </Box>

      <TextField
        value={value}
        onChange={onChange}
        id="outlined-basic"
        sx={{
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

export default HNS;
