import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import USA from "../pic/usa.png";
import Bell from "../pic/bell.png";
import Power from "../pic/power.png";
import Account from "../pic/account.png";
import Bell1 from "../pic/bell1.png";
import Power1 from "../pic/power1.png";
import "../Style/BarStyles.css";

const Bar = () => {
  const [isHoveredBell, setIsHoveredBell] = useState(false);
  const [isHoveredPower, setIsHoveredPower] = useState(false);

  const handleHoverBell = () => {
    setIsHoveredBell(true);
  };

  const handleUnhoverBell = () => {
    setIsHoveredBell(false);
  };

  const handleHoverPower = () => {
    setIsHoveredPower(true);
  };

  const handleUnhoverPower = () => {
    setIsHoveredPower(false);
  };

  return (
    <>
      <Box className="boxStyle">
        <Typography className="fontHelp">help</Typography>
        <Box className="menu">
          <Box className="usa">
            <img src={USA} alt="USA" className="img"/>
          </Box>
          <Box className="bell">
            <img src={isHoveredBell ? Bell1 : Bell} alt="Bell" className="img" onMouseEnter={handleHoverBell} onMouseLeave={handleUnhoverBell} />
          </Box>
          <Box className="account">
            <img src={Account} alt="Account" style={{ height:"20px", width:"20px"}} />
            <Typography sx={{ color: "white", paddingLeft: "5px" }}>SuperAdmin</Typography>
          </Box>
          <Box className="power">
            <img src={isHoveredPower ? Power1 : Power} alt="Power" className="img" onMouseEnter={handleHoverPower} onMouseLeave={handleUnhoverPower}/>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Bar;
