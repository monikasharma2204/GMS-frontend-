import React, { useState } from "react";
import { Box, Drawer, List,  ListItem, ListItemIcon, ListItemText, CssBaseline, Typography } from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import Bar from "../container/Bar.jsx";
import PurchaseTitle from "../container/PurchaseTitle.jsx";
import PurchaseBody from "../container/PurchaseBody.jsx";
import Home from "../pic/Navbar/home.png";
import Dashboard from "../pic/Navbar/dashboard.png";
import Company from "../pic/Navbar/company.png";
import UserPer from "../pic/Navbar/User.png";
import Account from "../pic/Navbar/Account.png";
import StoneMas from "../pic/Navbar/stonemaster.png";
import Quotation from "../pic/Navbar/quotation.png";
import Reserve from "../pic/Navbar/Reserve.png";
import PurOrder from "../pic/Navbar/order.png";
import Memo from "../pic/Navbar/memo.png";
import Inventory from "../pic/Navbar/inventory.png";
import Sale from "../pic/Navbar/sale.png";
import Finance from "../pic/Navbar/finance.png";
import Report from "../pic/Navbar/report.png";
import Other from "../pic/Navbar/other.png";
import Setup from "../pic/Navbar/Setup.png";
import Logo from "../pic/Navbar/Logo.png";
import Unpin from "../pic/Navbar/unpin.png";
import Pin from "../pic/Navbar/pin.png";
import "../Style/PurchasePageStyles.css"

const drawerWidth = 223;
const collapsedDrawerWidth = 56;

