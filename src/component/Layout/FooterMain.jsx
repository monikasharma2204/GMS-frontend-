import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";
// { onClick, onCancelEdit, responseMessage, isSaveDisabled, disabled, handlePost }
import { useRecoilState,useRecoilValue } from "recoil";
import { showConfirmModalState,confirmValueState,successModalState,successValueState,failedValueState ,failedModalState } from "recoil/DialogState";
import { enableEditState } from "recoil/state/VendorState";
import {activeSaveButtonState,activeEditButtonState} from "recoil/ButtonState"
import { isEditingState } from "recoil/state/CommonState";
import { companyProfileFSMState } from "recoil/state/CompanyProfileFSMState";
import { userAndPermissionFSMState } from "recoil/state/UserAndPermissionFSMState";
import ConfirmCancelDialog from "component/Commons/ConfirmCancelDialog";
const Footer = (props) => {
 
  const [ isEditing,setIsEditing] = useRecoilState(isEditingState)
    const [activeSaveButton, setActiveSaveButton] = useRecoilState(activeSaveButtonState);
    const [activeEditButton, setActiveEditButton] = useRecoilState(activeEditButtonState);
    const [confirmValue, setConfirmValue] = useRecoilState(confirmValueState);
  
    const editStatus = useRecoilValue(enableEditState)
    const [companyProfileFsmState, setCompanyProfileFsmState] = useRecoilState(companyProfileFSMState);
    const [userAndPermissionFsmState, setUserAndPermissionFsmState] = useRecoilState(userAndPermissionFSMState);

    const [openConfirm, setOpenConfirm] = useRecoilState(showConfirmModalState);
    const [openSuccess, setOpenSuccess] = useRecoilState(successModalState);
    const [openUnsuccess, setOpenUnsuccess] = useRecoilState(failedModalState);
  const location = useLocation();

  const isCompanyProfile = location.pathname.includes("/company/profile") || location.pathname.includes("/company/company-profile") || location.pathname === "/company/profile" || location.pathname === "/company/company-profile";
  const isUserAndPermission = location.pathname.includes("/userandpermission");
  
  // Get the appropriate FSM state based on page
  const fsmState = isCompanyProfile ? companyProfileFsmState : (isUserAndPermission ? userAndPermissionFsmState : null);
  const setFsmState = isCompanyProfile ? setCompanyProfileFsmState : (isUserAndPermission ? setUserAndPermissionFsmState : null);

  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  

  const getCancelDisabled = () => {
    if ((isCompanyProfile || isUserAndPermission) && fsmState) {
      // Enabled only in dirty & edit, disabled in add & view
      return fsmState !== "dirty" && fsmState !== "edit";
    }
    return false;
  };

  const getSaveDisabled = () => {
    if ((isCompanyProfile || isUserAndPermission) && fsmState) {
      // Enabled only in dirty & edit, disabled in add & view
      return fsmState !== "dirty" && fsmState !== "edit";
    }
    return editStatus === false && isEditing === false;
  };

  // Check if user has permissions for UserAndPermission page (RBAC)
  // For CompanyProfile and other pages: buttons always show (no permission check)
  // For UserAndPermission: buttons only show if permission is true
  const hasUserAddPermission = isUserAndPermission ? (props.userPermission_add === true) : true;
  const hasUserEditPermission = isUserAndPermission ? (props.userPermission_edit === true) : true;

  const getAddDisabled = () => {
    if (isUserAndPermission) {
      // Same logic as Edit button: Enabled only in view, disabled in add/dirty/edit
      if (fsmState) {
        return fsmState !== "view";
      }
      // If fsmState is not initialized yet (null/undefined), default to disabled
      return true;
    }
    // For CompanyProfile or other pages, Add button is not shown
    return true;
  };

  const getEditDisabled = () => {
    if (isCompanyProfile || isUserAndPermission) {
      // For FSM pages, check if fsmState exists
      if (fsmState) {
        // Enabled only in view, disabled in add/dirty/edit
        return fsmState !== "view";
      }
      // If fsmState is not initialized yet, default to disabled (will be enabled once state is set to "view")
      return true;
    }
    // For non-FSM pages, use the original logic
    return editStatus === false && isEditing === false;
  };

  const isAddDisabled = getAddDisabled();
  const isEditDisabled = getEditDisabled();
  const isCancelDisabled = getCancelDisabled();
  const isSaveDisabled = getSaveDisabled();



  const handleSaveClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirmEdit = (confirmed) => {
    setConfirmValue(true)
  };

  const handleConfirmClose = (confirmed) => {
    if (confirmed) {
    //   onClick();
    }
    setOpenConfirm(false);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
    setOpenUnsuccess(false);
  };

  return (
    <>
      <Box
        sx={{
          width: "1697px",
          height: "65px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderTop: "1px solid #BFBFBF",
          gap: "8px",
          position: "fixed",
          bottom: "0",
          backgroundColor: "#FFF",
          zIndex: 5,
        }}
      >
   
        {isUserAndPermission && props.onAddClick && (
          <Button
            disabled={isAddDisabled || !hasUserAddPermission}
            onClick={() => {
              if (!isAddDisabled && props.onAddClick) {
                props.onAddClick();
              }
            }}
            sx={{
              textTransform: "none",
              height: "45px",
              width: "84px",
              padding: "12px",
              borderRadius: "4px",
              gap: "8px",
              backgroundColor: isAddDisabled ? "#E6E6E6" : "#05595B",
              "&:hover": {
                backgroundColor: isAddDisabled ? "#E6E6E6" : "#05595B",
              },
              "&:disabled": {
                color: "#57646E",
                backgroundColor: "#E6E6E6",
              },
            }}
          >
            <Typography
              sx={{
                color: isAddDisabled ? "#57646E" : "var(--jw-background-white-textwhite, #FFF)",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Add
            </Typography>
          </Button>
        )}

        
        <Button
          disabled={isEditDisabled || (isUserAndPermission && !hasUserEditPermission)}
          onClick={() => {
            if (props.onEdit) {
              props.onEdit();
            } else {
              setIsEditing(true);
              if (isCompanyProfile || isUserAndPermission) {
                if (setFsmState) {
                  setFsmState("edit");
                }
              }
            }
          }}
          sx={{
            textTransform: "none",
            height: "45px",
            width: "84px",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #05595B",
            gap: "8px",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#fff",
            },
            "&:disabled": {
              color: "#999191",
              backgroundColor: "#fff",
              borderColor: "#999191",
              "& .MuiTypography-root": {
                color: "#999191",
              },
              "& svg path": {
                fill: "#999191",
              },
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
              d="M7 17.0129L11.413 16.9979L21.045 7.4579C21.423 7.0799 21.631 6.5779 21.631 6.0439C21.631 5.5099 21.423 5.0079 21.045 4.6299L19.459 3.0439C18.703 2.2879 17.384 2.2919 16.634 3.0409L7 12.5829V17.0129ZM18.045 4.4579L19.634 6.0409L18.037 7.6229L16.451 6.0379L18.045 4.4579ZM9 13.4169L15.03 7.4439L16.616 9.0299L10.587 15.0009L9 15.0059V13.4169Z"
              fill={!isEditDisabled ? "#05595B" : "#E6E6E6"}
            />
            <path
              d="M5 21H19C20.103 21 21 20.103 21 19V10.332L19 12.332V19H8.158C8.132 19 8.105 19.01 8.079 19.01C8.046 19.01 8.013 19.001 7.979 19H5V5H11.847L13.847 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21Z"
              fill={!isEditDisabled ? "#05595B" : "#E6E6E6"}
            />
          </svg>
          <Typography
            sx={{
              color: !isEditDisabled ? "#05595B" : "#E6E6E6",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Edit
          </Typography>
        </Button>

        <Button
          disabled={isCancelDisabled}
          onClick={() => {
          
            if ((isCompanyProfile || isUserAndPermission) && (fsmState === "dirty" || fsmState === "edit")) {
              setShowCancelConfirmDialog(true);
            } else {
        
              if (props.onCancelEdit) {
                props.onCancelEdit();
              }
            }
          }}
          sx={{
            height: "45px",
            padding: "12px 24px",
            borderRadius: "4px",
            border: "1px solid #BFBFBF",
            backgroundColor: "var(--jw-background-white-textwhite, #FFF)",
            "&:hover": {
              backgroundColor: isCancelDisabled ? "var(--jw-background-white-textwhite, #FFF)" : "#F5F5F5",
            },
            "&:disabled": {
              color: "#BFBFBF",
              borderColor: "#BFBFBF",
              opacity: 0.6,
              cursor: "not-allowed",
              "& .MuiTypography-root": {
                color: "#BFBFBF",
              },
            },
          }}
        >
          <Typography
            sx={{
              textTransform: "none",
              color: "var(----jw-main__text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Cancel
          </Typography>
        </Button>


        <Button
          disabled={isSaveDisabled}
          onClick={props.onClick}
          sx={{
            height: "45px",
            padding: "12px 24px",
            borderRadius: "4px",
            marginRight: "32px",
            backgroundColor: isSaveDisabled ? "gray" : "#05595B",
            "&:hover": {
              backgroundColor: isSaveDisabled ? "gray" : "#05595B",
            },
            "&:disabled": {
              backgroundColor: "gray !important",
              color: "var(--jw-background-white-textwhite, #FFF)",
            },
          }}
        >
          <Typography
            sx={{
              textTransform: "none",
              color: "var(--jw-background-white-textwhite, #FFF)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Save
          </Typography>
        </Button>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
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
            onClick={handleConfirmClose}
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
              Would you like to save?
            </Typography>
            <Box sx={{ display: "flex", gap: "14px" }}>
              <Button
                onClick={props.handleConfirmClose}
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
                onClick={props.onClick}
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

        {/* Success Dialog */}
        <Dialog
          open={openSuccess}
          onClose={handleSuccessClose}
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
        
          <Box
            onClick={handleSuccessClose}
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

        {/* Unsuccess Dialog */}
        <Dialog
          open={openUnsuccess}
          onClose={handleSuccessClose}
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
          <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_2788_204916)">
<path d="M56 0C25.0723 0 0 25.0723 0 56C0 86.9295 25.0723 112 56 112C86.9295 112 112 86.9295 112 56C112 25.0723 86.9295 0 56 0ZM56 105.11C28.9818 105.11 7 83.0182 7 55.9998C7 28.9815 28.9818 6.99978 56 6.99978C83.0182 6.99978 105 28.9816 105 55.9998C105 83.0179 83.0182 105.11 56 105.11ZM75.7978 36.2023C74.431 34.8355 72.2155 34.8355 70.8488 36.2023L56 51.051L41.1512 36.2023C39.7845 34.8355 37.569 34.8355 36.2005 36.2023C34.8338 37.569 34.8338 39.7845 36.2005 41.1512L51.0492 56L36.2005 70.8488C34.8338 72.2138 34.8338 74.4329 36.2005 75.7979C37.5673 77.1646 39.7827 77.1646 41.1512 75.7979L56 60.9491L70.8488 75.7979C72.2155 77.1646 74.431 77.1646 75.7978 75.7979C77.1645 74.4329 77.1645 72.2138 75.7978 70.8488L60.949 56L75.7978 41.1512C77.1663 39.7827 77.1663 37.5672 75.7978 36.2023Z" fill="#D9214E"/>
</g>
<defs>
<clipPath id="clip0_2788_204916">
<rect width="112" height="112" fill="white"/>
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
            Unsuccessfully ... Please try again
          </Typography>
        </Dialog>

       
        {(isCompanyProfile || isUserAndPermission) && (
          <ConfirmCancelDialog
            open={showCancelConfirmDialog}
            onClose={(confirmed) => {
              setShowCancelConfirmDialog(false);
              if (confirmed && props.onCancelEdit) {
                props.onCancelEdit();
              }
            }}
            title="Confirm Cancel"
            message="You have entered some data. Do you really want to cancel?"
            noButtonText="No"
            yesButtonText="Yes"
          />
        )}
      </Box>
    </>
  );
};

export default Footer;
