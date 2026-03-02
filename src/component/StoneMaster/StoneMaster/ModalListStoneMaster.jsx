import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import SwitchIOSStyleInModal from "../../SwitchIOSStyleInModal";
import SwitchWithLabel from "../../SwitchIOSStyleLabel";

import apiRequest from "../../../helpers/apiHelper";
import * as XLSX from "xlsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
};

const ModalListStoneMaster = (props) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCheckboxChange = (event, stone) => {
    if (event.target.checked) {
      setSelectedCheckboxes([...selectedCheckboxes, stone]);
    } else {
      setSelectedCheckboxes(
        selectedCheckboxes.filter((item) => item !== stone)
      );
    }
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Select all items
      setSelectedCheckboxes(data);
    } else {
      // Deselect all items
      setSelectedCheckboxes([]);
    }
  };

  const exportToExcel = (selectedCheckboxes) => {
    // เลือกเฉพาะฟิลด์ที่ต้องการ เช่น code, name, และ master_status
    const filteredData = selectedCheckboxes.map((item) => ({
      code: item.code,
      name: item.name,
      master_status: item.master_status,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Stones");
  
    // Exporting the excel file
    const workSheetName = "selected_stones"+props.master_type+".xlsx";
    XLSX.writeFile(workbook, workSheetName);
  };

  const handleExport = () => {
    exportToExcel(selectedCheckboxes);
  };

  const handleDelete = () => {
    if (selectedCheckboxes.length === 0) {
      alert("Please select items to delete");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Extract codes from selected items
      const codes = selectedCheckboxes.map(item => item.code);
      
      // Make API call to delete items - following the same pattern as other APIs
      const response = await apiRequest("DELETE", "/master", {
        codes: codes,
        master_type: props.master_type
      });
      
      console.log("Delete API Response:", response);
      
      // Remove deleted items from local state
      setData(prevData => 
        prevData.filter(item => !selectedCheckboxes.includes(item))
      );
      setRawListData(prevData => 
        prevData.filter(item => !selectedCheckboxes.includes(item))
      );
      
      // Close modal and clear selection
      setShowDeleteConfirm(false);
      setSelectedCheckboxes([]);
      setSelectAll(false);
      
    } catch (error) {
      console.error("Delete API Error:", error);
      // Only show error alert if there's an actual error
      alert("Error deleting items. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (hasChanges) {
      window.location.reload();
    }
  };

  const [page, setPage] = React.useState("10");

  const handleChange = (event) => {
    setPage(event.target.value);
  };

  const [data, setData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchData, setSearchData] = useState(false);
  const [rawListData, setRawListData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    if (open) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await apiRequest(
            "GET",
            "/master?master_type="+props.master_type
          );
          setData(response);
          setRawListData(response)
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open]);

  const handleSwitchChange =  async (id,status) => {

    // Update the local state for the specific item
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item._id === id ? { ...item, master_status: status } : item
      );
      console.log("Updated Data:", updatedData); // Log updated data
      return updatedData;
    });

    setHasChanges(true);

    try {
      // Send an update request to the server
      await apiRequest("PUT", "/master", {
        _id: id,
        master_status: status,
        master_type: props.master_type,
      });
      console.log("Update Success:", id, "New Status:", status);
    } catch (err) {
      console.error("Update Error:", err); // Log update errors
      // Optional: Revert the local state update if the request fails
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id
            ? { ...item, master_status: item.master_status }
            : item
        )
      );
    }
  };



  return (
    <>
      <Box>
        <Button
          onClick={handleOpen}
          sx={{
            textTransform: "none",
            height: "35px",
            width: "84px",
            padding: "12px",
            borderRadius: "4px",
            gap: "8px",
            marginRight: "12px",
            backgroundColor: "#C6A969",
            "&:hover": {
              backgroundColor: "#C6A969",
            },
          }}
        >
          <Typography
            sx={{
              color: "var(--jw-background-white-textwhite, #FFF)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            List
          </Typography>
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* Header */}
            <Box
              sx={{
                width: "100%",
                height: "56px",
                backgroundColor: "var(--HeadPage, #05595B)",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  fontFamily: "Calibri",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  marginLeft: "32px",
                  marginTop: "10px",
                }}
              >
                {props.modal_heading}
              </Typography>
              <Box
                sx={{
                  marginTop: "16px",
                  marginRight: "16px",
                  cursor: "pointer",
                  "&:hover svg path": {
                    fill: "#E00410",
                  },
                }}
                onClick={handleClose}
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
                    fill="white"
                  />
                  <path
                    d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
                    fill="white"
                  />
                </svg>
              </Box>
            </Box>

            {/* Body */}
            <Box
              sx={{
                backgroundColor: "#F8F8F8",
                width: "95.2%",
                height: "721px",
                marginLeft: "33px",
                marginTop: "33px",
                paddingTop: "32px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Title */}
              <Box
                sx={{
                  width: "1232px",
                  height: "40px",
                  marginLeft: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "var(--HeadPage, #05595B)",
                      fontFamily: "Calibri",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                      {props.modal_subheading}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: "12px" }}>
                  <Box>
                    <TextField
                    onChange={(e)=>{
                      if(e.target.value.length>0){
                        const regex = new RegExp(e.target.value);
                      setData(data.filter(list => list.code.match(regex)));
                      }else{
                        setData(rawListData);
                      }
                      
          

                    }}
                      placeholder="Search ..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 19"
                              fill="none"
                            >
                              <path
                                d="M17.2233 18.5L10.3436 11.6208C9.79431 12.0888 9.1626 12.4509 8.44849 12.7073C7.73438 12.9636 7.0166 13.0918 6.29517 13.0918C4.53589 13.0918 3.04688 12.4828 1.82813 11.2648C0.609375 10.0469 0 8.55835 0 6.79918C0 5.04001 0.608642 3.55072 1.82593 2.33131C3.04321 1.1119 4.5315 0.501467 6.29077 0.500003C8.05005 0.498538 9.5398 1.10788 10.76 2.32802C11.9802 3.54816 12.5907 5.03744 12.5914 6.79588C12.5914 7.55902 12.4563 8.29762 12.186 9.01169C11.9158 9.72576 11.5605 10.3366 11.1204 10.8441L18 17.7222L17.2233 18.5ZM6.29517 11.9921C7.75269 11.9921 8.98352 11.4904 9.98767 10.4871C10.9918 9.48371 11.4935 8.25295 11.4928 6.79478C11.4921 5.33662 10.9904 4.10623 9.98767 3.1036C8.98499 2.10098 7.75452 1.5993 6.29626 1.59857C4.83801 1.59784 3.60718 2.09951 2.60376 3.1036C1.60034 4.10769 1.09863 5.33809 1.09863 6.79478C1.09863 8.25148 1.60034 9.48188 2.60376 10.486C3.60718 11.4901 4.83765 11.9928 6.29517 11.9921Z"
                                fill="#4F4A3E"
                              />
                            </svg>
                          </InputAdornment>
                        ),
                        sx: {
                          color: "#C0C0C0",
                          fontFamily: "Segoe UI",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {},
                          borderRadius: "10px",
                          backgroundColor: "#FFF",
                          width: "354px",
                          height: "40px",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E0E2E4",
                          },
                          "&:hover": {
                            backgroundColor: "#F5F8FF",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E0E2E4",
                          },
                        },
                        marginRight: "16px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      width: "113px",
                      height: "38px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#343434",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      Rows per page
                    </Typography>
                  </Box>

                  <FormControl
                    
                    sx={{
                      height: "40px",
                      width: "69px",
                      marginRight: "10px",
                    }}
                  >
                    <Select
                      sx={{
                        height: "40px",
                        width: "69px",
                        backgroundColor: "#FFF",
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                      value={page}
                      onChange={handleChange}
                    >
                      <MenuItem
                        value={10}
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        10
                      </MenuItem>
                      <MenuItem
                        value={20}
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        20
                      </MenuItem>
                      <MenuItem
                        value={30}
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        30
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      "&:hover svg path": {
                        fill: "#E9B238",
                      },
                      marginTop: "6px",
                      "& svg path": {
                        fill: "#666666",
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
                        fill="white"
                      />
                    </svg>
                  </Box>

                  <Box
                    onClick={handleExport}
                    sx={{
                      cursor: "pointer",
                      "&:hover svg path": {
                        fill: "#00AA3A",
                      },
                      marginTop: "6px",
                      "& svg path": {
                        fill: "#666666",
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
                        fill="white"
                      />
                    </svg>
                  </Box>
                </Box>
              </Box>
              {/* Table */}
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error" sx={{ padding: "20px" }}>
                  Error: {error.message}
                </Typography>
              ) : (
                <Box
                  sx={{
                    width: "1200px",
                    marginTop: "24px",
                    marginLeft: "48px",
                    borderRadius: "5px 5px 5px 5px",
                    border: "1px solid var(--Line-Table, #C6C6C8)",
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                <Box
                  sx={{
                    width: "1200px",
                    height: "40px",
                    bgcolor: "#EDEDED",
                    display: "flex",
                    borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                  }}
                >
                  <Box
                    sx={{
                      width: "90px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Checkbox checked={selectAll}
  onChange={handleSelectAllChange}/>
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      #
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "260px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginLeft: "128px",
                    }}
                  >
                    <Typography
                      sx={{
                        marginLeft: "16px ",
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Code
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "300px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginLeft: "128px",
                    }}
                  >
                    <Typography
                      sx={{
                        marginLeft: "16px ",
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      Name
                    </Typography>
                  </Box>

                  <Box
                        sx={{
                          width: "183px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "100px",
                          borderLeft: "1px solid var(--Line-Table, #C6C6C8)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "var(--Main-Text, #343434)",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 700,
                          }}
                        >
                      Status
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    overflow: "auto",
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    maxHeight: "580px",
                  }}
                >
                  {data.map((item, index) => {


                    return (
                      
                    <Box
                    key={item._id}
                    sx={{
                      width: "1200px",
                      height: "40px",
                      bgcolor: "#FFF",
                      display: "flex",
                      borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                    }}
                  >
                    <Box
                      sx={{
                        width: "90px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Checkbox
                        checked={selectedCheckboxes.includes(item)}
                        onChange={(event) =>
                          handleCheckboxChange(event, item)
                        }
                      />
                      <Typography
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "260px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginLeft: "128px",
                      }}
                    >
                      <Typography
                        sx={{
                          marginLeft: "16px ",
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        {item.code}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "300px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginLeft: "128px",
                      }}
                    >
                      <Typography
                        sx={{
                          marginLeft: "16px ",
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "183px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "100px",
                        borderLeft: "1px solid var(--Line-Table, #C6C6C8)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "var(--Main-Text, #343434)",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                        }}
                      >
                  
                                      <SwitchWithLabel
            checked={item.master_status === "active"}
            onChange={(e) =>  {
         
              let status = e.target.checked?"active":"inactive"
              handleSwitchChange(item._id,status)
            }
          
          } label={item.master_status}
          /> 
                        {/* <SwitchWithLabel
                          checked={item.master_status === "active"}
                          onChange={handleSwitchChange(item._id)}
                        /> */}
                      </Typography>
                    </Box>
                  </Box>
                    )
                  }
                  )}
                </Box>
              </Box>
              )}  
              {/* Delete Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                  marginRight: "48px",
                  marginBottom: "24px",
                  flexShrink: 0,
                }}
              >
                <Button
                  onClick={handleDelete}
                  sx={{
                    backgroundColor: "#B41E38", // Updated color as requested
                    color: "#FFF",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    textTransform: "none",
                    padding: "12px 24px",
                    borderRadius: "4px",
                    minWidth: "100px",
                    height: "40px",
                    "&:hover": {
                      backgroundColor: "#9A1A30", // Darker shade for hover
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={showDeleteConfirm}
          onClose={handleCancelDelete}
          aria-labelledby="delete-confirmation-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            {/* Warning Icon */}
            <Box sx={{ mb: 2 }}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 19.7778H22L12 2Z"
                  fill="#B41E38"
                  stroke="#B41E38"
                  strokeWidth="2"
                />
                <path
                  d="M12 9V13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1" fill="white" />
              </svg>
            </Box>

            {/* Question Text */}
            <Typography
              variant="h6"
              sx={{
                color: "#343434",
                fontFamily: "Calibri",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 600,
                mb: 3,
              }}
            >
              Would you like to delete?
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                onClick={handleCancelDelete}
                sx={{
                  backgroundColor: "#FFF",
                  color: "#666666",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  textTransform: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  border: "1px solid #E0E0E0",
                  minWidth: "100px",
                  height: "40px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                    borderColor: "#D0D0D0",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                sx={{
                  backgroundColor: "#B41E38",
                  color: "#FFF",
                  fontFamily: "Calibri",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  textTransform: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  minWidth: "120px",
                  height: "40px",
                  "&:hover": {
                    backgroundColor: "#9A1A30",
                  },
                }}
              >
                Yes, delete it!
              </Button>
            </Box>

            {/* Close Icon */}
            <Box
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                cursor: "pointer",
                "&:hover svg path": {
                  fill: "#B41E38",
                },
              }}
              onClick={handleCancelDelete}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ModalListStoneMaster;
