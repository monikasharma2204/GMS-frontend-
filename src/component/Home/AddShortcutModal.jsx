import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import "../../Assets/styles/HomeShortcutModal.css";
import { DisabledUncheckedSvg } from "./HomeIcons";

export const SHORTCUT_SECTIONS = [
  {
    title: "Dashboard",
    items: [{ value: "DashBoard", label: "Dashboard" }],
  },
  {
    title: "Stone Master",
    items: [
      { value: "Stone Group", label: "Stone Group" },
      { value: "Stone", label: "Stone" },
      { value: "Shape", label: "Shape" },
      { value: "Color", label: "Color" },
      { value: "Size", label: "Size" },
      { value: "Cutting", label: "Cutting" },
      { value: "Quality", label: "Quality" },
      { value: "Clarity", label: "Clarity" },
    ],
  },
  {
    title: "Memo",
    items: [
      { value: "Memo In", label: "Memo In" },
      { value: "Memo Return", label: "Memo Return" },
      { value: "Memo Out", label: "Memo Out" },
      { value: "Memo Out Return", label: "Memo Out Return" },
    ],
  },
  {
    title: "Report",
    items: [{ value: "Report", label: "Report" }],
  },
  {
    title: "Company",
    items: [
      { value: "Company Profile", label: "Company Profile" },
      { value: "Bank", label: "Bank" },
    ],
  },
  {
    title: "Quotation",
    items: [{ value: "Quotation", label: "Quotation" }],
  },
  {
    title: "Inventory",
    items: [
      { value: "Load", label: "Load" },
    ],
  },
  {
    title: "Stock Report",
    items: [
      { value: "Primary", label: "Primary" },
      { value: "Consignment", label: "Consignment" },
      { value: "Stock Check", label: "Stock Check" },
      { value: "Consignment Check", label: "Consignment Check" },
    ],
  },
  {
    title: "Stock Transfer",
    items: [
      { value: "Merge & Split", label: "Merge & Split" },
      { value: "Transfer", label: "Transfer" },

    ],
  },

  {
    title: "Setup",
    items: [
      { value: "Main Location", label: "Main Location" },
      { value: "Sub Location", label: "Sub Location" },
      { value: "Currency", label: "Currency" },
      { value: "Certificate Type", label: "Certificate Type" },
      { value: "Labour Type", label: "Labour Type" },
    ],
  },
  {
    title: "User & Permission",
    items: [{ value: "User & Permission", label: "User & Permission" }],
  },
  {
    title: "Reserve",
    items: [{ value: "Reserve", label: "Reserve" }],
  },
  {
    title: "Purchase Order",
    items: [
      { value: "Purchase Order", label: "Purchase Order" },
      { value: "Purchase", label: "Purchase (PU)" },
    ],
  },
  {
    title: "Sale",
    items: [{ value: "Sale", label: "Sale" }],
  },
  {
    title: "Partner Master",
    items: [
      { value: "Vendor", label: "Vendor" },
      { value: "Customer", label: "Customer" },
    ],
  },
  {
    title: "Finance",
    items: [
      { value: "Receivable", label: "Receivable" },
      { value: "Payable", label: "Payable" },
      { value: "Transaction", label: "Transaction" },
    ],
  },
];

const SHORTCUT_COLUMN_TITLES = [
  ["Dashboard", "Company", "User & Permission", "Partner Master", "Finance"],
  ["Stone Master", "Quotation", "Reserve", "Purchase Order"],
  ["Memo", "Inventory", "Stock Report", "Stock Transfer", "Sale"],
  ["Report", "Setup"],
];

const DragHandleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1.96094" y1="2.7085" x2="14.0443" y2="2.7085" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" />
    <line x1="1.96094" y1="7.375" x2="14.0443" y2="7.375" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" />
    <line x1="1.96094" y1="12.0417" x2="14.0443" y2="12.0417" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" />
  </svg>

);

const RemoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_21674_4605)">
      <path d="M5.13759 7.25H10.6931C10.8405 7.25 10.9818 7.32024 11.086 7.44526C11.1902 7.57029 11.2487 7.73986 11.2487 7.91667C11.2487 8.09348 11.1902 8.26305 11.086 8.38807C10.9818 8.5131 10.8405 8.58333 10.6931 8.58333H5.13759C4.99024 8.58333 4.84894 8.5131 4.74475 8.38807C4.64056 8.26305 4.58203 8.09348 4.58203 7.91667C4.58203 7.73986 4.64056 7.57029 4.74475 7.44526C4.84894 7.32024 4.99024 7.25 5.13759 7.25Z" fill="#B41E38" />
      <path d="M7.91797 14.7739C8.81846 14.7739 9.71014 14.5965 10.5421 14.2519C11.374 13.9073 12.13 13.4022 12.7667 12.7655C13.4034 12.1287 13.9085 11.3728 14.2531 10.5409C14.5977 9.70892 14.7751 8.81724 14.7751 7.91675C14.7751 7.01626 14.5977 6.12458 14.2531 5.29263C13.9085 4.46069 13.4034 3.70476 12.7667 3.06802C12.13 2.43127 11.374 1.92618 10.5421 1.58157C9.71014 1.23697 8.81846 1.05961 7.91797 1.05961C6.09934 1.05961 4.3552 1.78205 3.06924 3.06802C1.78327 4.35398 1.06083 6.09812 1.06083 7.91675C1.06083 9.73538 1.78327 11.4795 3.06924 12.7655C4.3552 14.0514 6.09934 14.7739 7.91797 14.7739ZM7.91797 15.9167C5.79624 15.9167 3.76141 15.0739 2.26111 13.5736C0.760823 12.0733 -0.0820312 10.0385 -0.0820312 7.91675C-0.0820313 5.79502 0.760823 3.76018 2.26111 2.25989C3.76141 0.759603 5.79624 -0.083252 7.91797 -0.083252C10.0397 -0.083252 12.0745 0.759603 13.5748 2.25989C15.0751 3.76018 15.918 5.79502 15.918 7.91675C15.918 10.0385 15.0751 12.0733 13.5748 13.5736C12.0745 15.0739 10.0397 15.9167 7.91797 15.9167Z" fill="#B41E38" />
    </g>
    <defs>
      <clipPath id="clip0_21674_4605">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>

);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function AddShortcutModal({
  open,
  onClose,
  selected = [],
  setSelected,
  max = 14,
  // onReset,
  onOk,
}) {
  const [draggingIndex, setDraggingIndex] = useState(null);
  // Local state to track selections - only apply when OK is clicked
  const [localSelected, setLocalSelected] = useState(selected);
  const leftScrollRef = useRef(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const labelByValue = useMemo(() => {
    const m = new Map();
    SHORTCUT_SECTIONS.forEach((section) => {
      section.items.forEach((it) => {
        m.set(it.value, it.label);
      });
    });
    return m;
  }, []);

  const sectionsByTitle = useMemo(() => {
    const m = new Map();
    SHORTCUT_SECTIONS.forEach((s) => m.set(s.title, s));
    return m;
  }, []);


  useEffect(() => {
    if (open) {
      setLocalSelected(selected);
    }
  }, [open, selected]);


  useEffect(() => {
    if (!open) return;

    const checkViewportHeight = () => {

      const viewportHeight = window.innerHeight;
      const isConsoleOpen = viewportHeight < window.outerHeight * 0.7;
      setShowScrollbar(isConsoleOpen);
    };


    checkViewportHeight();

    window.addEventListener("resize", checkViewportHeight);

    const interval = setInterval(checkViewportHeight, 500);

    return () => {
      window.removeEventListener("resize", checkViewportHeight);
      clearInterval(interval);
    };
  }, [open]);


  const scrollbarStyles = {
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: showScrollbar
        ? "rgba(150,150,150,0.6)"
        : "transparent",
      borderRadius: "6px",
      transition: "background-color 0.25s ease",
    },
    scrollbarWidth: "thin",
    scrollbarColor: showScrollbar
      ? "rgba(150,150,150,0.6) transparent"
      : "transparent transparent",
  };

  const isChecked = (value) => localSelected.includes(value);

  const toggle = (value) => {
    setLocalSelected((prev) => {
      const exists = prev.includes(value);
      if (exists) return prev.filter((v) => v !== value);
      if (prev.length >= max) return prev;
      return [...prev, value];
    });
  };

  const remove = (value) => {
    setLocalSelected((prev) => prev.filter((v) => v !== value));
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", String(index));
    event.dataTransfer.effectAllowed = "move";
    setDraggingIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const draggedIndex = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isNaN(draggedIndex) || draggedIndex === index) {
      setDraggingIndex(null);
      return;
    }

    setLocalSelected((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });

    setDraggingIndex(null);
  };


  const handleOk = () => {
    setSelected(localSelected);
    if (onOk) {
      onOk(localSelected);
    }
    onClose();
  };


  const handleClose = () => {
    setLocalSelected(selected);
    onClose();
  };

  const handleModalClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="add-shortcut-modal"
      disableEscapeKeyDown={true}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        },
      }}
    >
      <Box className="homeShortcutModalRoot">
        <Box className="homeShortcutModalHeader">
          <Typography className="homeShortcutModalTitle">Add Shortcut</Typography>
          <IconButton onClick={onClose} className="homeShortcutCloseBtn">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className="homeShortcutModalBody">
          <Box className="homeShortcutPanel">
            <Box className="homeShortcutPanelHeader">
              <Box className="homeShortcutPanelHeaderLeft">
                <Typography className="homeShortcutPanelTitle">
                  Select Shortcuts
                </Typography>

              </Box>
              <Typography
                className="homeShortcutCount"
                sx={{
                  color: localSelected.length >= max ? "#B41E38 !important" : "inherit",
                  "&.homeShortcutCount": {
                    color: localSelected.length >= max ? "#B41E38 !important" : "inherit"
                  }
                }}
              >
                {localSelected.length}/{max}
              </Typography>
            </Box>

            <Box className="homeShortcutDivider" />

            <Box
              ref={leftScrollRef}
              className="homeShortcutLeftScroll"
              sx={scrollbarStyles}
            >
              <Box className="homeShortcutColumns">
                {SHORTCUT_COLUMN_TITLES.map((column, colIdx) => (
                  <Box key={colIdx} className="homeShortcutColumn">
                    {column.map((title) => {
                      const section = sectionsByTitle.get(title);
                      if (!section) return null;
                      return (
                        <Box key={section.title} className="homeShortcutGroup">
                          <Typography
                            className="homeShortcutGroupTitle"
                            sx={{
                              ...(section.title === "Stock Report" || section.title === "Stock Transfer" ? {
                                fontFamily: "Calibri !important",
                                fontWeight: "700 !important",
                                fontSize: "14px !important",
                                marginleft: "8px !important",
                                color: "#666666 !important",
                              } : {})
                            }}
                          >
                            {section.title}
                          </Typography>
                          <Box className="homeShortcutGroupItems">
                            {section.items.map((it) => {
                              const isStockGroup =
                                section.title === "Stock Report" ||
                                section.title === "Stock Transfer";
                              const checked = isChecked(it.value);
                              const disabled = !checked && localSelected.length >= max;
                              return (
                                <FormControlLabel
                                  key={it.value}
                                  className="homeShortcutCheckboxRow"
                                  labelPlacement="end"
                                  sx={{
                                    ...(isStockGroup
                                      ? {
                                        ".MuiFormControlLabel-label": {
                                          marginLeft: "4px !important",
                                          color: "#7a7a7a",
                                        },
                                        ".MuiCheckbox-root": {
                                          padding: "0px 5px 0px 0px !important",
                                          marginLeft: "18px !important",
                                        },
                                      }
                                      : {}),
                                  }}
                                  control={
                                    disabled ? (
                                      <Box
                                        sx={{
                                          padding: "3px 8px 3px 3px",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          width: "20px",
                                          height: "20px",
                                          cursor: "not-allowed",
                                          ...(isStockGroup
                                            ? {
                                              marginLeft: "18px !important",
                                              padding: "3px 8px 3px 3px !important",

                                              display: "inline-flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              width: "20px",
                                              height: "20px",
                                            }
                                            : {}),
                                        }}
                                      >
                                        <DisabledUncheckedSvg />
                                      </Box>
                                    ) : (
                                      <Checkbox
                                        size="small"
                                        checked={checked}
                                        onChange={() => toggle(it.value)}
                                        disableRipple
                                      />
                                    )
                                  }
                                  label={
                                    <Typography className="homeShortcutCheckboxLabel">
                                      {it.label}
                                    </Typography>
                                  }
                                />
                              );
                            })}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box className="homeShortcutPanel homeShortcutPanel--sort">
            <Box className="homeShortcutPanelHeader">
              <Typography className="homeSortPanelTitle" >
                Sort Shortcuts
              </Typography>
            </Box>
            <Box className="homeShortcutDivider" />

            <Box className="homeShortcutRightScroll">
              {localSelected.map((value, index) => (
                <Box
                  key={`${value}-${index}`}
                  className={`homeShortcutSortItem ${draggingIndex === index ? "isDragging" : ""
                    }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <Box className="homeShortcutSortLeft">
                    <Box className="homeShortcutDragHandle">
                      <DragHandleIcon />
                    </Box>
                    <Typography className="homeShortcutSortText">
                      {labelByValue.get(value) || value}
                    </Typography>
                  </Box>
                  <IconButton
                    className="homeShortcutRemoveBtn" sx={{ padding: "0px !important" }}
                    onClick={() => remove(value)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className="homeShortcutFooter">
          {/* {onReset ? (
            <Button
              className="homeShortcutBtnReset"
              variant="outlined"
              onClick={() => {
                setLocalSelected([]);
                if (onReset) {
                  onReset();
                }
              }}
            >
              Reset
            </Button> */}
          {/* ) : null} */}
          <Button
            className="homeShortcutBtnOk"
            variant="contained"
            onClick={handleOk}
            disabled={localSelected.length === 0}
          >
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

