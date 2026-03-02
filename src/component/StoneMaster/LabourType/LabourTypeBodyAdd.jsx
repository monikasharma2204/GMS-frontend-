import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Name from "../TextField/Name";
import Code from "../TextField/Code";
import IOSSwitch from "../../SwitchIOSStyle";
import Price from "../TextField/Price";

const LabourTypeBodyAdd = ({
  name,
  setName,
  code,
  setCode,
  status,
  setStatus,
  pricePcs,
  setPricePcs,
  priceCts,
  setPriceCts,
  priceType,
  setPriceType,
}) => {
  useEffect(()=>{
console.log(pricePcs)
  },[])
  return (
    <>
      <Box
        sx={{
          width: "1395px",
          height: "720px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: "1322px",
            height: "655px",
            backgroundColor: "var(--BG-Paper, #F8F8F8)",
            borderTopLeftRadius: "5px",
            marginTop: "24px",
            marginLeft: "24px",
            padding: "32px 24px",
          }}
        >
          <Code value={code} onChange={(e) => setCode(e.target.value)} />
          <Box sx={{ marginTop: "24px" }}>
            <Name value={name} onChange={(e) => setName(e.target.value)} />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <Price
              pricePcs={pricePcs}
              setPricePcs={setPricePcs}
              priceCts={priceCts}
              setPriceCts={setPriceCts}
              priceType={priceType}
              setPriceType={setPriceType}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: "24px",
            }}
          >
            <IOSSwitch
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              label="Active"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LabourTypeBodyAdd;
