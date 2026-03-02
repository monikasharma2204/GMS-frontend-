import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ProtectedLink from "../../Common/ProtectedLink";
import {
  SidebarMenuBox,
  DropdownMenuBox,
  TextButton,
  TextMain,
  Dropdownmenu,
} from "../../../Assets/styles/NavbarStyles.jsx";

const NewTab = {
  top: "549px",
  right: "-180px",
  width: "196px",
  height: "139px",
  cursor: "default",
  zIndex: 999,
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  filter:
    "drop-shadow(0px 8px 8px rgba(24, 39, 75, 0.08)) drop-shadow(0px 4px 6px rgba(24, 39, 75, 0.12))",
};

const NavBar = ({ handleClick, showRedBox }) => {
  const location = useLocation();
  const isMemoInActive = location.pathname === "/memo/memo-in" || location.pathname.startsWith("/memo/memo-in/");
  const isMemoReturnActive = location.pathname === "/memo/memo-return" || location.pathname.startsWith("/memo/memo-return/");
  const isMemoOutActive = location.pathname === "/memo/memo-out" || location.pathname.startsWith("/memo/memo-out/");
  const isMemoOutReturnActive = location.pathname === "/memo/memo-out-return" || location.pathname.startsWith("/memo/memo-out-return/");
  const isActive = location.pathname.startsWith("/memo") && !isMemoInActive && !isMemoReturnActive && !isMemoOutActive && !isMemoOutReturnActive;

  return (
    <>
      <Box
        onClick={handleClick}
        className="sidebar-menu-box"
        sx={[
          SidebarMenuBox,
          DropdownMenuBox,
          isActive && {
            ".hovered-text": {
              color: "#fff",
            },
            ".hovered-svg path": {
              stroke: "#fff",
            },
          },
        ]}
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
                d="M2.25 19.4994L9.525 12.5394C9.825 12.2394 9.825 11.7744 9.525 11.4744L2.79 4.70938"
                stroke={isActive ? "#fff" : "rgba(255,255,255,0.48)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}

            <svg className="hovered-svg hovered-svg-arrow" width="4" height="8" viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L0 8V0L4 4Z"  fill={isActive ? "#fff" : "rgba(255,255,255,0.48)"}  strokeWidth="0" />
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
              d="M13 9.5V7.75C13 7.15326 12.7629 6.58097 12.341 6.15901C11.919 5.73705 11.3467 5.5 10.75 5.5H9.75C9.55109 5.5 9.36032 5.42098 9.21967 5.28033C9.07902 5.13968 9 4.94891 9 4.75V3.75C9 3.15326 8.76295 2.58097 8.34099 2.15901C7.91903 1.73705 7.34674 1.5 6.75 1.5H5.5M5.5 10H10.5M5.5 12H8M7 1.5H3.75C3.336 1.5 3 1.836 3 2.25V13.75C3 14.164 3.336 14.5 3.75 14.5H12.25C12.664 14.5 13 14.164 13 13.75V7.5C13 5.9087 12.3679 4.38258 11.2426 3.25736C10.1174 2.13214 8.5913 1.5 7 1.5Z"
              stroke={isActive ? "#fff" : "rgba(255,255,255,0.48)"}
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
                color: isActive
                  ? "#fff"
                  : showRedBox === "Memo"
                    ? "#05595B"
                    : "rgba(255,255,255,0.48)",
              },
            ]}
          >
            Memo
          </Typography>
        </Box>
      </Box>

      {showRedBox === "Memo" && (
        <Box
          sx={NewTab}
          data-dropdown-menu
          onClick={(e) => e.stopPropagation()}
        >
          <Box>
            <Box sx={Dropdownmenu} className="hovered-box">
              <ProtectedLink to="/memo/memo-in">
                <Typography sx={TextMain} className={isMemoInActive ? "active" : ""}>Memo In</Typography>
              </ProtectedLink>
            </Box>

            <Box sx={Dropdownmenu} className="hovered-box">
              <ProtectedLink to="/memo/memo-return">
                <Typography sx={TextMain} className={isMemoReturnActive ? "active" : ""}>Memo Return</Typography>
              </ProtectedLink>
            </Box>

            <Box sx={Dropdownmenu} className="hovered-box">
              <ProtectedLink to="/memo/memo-out">
                <Typography sx={TextMain} className={isMemoOutActive ? "active" : ""}>Memo Out</Typography>
              </ProtectedLink>
            </Box>

            <Box sx={Dropdownmenu} className="hovered-box">
              <ProtectedLink to="/memo/memo-out-return">
                <Typography sx={TextMain} className={isMemoOutReturnActive ? "active" : ""}>Memo Out Return</Typography>
              </ProtectedLink>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NavBar;
