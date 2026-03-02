import React from "react";
import { Box, Typography } from "@mui/material";
import {
  SidebarMenuBox,
  DropdownMenuBox,
  TextButton,
  TextMain,
  Dropdownmenu,
} from "../../../Assets/styles/NavbarStyles.jsx";
import { Link, useLocation } from "react-router-dom";



const NewTab = {
  // position: "absolute",
  top: "699px",
  right: "-180px",
  height: "156px",
  cursor: "default",
  // borderLeft: "1px solid #E4E8EC",
  zIndex: 99,
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  filter:
    "drop-shadow(0px 8px 8px rgba(24, 39, 75, 0.08)) drop-shadow(0px 4px 6px rgba(24, 39, 75, 0.12))",
};

const Other = ({ handleClick, showRedBox }) => {

  const location = useLocation();
  const isMainLocationActive = location.pathname === "/settings/main-location" || location.pathname.startsWith("/settings/main-location/");
  const isSubLocationActive = location.pathname === "/settings/sub-location" || location.pathname.startsWith("/settings/sub-location/");
  const isCurrencyActive = location.pathname === "/settings/currency" || location.pathname.startsWith("/settings/currency/");
  const isCertificateTypeActive = location.pathname === "/stone-master/certificate-type" || location.pathname.startsWith("/stone-master/certificate-type/");
  const isLabourTypeActive = location.pathname === "/stone-master/labour-type" || location.pathname.startsWith("/stone-master/labour-type/");
  const isActive = (location.pathname.startsWith("/settings") || location.pathname.startsWith("/stone-master/certificate-type") || location.pathname.startsWith("/stone-master/labour-type")) && !isMainLocationActive && !isSubLocationActive && !isCurrencyActive && !isCertificateTypeActive && !isLabourTypeActive;

  const activeColor = "#fff";
  const inactiveColor = "rgba(255, 255, 255, 0.48)";
  return (
    <>
      <Box
        onClick={handleClick}
        className="sidebar-menu-box"
        sx={[
          SidebarMenuBox,
          DropdownMenuBox(showRedBox, "Account"),
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
      >
        <Box sx={{ display: "flex", alignItems: "center", ml: "12px" }}>

          <Box sx={{ mr: "6px" }}>
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
              />
            </svg> */}

            <svg className="hovered-svg hovered-svg-arrow" width="4" height="8" viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0 8V0L4 4Z" fill="currentColor" stroke="none" strokeWidth="0" />
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
              d="M6.44754 2.75735C6.48427 2.37091 6.66376 2.01205 6.95094 1.75087C7.23812 1.4897 7.61235 1.34497 8.00054 1.34497C8.38872 1.34497 8.76296 1.4897 9.05014 1.75087C9.33732 2.01205 9.5168 2.37091 9.55354 2.75735C9.57561 3.00699 9.65751 3.24763 9.79229 3.45891C9.92707 3.67019 10.1108 3.84589 10.3278 3.97114C10.5449 4.09638 10.789 4.16749 11.0393 4.17843C11.2897 4.18938 11.539 4.13984 11.7662 4.03402C12.1189 3.87387 12.5187 3.8507 12.8875 3.96901C13.2564 4.08732 13.5681 4.33865 13.7619 4.67409C13.9557 5.00953 14.0177 5.40507 13.936 5.78373C13.8542 6.1624 13.6345 6.4971 13.3195 6.72269C13.1145 6.86658 12.9471 7.05776 12.8315 7.28004C12.7159 7.50231 12.6556 7.74916 12.6556 7.99969C12.6556 8.25021 12.7159 8.49706 12.8315 8.71934C12.9471 8.94161 13.1145 9.13279 13.3195 9.27669C13.6345 9.50228 13.8542 9.83697 13.936 10.2156C14.0177 10.5943 13.9557 10.9898 13.7619 11.3253C13.5681 11.6607 13.2564 11.9121 12.8875 12.0304C12.5187 12.1487 12.1189 12.1255 11.7662 11.9654C11.539 11.8595 11.2897 11.81 11.0393 11.8209C10.789 11.8319 10.5449 11.903 10.3278 12.0282C10.1108 12.1535 9.92707 12.3292 9.79229 12.5405C9.65751 12.7517 9.57561 12.9924 9.55354 13.242C9.5168 13.6285 9.33732 13.9873 9.05014 14.2485C8.76296 14.5097 8.38872 14.6544 8.00054 14.6544C7.61235 14.6544 7.23812 14.5097 6.95094 14.2485C6.66376 13.9873 6.48427 13.6285 6.44754 13.242C6.4255 12.9923 6.3436 12.7516 6.20878 12.5402C6.07396 12.3288 5.89018 12.1531 5.67302 12.0278C5.45586 11.9026 5.21172 11.8315 4.96126 11.8206C4.7108 11.8097 4.4614 11.8594 4.2342 11.9654C3.88146 12.1255 3.48175 12.1487 3.11287 12.0304C2.74399 11.9121 2.43232 11.6607 2.23853 11.3253C2.04473 10.9898 1.98268 10.5943 2.06444 10.2156C2.14621 9.83697 2.36594 9.50228 2.68087 9.27669C2.88595 9.13279 3.05336 8.94161 3.16893 8.71934C3.2845 8.49706 3.34484 8.25021 3.34484 7.99969C3.34484 7.74916 3.2845 7.50231 3.16893 7.28004C3.05336 7.05776 2.88595 6.86658 2.68087 6.72269C2.36638 6.49698 2.14704 6.16242 2.06547 5.78401C1.9839 5.4056 2.04594 5.01038 2.23953 4.67516C2.43311 4.33994 2.74441 4.08867 3.11293 3.97018C3.48145 3.85169 3.88086 3.87444 4.23354 4.03402C4.46071 4.13984 4.71003 4.18938 4.9604 4.17843C5.21078 4.16749 5.45482 4.09638 5.67189 3.97114C5.88896 3.84589 6.07266 3.67019 6.20745 3.45891C6.34223 3.24763 6.42413 3.00699 6.4462 2.75735"
              stroke="#D0D0D0"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
              stroke="#D0D0D0"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Typography
            className="hovered-text"
            sx={[
              TextButton,
              {
                color: showRedBox === "Other" ? "#05595B" : "#FFF",
              },
            ]}
          >
            Setup
          </Typography>
        </Box>
      </Box>
      {showRedBox === "Other" && (
        <Box
          sx={NewTab}
          data-dropdown-menu
          onClick={(e) => e.stopPropagation()}
        >
          <Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <Link to="/settings/main-location">
                <Typography sx={TextMain} className={isMainLocationActive ? "active" : ""}>Main Location</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">

              <Link to="/settings/sub-location">
                <Typography sx={TextMain} className={isSubLocationActive ? "active" : ""}>Sub Location</Typography>
              </Link>
            </Box>
            <Box sx={Dropdownmenu} className="hovered-box">

              <Link to="/settings/currency">
                <Typography sx={TextMain} className={isCurrencyActive ? "active" : ""}>Currency</Typography>
              </Link>
            </Box>

             <Box sx={Dropdownmenu} className="hovered-box">
                          <Link to="/stone-master/certificate-type/">
                            <Typography sx={TextMain} className={isCertificateTypeActive ? "active" : ""}>Certificate Type</Typography>
                          </Link>
                        </Box>
                        <Box sx={Dropdownmenu }  className="hovered-box">
                          <Link to="/stone-master/labour-type/">
                            <Typography sx={TextMain} className={isLabourTypeActive ? "active" : ""}>Labour Type</Typography>
                          </Link>
                        </Box>


          </Box>
        </Box>
      )}
    </>
  );
};

export default Other;
