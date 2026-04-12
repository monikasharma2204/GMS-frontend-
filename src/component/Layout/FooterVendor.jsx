import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { VendorDataSelector } from "recoil/selector/VendorSelector";
import apiRequest from "../../helpers/apiHelper";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "config/config.js";
import SuccessModal from "../../component/Commons/SuccessModal";
import ErrorModal from "../../component/Commons/ErrorModal";
import WarningDialog from "../../component/Commons/WarningDialog";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import { vendorDataState, vendorFieldErrorsState, vendorInvoiceAddressListState } from "recoil/state/VendorState";
import { validateAccountFields } from "../../helpers/accountValidation";
import { downloadQuotationPdf, downloadPurchaseOrderPdf, downloadPurchasePdf, downloadSalePdf } from "../../helpers/pdfHelper";

const Footer = (props) => {
  const isSaveDisabled = false;
  const disabled = false;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openUnsuccess, setOpenUnsuccess] = useState(false);
  const [isOpenModalWarning, setIsOpenModalWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const vendorData = useRecoilValue(VendorDataSelector);
  const invoiceAddressList = useRecoilValue(vendorInvoiceAddressListState);
  const [fieldErrors, setFieldErrors] = useRecoilState(vendorFieldErrorsState);

  const validateFields = () => {
    const validation = validateAccountFields(vendorData, invoiceAddressList);

    setFieldErrors(validation.errors);

    if (!validation.isValid) {
      setWarningText(validation.warningText);
      setIsOpenModalWarning(true);
      return false;
    }

    setFieldErrors({
      business_type: "",
      vendor_code_id: "",
      vendor_code_name: "",
      contact_person: "",
      phone_no: "",
      email: "",
      currency: "",
      invoice_address: "",
      shipping_address: "",
    });
    return true;
  };

  const handleSaveClick = () => {
    if (props.useCustomSaveConfirm && props.onSaveClick) {
      props.onSaveClick();
      return;
    }

    if ((props.type === "purchaseOrder" || props.type === "purchase" || props.type === "memo_in" || props.type === "memo_return") && props.onSaveClick) {
      props.onSaveClick();
      return;
    }

    if (props.type !== "quotation" && props.type !== "reserve" && props.type !== "purchase" && props.type !== "purchaseOrder" && props.type !== "memo_in" && props.type !== "memo_out" && props.type !== "memo_return" && props.type !== "memo_out_return" && props.type !== "load" && props.type !== "sale") {
      if (!validateFields()) {
        return;
      }
    }

    let invoiceInfo;
    setOpenConfirm(true);
  };

  const handleCancel = () => {
    setOpenConfirm(false);
  };


  const handleConfirmClose = async (confirmed) => {
    if (!confirmed) {
      setOpenConfirm(false);
      return;
    }


    if ((props.type === "quotation" || props.type === "reserve" || props.type === "purchaseOrder" || props.type === "purchase" || props.type === "memo_in" || props.type === "memo_return" || props.type === "memo_out" || props.type === "memo_out_return" || props.type === "load" || props.type === "sale") && props.onSaveClick) {
      setOpenConfirm(false);
      props.onSaveClick();
      return;
    }

    try {
      const updatedInvoiceAddressList = (vendorData.invoice_address || []).map(addr => ({
        ...addr
      }));

      const updatedShippingAddressList = (vendorData.shipping_address || []).map(addr => ({
        ...addr
      }));




      const fsmState = props.fsmState;
      const hasId = !!(props.formData?._id || props.selectedData?._id || props.originalData?._id || vendorData?._id);
      const method = (fsmState === "dirty" && !hasId) || (fsmState === "initial" && !hasId) ? "POST" : "PUT";
      const recordId = props.formData?._id || props.selectedData?._id || props.originalData?._id || vendorData?._id;
      const endpoint = "/account/vendor";

      const updatedVendorData = {
        ...vendorData,
        invoice_address: updatedInvoiceAddressList,
        shipping_address: updatedShippingAddressList,
      };
      if (recordId) {
        updatedVendorData._id = recordId;
      } else {

        delete updatedVendorData._id;
      }

      const requestPayload = {
        ...updatedVendorData,
        account_type: props.account_type,
      };

      const processData = await apiRequest(method, endpoint, requestPayload);

      if (processData?.code === 200) {
        setOpenConfirm(false);
        setOpenSuccess(true);

        const savedData = processData?.data || updatedVendorData;

        if (savedData) {
          if (!savedData._id) {
            if (savedData.id) {
              savedData._id = savedData.id;
            } else if (recordId) {

              savedData._id = recordId;
            } else if (updatedVendorData._id) {
              savedData._id = updatedVendorData._id;
            }
          }
        }

        if (props.onSaveSuccess) {
          props.onSaveSuccess(savedData);
        }
      } else {
        setOpenConfirm(false);
        setOpenUnsuccess(true);
      }
    } catch (err) {
      console.error("API failed", err);
      setOpenConfirm(false);
      setOpenUnsuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
    setOpenUnsuccess(false);
  };
  useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        setOpenSuccess(false);
        setOpenUnsuccess(false);

      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [openSuccess]);

  const getCancelDisabled = () => {

    if (props.type === "purchase" && props.memoInfo?.isPOEdit) {
      return false;
    }

    if (props.type === "reserve" && (props.formData?.from_reserve || props.selectedData?.from_reserve)) {
      return true;
    }
    const isApproved =
      props.isApproved ||
      ((props.formData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.formData?.status_approve || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status_approve || "") + "").toLowerCase() === "approved";

    if (props.type === "load" && isApproved) {
      return true;
    }

    if (isApproved) {
      return true;
    }


    const isCancelled =
      ((props.formData?.status || "") + "").toLowerCase() === "cancelled" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "cancelled" ||
      ((props.formData?.status_cancel || "") + "").toLowerCase() === "cancelled" ||
      ((props.selectedData?.status_cancel || "") + "").toLowerCase() === "cancelled";

    if (isCancelled) {
      return true;
    }

    if (props.fsmState) {
      if ((props.type === "quotation" || props.type === "reserve" || props.type === "memo_out" || props.type === "memo_out_return" || props.type === "load") && props.hasUnsavedData) {
        const hasStoneData = props.hasUnsavedData();
        return !hasStoneData || !(props.fsmState === "dirty" || props.fsmState === "editing");
      }

      if (props.type === "purchase" || props.type === "purchaseOrder" || props.type === "memo_in" || props.type === "memo_return" || props.type === "memo_out_return" || props.type === "load") {

        const shouldEnable = props.fsmState === "dirty" || props.fsmState === "editing" || (props.fsmState === "initial" && props.type === "purchase" && props.memoInfo?.isPOEdit) || (props.type === "purchase" && props.memoInfo?.isPOEdit);
        return !shouldEnable;
      }

      if (props.type === "sale" && props.fsmState === "initial") {
        return false;
      }

      return !(props.fsmState === "dirty" || props.fsmState === "editing");
    }


    if (props.type === "purchase" && props.memoInfo?.isPOEdit) {
      return false;
    }
    return true;
  };

  const getSaveDisabled = () => {

    if (props.type === "purchase" && props.memoInfo?.isPOEdit) {
      return props.isSaveDisabled !== undefined ? props.isSaveDisabled : false;
    }

    if (props.type === "reserve" && (props.formData?.from_reserve || props.selectedData?.from_reserve)) {
      return false;
    }


    const isApproved =
      props.isApproved ||
      ((props.formData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.formData?.status_approve || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status_approve || "") + "").toLowerCase() === "approved";

    if (props.type === "load" && isApproved) {
      return true;
    }

    if (isApproved) {
      return true;
    }

    const isCancelled =
      ((props.formData?.status || "") + "").toLowerCase() === "cancelled" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "cancelled" ||
      ((props.formData?.status_cancel || "") + "").toLowerCase() === "cancelled" ||
      ((props.selectedData?.status_cancel || "") + "").toLowerCase() === "cancelled";

    if (isCancelled) {
      return true;
    }

    if (props.fsmState) {


      const saleFromReserve = props.type === "sale" && (props.formData?.from_reserve || props.selectedData?.from_reserve || props.formData?.isReserveEdit || props.selectedData?.isReserveEdit || props.memoInfo?.from_reserve || props.memoInfo?.isReserveEdit);
      const stateAllowsSave = props.fsmState === "dirty" || props.fsmState === "editing" || (props.fsmState === "initial" && props.type === "purchase" && props.memoInfo?.isPOEdit) || (props.type === "purchase" && props.memoInfo?.isPOEdit) || (props.fsmState === "initial" && saleFromReserve);


      if (props.type === "sale") {
        console.log("[FooterVendor] Sale Save Button Debug:", {
          fsmState: props.fsmState,
          stateAllowsSave,
          isSaveDisabled: props.isSaveDisabled,
          type: props.type,
          saleFromReserve,
          willBeDisabled: !stateAllowsSave || (props.isSaveDisabled !== undefined ? props.isSaveDisabled : false)
        });
      }

      if ((props.type === "quotation" || props.type === "reserve" || props.type === "memo_out" || props.type === "load") && props.hasUnsavedData) {
        const hasStoneData = props.hasUnsavedData();
        return !hasStoneData || !stateAllowsSave || (props.isSaveDisabled !== undefined ? props.isSaveDisabled : false);
      }

      if (props.type === "purchase" || props.type === "purchaseOrder" || props.type === "memo_in" || props.type === "memo_return" || props.type === "load" || props.type === "sale") {
        return !stateAllowsSave || (props.isSaveDisabled !== undefined ? props.isSaveDisabled : false);
      }
      return !stateAllowsSave || (props.isSaveDisabled !== undefined ? props.isSaveDisabled : false);
    }


    if (props.type === "purchase" && props.memoInfo?.isPOEdit) {
      return props.isSaveDisabled !== undefined ? props.isSaveDisabled : false;
    }
    return true;
  };

  const getAddDisabled = () => {

    if (props.type === "purchase" && props.memoInfo?.isPOEdit) {
      return true;
    }

    if (props.fsmState === "editing") {
      return true;
    }

    if (props.type === "reserve" && (props.formData?.from_reserve || props.selectedData?.from_reserve)) {
      return false;
    }

    if (props.type === "sale" && (props.formData?.from_reserve || props.selectedData?.from_reserve || props.formData?.isReserveEdit || props.selectedData?.isReserveEdit || props.memoInfo?.from_reserve || props.memoInfo?.isReserveEdit)) {
      return false;
    }

    const isApproved =
      props.isApproved ||
      ((props.formData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.formData?.status_approve || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status_approve || "") + "").toLowerCase() === "approved";

    if (isApproved) {
      return false;
    }

    if (props.fsmState) {
      return props.fsmState !== "saved";
    }
    return true;
  };

  const getEditDisabled = () => {

    if (props.type === "purchase" && props.memoInfo?.isPOEdit) {
      return true;
    }

    if (props.fsmState === "editing") {
      return true;
    }

    if (props.type === "reserve" && (props.formData?.from_reserve || props.selectedData?.from_reserve)) {
      return true;
    }

    const isApproved =
      props.isApproved ||
      ((props.formData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "approved" ||
      ((props.formData?.status_approve || "") + "").toLowerCase() === "approved" ||
      ((props.selectedData?.status_approve || "") + "").toLowerCase() === "approved";

    if (props.type === "load" && isApproved) {
      return true;
    }

    if (isApproved) {
      return true;
    }


    const isCancelled =
      ((props.formData?.status || "") + "").toLowerCase() === "cancelled" ||
      ((props.selectedData?.status || "") + "").toLowerCase() === "cancelled" ||
      ((props.formData?.status_cancel || "") + "").toLowerCase() === "cancelled" ||
      ((props.selectedData?.status_cancel || "") + "").toLowerCase() === "cancelled";

    if (isCancelled) {
      return true;
    }

    if (props.fsmState) {
      if (props.type === "load") {
        const hasValidData = props.formData || props.selectedData;
        return !hasValidData || props.fsmState !== "saved";
      }

      const hasValidData = props.formData || props.selectedData;

      return !hasValidData || props.fsmState !== "saved";
    }
    return true;
  };

  const handleExportToExcel = async () => {
    if (props.onExportExcel) {
      props.onExportExcel();
      return;
    }

    if (!props.account_type) return;

    try {
      const endpoint = props.account_type === "customer"
        ? "/account/customer/list"
        : "/account/vendor/list";

      const response = await axios.get(API_URL + endpoint);
      const data = response.data;

      const filteredData = data.map((item) => ({
        code: item.vendor_code_id || item.code || "",
        name: item.vendor_code_name || item.name || "",
        account_status: item.account_status || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Exporting the excel file
      const workSheetName = "export_" + props.account_type + ".xlsx";
      XLSX.writeFile(workbook, workSheetName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel. Please try again.");
    }
  };

  const handlePrint = async (e) => {

    e.preventDefault();
    const formData = props.formData || {};
    const selectedData = props.selectedData || {};
    const originalData = props.originalData || {};

    const id = formData._id || formData.id || selectedData._id || selectedData.id || originalData._id || originalData.id;

    if (props.type === "purchaseOrder") {
      if (!id) {
        alert("Please save the purchase order first to print.");
        return;
      }
      const invoiceNo = formData.invoice_no || selectedData.invoice_no || originalData.invoice_no || "purchase-order";
      await downloadPurchaseOrderPdf(id, invoiceNo);
      return;
    }

    if (props.type === "purchase") {
      if (!id) {
        alert("Please save the purchase first to print.");
        return;
      }
      const invoiceNo = formData.invoice_no || selectedData.invoice_no || originalData.invoice_no || "purchase";
      await downloadPurchasePdf(id, invoiceNo);
      return;
    }

    if (props.type === "quotation") {
      if (!id) {
        alert("Please save the quotation first to print.");
        return;
      }
      const invoiceNo = formData.invoice_no || selectedData.invoice_no || originalData.invoice_no || "quotation";
      await downloadQuotationPdf(id, invoiceNo);
    }

    if (props.type === "sale") {
      if (!id) {
        alert("Please save the sale first to print.");
        return;
      }
      const invoiceNo = formData.invoice_no || selectedData.invoice_no || originalData.invoice_no || "sale";
      await downloadSalePdf(id, invoiceNo);
    }
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
          paddingLeft: "32px",
          paddingRight: "32px",
          left:"222px"
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {props.onAddClick ? (
            <Button
              disabled={getAddDisabled()}
              onClick={!getAddDisabled() && props.onAddClick ? props.onAddClick : undefined}
              sx={{
                textTransform: "none",
                height: "45px",
                width: "84px",
                padding: "12px",
                borderRadius: "4px",
                gap: "8px",
                backgroundColor: getAddDisabled() ? "#E6E6E6" : "#05595B",
                "&:hover": {
                  backgroundColor: getAddDisabled() ? "#E6E6E6" : "#05595B",
                },
                "&:disabled": {
                  color: "#57646E",
                },
              }}
            >
              <Typography
                sx={{
                  color: getAddDisabled() ? "#57646E" : "var(--jw-background-white-textwhite, #FFF)",
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
          ) : null}

          <Button
            disabled={getEditDisabled()}
            onClick={!getEditDisabled() && props.onEditToggle ? props.onEditToggle : undefined}
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
                d="M7 17.0134L11.413 16.9984L21.045 7.45839C21.423 7.08039 21.631 6.57839 21.631 6.04439C21.631 5.51039 21.423 5.00839 21.045 4.63039L19.459 3.04439C18.703 2.28839 17.384 2.29239 16.634 3.04139L7 12.5834V17.0134ZM18.045 4.45839L19.634 6.04139L18.037 7.62339L16.451 6.03839L18.045 4.45839ZM9 13.4174L15.03 7.44439L16.616 9.03039L10.587 15.0014L9 15.0064V13.4174Z"
                fill={!getEditDisabled() && (props.formData || props.selectedData) ? "#05595B" : "#E6E6E6"}
              />
              <path
                d="M5 21H19C20.103 21 21 20.103 21 19V10.332L19 12.332V19H8.158C8.132 19 8.105 19.01 8.079 19.01C8.046 19.01 8.013 19.001 7.979 19H5V5H11.847L13.847 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21Z"
                fill={!getEditDisabled() && (props.formData || props.selectedData) ? "#05595B" : "#E6E6E6"}
              />
            </svg>
            <Typography
              sx={{
                color: !getEditDisabled() && (props.formData || props.selectedData) ? "#05595B" : "#E6E6E6",
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
        </Box>


        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
            disabled={getCancelDisabled()}
            onClick={() => {

              if ((props.type === "quotation" || props.type === "reserve" || props.type === "purchase" || props.type === "purchaseOrder" || props.type === "memo_in" || props.type === "memo_out" || props.type === "memo_return" || props.type === "memo_out_return" || props.type === "load" || props.type === "sale") && props.onCancelEdit) {
                props.onCancelEdit();
                return;
              }

              if (props.fsmState === "editing" || props.fsmState === "dirty") {
                setShowCancelConfirmDialog(true);
              } else if (props.fsmState) {
                if (props.onCancelView) {
                  props.onCancelView();
                }
              } else if (props.onCancelEdit) {
                props.onCancelEdit();
              }
            }}
            sx={{
              height: "45px",
              padding: "12px 24px",
              borderRadius: "4px",
              border: getCancelDisabled() ? "1px solid #BFBFBF" : "1px solid #05595B",
              backgroundColor: getCancelDisabled() ? "#F5F5F5" : "var(--jw-background-white-textwhite, #FFF)",
              "&:hover": {
                backgroundColor: getCancelDisabled() ? "#F5F5F5" : "#F5F8FF",
              },
              "&:disabled": {
                color: "#BFBFBF",
                backgroundColor: "#F5F5F5",
                borderColor: "#BFBFBF",
              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                color: getCancelDisabled() ? "#BFBFBF" : "#343434",
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
            className="save_vendor"
            disabled={getSaveDisabled()}
            onClick={handleSaveClick}
            sx={{
              height: "45px",
              padding: "12px 24px",
              borderRadius: "4px",
              backgroundColor: getSaveDisabled() ? "#BFBFBF" : "#05595B",
              "&:hover": {
                backgroundColor: getSaveDisabled() ? "#BFBFBF" : "#044A4C",
              },
              "&:disabled": {
                backgroundColor: "#BFBFBF !important",
                color: "#FFF !important",
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

          {/* Copy/Duplicate SVG Icon */}
          <Box role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (props.fsmState === "editing" || props.fsmState === "dirty") return;

              handlePrint(e);
            }}
            sx={{
              "&:hover svg path": {
                fill: (props.fsmState === "editing" || props.fsmState === "dirty")
                  ? "#BFBFBF"
                  : "#E9B238",
              },
              cursor: (props.fsmState === "editing" || props.fsmState === "dirty")
                ? "not-allowed"
                : "pointer",
              marginLeft: "8px",
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
                fill={(props.fsmState === "editing" || props.fsmState === "dirty") ? "#BFBFBF" : "#05595B"}
              />
            </svg>
          </Box>

          {/* Excel Export SVG Icon */}
          <Box


            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (props.fsmState === "editing" || props.fsmState === "dirty") return;

              handleExportToExcel();
            }}


            sx={{
              "&:hover svg path": {
                fill: (props.fsmState === "editing" || props.fsmState === "dirty")
                  ? "#BFBFBF"
                  : "#E9B238",
              },
              cursor: (props.fsmState === "editing" || props.fsmState === "dirty")
                ? "not-allowed"
                : "pointer",
              marginRight: "32px",
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
                fill={(props.fsmState === "editing" || props.fsmState === "dirty") ? "#BFBFBF" : "#05595B"}
              />
            </svg>
          </Box>
        </Box>

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
            onClick={() => handleConfirmClose(false)}
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
                onClick={handleCancel}
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
                onClick={() => handleConfirmClose(true)}
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


        <SuccessModal
          open={openSuccess}
          onClose={handleSuccessClose}
          message="Successfully!"
        />


        <ErrorModal
          open={openUnsuccess}
          onClose={handleSuccessClose}
          message="Unsuccessfully!"
        />


        <WarningDialog
          open={isOpenModalWarning}
          onClose={() => setIsOpenModalWarning(false)}
          message={warningText}
        />

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
      </Box>
    </>
  );
};

export default Footer;
