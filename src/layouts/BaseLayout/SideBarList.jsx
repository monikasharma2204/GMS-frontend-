import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, InputAdornment, Box, Typography, Dialog } from "@mui/material";
import apiRequest from "helpers/apiHelper.js"
import { vendorListState } from "recoil/state/VendorState";
import { useRecoilState } from "recoil";
import { Link, useLocation } from "react-router-dom";
import "App.css"
import {API_URL} from "config/config.js";
import CustomConfirmDialog from "../../component/Commons/CustomConfirmDialog";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import { successValueState } from "recoil/DialogState";
import { 
  payloadDataCurrencyState,
  payloadDataMainLocationState,
  payloadDataSubLocationState
} from "recoil/state/CommonState";
const SideBarList = (props) => {
  const location = useLocation();
  
  const [accountData,setAccountData] = useState(false)
  const [ vendorList,setVendorList] = useRecoilState(vendorListState)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false)
  const [pendingItem, setPendingItem] = useState(null)
  const [successStatus, setSuccessStatus] = useRecoilState(successValueState)
  
  // Get payload data based on the list type
  const [payloadDataCurrency] = useRecoilState(payloadDataCurrencyState)
  const [payloadDataMainLocation] = useRecoilState(payloadDataMainLocationState)
  const [payloadDataSubLocation] = useRecoilState(payloadDataSubLocationState)

  useEffect(()=>{
    axios.get(`${API_URL}/${props.list_url}`)
    .then(response => {
      console.log(response.data)
      setAccountData(response.data);
      setVendorList(response.data)
    })
    .catch(error => {
      console.error("Error fetching shape data:", error);
    });
  },[props.refreshKey])

  // Set selected item when URL changes (edit mode)
  useEffect(() => {
    const currentPath = location.pathname;
    const editMatch = currentPath.match(/\/edit\/([^\/]+)/);
    if (editMatch) {
      const editingId = editMatch[1];
      setSelectedItemId(editingId);
    } else {
      setSelectedItemId(null);
    }
  }, [location.pathname]);

  // Clear selection when isEditing changes to false (cancel button clicked)
  useEffect(() => {
    if (!props.isEditing) {
      // If we're not editing (cancel button clicked), clear selection
      setSelectedItemId(null);
    }
  }, [props.isEditing]);

  const handleItemClick = (item, event) => {
    // Only prevent clicks in ADD mode (method === "POST"), not in EDIT mode
    if (props.isEditing && props.method === "POST") {
      event.preventDefault(); 
      event.stopPropagation(); 
      return false; 
    }
    
    // In edit mode, show confirmation dialog
    if (props.isEditing && props.method === "PUT") {
      event.preventDefault(); // Prevent navigation when editing
  
      if (props.onConfirmedDataSelection) {
        setPendingItem(item);
        setShowCancelConfirmDialog(true);
        return false;
      } else if (props.onItemClickInEditMode) {
        // Parent handles the confirmation dialog
        props.onItemClickInEditMode(item, event);
        return false;
      } else {

        setPendingItem(item);
        setShowConfirmDialog(true);
        return false;
      }
    }
    
    setSelectedItemId(item._id);
    if (props.onDataSelection) {
      props.onDataSelection(item);
    }
  };

  const handleCancelConfirmDialogClose = async (confirmed) => {
    setShowCancelConfirmDialog(false);
    if (confirmed === true && pendingItem && props.onConfirmedDataSelection) {
      props.onConfirmedDataSelection(pendingItem);
      setPendingItem(null);
      return;
    }
    setPendingItem(null);
  };

  const handleConfirmDialogClose = async (confirmed) => {
    setShowConfirmDialog(false);
    if (confirmed === true && pendingItem && props.onConfirmedDataSelection) {
      try {
        // Determine payload data based on list type
        let payloadData;
        if (props.list_url === "currencies") {
          payloadData = payloadDataCurrency;
        } else if (props.list_url === "locations") {
          payloadData = payloadDataMainLocation;
        } else if (props.list_url === "sublocations") {
          payloadData = payloadDataSubLocation;
        }

        // Call save API if we have payload data and method/endpoint
        if (payloadData && props.method && props.endpointPath) {
          const save = await apiRequest(props.method, props.endpointPath, payloadData);
          if (save) {
            // Save successful, now switch to new item
            props.onConfirmedDataSelection(pendingItem);
            // Show success dialog
            setSuccessStatus(true);
            // Auto-hide success dialog after 2 seconds
            setTimeout(() => {
              setSuccessStatus(false);
            }, 2000);
          } else {
            // Save failed
            setSuccessStatus("unsuccess");
            setTimeout(() => {
              setSuccessStatus(false);
            }, 2000);
          }
        } else {
          // No save needed, just switch items
          props.onConfirmedDataSelection(pendingItem);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        setSuccessStatus("unsuccess");
        setTimeout(() => {
          setSuccessStatus(false);
        }, 2000);
      }
    }
    setPendingItem(null);
  };


  return (
    <>
      <div className="link_search_list_block sidebar_list_search">
    <div className="search_area">
      <span className="icon_search">
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
      </span>
      <input type="text" className="search_data_list" placeholder="Search..."  />
    </div>
    <div className="list_area">
    {accountData? 
    accountData.map((v,k)=>(
    
      <Link   
        to={props.isEditing ? '#' : `/${props.base_url}/edit/${v._id}`} 
        style={{ textDecoration: 'none', pointerEvents: (props.isEditing && props.method === "POST") ? 'none' : 'auto' }}   
        key={k}
        onClick={(e) => {
          // Only prevent clicks in ADD mode (method === "POST"), not in EDIT mode
          if (props.isEditing && props.method === "POST") {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          handleItemClick(v, e);
        }}
      >
    
        {/* <span 
          className="link_search_list"
          style={{
            backgroundColor: (selectedItemId === v._id) ? '#EFEFEF' : 'inherit',
            cursor: (props.isEditing && props.method === "POST") ? 'default' : 'pointer',
            color: (selectedItemId === v._id) ? '#000000' : (props.isEditing ? '#ababab' : '#000000'),
            opacity: (props.isEditing && props.method === "POST") ? 0.6 : (props.isEditing ? 0.6 : 1)
          }}
        > */}
        <span 
  className="link_search_list"
  style={{
    backgroundColor: selectedItemId === v._id ? '#EFEFEF' : 'inherit',
    cursor: (props.isEditing && props.method === "POST") ? 'default' : 'pointer',

    color: v.status !== "active" ? '#9e9e9e' : '#000000',

    opacity: v.status !== "active" ? 0.6 : 1
  }}
>

          {v.code||v.bank_name}  
        </span>
    
      </Link>
    
    )
    )
    
    : ""}

    </div>
    
      </div>

     
      {props.onConfirmedDataSelection && (
        <ConfirmCancelDialog
          open={showCancelConfirmDialog}
          onClose={handleCancelConfirmDialogClose}
        />
      )}

      {/* Custom Confirm Dialog - for other cases */}
      <CustomConfirmDialog
        open={showConfirmDialog}
        onClose={handleConfirmDialogClose}
        onConfirm={handleConfirmDialogClose}
        title="Would you like to save?"
      />

      {/* Success Dialog */}
      <Dialog
        open={successStatus === true}
        disableEscapeKeyDown
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
      </Dialog>
    </>
  );

};

export default SideBarList;
