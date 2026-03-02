import { TextField } from "@mui/material";
import { QuotationtableRowsState } from "recoil/MemoReturn/MemoReturn";
import { useRecoilState } from "recoil";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/MemoReturn/MemoState.js";

const Ref1 = ({ onRef1Change, ref1, disabled = false }) => {

  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);

  return (
    <TextField
      id="outlined-required"
      label="Ref. 1 :"
      value={ref1}
       disabled={disabled}
      onChange={(e) => onRef1Change(e.target.value)}
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
        },
      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "415px",
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
        "& .MuiOutlinedInput-input::placeholder": {
          color:
            "var(--gbreadcrumbs-and-other-parts-text, var(--Text-Dis-Field, #9A9A9A))",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        
      }}
    />
  );
};

export default Ref1;
