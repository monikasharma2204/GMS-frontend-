import React, { useEffect, useReducer, useState, useRef } from "react";
import { Box, Button, Typography, Grid, Dialog } from "@mui/material";
import ModalDayBook from "./ModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";
import { useRecoilState } from "recoil";
import { editMemoState, memoInfoState, isApprovedState } from "recoil/Purchase/MemoState.js";

import { DayBookQuotationState } from "recoil/Purchase/PurchaseState";


const QuotationsOrderHeader = ({
  state,
  handleSaveMemo,
  setDueDate,
  handleEdit,
  open,
  setOpen,
  setIsDayBookDataLoaded,
  fsmState,
  hasUnsavedData,
}) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [editMemoStatus, setEditMemoStatus] = useRecoilState(editMemoState);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [isDisableDayBook, setIsDisableDayBook] = useState(false);
  const [dayBookQuotation, setDayBookQuotation] = useRecoilState(
    DayBookQuotationState
  );
  const [isOpenApprovalModal, setIsOpenApprovalModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isApproved, setIsApproved] = useRecoilState(isApprovedState);
  const [currentPUId, setCurrentPUId] = useState(null);
  const manuallyApproved = useRef(false);
  const [isOpenUnsavedDataDialog, setIsOpenUnsavedDataDialog] = useState(false);
  const [pendingDayBookSelection, setPendingDayBookSelection] = useState(null);


  useEffect(() => {
    if (isOpenSuccessModal) {
      const timer = setTimeout(() => {
        setIsOpenSuccessModal(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpenSuccessModal]);


  useEffect(() => {

    if (memoInfo?.id && (memoInfo?.isDayBookEdit || memoInfo?.isPOEdit || memoInfo?.status)) {
      setCurrentPUId(memoInfo.id);

      if (memoInfo?.isDayBookEdit) {
        setIsApproved(memoInfo.status === "approved");
      } else if (memoInfo?.isPOEdit) {

        if (!manuallyApproved.current) {
          setIsApproved(memoInfo.status === "approved");
        }
      } else if (memoInfo?.status) {

        setIsApproved(memoInfo.status === "approved");
      }
    } else {
      setCurrentPUId(null);
      setIsApproved(false);
    }
  }, [memoInfo]);


  useEffect(() => {
    return () => {

      setIsApproved(false);
    };
  }, []);

  const getInventoryData = async () => {
    try {
      const response = await apiRequest("GET", "/pu");
      const inventoryData = response.map((el) => {
        let processedAccount = el.account;
        if (processedAccount && typeof processedAccount === 'object') {
          processedAccount = {
            ...processedAccount,
            label: processedAccount.vendor_code_name || processedAccount.name || processedAccount.label || processedAccount.code || "",
            code: processedAccount.vendor_code_id || processedAccount.code || ""
          };
        }
        return {
          ...el,
          account: processedAccount,
          vendor_code_id: el.vendor_code_id, // add vendor_code_id here
          inventory_item: el.items.map((inventory) => {
            return {
              ...inventory,
              // weight: Number(inventory.weight["$numberDecimal"]) || 0,
              // total_amount: Number(inventory.total_amount["$numberDecimal"]) || 0,
              // price: Number(inventory.price["$numberDecimal"]) || 0,
              // discount_percent: Number(inventory.discount_percent["$numberDecimal"]) || 0,
              // discount_amount: Number(inventory.discount_amount["$numberDecimal"]) || 0,
              // amount: Number(inventory.amount["$numberDecimal"]) || 0
            };
          }),
        };
      });

      setInventoryData(inventoryData);
    } catch (e) {
      // Error handling
    }
  };

  // useEffect(() => {
  //     if(inventoryData.length > 0) {
  //       setIsDisableDayBook(true)
  //     }
  // }, [inventoryData])

  useEffect(() => {
    if (open) {
      getInventoryData();
    }
  }, [open]);

  const handleCheckboxChange = (inventory) => {
    setInventoryData((prevInventoryData) =>
      prevInventoryData.map((item) => {
        if (item._id === inventory._id) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      })
    );
  };


  const handleApprovalSuccess = () => {

    setIsOpenSuccessModal(true);

    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

  // Function to handle approval API call
  const handleApprovalAction = async () => {
    if (isApproved) {
      console.error("Already approved");
      return;
    }

    try {

      if (memoInfo?.isPOEdit) {
        if (!currentPUId && !memoInfo?.id) {
          console.error("No PU ID available for PO approval");
          return;
        }

        const puId = currentPUId || memoInfo?.id;

        // Set approval state immediately when button is clicked
        setIsApproved(true);
        setMemoInfo(prev => ({
          ...prev,
          status: "approved"
        }));

        const response = await apiRequest("PUT", `/pu/${puId}`, {
          status: "approved",
          invoice_no: memoInfo?.invoice_no || ""
        });

        if (response) {
          handleApprovalSuccess();
        } else {

          setIsApproved(false);
          setMemoInfo(prev => ({
            ...prev,
            status: "pending"
          }));
        }
      } else {

        if (!currentPUId) {
          console.error("No PU ID available for DayBook approval");
          return;
        }

        // Set approval state immediately when button is clicked
        setIsApproved(true);
        setMemoInfo(prev => ({
          ...prev,
          status: "approved"
        }));
        setEditMemoStatus(false);

        const response = await apiRequest("PUT", `/pu/${currentPUId}`, {
          status: "approved",
          invoice_no: memoInfo?.invoice_no || ""
        });

        if (response) {
          handleApprovalSuccess();
        } else {
          // If API call fails, revert the approval state
          setIsApproved(false);
          setMemoInfo(prev => ({
            ...prev,
            status: "pending"
          }));
          setEditMemoStatus(true);
        }
      }
    } catch (error) {
      console.error("Error updating approval status:", error);

      setIsApproved(false);
      setMemoInfo(prev => ({
        ...prev,
        status: "pending"
      }));
    }
  };

  const handleDayBookSubmit = () => {
    const inventoryDataSelected = [];
    inventoryData.map((item) => {
      return item.inventory_item
        .filter((el) => el.checked)
        .map((inventory) => {
          const inventoryData = {
            ...item,
            ...inventory,
            lot_no: inventory.lot_no,
            stone: inventory.stone,
            size: inventory.size,
            color: inventory.color,
            cutting: inventory.cutting,
            quality: inventory.quality,
            clarity: inventory.clarity,
            cer_type: inventory.cer_type,
            cer_no: inventory.cer_no,
            disabled: true,
          };
          delete inventoryData.inventory_item;
          // inventoryDataSelected.push(inventoryData)
          inventoryDataSelected[0] = inventoryData;
        });
    });

    let selectedItems = state.selectedItems;
    selectedItems.filter(
      (el) =>
        !el._id || inventoryDataSelected.map((el) => el._id).includes(el._id)
    );

    const remainSelected = inventoryDataSelected.filter(
      (el) => !selectedItems.map((el) => el._id).includes(el._id)
    );
    selectedItems = selectedItems.concat(remainSelected);

    if (fsmState && fsmState === "dirty" && hasUnsavedData && hasUnsavedData()) {

      setPendingDayBookSelection(selectedItems);
      setIsOpenUnsavedDataDialog(true);
      return;
    }

    // setDueDate(doc_date)
    setDayBookQuotation(selectedItems[0]);


    setIsDisableDayBook(true);
    handleSaveMemo(selectedItems);
  };

  const handleUnsavedDataConfirm = (confirmed) => {
    if (confirmed && pendingDayBookSelection) {

      setDayBookQuotation(pendingDayBookSelection[0]);
      setIsDisableDayBook(true);
      handleSaveMemo(pendingDayBookSelection);
      setPendingDayBookSelection(null);
    }
    setIsOpenUnsavedDataDialog(false);
  };


  const calculateSums = (dataArray) =>
    dataArray.reduce(
      (totals, item) => {
        totals.weight += item.weight || 0;
        totals.pcs += item.pcs || 0;
        totals.amount += item.amount || 0;
        return totals;
      },
      { amount: 0, pcs: 0, weight: 0 }
    );

  return (
    <>
      <Box
        sx={{
          width: "1697px",
          height: "64px",
          flexShrink: 0,
          backgroundColor: "#FFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
        }}
      >
        <Box
          sx={{
            width: "388px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#05595B",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginLeft: "32px",
            }}
          >
            Purchase (PU)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ marginRight: "12px" }}>
            <Button
              disabled={isApproved || (!currentPUId && !memoInfo?.isPOEdit) || editMemoStatus}
              onClick={() => {
                if (!isApproved && (currentPUId || memoInfo?.isPOEdit) && !editMemoStatus && !memoInfo?.isPOEdit) {
                  setIsOpenApprovalModal(true);
                }
              }}
              sx={{
                textTransform: "none",
                height: "35px",
                width: "100px",
                padding: "12px",
                borderRadius: "4px",
                gap: "8px",
                backgroundColor: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                  ? "#E6E6E6"
                  : isApproved
                    ? "#00AA3A33"
                    : "#C6A96933",
                border: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                  ? "1px solid #BFBFBF"
                  : isApproved
                    ? "1px solid #00AA3A80"
                    : "1px solid #C6A96980",
                color: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                  ? "#57646E"
                  : isApproved
                    ? "#00AA3A"
                    : "#C6A969",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "1px",
                "&:hover": {
                  backgroundColor: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                    ? "#E6E6E6"
                    : isApproved
                      ? "#00AA3A33"
                      : "#C6A96933",
                },
                "&.Mui-disabled": {
                  backgroundColor: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                    ? "#E6E6E6"
                    : isApproved
                      ? "#00AA3A33"
                      : "#C6A96933",
                  color: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                    ? "#57646E"
                    : isApproved
                      ? "#00AA3A"
                      : "#C6A969",
                  border: (!currentPUId || editMemoStatus || memoInfo?.isPOEdit)
                    ? "1px solid #BFBFBF"
                    : isApproved
                      ? "1px solid #00AA3A80"
                      : "1px solid #C6A96980",
                },
              }}
            >
              {isApproved ? "Approved" : "Approve"}
            </Button>
          </Box>



          <Box>
            <ModalDayBook
              data={inventoryData}
              handleEdit={handleEdit}
              state={state}
              handleCheckboxChange={handleCheckboxChange}
              handleSubmit={handleDayBookSubmit}
              setDueDate={setDueDate}
              isDisableDayBook={isDisableDayBook}
              calculateSums={calculateSums}
              open={open}
              setOpen={setOpen}
              hasUnsavedData={hasUnsavedData}
              fsmState={fsmState}
              currentInvoiceId={memoInfo?._id || memoInfo?.id}
              isEditMode={editMemoStatus}
            />
          </Box>



          <Box
            sx={{
              marginRight: "12px",
              "&:hover svg path": {
                fill: "#E9B238",
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M8.16671 2.33398C7.85729 2.33398 7.56054 2.4569 7.34175 2.67569C7.12296 2.89449 7.00004 3.19123 7.00004 3.50065V8.16732H4.66671C4.04787 8.16732 3.45438 8.41315 3.01679 8.85074C2.57921 9.28832 2.33337 9.88181 2.33337 10.5007V19.834C2.33337 20.4528 2.57921 21.0463 3.01679 21.4839C3.45438 21.9215 4.04787 22.1673 4.66671 22.1673H7.00004V24.5007C7.00004 24.8101 7.12296 25.1068 7.34175 25.3256C7.56054 25.5444 7.85729 25.6673 8.16671 25.6673H19.8334C20.1428 25.6673 20.4395 25.5444 20.6583 25.3256C20.8771 25.1068 21 24.8101 21 24.5007V22.1673H23.3334C23.9522 22.1673 24.5457 21.9215 24.9833 21.4839C25.4209 21.0463 25.6667 20.4528 25.6667 19.834V10.5007C25.6667 9.88181 25.4209 9.28832 24.9833 8.85074C24.5457 8.41315 23.9522 8.16732 23.3334 8.16732H21V3.50065C21 3.19123 20.8771 2.89449 20.6583 2.67569C20.4395 2.4569 20.1428 2.33398 19.8334 2.33398H8.16671ZM19.8334 16.334H8.16671C7.85729 16.334 7.56054 16.4569 7.34175 16.6757C7.12296 16.8945 7.00004 17.1912 7.00004 17.5007V19.834H4.66671V10.5007H23.3334V19.834H21V17.5007C21 17.1912 20.8771 16.8945 20.6583 16.6757C20.4395 16.4569 20.1428 16.334 19.8334 16.334ZM18.6667 8.16732H9.33337V4.66732H18.6667V8.16732ZM5.83337 11.6673V14.0007H9.33337V11.6673H5.83337ZM18.6667 18.6673V23.334H9.33337V18.6673H18.6667Z"
                fill="#05595B"
              />
            </svg>
          </Box>

          <Box
            sx={{
              marginRight: "12px",
              "&:hover svg path": {
                fill: "#00AA3A",
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                d="M19.4175 1.7L17.8862 0H5.8275C4.9575 0 4.62125 0.645 4.62125 1.14875V5.68625H6.3125V2.06625C6.3125 1.87375 6.475 1.71125 6.6625 1.71125H15.2913C15.4812 1.71125 15.5763 1.745 15.5763 1.90125V7.92625H21.7175C21.9587 7.92625 22.0525 8.05125 22.0525 8.23375V22.9463C22.0525 23.2537 21.9275 23.3 21.74 23.3H6.6625C6.56952 23.2977 6.48106 23.2595 6.41576 23.1932C6.35047 23.127 6.31345 23.038 6.3125 22.945V21.6H4.6325V23.7188C4.61 24.4688 5.01 25 5.8275 25H22.575C23.45 25 23.7488 24.3663 23.7488 23.7887V6.48375L23.3113 6.00875L19.4175 1.7ZM17.295 1.9L17.7787 2.4425L21.0238 6.00875L21.2025 6.225H17.8862C17.6362 6.225 17.4775 6.18375 17.4112 6.1C17.345 6.01875 17.3062 5.8875 17.295 5.70875V1.9ZM15.9325 13.3337H21.6537V15.0013H15.9312L15.9325 13.3337ZM15.9325 10.0013H21.6537V11.6675H15.9312L15.9325 10.0013ZM15.9325 16.6675H21.6537V18.335H15.9312L15.9325 16.6675ZM1.25 7.0325V20.3662H14.3313V7.0325H1.25ZM7.79125 14.7875L6.99125 16.01H7.79125V17.5H3.77L6.6875 13.1125L4.1025 9.1675H6.2625L7.7925 11.4625L9.32125 9.1675H11.48L8.89 13.1125L11.8113 17.5H9.57L7.79125 14.7875Z"
                fill="#05595B"
              />
            </svg>
          </Box>

          <Box
            sx={{
              marginRight: "32px",
              "&:hover svg path": {
                fill: "#00AA3A",
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
            >
              <g clipPath="url(#clip0_993_402828)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.2143 1.78571C17.2143 1.44472 17.3497 1.1177 17.5909 0.876577C17.832 0.635459 18.159 0.5 18.5 0.5L21.5 0.5C23.156 0.5 24.5 1.844 24.5 3.5V6.5C24.5 6.84099 24.3645 7.16802 24.1234 7.40914C23.8823 7.65026 23.5553 7.78571 23.2143 7.78571C22.8733 7.78571 22.5463 7.65026 22.3051 7.40914C22.064 7.16802 21.9286 6.84099 21.9286 6.5V3.5C21.9286 3.38634 21.8834 3.27733 21.803 3.19695C21.7227 3.11658 21.6137 3.07143 21.5 3.07143H18.5C18.159 3.07143 17.832 2.93597 17.5909 2.69485C17.3497 2.45373 17.2143 2.12671 17.2143 1.78571ZM0.5 12.5C0.5 12.159 0.635459 11.832 0.876577 11.5909C1.1177 11.3497 1.44472 11.2143 1.78571 11.2143H23.2143C23.5553 11.2143 23.8823 11.3497 24.1234 11.5909C24.3645 11.832 24.5 12.159 24.5 12.5C24.5 12.841 24.3645 13.168 24.1234 13.4091C23.8823 13.6503 23.5553 13.7857 23.2143 13.7857H1.78571C1.44472 13.7857 1.1177 13.6503 0.876577 13.4091C0.635459 13.168 0.5 12.841 0.5 12.5ZM3.07143 3.5C3.07143 3.38634 3.11658 3.27733 3.19695 3.19695C3.27733 3.11658 3.38634 3.07143 3.5 3.07143H6.5C6.84099 3.07143 7.16802 2.93597 7.40914 2.69485C7.65026 2.45373 7.78571 2.12671 7.78571 1.78571C7.78571 1.44472 7.65026 1.1177 7.40914 0.876577C7.16802 0.635459 6.84099 0.5 6.5 0.5L3.5 0.5C2.70435 0.5 1.94129 0.81607 1.37868 1.37868C0.81607 1.94129 0.5 2.70435 0.5 3.5L0.5 6.5C0.5 6.84099 0.635459 7.16802 0.876577 7.40914C1.1177 7.65026 1.44472 7.78571 1.78571 7.78571C2.12671 7.78571 2.45373 7.65026 2.69485 7.40914C2.93597 7.16802 3.07143 6.84099 3.07143 6.5V3.5ZM23.2143 17.2143C23.5553 17.2143 23.8823 17.3497 24.1234 17.5909C24.3645 17.832 24.5 18.159 24.5 18.5V21.5C24.5 22.2957 24.1839 23.0587 23.6213 23.6213C23.0587 24.1839 22.2957 24.5 21.5 24.5H18.5C18.159 24.5 17.832 24.3645 17.5909 24.1234C17.3497 23.8823 17.2143 23.5553 17.2143 23.2143C17.2143 22.8733 17.3497 22.5463 17.5909 22.3051C17.832 22.064 18.159 21.9286 18.5 21.9286H21.5C21.6137 21.9286 21.7227 21.8834 21.803 21.803C21.8834 21.7227 21.9286 21.6137 21.9286 21.5V18.5C21.9286 18.159 22.064 17.832 22.3051 17.5909C22.5463 17.3497 22.8733 17.2143 23.2143 17.2143ZM3.07143 18.5C3.07143 18.159 2.93597 17.832 2.69485 17.5909C2.45373 17.3497 2.12671 17.2143 1.78571 17.2143C1.44472 17.2143 1.1177 17.3497 0.876577 17.5909C0.635459 17.832 0.5 18.159 0.5 18.5L0.5 21.5C0.5 23.156 1.844 24.5 3.5 24.5H6.5C6.84099 24.5 7.16802 24.3645 7.40914 24.1234C7.65026 23.8823 7.78571 23.5553 7.78571 23.2143C7.78571 22.8733 7.65026 22.5463 7.40914 22.3051C7.16802 22.064 6.84099 21.9286 6.5 21.9286H3.5C3.38634 21.9286 3.27733 21.8834 3.19695 21.803C3.11658 21.7227 3.07143 21.6137 3.07143 21.5V18.5Z"
                  fill="#05595B"
                />
              </g>
              <defs>
                <clipPath id="clip0_993_402828">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Box>
        </Box>
      </Box>

      {/* Approval Confirmation Modal */}
      <Dialog
        open={isOpenApprovalModal}
        onClose={() => setIsOpenApprovalModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box
          onClick={() => setIsOpenApprovalModal(false)}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover svg path": {
              fill: "#E00410",
            },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
              fill="#343434"
            />
          </svg>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
            >
              <g clipPath="url(#clip0_472_206411)">
                <path
                  d="M50.4 89.6H61.6V78.4H50.4V89.6ZM56 0C48.646 0 41.364 1.44848 34.5697 4.26275C27.7755 7.07701 21.6021 11.2019 16.402 16.402C5.89998 26.9041 0 41.1479 0 56C0 70.8521 5.89998 85.0959 16.402 95.598C21.6021 100.798 27.7755 104.923 34.5697 107.737C41.364 110.552 48.646 112 56 112C70.8521 112 85.0959 106.1 95.598 95.598C106.1 85.0959 112 70.8521 112 56C112 48.646 110.552 41.364 107.737 34.5697C104.923 27.7755 100.798 21.6021 95.598 16.402C90.3979 11.2019 84.2245 7.07701 77.4303 4.26275C70.636 1.44848 63.354 0 56 0ZM56 100.8C31.304 100.8 11.2 80.696 11.2 56C11.2 31.304 31.304 11.2 56 11.2C80.696 11.2 100.8 31.304 100.8 56C100.8 80.696 80.696 100.8 56 100.8ZM56 22.4C50.0592 22.4 44.3616 24.76 40.1608 28.9608C35.96 33.1616 33.6 38.8591 33.6 44.8H44.8C44.8 41.8296 45.98 38.9808 48.0804 36.8804C50.1808 34.78 53.0296 33.6 56 33.6C58.9704 33.6 61.8192 34.78 63.9196 36.8804C66.02 38.9808 67.2 41.8296 67.2 44.8C67.2 56 50.4 54.6 50.4 72.8H61.6C61.6 60.2 78.4 58.8 78.4 44.8C78.4 38.8591 76.04 33.1616 71.8392 28.9608C67.6384 24.76 61.9408 22.4 56 22.4Z"
                  fill="#0072EC"
                />
              </g>
              <defs>
                <clipPath id="clip0_472_206411">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Box>
          <Typography
            sx={{
              marginBottom: "24px",
              color: "#343434",
              textAlign: "center",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Would you like to approve?
          </Typography>
          <Box sx={{ display: "flex", gap: "14px" }}>
            <Button
              onClick={() => setIsOpenApprovalModal(false)}
              sx={{
                height: "44px",
                padding: "12px 40px",
                borderRadius: "4px",
                backgroundColor: "#FFF",
                "&:hover": {
                  backgroundColor: "#FFF",
                },
                border: "2px solid #E6E6E6",
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  color: "#10002E",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                No
              </Typography>
            </Button>
            <Button
              onClick={() => {
                setIsOpenApprovalModal(false);
                handleApprovalAction();
              }}
              sx={{
                height: "44px",
                padding: "12px 40px",
                borderRadius: "4px",
                backgroundColor: "#05595B",
                "&:hover": {
                  backgroundColor: "#05595B",
                },
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  color: "#FFF",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Yes
              </Typography>
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Unsaved Data Dialog */}
      <Dialog
        open={isOpenUnsavedDataDialog}
        onClose={() => setIsOpenUnsavedDataDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box
          onClick={() => handleUnsavedDataConfirm(false)}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover svg path": {
              fill: "#E00410",
            },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 18.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
              fill="#343434"
            />
          </svg>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
            >
              <g clipPath="url(#clip0_472_206411)">
                <path
                  d="M50.4 89.6H61.6V78.4H50.4V89.6ZM56 0C48.646 0 41.364 1.44848 34.5697 4.26275C27.7755 7.07701 21.6021 11.2019 16.402 16.402C5.89998 26.9041 0 41.1479 0 56C0 70.8521 5.89998 85.0959 16.402 95.598C21.6021 100.798 27.7755 104.923 34.5697 107.737C41.364 110.552 48.646 112 56 112C70.8521 112 85.0959 106.1 95.598 95.598C106.1 85.0959 112 70.8521 112 56C112 48.646 110.552 41.364 107.737 34.5697C104.923 27.7755 100.798 21.6021 95.598 16.402C90.3979 11.2019 84.2245 7.07701 77.4303 4.26275C70.636 1.44848 63.354 0 56 0ZM56 100.8C31.304 100.8 11.2 80.696 11.2 56C11.2 31.304 31.304 11.2 56 11.2C80.696 11.2 100.8 31.304 100.8 56C100.8 80.696 80.696 100.8 56 100.8ZM56 22.4C50.0592 22.4 44.3616 24.76 40.1608 28.9608C35.96 33.1616 33.6 38.8591 33.6 44.8H44.8C44.8 41.8296 45.98 38.9808 48.0804 36.8804C50.1808 34.78 53.0296 33.6 56 33.6C58.9704 33.6 61.8192 34.78 63.9196 36.8804C66.02 38.9808 67.2 41.8296 67.2 44.8C67.2 56 50.4 54.6 50.4 72.8H61.6C61.6 60.2 78.4 58.8 78.4 44.8C78.4 38.8591 76.04 33.1616 71.8392 28.9608C67.6384 24.76 61.9408 22.4 56 22.4Z"
                  fill="#ED9738"
                />
              </g>
              <defs>
                <clipPath id="clip0_472_206411">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Box>
          <Typography
            sx={{
              marginBottom: "24px",
              color: "#343434",
              textAlign: "center",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Unsaved Data
          </Typography>
          <Typography
            sx={{
              marginBottom: "24px",
              color: "#343434",
              textAlign: "center",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              lineHeight: "normal",
            }}
          >
            You have unsaved changes. Do you want to discard them and load daybook data?
          </Typography>
          <Box sx={{ display: "flex", gap: "14px" }}>
            <Button
              onClick={() => handleUnsavedDataConfirm(false)}
              sx={{
                height: "44px",
                padding: "12px 40px",
                borderRadius: "4px",
                backgroundColor: "#FFF",
                "&:hover": {
                  backgroundColor: "#FFF",
                },
                border: "2px solid #E6E6E6",
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  color: "#10002E",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                No
              </Typography>
            </Button>
            <Button
              onClick={() => handleUnsavedDataConfirm(true)}
              sx={{
                height: "44px",
                padding: "12px 40px",
                borderRadius: "4px",
                backgroundColor: "#05595B",
                "&:hover": {
                  backgroundColor: "#05595B",
                },
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  color: "#FFF",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Yes
              </Typography>
            </Button>
          </Box>
        </Box>
      </Dialog>
      {/* Success Modal */}
      <Dialog
        open={isOpenSuccessModal}
        onClose={() => setIsOpenSuccessModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box
          onClick={() => setIsOpenSuccessModal(false)}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover svg path": {
              fill: "#E00410",
            },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
              fill="#343434"
            />
          </svg>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="113"
              height="112"
              viewBox="0 0 113 112"
              fill="none"
            >
              <g clipPath="url(#clip0_472_206422)">
                <path
                  d="M56.5 0C25.5722 0 0.5 25.0722 0.5 56C0.5 86.9295 25.5722 112 56.5 112C87.4295 112 112.5 86.9295 112.5 56C112.5 25.0722 87.4295 0 56.5 0ZM56.5 105.11C29.4817 105.11 7.5 83.0182 7.5 55.9998C7.5 28.9815 29.4817 6.99978 56.5 6.99978C83.5182 6.99978 105.5 28.9816 105.5 55.9998C105.5 83.0179 83.5182 105.11 56.5 105.11ZM78.8493 35.5093L45.9929 68.572L31.1966 53.7757C29.8299 52.409 27.6144 52.409 26.2459 53.7757C24.8791 55.1425 24.8791 57.358 26.2459 58.7247L43.5691 76.0498C44.9359 77.4147 47.1514 77.4147 48.5199 76.0498C48.6774 75.8923 48.8122 75.7206 48.9347 75.5423L83.8018 40.4599C85.1668 39.0931 85.1668 36.8776 83.8018 35.5093C82.4333 34.1425 80.2178 34.1425 78.8493 35.5093Z"
                  fill="#17C653"
                />
              </g>
              <defs>
                <clipPath id="clip0_472_206422">
                  <rect
                    width="112"
                    height="112"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Box>
          <Typography
            sx={{
              marginBottom: "24px",
              color: "#343434",
              textAlign: "center",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Successfully!
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default QuotationsOrderHeader;