const PurchasePage = () => {
  const [open, setOpen] = useState(false);
  const [permanentOpen, setPermanentOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleDrawerToggle = () => {
    setPermanentOpen(!permanentOpen);
    setOpen(!permanentOpen);
    setIsPinned(!isPinned);
    setSelectedMenu(null);
  };

  const handleMouseEnter = () => {
    if (!permanentOpen) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!permanentOpen && !selectedMenu) {
      setOpen(false);
    }
  };

  const handleMenuClick = (menu) => {
    if (selectedMenu === menu) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(menu);
      setOpen(true);
    }
  };

  const handleBoxMouseLeave = () => {
    if (!permanentOpen) {
      setSelectedMenu(null);
      setOpen(false);
    }
  };

  const handleShowSelectedRows = (selectedData) => {
    setSelectedRows(selectedData);
  };

  const getIcon = (index) => {
    switch (index) {
      case 0:
        return <img src={Home} alt="Home" style={{ width: 20, height: 20 }} />;
      case 1:
        return (
          <img
            src={Dashboard}
            alt="Dashboard"
            style={{ width: 20, height: 20 }}
          />
        );
      case 2:
        return (
          <img src={Company} alt="Company" style={{ width: 20, height: 20 }} />
        );
      case 3:
        return (
          <img src={UserPer} alt="UserPer" style={{ width: 20, height: 20 }} />
        );
      case 4:
        return (
          <img src={Account} alt="Account" style={{ width: 20, height: 20 }} />
        );
      case 5:
        return (
          <img
            src={StoneMas}
            alt="StoneMas"
            style={{ width: 20, height: 20 }}
          />
        );
      case 6:
        return (
          <img
            src={Quotation}
            alt="Quotation"
            style={{ width: 20, height: 20 }}
          />
        );
      case 7:
        return (
          <img src={Reserve} alt="Reserve" style={{ width: 20, height: 20 }} />
        );
      case 8:
        return (
          <img
            src={PurOrder}
            alt="PurOrder"
            style={{ width: 20, height: 20 }}
          />
        );
      case 9:
        return <img src={Memo} alt="Memo" style={{ width: 20, height: 20 }} />;
      case 10:
        return (
          <img
            src={Inventory}
            alt="Inventory"
            style={{ width: 20, height: 20 }}
          />
        );
      case 11:
        return <img src={Sale} alt="Sale" style={{ width: 20, height: 20 }} />;
      case 12:
        return (
          <img src={Finance} alt="Finance" style={{ width: 20, height: 20 }} />
        );
      case 13:
        return (
          <img src={Report} alt="Report" style={{ width: 20, height: 20 }} />
        );
      case 14:
        return (
          <img src={Other} alt="Other" style={{ width: 20, height: 20 }} />
        );
      case 15:
        return (
          <img src={Setup} alt="Setup" style={{ width: 20, height: 20 }} />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }} onMouseLeave={handleBoxMouseLeave} >
      <CssBaseline />

      <Drawer variant="permanent"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{ width: open ? drawerWidth : collapsedDrawerWidth, flexShrink: 0, whiteSpace: "nowrap", transition: "width 0.3s",
                    "& .MuiDrawer-paper": { width: open ? drawerWidth : collapsedDrawerWidth, transition: "width 0.3s", overflowX: "hidden", boxSizing: "border-box"}}}>
        <List>
          <ListItem>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between"}}>
              <Box>
                <img src={Logo} 
                     alt="Logo"
                     style={{ width: open ? 100 : 24, height: open ? 100 : 24, position: "relative", top: open ? "50%" : "initial", left: open ? "48%" : "initial"}}/>
              </Box>
              <Box sx={{ paddingBottom: "80px" }}>
                {open && ( <img onClick={handleDrawerToggle}
                                src={isPinned ? Pin : Unpin}
                                alt="PinToggle"
                                style={{ width: 24, height: 24, cursor: "pointer"}}/>
                )}
              </Box>
            </Box>
          </ListItem>
          {[
            "Home",
            "Dashboard",
            "Company",
            "User & Permission",
            "Account",
            "Stone Master",
            "Quotation",
            "Reserve",
            "Purchase Order",
            "Memo",
            "Inventory",
            "Sale",
            "Finance",
            "Report",
            "Other",
            "Setup",
          ].map((text, index) => (
            <ListItem button key={text} onClick={() => handleMenuClick(text)}>
              <ListItemIcon>{getIcon(index)}</ListItemIcon>
              {open && (
                <>
                  <ListItemText primary={text} />
                  {(text === "Company" ||
                    text === "Account" ||
                    text === "Stone Master" ||
                    text === "Purchase Order" ||
                    text === "Memo" ||
                    text === "Inventory" ||
                    text === "Finance" ||
                    text === "Other") && <ChevronRightIcon />}
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ marginLeft: permanentOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`, transition: "margin-left 0.3s", flexGrow: 1}}>
        <Bar/>
        <PurchaseTitle onShowSelectedRows={handleShowSelectedRows} />
        <PurchaseBody selectedRows={selectedRows}/>
      </Box>

      {selectedMenu === "Company" && (
        <Box onMouseLeave={handleBoxMouseLeave} className="customContainer1">
          <Box className="customHeader1">
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Company</Typography>
          </Box>
          <Box className="customSubContainer1">
            <Typography sx={{ color: "343434" }}>Company</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Company Profile</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2" >• Bank</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Account" && (
        <Box onMouseLeave={handleBoxMouseLeave} className="customContainer2">
          <Box className="customSubContainer2">
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Account</Typography>
          </Box>
          <Box className="boxContaiinder">
            <Typography sx={{ color: "343434" }}>Account</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Vendor</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Customer</Typography>
              <Typography sx={{ color: "#ACACAC", fontSize: "14px", marginTop: "15px" }}>• Associated</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Stone Master" && (
        <Box onMouseLeave={handleBoxMouseLeave} className="customContainer3">
          <Box className="customSubContainer3">
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Stone Master</Typography>
          </Box>
          <Box className="boxContaiinder">
            <Typography sx={{ color: "343434" }}>Stone Master</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Stone group</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Stone</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Shape</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Size</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Color</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Cutting</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Quality</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Clarity</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Certificate Type</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Labour Type</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Purchase Order" && (
        <Box onMouseLeave={handleBoxMouseLeave}
             sx={{ position: "absolute", top: 0, left: permanentOpen ? `${223}px` : `${223}px`, width: "255px", height: "114vh", backgroundColor: "#EAEAF4", zIndex: 1300, transition: "left 0.3s"}}>
          <Box sx={{ height: "70px", borderBottom: "1px solid #ccc", borderColor: "white", display: "flex", alignItems: "center", paddingLeft: "15px" }}>
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Purchase Order</Typography>
          </Box>
          <Box sx={{ height: "70px", paddingLeft: "15px", paddingTop: "15px" }}>
            <Typography sx={{ color: "343434" }}>Purchase Order</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Purchase Order (PO)</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Purchase (PO)</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Memo" && (
        <Box onMouseLeave={handleBoxMouseLeave}
             sx={{ position: "absolute", top: 0, left: permanentOpen ? `${223}px` : `${223}px`,  width: "255px", height: "114vh", backgroundColor: "#EAEAF4", zIndex: 1300, transition: "left 0.3s" }}>
          <Box sx={{ height: "70px", borderBottom: "1px solid #ccc", borderColor: "white", display: "flex", alignItems: "center", paddingLeft: "15px"}}>
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Memo</Typography>
          </Box>
          <Box sx={{ height: "70px", paddingLeft: "15px", paddingTop: "15px"}}>
            <Typography sx={{ color: "343434" }}>Memo</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Memo In</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Memo Return</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Memo Out</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Memo Out Return</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Inventory" && (
        <Box onMouseLeave={handleBoxMouseLeave} 
             sx={{ position: "absolute", top: 0, left: permanentOpen ? `${223}px` : `${223}px`, width: "255px", height: "114vh", backgroundColor: "#EAEAF4", zIndex: 1300, transition: "left 0.3s" }}>
          <Box sx={{ height: "70px", borderBottom: "1px solid #ccc", borderColor: "white", display: "flex", alignItems: "center", paddingLeft: "15px"}}>
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Inventory</Typography>
          </Box>
          <Box sx={{ height: "70px", paddingLeft: "15px", paddingTop: "15px" }}>
            <Typography sx={{ color: "343434" }}>Inventory</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• All</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Primary</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Consignment</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Load
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Finance" && (
        <Box onMouseLeave={handleBoxMouseLeave}
        sx={{ position: "absolute", top: 0, left: permanentOpen ? `${223}px` : `${223}px`, width: "255px", height: "114vh", backgroundColor: "#EAEAF4", zIndex: 1300, transition: "left 0.3s" }}>
          <Box
            sx={{ height: "70px", borderBottom: "1px solid #ccc", borderColor: "white", display: "flex", alignItems: "center", paddingLeft: "15px"}}>
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Finance</Typography>
          </Box>
          <Box sx={{ height: "70px", paddingLeft: "15px", paddingTop: "15px" }}>
            <Typography sx={{ color: "343434" }}>Finance</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Outstanding Receipt</Typography>
              <Typography sx={{ color: "#343434", fontSize: "14px", "&:hover": { color: "#0072EC" }, paddingTop:"10px", paddingLeft:"15px" }}>- Payable</Typography>
              <Typography sx={{ color: "#343434", fontSize: "14px", "&:hover": { color: "#0072EC" }, paddingTop:"10px", paddingLeft:"15px" }}>- Receivabl</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Transaction</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {selectedMenu === "Other" && (
        <Box onMouseLeave={handleBoxMouseLeave}
             sx={{ position: "absolute", top: 0, left: permanentOpen ? `${223}px` : `${223}px`, width: "255px", height: "114vh", backgroundColor: "#EAEAF4", zIndex: 1300, transition: "left 0.3s" }}>
          <Box sx={{ height: "70px", borderBottom: "1px solid #ccc", borderColor: "white", display: "flex", alignItems: "center", paddingLeft: "15px" }}>
            <Typography sx={{ fontWeight: "bold", color: "343434" }}>Other</Typography>
          </Box>
          <Box sx={{ height: "70px", paddingLeft: "15px", paddingTop: "15px"}}>
            <Typography sx={{ color: "343434" }}>Other</Typography>
            <Box sx={{ paddingTop: "15px", paddingLeft: "10px" }}>
              <Typography className="customText1" sx={{ fontSize: "14px"}}>• Main Location</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Sub Location</Typography>
              <Typography sx={{ fontSize: "14px", marginTop: "15px" }} className="customText2">• Currency </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PurchasePage;
