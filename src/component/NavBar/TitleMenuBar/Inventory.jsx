import { React, useState, useEffect, useLayoutEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ProtectedLink from "../../Common/ProtectedLink";

import {
  SidebarMenuBox,
  DropdownMenuBox,
  TextButton,
  DropdownMenuReport,
  TextMain,
  Dropdownmenu,
  DropdownMenuTransfer,
  DropdownMenuBoxReport,
  DropdownMenuBoxTransfer,
  TextMainTransfer,
  TextMainReport,
} from "../../../Assets/styles/NavbarStyles.jsx";

const NewTab = {
  top: "600px",
  right: "-180px",
  // width: "180px",
  // height: "160px",
  cursor: "default",
  zIndex: 999,
  borderTopRightRadius: "10px",
  borderBottomRightRadius: "10px",
  filter:
    "drop-shadow(0px 8px 8px rgba(24, 39, 75, 0.08)) drop-shadow(0px 4px 6px rgba(24, 39, 75, 0.12))",
};

const Inventory = ({ handleClick, showRedBox, openInventory,
  setOpenInventory,
  openReport,
  setOpenReport,
  openTransfer,
  setOpenTransfer }) => {



  const location = useLocation();

  const isPathActive = (path, fromParamValue = null) => {
    const urlParams = new URLSearchParams(location.search);
    const currentFromParam = urlParams.get('from');
    const navState = location.state;

    const pathMatches = location.pathname.includes(path);
    if (!pathMatches) return false;

    if (fromParamValue) {
      return (currentFromParam === fromParamValue) ||
        (fromParamValue === 'report' && navState?.fromReport) ||
        (fromParamValue === 'transfer' && navState?.fromTransfer);
    }

    return true;
  };

  const hasReportChildActive = isPathActive("/inventory/report/");
  const hasTransferChildActive = isPathActive("/inventory/transfer/");
  const hasLoadActive = isPathActive("/inventory/load");
  const hasAnyChildActive = hasReportChildActive || hasTransferChildActive || hasLoadActive;

  const isInventoryActive = false;
  const isStockReportActive = hasReportChildActive;
  const isStockTransferActive = hasTransferChildActive;


  useEffect(() => {
    if (showRedBox && showRedBox !== "Inventory") {
      setOpenInventory(false);
      setOpenReport(false);
      setOpenTransfer(false);
    }
  }, [showRedBox]);

  useLayoutEffect(() => {
    if (location.pathname.startsWith("/inventory")) {

      setOpenInventory(true);

      const urlParams = new URLSearchParams(location.search);
      const fromParam = urlParams.get('from');
      setOpenReport((prevOpenReport) => {
        const urlParams = new URLSearchParams(location.search);
        const fromParam = urlParams.get('from');
        const navState = location.state;

        if (fromParam === 'report') {
          return true;
        } else if (fromParam === 'transfer') {
          return false;
        } else if (navState?.fromReport) {
          return true;
        } else if (navState?.fromTransfer) {
          return false;
        } else if (
          location.pathname.includes("/inventory/report/")
        ) {
          return true;
        }

        if (prevOpenReport && (
          location.pathname.includes("/primary") ||
          location.pathname.includes("/consignment") ||
          location.pathname.includes("/stockmovement")
        )) {
          return true;
        }

        return prevOpenReport;
      });

      setOpenTransfer((prevOpenTransfer) => {
        const urlParams = new URLSearchParams(location.search);
        const fromParam = urlParams.get('from');
        const navState = location.state;

        if (fromParam === 'transfer') {
          return true;
        } else if (fromParam === 'report') {
          return false;
        } else if (navState?.fromTransfer) {
          return true;
        } else if (navState?.fromReport) {
          return false;
        } else if (location.pathname.includes("/inventory/transfer/")) {
          return true;
        }

        return prevOpenTransfer;
      });
    }
  }, [location.pathname, location.search, location.state]);


  return (
    <>
      <Box
        // onClick={handleClick}

        onClick={(e) => {
          e.stopPropagation();
          setOpenInventory((prev) => !prev);

          if (openInventory) {
            setOpenReport(false);
            setOpenTransfer(false);
          }
          handleClick();
        }}
        className={`sidebar-menu-box ${isInventoryActive ? 'active' : ''}`}
        sx={[
          SidebarMenuBox,
          DropdownMenuBox(openInventory ? "Inventory" : "", "Inventory"),
        ]}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "12px" }}>
          <Box sx={{ marginRight: "6px" }}>
            <svg
              className="hovered-svg hovered-svg-arrow"
              width="4"
              height="8"
              viewBox="0 0 4 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L0 8V0L4 4Z"
                fill="currentColor"
                stroke="none"
                strokeWidth="0"
              />
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
              d="M7.33333 14.4867C7.53603 14.6037 7.76595 14.6653 8 14.6653C8.23405 14.6653 8.46397 14.6037 8.66667 14.4867L13.3333 11.82C13.5358 11.7031 13.704 11.535 13.821 11.3326C13.938 11.1301 13.9998 10.9005 14 10.6667V5.33335C13.9998 5.09953 13.938 4.86989 13.821 4.66746C13.704 4.46503 13.5358 4.29692 13.3333 4.18002L8.66667 1.51335C8.46397 1.39633 8.23405 1.33472 8 1.33472C7.76595 1.33472 7.53603 1.39633 7.33333 1.51335L2.66667 4.18002C2.46418 4.29692 2.29599 4.46503 2.17897 4.66746C2.06196 4.86989 2.00024 5.09953 2 5.33335V10.6667C2.00024 10.9005 2.06196 11.1301 2.17897 11.3326C2.29599 11.535 2.46418 11.7031 2.66667 11.82L7.33333 14.4867Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 14.6667V8"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.19336 4.66675L8.00003 8.00008L13.8067 4.66675"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 2.84668L11 6.28001"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Typography className="hovered-text" sx={TextButton}>
            Inventory
          </Typography>
        </Box>
      </Box>

      {/* DROPDOWN */}
      {/* {showRedBox === "Inventory" && ( */}

      {openInventory && (
        <Box
          sx={NewTab}
          onClick={(e) => e.stopPropagation()}
          data-dropdown-menu
        // onClick={(e) => e.stopPropagation()}
        >
          <ProtectedLink to="/inventory/load">
            <Box sx={Dropdownmenu} className="hovered-box">
              <Typography
                className={isPathActive("/inventory/load") ? "active" : ""}
                sx={TextMain}
              >Load</Typography>
            </Box>
          </ProtectedLink>


          <Box
            // onClick={handleClick}
            onClick={(e) => {
              e.stopPropagation();
              setOpenReport((prev) => !prev);
              setOpenTransfer(false); // close transfer
            }}

            className={`sidebar-menu-box ${isStockReportActive ? 'active' : ''}`}
            sx={[
              SidebarMenuBox,
              DropdownMenuBoxReport(),
            ]}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "46px",
              }}
            >
              <Box sx={{ marginRight: "6px" }}>
                <svg
                  className="hovered-svg hovered-svg-arrow"
                  width="4"
                  height="8"
                  viewBox="0 0 4 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L0 8V0L4 4Z"
                    fill="currentColor"
                    stroke="none"
                    strokeWidth="0"
                  />
                </svg>
              </Box>

              <Typography className="hovered-text" sx={TextButton}>
                Stock Report
              </Typography>
            </Box>
          </Box>
          {/* {showRedBox === "Inventory" && ( */}
          {openReport && (
            <Box
              sx={NewTab}
              data-dropdown-menu
              onClick={(e) => e.stopPropagation()}
            >
              <Box>


                <Box sx={DropdownMenuReport} className="hovered-box">
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={DropdownMenuReport}
                  >
                    <ProtectedLink
                      to="/inventory/report/primary"
                    >
                      <Typography
                        className={isPathActive("/inventory/report/primary") ? "active" : ""}
                        sx={TextMainReport}
                      >Primary</Typography>
                    </ProtectedLink>
                  </Box>
                </Box>
                <Box sx={DropdownMenuReport} className="hovered-box">
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={DropdownMenuReport}
                  >
                    <ProtectedLink
                      to="/inventory/report/consignment"
                    >
                      <Typography
                        className={isPathActive("/inventory/report/consignment") ? "active" : ""}
                        sx={TextMainReport}
                      >Consignment</Typography>
                    </ProtectedLink>
                  </Box>
                </Box>
                <Box sx={DropdownMenuReport} className="hovered-box">
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={DropdownMenuReport}
                  >
                    <ProtectedLink
                      to="/inventory/report/stock-check"
                    >
                      <Typography
                        className={isPathActive("/inventory/report/stock-check") ? "active" : ""}
                        sx={TextMainReport}
                      >Stock Check</Typography>
                    </ProtectedLink>
                  </Box>
                </Box>

                <Box sx={DropdownMenuReport} className="hovered-box">
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={DropdownMenuReport}
                  >
                    <ProtectedLink
                      to="/inventory/report/cons-check"
                    >
                      <Typography
                        className={isPathActive("/inventory/report/cons-check") ? "active" : ""}
                        sx={TextMainReport}
                      >Cons Check</Typography>
                    </ProtectedLink>
                  </Box>
                </Box>


              </Box>
            </Box>
          )}

          <Box
            // onClick={handleClick}
            onClick={(e) => {
              e.stopPropagation();
              setOpenTransfer((prev) => !prev);
              setOpenReport(false); // close report
            }}
            className={`sidebar-menu-box ${isStockTransferActive ? 'active' : ''}`}
            sx={[
              SidebarMenuBox,
              DropdownMenuBoxTransfer(openTransfer ? "Inventory" : ""),
            ]}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "46px",
              }}
            >
              <Box sx={{ marginRight: "6px" }}>
                <svg
                  className="hovered-svg hovered-svg-arrow"
                  width="4"
                  height="8"
                  viewBox="0 0 4 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L0 8V0L4 4Z"
                    fill="currentColor"
                    stroke="none"
                    strokeWidth="0"
                  />
                </svg>
              </Box>

              <Typography className="hovered-text" sx={TextButton}>
                Stock Transfer
              </Typography>
            </Box>
          </Box>
          {/* {showRedBox === "Inventory" && ( */}

          {openTransfer && (
            <Box
              sx={NewTab}
              data-dropdown-menu
              onClick={(e) => e.stopPropagation()}
            >
              <Box>
                <Box sx={DropdownMenuTransfer} className="hovered-box">
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={DropdownMenuTransfer}
                  >
                    <ProtectedLink
                      to="/inventory/transfer/merge-split"
                    >
                      <Typography
                        className={isPathActive("/inventory/transfer/merge-split") ? "active" : ""}
                        sx={TextMainTransfer}
                      >Merge & Split</Typography>
                    </ProtectedLink>
                  </Box>
                </Box>
                <Box sx={DropdownMenuTransfer} className="hovered-box">
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={DropdownMenuTransfer}
                  >
                    <ProtectedLink
                      to="/inventory/transfer/location-transfer"
                    >
                      <Typography
                        className={isPathActive("/inventory/transfer/location-transfer") ? "active" : ""}
                        sx={TextMainTransfer}
                      >Transfer</Typography>
                    </ProtectedLink>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default Inventory;
