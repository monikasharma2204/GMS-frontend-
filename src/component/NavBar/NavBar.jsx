import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Header from "./TitleMenuBar/Header.jsx";
import Home from "./TitleMenuBar/Home.jsx";
import Dashboard from "./TitleMenuBar/Dashboard.jsx";
import Company from "./TitleMenuBar/Company.jsx";
import UserAndPermission from "./TitleMenuBar/UserAndPermission.jsx";
import Account from "./TitleMenuBar/Account.jsx";
import StoneMaster from "./TitleMenuBar/StoneMaster.jsx";
import Quotation from "./TitleMenuBar/Quotation.jsx";
import Reserve from "./TitleMenuBar/Reserve.jsx";
import PurchaseOrder from "./TitleMenuBar/PurchaseOrder.jsx";
import Memo from "./TitleMenuBar/Memo.jsx";
import Inventory from "./TitleMenuBar/Inventory.jsx";
import Sale from "./TitleMenuBar/Sale.jsx";
import Finance from "./TitleMenuBar/Finance";
import Report from "./TitleMenuBar/Report.jsx";
import Other from "./TitleMenuBar/Other.jsx";

const NavBar = () => {
  const [showRedBox, setShowRedBox] = useState(() => {
    return localStorage.getItem("activeDropdown");
  });

  const navRef = useRef();
  const menuScrollRef = useRef();

  const [openInventory, setOpenInventory] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (showRedBox) {
      localStorage.setItem("activeDropdown", showRedBox);
    } else {
      localStorage.removeItem("activeDropdown");
    }
  }, [showRedBox]);


  useEffect(() => {
    const menuElement = menuScrollRef.current;
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 500);
    };

    menuElement?.addEventListener("scroll", handleScroll);
    return () => {
      menuElement?.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);


  const scrollbarStyles = {
    overflowY: "auto",
  

    "&::-webkit-scrollbar": {
      width: "4px",
    },
  
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
  
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: isScrolling
        ? "rgba(150,150,150,0.6)"
        : "transparent",
      borderRadius: "10px",
      transition: "background-color 0.25s ease",
    },

    scrollbarWidth: "thin",
    scrollbarColor: isScrolling
      ? "rgba(150,150,150,0.6) transparent"
      : "transparent transparent",
  };
  
  

  const handleClickAccount = () => {
    setShowRedBox(showRedBox === "Account" ? null : "Account");
  };

  const handleClickCompany = () => {
    setShowRedBox(showRedBox === "Company" ? null : "Company");
  };

  const handleClickStoneMaster = () => {
    setShowRedBox((prev) => (prev === "Stone Master" ? null : "Stone Master"));
  };

  const handleClickPurchaseOrder = () => {
    setShowRedBox(showRedBox === "Purchase Order" ? null : "Purchase Order");
  };

  const handleClickMemo = () => {
    setShowRedBox(showRedBox === "Memo" ? null : "Memo");
  };

  const handleClickInventory = () => {
    // setShowRedBox(showRedBox === "Inventory" ? null : "Inventory");

    setShowRedBox((prev) => (prev === "Inventory" ? null : "Inventory"));
  };

  const handleClickFinance = () => {
    setShowRedBox(showRedBox === "Finance" ? null : "Finance");
  };

  const handleClickOther = () => {
    setShowRedBox(showRedBox === "Other" ? null : "Other");
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (navRef.current && !navRef.current.contains(event.target)) {
  //       setShowRedBox(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <>
      <Box
        ref={navRef}
        sx={{
          position: "fixed",
          width: "200px",
          height: "100%",
          bgcolor: "#05595B",
          zIndex: "999",
          padding: "12px",
          maxHeight: "100%",
          overflowY: "auto",
          // ...scrollbarStyles,
        }}
      >
        {/* Header */}

        <Header />

        {/* Menu */}


        <Box 
          ref={menuScrollRef}
          sx={{
            height: "calc(100vh - 115px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingTop: "24px",
            ...scrollbarStyles,
          }}
        >
          <Home />
          <Dashboard />
          <Company handleClick={handleClickCompany} showRedBox={showRedBox} />
          <UserAndPermission />
          <Account handleClick={handleClickAccount} showRedBox={showRedBox} />
          <StoneMaster
            handleClick={handleClickStoneMaster}
            showRedBox={showRedBox}
          />
          <Quotation />
          <Reserve />
          <PurchaseOrder
            handleClick={handleClickPurchaseOrder}
            showRedBox={showRedBox}
          />
          <Memo handleClick={handleClickMemo} showRedBox={showRedBox} />

          <Inventory handleClick={handleClickInventory} showRedBox={showRedBox}
            openInventory={openInventory}
            setOpenInventory={setOpenInventory}
            openReport={openReport}
            setOpenReport={setOpenReport}
            openTransfer={openTransfer}
            setOpenTransfer={setOpenTransfer} />


          <Sale />
          <Finance handleClick={handleClickFinance} showRedBox={showRedBox} />
          <Report />
          <Other handleClick={handleClickOther} showRedBox={showRedBox} />
        </Box>

        {/* <Setup/> */}
      </Box>
    </>
  );
};

export default NavBar;
