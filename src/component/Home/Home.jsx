import React, { useState } from "react";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../../Assets/image/Codth logo-JPG(WH).png";
import { saveShortcutService } from "services/homeService";
import AddShortcutModal, { SHORTCUT_SECTIONS } from "./AddShortcutModal";
import DeleteShortcutModal from "./DeleteShortcutModal";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  DashboardIcon,
  CompanyProfileIcon,
  BankIcon,
  UserPermissionIcon,
  VendorIcon,
  CustomerIcon,
  StoneGroupIcon,
  StoneIcon,
  ShapeIcon,
  ReserveIcon,
  SaleIcon,
  SubLocationIcon,
  ReportIcon,
  AllIcon,
  PrimaryIcon,
  ConsignmentIcon,
  LoadIcon,
  OutstandingReceiptPayableIcon,
  ReceivableIcon,
  TransactionIcon,
  CurrencyIcon,
  QualityIcon,
  ClarityIcon,
  CertificateTypeIcon,
  LabourTypeIcon,
  QuotationIcon,
  PurchaseOrderIcon,
  PurchaseIcon,
  MemoInIcon,
  MemoReturnIcon,
  MemoOutIcon,
  MemoOutReturnIcon,
  SizeIcon,
  ColorIcon,
  CuttingIcon,
  MainLocationIcon,
} from "./HomeIcons";

const MAX_BOXES = 14;


const getParentMenuTitle = (itemValue) => {
  for (const section of SHORTCUT_SECTIONS) {
    const itemExists = section.items.some((item) => item.value === itemValue);
    if (itemExists && itemValue !== section.title) {
      return section.title;
    }
  }
  return null;
};

const getBoxLink = (boxName) => {
  switch (boxName) {
    case "Company Profile":
      return "/company/company-profile";
    case "Bank":
      return "/company/bank";
    case "User & Permission":
      return "/userandpermission";
    case "Vendor":
      return "/account/vendor";
    case "Customer":
      return "/account/customer";
    case "Stone Group":
      return "/stone-master/stone-group";
    case "Stone":
      return "/stone-master/stone";
    case "Shape":
      return "/stone-master/shape";
    case "Size":
      return "/stone-master/size";
    case "Color":
      return "/stone-master/color";
    case "Cutting":
      return "/stone-master/cutting";
    case "Quality":
      return "/stone-master/quality";
    case "Clarity":
      return "/stone-master/clarity";
    case "Certificate Type":
      return "/stone-master/certificate-type";
    case "Labour Type":
      return "/stone-master/labour-type";
    case "Purchase Order":
      return "/purchase-order/purchase-order";
    case "Purchase":
      return "/purchase-order/purchase";
    case "Memo In":
      return "/memo/memo-in";
    default:
      return "/home";
  }
};

