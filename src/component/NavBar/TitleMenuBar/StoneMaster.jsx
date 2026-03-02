import React from "react";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  TextButton,
  ButtonOnNavBarWithOutRightArrow,
  SidebarMenuBox,
  DropdownMenuBox,
  Dropdownmenu,
  TextMain,
} from "../../../Assets/styles/NavbarStyles.jsx";

const NewTab = {

  top: "345px",
  right: "-180px",
  Color: "#FFF",
  width: "180px",
  cursor: "default",
  zIndex: 999,
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  filter:
    "drop-shadow(0px 8px 8px rgba(24, 39, 75, 0.08)) drop-shadow(0px 4px 6px rgba(24, 39, 75, 0.12))",
};

const TextHeader = {
  color: "var(--Muay-Black, #343434)",
  fontFamily: "Calibri",
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
  marginLeft: "16px",
  marginTop: "24px",
  marginBottom: "24px",
};

const TextTitle = {
  color: "var(--Muay-Black, #343434)",
  fontFamily: "Calibri",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  marginLeft: "16px",
  marginTop: "16px",
};

const StoneMaster = ({ handleClick, showRedBox  }) => {


  const location = useLocation();
  const isStoneGroupActive = location.pathname === "/stone-master/stone-group" || location.pathname.startsWith("/stone-master/stone-group/");
  const isStoneActive = location.pathname === "/stone-master/stone" || location.pathname.startsWith("/stone-master/stone/");
  const isShapeActive = location.pathname === "/stone-master/shape" || location.pathname.startsWith("/stone-master/shape/");
  const isSizeActive = location.pathname === "/stone-master/size" || location.pathname.startsWith("/stone-master/size/");
  const isColorActive = location.pathname === "/stone-master/color" || location.pathname.startsWith("/stone-master/color/");
  const isCuttingActive = location.pathname === "/stone-master/cutting" || location.pathname.startsWith("/stone-master/cutting/");
  const isClarityActive = location.pathname === "/stone-master/clarity" || location.pathname.startsWith("/stone-master/clarity/");
  const isQualityActive = location.pathname === "/stone-master/quality" || location.pathname.startsWith("/stone-master/quality/");
  const isCertificateTypeActive = location.pathname === "/stone-master/certificate-type" || location.pathname.startsWith("/stone-master/certificate-type/");
  const isLabourTypeActive = location.pathname === "/stone-master/labour-type" || location.pathname.startsWith("/stone-master/labour-type/");
  const isActive = location.pathname.startsWith("/stone-master") && !isStoneGroupActive && !isStoneActive && !isShapeActive && !isSizeActive && !isColorActive && !isCuttingActive && !isCertificateTypeActive && !isLabourTypeActive && !isClarityActive && !isQualityActive;

  const activeColor = "#fff";
  const inactiveColor = "rgba(255, 255, 255, 0.48)";

  return (
    <>
      <Box
        className="sidebar-menu-box"
        sx={[
          SidebarMenuBox,
          DropdownMenuBox(showRedBox, "Stone Master"),
          {
            color: isActive ? activeColor : inactiveColor,
            "& .hovered-text": {
              color: "currentColor",
            },
            "& .hovered-svg path": {
              stroke: "currentColor",
            },
          },
        ]}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "12px" }}>
          <Box sx={{ marginRight: "6px" }}>
            {/* <svg
              className="hovered-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="12"
              viewBox="0 0 11 24"
              fill="none"
            >
              <path
                d="M2.25 19.4994C2.15164 19.5006 2.05411 19.4812 1.96369 19.4424C1.87328 19.4037 1.79197 19.3464 1.725 19.2744C1.425 18.9744 1.425 18.5094 1.725 18.2094L7.95 11.9844L1.725 5.77437C1.425 5.47437 1.425 5.00938 1.725 4.70938C2.025 4.40938 2.49 4.40938 2.79 4.70938L9.525 11.4744C9.825 11.7744 9.825 12.2394 9.525 12.5394L2.775 19.2744C2.625 19.4244 2.43 19.4994 2.25 19.4994Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}
                <svg className="hovered-svg hovered-svg-arrow" width="4" height="8" viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0 8V0L4 4Z" fill="currentColor" stroke="none" strokeWidth= "0"  />
            </svg>
          </Box>
          <svg
            className="hovered-svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.70796 2.17745C7.73673 2.12518 7.77901 2.0816 7.83037 2.05125C7.88173 2.02089 7.9403 2.00488 7.99996 2.00488C8.05962 2.00488 8.11818 2.02089 8.16955 2.05125C8.22091 2.0816 8.26318 2.12518 8.29196 2.17745L10.26 5.91345C10.3069 5.99995 10.3724 6.075 10.4518 6.13319C10.5311 6.19138 10.6224 6.23128 10.719 6.25002C10.8156 6.26876 10.9152 6.26587 11.0106 6.24156C11.106 6.21726 11.1948 6.17214 11.2706 6.10945L14.122 3.66678C14.1767 3.62226 14.2441 3.59626 14.3146 3.59251C14.3851 3.58877 14.4549 3.60748 14.514 3.64594C14.5732 3.68441 14.6186 3.74065 14.6437 3.80657C14.6689 3.87249 14.6725 3.94469 14.654 4.01278L12.7646 10.8434C12.7261 10.9832 12.643 11.1066 12.528 11.1949C12.413 11.2832 12.2723 11.3316 12.1273 11.3328H3.87329C3.72818 11.3318 3.58736 11.2834 3.47222 11.1951C3.35707 11.1068 3.27389 10.9833 3.23529 10.8434L1.34662 4.01345C1.32812 3.94536 1.3317 3.87316 1.35685 3.80724C1.382 3.74132 1.42741 3.68508 1.48656 3.64661C1.5457 3.60814 1.61553 3.58944 1.68598 3.59318C1.75644 3.59692 1.82389 3.62293 1.87862 3.66745L4.72929 6.11011C4.80516 6.17281 4.89396 6.21793 4.98933 6.24223C5.0847 6.26654 5.18427 6.26942 5.28089 6.25069C5.37751 6.23195 5.46878 6.19205 5.54815 6.13386C5.62752 6.07567 5.69303 6.00062 5.73996 5.91411L7.70796 2.17745Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33301 14H12.6663"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Typography className="hovered-text" sx={TextButton}>
            Stone Master
          </Typography>
        </Box>
      </Box>
      {showRedBox === "Stone Master" && (

        
        <Box sx={NewTab} 
        onClick={(e) => e.stopPropagation()}  >
          <Box>
            <Box sx={Dropdownmenu}  className="hovered-box">
              <Link to="/stone-master/stone-group">
                <Typography sx={TextMain} className={isStoneGroupActive ? "active" : ""}>Stone Group</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/stone/">
                <Typography sx={TextMain} className={isStoneActive ? "active" : ""}>Stone</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/shape/">
                <Typography sx={TextMain} className={isShapeActive ? "active" : ""}>Shape</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/size/">
                <Typography sx={TextMain} className={isSizeActive ? "active" : ""}>Size</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/color">
                <Typography sx={TextMain} className={isColorActive ? "active" : ""}>Color</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/cutting/">
                <Typography sx={TextMain} className={isCuttingActive ? "active" : ""}>Cutting</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/quality/">
                <Typography sx={TextMain} className={isQualityActive ? "active" : ""}>Quality</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/stone-master/clarity/">
                <Typography sx={TextMain} className={isClarityActive ? "active" : ""}>Clarity</Typography>
              </Link>
            </Box>
           
          </Box>
        </Box>
      )}
    </>
  );
};

export default StoneMaster;
