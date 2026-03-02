import { TextField } from "@mui/material";
import { useRecoilState } from "recoil";
import { QuotationtableRowsState } from "recoil/MemoReturn/MemoReturn";
import {
  keyEditState,
  memoInfoState,
  selectedCurrencyState,
} from "recoil/MemoReturn/MemoState.js";

const Ref2 = ({ onRef2Change, ref2, disabled = false }) => {
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);

  return (
    <TextField
      id="outlined-required"
      label="Ref. 2 :"
      value={ref2}
      disabled={disabled}
      onChange={(e) => onRef2Change(e.target.value)}
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
          width: "425px",
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
        marginLeft: "35px"
      }}
    />
  );
};

export default Ref2;
