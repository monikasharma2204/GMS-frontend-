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
          width: { xs: "100%", x991: "calc(100% - 222px)" },
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderTop: "1px solid #BFBFBF",
          gap: "20px",
          "@media (max-width: 480px)": {
            gap: "4px",
          },
          position: "fixed",
          bottom: "0",
          left: { xs: 0, x991: "222px" },
          backgroundColor: "#FFF",
          zIndex: 5,
          paddingLeft: "32px",
          paddingRight: "32px",
          left: "222px"
        }}
      >

        <Box sx={{ display: "flex", gap: { xs: "8px", sm: "12px" }, borderRight: "1px solid #BFBFBF", }}>
          {props.onAddClick ? (
            <Button
              disabled={getAddDisabled()}
              onClick={!getAddDisabled() && props.onAddClick ? props.onAddClick : undefined}
              sx={{


                height: "32px",
                width: "96px",
                paddingLeft: "16px",
                paddingRight: "16px",
                borderRadius: "4px",
                "@media (min-width: 320px) and (max-width: 480px)": {
                  width: "40px",

                },
                color: "#FFFFFF",
                backgroundColor: getAddDisabled() ? "#E6E6E6" : "#086E71",
                "&:hover": {
                  backgroundColor: getAddDisabled() ? "#E6E6E6" : "#05595B",
                },
                "&:disabled": {
                  color: "#666666",
                  backgroundColor: "#E6E6E6",
                  border: "1px solid #E6E6E6",

                  "& .MuiTypography-root": {
                    color: "#666666",
                  },
                },
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",

                  fontFamily: "Calibri",
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    "@media (min-width: 320px) and (max-width: 480px)": {
                      fontSize: "10px",
                    },
                  },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Add
              </Typography>
            </Button>
          ) : null}

          <Box sx={{
            paddingRight: "20px",


            "@media (min-width: 320px) and (max-width: 480px)": {
              paddingRight: "4px",

            },
          }}>
            <Button
              disabled={getEditDisabled()}
              onClick={!getEditDisabled() && props.onEditToggle ? props.onEditToggle : undefined}
              sx={{
                textTransform: "none",
                height: "32px",
                width: "96px",
                padding: "12px",
                borderRadius: "4px",
                paddingLeft: "16px",
                paddingRight: "16px",
                gap: "8px",
                backgroundColor: "#fff",
                border: "1px solid #EDEDED",
                color: "#343434",
                "& .MuiTypography-root": {
                  color: "#343434",
                },
                "& svg path": {
                  stroke: "#343434",
                },
                "&:hover": {
                  backgroundColor: "#fff",
                },
                "&:disabled": {
                  color: "#666666",
                  backgroundColor: "#E6E6E6",

                  "& .MuiTypography-root": {
                    color: "#666666",
                  },
                  "& svg path": {
                    stroke: "#666666",
                  },
                },
                "@media (min-width: 320px) and (max-width: 480px)": {
                  width: "40px",

                  gap: "2px",
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H15.8333C16.2754 17.5 16.6993 17.3244 17.0118 17.0118C17.3244 16.6993 17.5 16.2754 17.5 15.8333V10"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.3132 2.18744C15.6447 1.85592 16.0944 1.66968 16.5632 1.66968C17.0321 1.66968 17.4817 1.85592 17.8132 2.18744C18.1448 2.51897 18.331 2.9686 18.331 3.43744C18.331 3.90629 18.1448 4.35592 17.8132 4.68744L10.3024 12.1991C10.1045 12.3968 9.86007 12.5415 9.59156 12.6199L7.1974 13.3199C7.12569 13.3409 7.04968 13.3421 6.97732 13.3236C6.90496 13.305 6.83892 13.2674 6.7861 13.2146C6.73328 13.1618 6.69564 13.0957 6.6771 13.0234C6.65856 12.951 6.65981 12.875 6.68073 12.8033L7.38073 10.4091C7.4595 10.1408 7.60451 9.89666 7.8024 9.69911L15.3132 2.18744Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Typography
                sx={{
                  color: "inherit",
                  fontFamily: "Calibri",
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    "@media (min-width: 320px) and (max-width: 480px)": {
                      fontSize: "10px",
                    },
                  },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Edit
              </Typography>
            </Button>

          </Box>


        </Box>


        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderRight: "1px solid #BFBFBF",
          paddingRight: "20px",
          "@media (min-width: 320px) and (max-width: 480px)": {
            gap: "4px",
            paddingRight: "4px",
          },
        }}>
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
              height: "32px",
              width: "96px",
              paddingLeft: "16px",
              paddingRight: "16px",
              borderRadius: "4px",
              border: getCancelDisabled() ? "1px solid #BFBFBF" : "1px solid #B41E38",
              backgroundColor: getCancelDisabled() ? "#F5F5F5" : "var(--jw-background-white-textwhite, #FFF)",
              "& .MuiTypography-root": {
                color: "#B41E38",
              },
              "&:hover": {
                backgroundColor: "#FFF",
              },
              "&:disabled": {
                color: "#666666",
                backgroundColor: "#E6E6E6",
                border: "1px solid #E6E6E6",
                "& .MuiTypography-root": {
                  color: "#666666",
                },
              },
              "@media (min-width: 320px) and (max-width: 480px)": {
                width: "40px",

              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                // color: getCancelDisabled() ? "#BFBFBF" : "#343434",
                textTransform: "none",
                color: "inherit",
                fontFamily: "Calibri",
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  "@media (min-width: 320px) and (max-width: 480px)": {
                    fontSize: "10px",
                  },
                },
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
              height: "32px",
              width: "96px",
              paddingLeft: "16px",
              paddingRight: "16px",
              borderRadius: "4px",
              "@media (min-width: 320px) and (max-width: 480px)": {
                width: "40px",

              },
              color: "#FFFFFF",
              backgroundColor: getSaveDisabled() ? "gray" : "#086E71",
              "&:hover": {
                backgroundColor: getSaveDisabled() ? "gray" : "#05595B",
              },
              "&:disabled": {
                color: "#666666",
                backgroundColor: "#E6E6E6",
                border: "1px solid #E6E6E6",

                "& .MuiTypography-root": {
                  color: "#666666",
                },
              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",

                fontFamily: "Calibri",
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  "@media (min-width: 320px) and (max-width: 480px)": {
                    fontSize: "10px",
                  },
                },
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Save
            </Typography>
          </Button>


          <Box sx={{
            display: "flex", alignItems: "center", gap: {
              sm: "12px",
              xs: "0px",
            }
          }}>
            <Box
              sx={{
                "&:hover svg path": {
                  fill: "#E9B238",
                },
                cursor: "pointer",

              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.75 7.75H15.25C14.9848 7.75 14.7304 7.64464 14.5429 7.45711C14.3554 7.26957 14.25 7.01522 14.25 6.75V2.25M19.75 7.75V20.75C19.75 21.0152 19.6446 21.2696 19.4571 21.4571C19.2696 21.6446 19.0152 21.75 18.75 21.75H5.25C4.98478 21.75 4.73043 21.6446 4.54289 21.4571C4.35536 21.2696 4.25 21.0152 4.25 20.75V3.25C4.25 2.98478 4.35536 2.73043 4.54289 2.54289C4.73043 2.35536 4.98478 2.25 5.25 2.25H14.25M19.75 7.75L14.25 2.25" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.2152 12.2675H14.9692V16.75M14.9692 14.5085H16.4347M6.78468 16.7415V12.2585H8.29318C8.6922 12.2584 9.07493 12.4167 9.35717 12.6988C9.63941 12.9809 9.79805 13.3635 9.79818 13.7625C9.79831 14.1615 9.63993 14.5442 9.35787 14.8265C9.07582 15.1087 8.6932 15.2674 8.29418 15.2675H6.78418M10.8767 16.75V12.25H11.6397C12.2364 12.25 12.8087 12.4871 13.2307 12.909C13.6526 13.331 13.8897 13.9033 13.8897 14.5C13.8897 15.0967 13.6526 15.669 13.2307 16.091C12.8087 16.5129 12.2364 16.75 11.6397 16.75H10.8767Z" stroke="#666666" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

            </Box>

            <Box
              onClick={handleExportToExcel}
              sx={{
                cursor: "pointer",
                "&:hover svg path": {
                  fill: "#00AA3A",
                },


              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.5858 3.30392H13.9882V1.51367L1.5 3.44117V20.3364L13.9882 22.4874V19.8339H21.5858C21.8158 19.8456 22.0412 19.7656 22.2125 19.6116C22.3839 19.4576 22.4872 19.242 22.5 19.0119V4.12517C22.487 3.89527 22.3836 3.67985 22.2123 3.52597C22.041 3.37209 21.8157 3.29226 21.5858 3.30392ZM21.7057 19.1484H13.9628L13.95 17.7317H15.8153V16.0817H13.9357L13.9268 15.1067H15.8153V13.4567H13.9125L13.9035 12.4817H15.8153V10.8317H13.8975V9.85667H15.8153V8.20667H13.8975V7.23167H15.8153V5.58167H13.8975V4.08167H21.7057V19.1484Z" fill="#666666" />
                <path d="M20.1075 5.5791H16.8652V7.2291H20.1075V5.5791Z" fill="#666666" />
                <path d="M20.1075 8.20508H16.8652V9.85508H20.1075V8.20508Z" fill="#666666" />
                <path d="M20.1075 10.8311H16.8652V12.4811H20.1075V10.8311Z" fill="#666666" />
                <path d="M20.1075 13.4561H16.8652V15.1061H20.1075V13.4561Z" fill="#666666" />
                <path d="M20.1075 16.082H16.8652V17.732H20.1075V16.082Z" fill="#666666" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.76007 8.00433L6.36957 7.91208L7.38132 10.6938L8.57682 7.79733L10.1863 7.70508L8.23182 11.6546L10.1863 15.6138L8.48457 15.4991L7.33557 12.4811L6.18582 15.3843L4.62207 15.2463L6.43857 11.7491L4.76007 8.00433Z" fill="white" />
              </svg>

            </Box>
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