const Homey = () => {

  const theme = useTheme();
  const isAbove1600 = useMediaQuery("(min-width:1600px)");
 

  const boxConfig = {
    DashBoard: { icon: <DashboardIcon />, text: "Dashboard" },
    "Company Profile": {
      icon: <CompanyProfileIcon />,
      text: "Company Profile",
    },
    Bank: { icon: <BankIcon />, text: "Bank" },
    "User & Permission": {
      icon: <UserPermissionIcon />,
      text: "User & Permission",
    },
    Vendor: { icon: <VendorIcon />, text: "Vendor" },
    Customer: { icon: <CustomerIcon />, text: "Customer" },
    "Stone Group": { icon: <StoneGroupIcon />, text: "Stone Group" },
    Stone: { icon: <StoneIcon />, text: "Stone" },
    Shape: { icon: <ShapeIcon />, text: "Shape" },
    Size: { icon: <SizeIcon />, text: "Size" },
    Color: { icon: <ColorIcon />, text: "Color" },
    Cutting: { icon: <CuttingIcon />, text: "Cutting" },
    Quality: { icon: <QualityIcon />, text: "Quality" },
    Clarity: { icon: <ClarityIcon />, text: "Clarity" },
    "Certificate Type": {
      icon: <CertificateTypeIcon />,
      text: "Certificate Type",
    },
    "Labour Type": { icon: <LabourTypeIcon />, text: "Labour Type" },
    Quotation: { icon: <QuotationIcon />, text: "Quotation" },
    Reserve: { icon: <ReserveIcon />, text: "Reserve" },
    "Purchase Order": { icon: <PurchaseOrderIcon />, text: "Purchase Order" },
    Purchase: { icon: <PurchaseIcon />, text: "Purchase" },
    "Memo In": { icon: <MemoInIcon />, text: "Memo In" },
    "Memo Return": { icon: <MemoReturnIcon />, text: "Memo Return" },
    "Memo Out": { icon: <MemoOutIcon />, text: "Memo Out" },
    "Memo Out Return": { icon: <MemoOutReturnIcon />, text: "Memo Out Return" },
    All: { icon: <AllIcon />, text: "All" },
    Primary: { icon: <PrimaryIcon />, text: "Primary" },
    Consignment: { icon: <ConsignmentIcon />, text: "Consignment" },
    Load: { icon: <LoadIcon />, text: "Load" },
    "Stock Check": { icon: <LoadIcon />, text: "Stock Check" },
    "Merge & Split": { icon: <LoadIcon />, text: "Merge & Split" },
    Transfer: { icon: <LoadIcon />, text: "Transfer" },
    Sale: { icon: <SaleIcon />, text: "Sale" },
    Payable: {
      icon: <OutstandingReceiptPayableIcon />,
      text: "Payable",
    },
    Receivable: { icon: <ReceivableIcon />, text: "Receivable" },
    Transaction: { icon: <TransactionIcon />, text: "Transaction" },
    Report: { icon: <ReportIcon />, text: "Report" },
    "Main Location": { icon: <MainLocationIcon />, text: "Main Location" },
    "Sub Location": { icon: <SubLocationIcon />, text: "Sub Location" },
    Currency: { icon: <CurrencyIcon />, text: "Currency" },
  };

  const [open, setOpen] = useState(false);
  const [createdBoxes, setCreatedBoxes] = useState([]);
  const [externalBoxes, setExternalBoxes] = useState([]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [boxToRemove, setBoxToRemove] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenRemoveDialog = (boxName) => {
    setBoxToRemove(boxName);
    setRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => {
    setRemoveDialogOpen(false);
    setBoxToRemove(null);
  };

  const handleSave = async (newSelected = null) => {
    const boxesToSave = newSelected !== null ? newSelected : createdBoxes;
    setExternalBoxes(boxesToSave);
    setCreatedBoxes(boxesToSave);
    try {
      const dashboard_setting = boxesToSave.map((boxName) => {
        return {
          columnClass: "mb-4 col-md-6 col-12",
          index: 0,
          name: boxName,
        };
      });

      const payload = {
        user_id: "66fe3fcad2af9608024c884d",
        dashboard_setting: dashboard_setting,
        type: "Dashboard",
      };

      const response = await saveShortcutService(payload);
      if (response.status === 200) {
        handleClose();
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleConfirmRemove = async () => {
    if (!boxToRemove) return;
    const updated = createdBoxes.filter((name) => name !== boxToRemove);
    setCreatedBoxes(updated);
    setExternalBoxes(updated);

    try {
      const dashboard_setting = updated.map((boxName) => {
        return {
          columnClass: "mb-4 col-md-6 col-12",
          index: 0,
          name: boxName,
        };
      });

      const payload = {
        user_id: "66fe3fcad2af9608024c884d",
        dashboard_setting: dashboard_setting,
        type: "Dashboard",
      };

      await saveShortcutService(payload);
    } catch (error) {
      console.error("Remove shortcut failed", error);
    } finally {
      handleCloseRemoveDialog();
    }
  };

  // const handleReset = () => {
  //   setCreatedBoxes([]);
  // };

  return (
    <div>
      <AddShortcutModal
        open={open}
        onClose={handleClose}
        selected={createdBoxes}
        setSelected={setCreatedBoxes}
        max={MAX_BOXES}
        // onReset={handleReset}
        onOk={handleSave} 
      />

      <DeleteShortcutModal

        open={removeDialogOpen}
        onClose={handleCloseRemoveDialog}
        onConfirm={handleConfirmRemove}
        
        
      />

      {/* External Boxes Section */}
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            // height: "100%",
            // marginTop: "2px",
            overflow: "hidden",
            // height: "calc(100vh - 72px)",

            height: isAbove1600 ?  "calc(100vh - 72px)" : "100%",
            backgroundColor: "#FFFFFF",
            // boxShadow: "0px 4px 20px rgb(0 0 0 / 10%)",
            
    
          }}
        >
          <Box
            sx={{
              // width: "143px",
              // height: "148px",
              // overflow: "hidden",
              marginTop: "80px",
            }}
          >
            <Box sx={{
              width: "143px",
              height: "148px",
            }}>
              <img sx={{ height: "100%", width: "auto" }} src={Logo} />
            </Box>

          </Box>

          <Box
            sx={{
              // width: externalBoxes.length > 0 ? "1290px" : "100%",
              width: isAbove1600 ? "1290px" : "100%",
              display: "flex",
              flexWrap: "wrap",
              columnGap: "10px",
              rowGap: "10px",
              height: isAbove1600 ?  "700px" : "100%",
              // rowGap: "62px",
              justifyContent: externalBoxes.length > 0 ? "center" : "center",
              alignContent: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: externalBoxes.length > 0 ? "80px" : "80px",
              padding: "20px"
            }}
          >
            {externalBoxes.map((box, index) => {
              const config = boxConfig[box] || { icon: null, text: box };
              const displayText =
                config.text || box.replace(/([A-Z])/g, " $1").trim();

              return (
                <Link
                  to={getBoxLink(box)}
                  key={index}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // width: "170px",
                      // height: "210px",
                      padding: "16px",
                      cursor: "pointer",
                      flexDirection: "column",
                      borderRadius: "5px",

                      position: "relative",
                      "&:hover": {
                        boxShadow: "0px 4px 20px 0px #0000001A",
                        borderRadius: "5px",
                      },
                      "&:hover .homeShortcutRemoveBtn": {
                        opacity: 1,
                        pointerEvents: "auto",


                      },
                    }}
                  >

                    <Box sx={{ width: "138px", display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        className="homeShortcutRemoveBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenRemoveDialog(box);
                        }}
                        sx={{
                          // position: "absolute",
                          // top: "5px",
                          // right: "10px",

                          opacity: 0,
                          pointerEvents: "none",
                          bgcolor: "#FFF",
                          padding: "0px !important",


                          // "&:hover": { border: "1px solid #B41E38" },
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_18113_488077)">
                            <path
                              d="M7.06662 9.96875H14.7055C14.9081 9.96875 15.1024 10.0653 15.2457 10.2372C15.3889 10.4091 15.4694 10.6423 15.4694 10.8854C15.4694 11.1285 15.3889 11.3617 15.2457 11.5336C15.1024 11.7055 14.9081 11.8021 14.7055 11.8021H7.06662C6.86403 11.8021 6.66973 11.7055 6.52647 11.5336C6.38322 11.3617 6.30273 11.1285 6.30273 10.8854C6.30273 10.6423 6.38322 10.4091 6.52647 10.2372C6.66973 10.0653 6.86403 9.96875 7.06662 9.96875Z"
                              fill="#9A9A9A"
                            />
                            <path
                              d="M10.8848 20.3139C12.1229 20.3139 13.349 20.0701 14.4929 19.5962C15.6369 19.1224 16.6762 18.4279 17.5518 17.5524C18.4273 16.6769 19.1218 15.6375 19.5956 14.4935C20.0695 13.3496 20.3133 12.1236 20.3133 10.8854C20.3133 9.6472 20.0695 8.42114 19.5956 7.27722C19.1218 6.13329 18.4273 5.09389 17.5518 4.21837C16.6762 3.34285 15.6369 2.64834 14.4929 2.17451C13.349 1.70068 12.1229 1.4568 10.8848 1.4568C8.38415 1.4568 5.98596 2.45017 4.21776 4.21837C2.44956 5.98657 1.45619 8.38476 1.45619 10.8854C1.45619 13.386 2.44956 15.7842 4.21776 17.5524C5.98596 19.3206 8.38415 20.3139 10.8848 20.3139ZM10.8848 21.8854C7.96738 21.8854 5.16949 20.7264 3.10659 18.6635C1.04369 16.6006 -0.115234 13.8028 -0.115234 10.8854C-0.115234 7.96799 1.04369 5.1701 3.10659 3.1072C5.16949 1.0443 7.96738 -0.114624 10.8848 -0.114624C13.8021 -0.114624 16.6 1.0443 18.6629 3.1072C20.7258 5.1701 21.8848 7.96799 21.8848 10.8854C21.8848 13.8028 20.7258 16.6006 18.6629 18.6635C16.6 20.7264 13.8021 21.8854 10.8848 21.8854Z"
                              fill="#9A9A9A"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_18113_488077">
                              <rect width="22" height="22" fill="#fff" />
                            </clipPath>
                          </defs>
                        </svg>
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        width: "80px",
                        height: "80px",
                        alignItems: "center",
                        backgroundColor: "#F2F6F7",
                        alignContent: "center",
                        borderRadius: "24px",
                      }}
                    >
                      {/* <IconButton
                        className="homeShortcutRemoveBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenRemoveDialog(box);
                        }}
                        sx={{
                          position: "absolute",
                          top: "5px",
                          right: "10px",

                          opacity: 0,
                          pointerEvents: "none",
                          bgcolor: "#FFF",


                          // "&:hover": { border: "1px solid #B41E38" },
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_18113_488077)">
                            <path
                              d="M7.06662 9.96875H14.7055C14.9081 9.96875 15.1024 10.0653 15.2457 10.2372C15.3889 10.4091 15.4694 10.6423 15.4694 10.8854C15.4694 11.1285 15.3889 11.3617 15.2457 11.5336C15.1024 11.7055 14.9081 11.8021 14.7055 11.8021H7.06662C6.86403 11.8021 6.66973 11.7055 6.52647 11.5336C6.38322 11.3617 6.30273 11.1285 6.30273 10.8854C6.30273 10.6423 6.38322 10.4091 6.52647 10.2372C6.66973 10.0653 6.86403 9.96875 7.06662 9.96875Z"
                              fill="#9A9A9A"
                            />
                            <path
                              d="M10.8848 20.3139C12.1229 20.3139 13.349 20.0701 14.4929 19.5962C15.6369 19.1224 16.6762 18.4279 17.5518 17.5524C18.4273 16.6769 19.1218 15.6375 19.5956 14.4935C20.0695 13.3496 20.3133 12.1236 20.3133 10.8854C20.3133 9.6472 20.0695 8.42114 19.5956 7.27722C19.1218 6.13329 18.4273 5.09389 17.5518 4.21837C16.6762 3.34285 15.6369 2.64834 14.4929 2.17451C13.349 1.70068 12.1229 1.4568 10.8848 1.4568C8.38415 1.4568 5.98596 2.45017 4.21776 4.21837C2.44956 5.98657 1.45619 8.38476 1.45619 10.8854C1.45619 13.386 2.44956 15.7842 4.21776 17.5524C5.98596 19.3206 8.38415 20.3139 10.8848 20.3139ZM10.8848 21.8854C7.96738 21.8854 5.16949 20.7264 3.10659 18.6635C1.04369 16.6006 -0.115234 13.8028 -0.115234 10.8854C-0.115234 7.96799 1.04369 5.1701 3.10659 3.1072C5.16949 1.0443 7.96738 -0.114624 10.8848 -0.114624C13.8021 -0.114624 16.6 1.0443 18.6629 3.1072C20.7258 5.1701 21.8848 7.96799 21.8848 10.8854C21.8848 13.8028 20.7258 16.6006 18.6629 18.6635C16.6 20.7264 13.8021 21.8854 10.8848 21.8854Z"
                              fill="#9A9A9A"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_18113_488077">
                              <rect width="22" height="22" fill="#fff" />
                            </clipPath>
                          </defs>
                        </svg>
                      </IconButton> */}

                      {config.icon}
                    </Box>

                    <Box sx={{ textAlign: "center", marginTop: "22px", marginBottom: "20px" }}>
                      <Typography
                        sx={{
                          color: "#05595B",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          lineHeight: "20px",
                          fontStyle: "normal",
                          fontWeight: 700,
                        }}
                      >
                        {displayText}
                      </Typography>
                      {getParentMenuTitle(box) && (
                        <Typography
                          sx={{
                            color: "#666666",
                            fontFamily: "Calibri",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "24px",
                            marginTop: "-4px",
                          }}
                        >
                          {getParentMenuTitle(box)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Link>
              );
            })}
            {externalBoxes.length < MAX_BOXES && (
              <Box
                onClick={handleOpen}
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: "170px",
                  minWidth: "170px",
                  padding: externalBoxes.length > 0 ? "0px" : "0px",
                  cursor: "pointer",
                  flexDirection: "column",
                  borderRadius: "5px",
                  // rowGap: "30px",
                  rowGap: externalBoxes.length > 0 ? "22px" : "30px"


                }}
              >
                <Box
                  sx={{
                    // width: "128px",
                    width: externalBoxes.length > 0 ? 80 : 128,
                    height: externalBoxes.length > 0 ? 80 : 128,
                    // height: "128px",
                    backgroundColor: "#F9F9F9",
                    alignItems: "center",

                    alignContent: "center",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "24px",
                  }}
                >
                  <svg
                    className="hovered-svg"
                    width={externalBoxes.length > 0 ? "32" : "48"}
                    height={externalBoxes.length > 0 ? "32" : "48"}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 9V39M39 24H9"
                      stroke="#57646E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: "6px" }}>
                  <Typography
                    sx={{
                      color: externalBoxes.length > 0 ? "#666666" : "#343434",
                      fontFamily: "Calibri",
                      fontSize: externalBoxes.length > 0 ? "16px" : "18px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      textAlign: "center",
                      // marginTop: "25px",
                    }}
                  >
                    {externalBoxes.length > 0
                      ? "Add/Edit Shortcut"
                      : "Add Shortcuts"}
                  </Typography>
                  {externalBoxes.length === 0 && (
                    <Typography
                      sx={{
                        color: "#9A9A9A",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        lineHeight: "normal",
                        fontStyle: "normal",
                        fontWeight: 500,
                        // width: "189px",
                        textAlign: "center",
                      }}
                    >
                      Click here to create one
                    </Typography>
                  )}
                </Box>

              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Homey;
