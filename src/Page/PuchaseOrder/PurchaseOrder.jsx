import React, { useReducer, useState, useEffect, useMemo, useCallback } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/Footer";

import PurchaseOrderBody from "component/PurchaseOrder/PurchaseOrderBody";
import PurchaseOrderHeader from "../../component/PurchaseOrder/PurchaseOrderHeader";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  QuotationSelectedInvoiceAddressState,
} from "recoil/PurchaseOrder/PurchaseOrderState";
import { grandTotalState, memoInfoState, editMemoState, isApprovedState } from "recoil/PurchaseOrder/MemoState";
import { currencyState } from "recoil/state/CommonState";
import { getVendorInfo } from "recoil/selector/VendorSelector";
import { useRecoilValueLoadable } from "recoil";
import { getCompanyCurrencyId } from "../../helpers/currencyCache.js";
import {
  initialData,
  initialData2,
  initialState,
  newAddTemplate,
} from "../../component/PurchaseOrder/Data.jsx";

import apiRequest from "../../helpers/apiHelper.js";
import { QuotationtableRowsState } from "recoil/PurchaseOrder/PurchaseOrderState";
import { useRecoilState, useResetRecoilState } from "recoil";
import useTransactionNavigationGuard from "../../hooks/useTransactionNavigationGuard";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { purchaseOrderFSMState, purchaseOrderOriginalDataState, purchaseOrderFormDataState } from "recoil/state/PurchaseOrderFSMState";
import FooterVendor from "../../component/Layout/FooterVendor";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import { exportTransactionToExcel } from "../../helpers/excelHelper";

const formatNumber = (value) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const unformatNumber = (value) => {
  return value.replace(/,/g, "");
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_ITEM": {
      const exists = state.selectedItems.some(
        (item) => item.account === action.payload.account
      );
      return {
        ...state,
        selectedItems: exists
          ? state.selectedItems.filter(
            (item) => item.account !== action.payload.account
          )
          : [...state.selectedItems, action.payload],
      };
    }

    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload };
    case "OPEN_MODAL_PO":
      return { ...state, openModalPO: true };
    case "CLOSE_MODAL_PO":
      return { ...state, openModalPO: false };
    case "OPEN_MODAL_Memo":
      return { ...state, openModalMemo: true };
    case "CLOSE_MODAL_Memo":
      return { ...state, openModalMemo: false };
    case "ADD_ROW": {
      let newItemIndex = 1;
      let newName = `New Item ${newItemIndex}`;

      while (state.selectedItems.some((item) => item.account === newName)) {
        newItemIndex++;
        newName = `New Item ${newItemIndex}`;
      }

      const newSelectBox = {
        ...newAddTemplate,
        account: newName,
        type: "select",
      };
      return {
        ...state,
        selectedItems: [...state.selectedItems, newSelectBox],
      };
    }
    case "DELETE_ITEM":
      return {
        ...state,
        selectedItems: state.selectedItems.filter(
          (item) => item.account !== action.payload
        ),
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        selectedItems: state.selectedItems.map((item, idx) =>
          idx === action.payload.index
            ? { ...item, [action.payload.field]: action.payload.value }
            : item
        ),
      };
    case "TOGGLE_DISCOUNT_PERCENT":
      return {
        ...state,
        useDiscountPercent: action.payload,
        discount_percent: action.payload ? state.discount_percent : 0,
        useDiscountAmount: false,
        discount_amount: 0,
      };
    case "TOGGLE_DISCOUNT_AMOUNT":
      return {
        ...state,
        useDiscountAmount: action.payload,
        discount_amount: action.payload ? state.discount_amount : 0,
        useDiscountPercent: false,
        discount_percent: 0,
      };
    case "SET_DISCOUNT_PERCENT":
      return {
        ...state,
        discount_percent: action.payload,
      };
    case "SET_DISCOUNT_AMOUNT":
      return {
        ...state,
        discount_amount: action.payload,
      };
    case "TOGGLE_VAT":
      return {
        ...state,
        useVAT: action.payload,
        vatAmount: action.payload ? state.vatAmount : 0,
      };
    case "SET_VAT_AMOUNT":
      return {
        ...state,
        vatAmount: action.payload,
      };
    case "SET_OTHER_CHARGE":
      return {
        ...state,
        otherCharge: action.payload,
      };
    case "TOGGLE_ALL_ITEMS_PO":
      return {
        ...state,
        selectedItems: action.payload ? initialData : [],
      };
    case "TOGGLE_ALL_ITEMS_MEMO":
      return {
        ...state,
        selectedItems: action.payload ? initialData2 : [],
      };
    case "RESET_STATE":
      return {
        ...initialState,
        selectedItems: [],
      };
    default:
      return state;
  }
}

const PurchaseOrder = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);

  const [open, setOpen] = useState(false);
  const [accountNew] = useRecoilState(useQuotationAccountState);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );
  const [shippingAddress, setShippingAddress] = useRecoilState(
    QuotationShippingAddressState
  );
  const vendorData = useRecoilValueLoadable(getVendorInfo);
  const [isApproved] = useRecoilState(isApprovedState);
  const [grandTotal, setGrandTotal] = useRecoilState(grandTotalState);
  const [editMemoStatus, setEditMemoStatus] = useRecoilState(editMemoState);
  const [isDayBookDataLoaded, setIsDayBookDataLoaded] = useState(false);

  // FSM States
  const [fsmState, setFsmState] = useRecoilState(purchaseOrderFSMState);
  const [originalData, setOriginalData] = useRecoilState(purchaseOrderOriginalDataState);
  const [formData, setFormData] = useRecoilState(purchaseOrderFormDataState);
  const [showUnsavedDataDialog, setShowUnsavedDataDialog] = useState(false);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const location = useLocation();

  // Function inside Header

  // Start_Dispatch_FUNCTION

  const handleOpenModalPO = () => dispatch({ type: "OPEN_MODAL_PO" });
  const handleCloseModalPO = () => dispatch({ type: "CLOSE_MODAL_PO" });
  const handleOpenModalMemo = () => dispatch({ type: "OPEN_MODAL_Memo" });
  const handleCloseModalMemo = () => dispatch({ type: "CLOSE_MODAL_Memo" });

  const handleSaveModalPO = (selectedItems) => {
    dispatch({ type: "SET_SELECTED_ITEMS", payload: selectedItems });
  };

  const handleSaveModalMemo = (selectedItems) => {
    if (selectedItems && selectedItems.length > 0) {
      const selectedPO = selectedItems[0];
      restoreFromOriginalData(selectedPO);


      const items = selectedPO.items || [];

      dispatch({ type: "SET_SELECTED_ITEMS", payload: items });
    }
  };

  // FSM Handlers
  const triggerFSMDirty = () => {
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleEditToggle = () => {
    if (fsmState === "saved") {
      setFsmState("editing");
      setEditMemoStatus(true);
    }
  };

  const handleCancelEdit = () => {
    if (fsmState === "editing") {

      setShowCancelConfirmDialog(true);
    } else if (fsmState === "dirty") {

      const hasData = rows.length > 0;

      if (hasData) {

        setShowCancelConfirmDialog(true);
      } else {

        setFsmState("initial");
        setEditMemoStatus(false);
        setIsDayBookDataLoaded(false);
      }
    }
  };

  const restoreFromOriginalData = (data) => {
    if (!data) return;


    if (data.doc_date) setDocDate(data.doc_date);
    if (data.due_date) setDueDate(data.due_date);


    setRef1(data.ref_1 || "");
    setRef2(data.ref_2 || "");
    setRemark(data.remark || "");
    setNote(data.note || "");


    setTimeout(() => {
      if (
        data.exchange_rate === 0 ||
        data.exchange_rate === "0" ||
        data.exchange_rate === "" ||
        data.exchange_rate === null
      ) {
        setExchangeRate("");
      } else {
        setExchangeRate(data.exchange_rate);
      }
    }, 100);


    if (data.currency) {
      let accountObj = { label: data.account, code: data.vendor_code_id };
      if (vendorData.state === "hasValue" && Array.isArray(vendorData.contents)) {
        const found = vendorData.contents.find(acc => acc.code === data.vendor_code_id);
        if (found) accountObj = found;
      }

      setMemoInfo(prev => ({
        ...prev,
        currency: data.currency._id,
        currencyCode: data.currency.code,
        account: accountObj,
        invoice_no: data.invoice_no,
        id: data._id,
        status: data.status,
        isDayBookEdit: data.isDayBookEdit,
      }));
    }

    // Restore rows
    if (data.items && Array.isArray(data.items)) {
      const formattedItems = data.items.map((el) => ({
        ...el,
        total_amount: Number(el.total_amount || 0).toFixed(2),
        weight_per_piece: Number(el.weight_per_piece || 0).toFixed(2),
        weight: Number(el.weight || 0).toFixed(3),
        price: Number(el.price || 0).toFixed(2),
        discount_percent: Number(el.discount_percent || 0).toFixed(2),
        discount_amount: Number(el.discount_amount || 0).toFixed(2),
        labour_price: parseFloat(Number(el.labour_price || 0).toFixed(2)),
        amount: Number(el.amount || 0).toFixed(2),
        isFromMemoPending: el.isFromMemoPending !== undefined ? el.isFromMemoPending : (el.stock_id ? true : false),
        type: (el.isFromMemoPending || el.stock_id) ? "Cons." : (el.type || el.stone_type || ""),
      }));
      setRows(formattedItems);
    }


    if (data.summary) {
      if (data.summary.discount > 0) {
        dispatch({ type: "TOGGLE_DISCOUNT_PERCENT", payload: true });
      }
      if (data.summary.discount_amount > 0) {
        dispatch({ type: "TOGGLE_DISCOUNT_AMOUNT", payload: true });
      }
      dispatch({ type: "SET_DISCOUNT_AMOUNT", payload: data.summary.discount_amount || 0 });
      dispatch({ type: "SET_OTHER_CHARGE", payload: data.summary.other_charge || 0 });
      if (data.summary.vat_amount > 0 || data.summary.vat > 0) {
        dispatch({ type: "SET_VAT_AMOUNT", payload: data.summary.vat || 0 });
        dispatch({ type: "TOGGLE_VAT", payload: true });
      }
      const subtotal = data.summary.sub_total || 0;
      const discountAmount = data.summary.discount || 0;
      const percentage = subtotal > 0 ? Math.floor(parseFloat((discountAmount / subtotal) * 100)) : 0;
      dispatch({ type: "SET_DISCOUNT_PERCENT", payload: percentage });
    }


    if (data.invoice_address) {
      setInvoiceAddress([{ label: data.invoice_address }]);
      setSelectedInvoiceAddress({ label: data.invoice_address, code: "" });
    }
    if (data.shipping_address) {
      setShippingAddress([{ label: data.shipping_address }]);
    }
  };

  const handleCancelConfirm = (confirmed) => {
    setShowCancelConfirmDialog(false);

    if (confirmed) {
      if (fsmState === "editing") {

        if (originalData) {
          restoreFromOriginalData(originalData);
          setFormData(originalData);
          setFsmState("saved");
          setEditMemoStatus(false);
        }
      } else if (fsmState === "dirty") {

        dispatch({ type: "RESET_STATE" });
        window.location.reload();
      }
    }

  };

  const handleSaveSuccess = (savedData = null) => {
    setFsmState("saved");
    setEditMemoStatus(false);


    const recordId = savedData?._id || memoInfo?.id;
    const invoiceNo = savedData?.invoice_no || memoInfo?.invoice_no;
    const status = savedData?.status || memoInfo.status || "pending";


    if (recordId) {
      setMemoInfo(prev => ({
        ...prev,
        id: recordId,
        invoice_no: invoiceNo,
        status: status,
      }));
    }


    if (recordId || rows.length > 0) {
      const completeData = {
        _id: recordId,
        invoice_no: invoiceNo,
        account: memoInfo.account?.label || "",
        vendor_code_id: memoInfo.account?.code || "",
        invoice_address: selectedInvoiceAddress?.label || invoiceAddress?.[0]?.label || "",
        shipping_address: shippingAddress?.[0]?.label || "",
        currency: {
          _id: memoInfo.currency,
          code: memoInfo.currencyCode,
        },
        doc_date: docDate,
        due_date: dueDate,
        exchange_rate: exchangeRate,
        ref_1: ref1,
        ref_2: ref2,
        remark: remark,
        note: note,
        items: rows,
        summary: {
          sub_total: calculateSubTotalAfterItemDiscounts(),
          discount: calculateTotalAfterDiscountPercent(),
          discount_amount: state.discount_amount,
          total_after_discount: calculateTotalAfterDiscount(),
          vat: state.vatAmount,
          vat_amount: calculateTotalAfterVAT(),
          other_charge: state.otherCharge,
          grand_total: calculateGrandTotal(),
        },
        status: savedData?.status || memoInfo.status,
        isDayBookEdit: memoInfo.isDayBookEdit || false,
      };
      setOriginalData(completeData);
      setFormData(completeData);
    }
  };

  const handleAddClick = () => {
    setFsmState("initial");
    setEditMemoStatus(false);
    setIsDayBookDataLoaded(false);

    setRef1("");
    setRef2("");
    setNote("");
    setRemark("");
    setDocDate(new Date());
    setDueDate(new Date());
    setExchangeRate("");

    dispatch({ type: "RESET_STATE" });

    resetPurchaseOrderState();

    setFormData(null);
    setOriginalData(null);
  };

  // Function inside Body

  const handleUpdate = (index, field, newValue) => {
    triggerFSMDirty();
    setRows((prevRows) => {
      const updatedRows = [...prevRows]; // Clone array
      updatedRows[index] = { ...updatedRows[index], [field]: newValue }; // Update only the target row
      return updatedRows;
    });
  };

  const handleDelete = (id) => {
    triggerFSMDirty();
    // dispatch({ type: "DELETE_ITEM", payload: itemName });
    setRows((prevRows) => prevRows.filter((row) => row._id !== id));
  };

  const handleAddRow = () => {
    triggerFSMDirty();
    // dispatch({ type: "ADD_ROW" });

    const formData = {
      stone_code: "",
      stone: "",
      shape: "",
      size: "",
      color: "",
      cutting: "",
      quality: "",
      clarity: "",
      cerType: "",
      certificateNumber: "",
      pcs: "",
      weight: "0.000",
      price: "0.00",
      unit: "cts",
      amount: "0.00",
      discount_percent: "0.00",
      discount_amount: "0.00",
      totalAmount: "0.00",
      "Ref No.": "",
      type: "",
      labour: "",
      labour_price: "0.00",
      weight_per_piece: "0.00",
      description: "",
      // Explicitly set flags to ensure manually added rows are editable
      isFromMemoPending: false,
      stock_id: undefined,
    };

    setRows((prevRows) => {
      const newItemIndex = prevRows.length + 1; // Incremental index
      let newName = `New Item ${newItemIndex}`; // Generate name
      let _id = "id" + newItemIndex;
      return [...prevRows, { account: newName, ...formData, _id: _id }];
    });
  };

  const handleSelectChange = (index, value) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { index, field: "unit_price", value },
    });

    handleUpdate(index, "unit_price", value);
  };

  const handleNumberChange = (index, field, value) => {
    const parsedValue = parseFloat(value);
    const newValue = isNaN(parsedValue) || value === "" ? 0 : parsedValue;
    // dispatch({
    //   type: "UPDATE_ITEM",
    //   payload: { index, field, value: newValue },
    // });

    handleUpdate(index, field, newValue);
  };
  const handleDiscountPercentToggle = () => {
    dispatch({
      type: "TOGGLE_DISCOUNT_PERCENT",
      payload: !state.useDiscountPercent,
    });
  };

  const handleDiscountAmountToggle = () => {
    dispatch({
      type: "TOGGLE_DISCOUNT_AMOUNT",
      payload: !state.useDiscountAmount,
    });
  };

  const handleDiscountPercentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;

    if (value >= 0 && value <= 100) {
      dispatch({ type: "SET_DISCOUNT_PERCENT", payload: value });
    }
  };

  const handleDiscountAmountChange = (e) => {
    const rawValue = e.target.value;
    const unformattedValue = rawValue.replace(/,/g, "");
    const value = parseFloat(unformattedValue) || 0;
    const formattedValue = new Intl.NumberFormat().format(value);
    dispatch({ type: "SET_DISCOUNT_AMOUNT", payload: value });
  };

  const handleVATToggle = () => {
    dispatch({ type: "TOGGLE_VAT", payload: !state.useVAT });
  };

  const handleVATChange = (e) => {
    const value = parseFloat(e.target.value) || 0;

    if (value >= 0 && value <= 100) {
      dispatch({ type: "SET_VAT_AMOUNT", payload: value });
    }
  };

  const handleOtherChargeChange = (e) => {
    const rawValue = e.target.value;
    const unformattedValue = rawValue.replace(/,/g, "");
    const value = parseFloat(unformattedValue) || 0;
    const formattedValue = new Intl.NumberFormat().format(value);
    dispatch({ type: "SET_OTHER_CHARGE", payload: value });
  };

  // End_Dispatch

  const isNumeric = (str) => {
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  };
  const formatNumberWithCommas = (number) => {
    const numberString = number.toString();
    const [integerPart, decimalPart] = numberString.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    if (decimalPart !== undefined) {
      return `${formattedIntegerPart}.${decimalPart}`;
    }

    return formattedIntegerPart;
  };

  const calculateAmount = (item = {}) => {
    const totalAmount =
      item.unit === "pcs"
        ? (isNumeric(item.pcs) ? item.pcs : 0) *
        (isNumeric(item.price) ? item.price : 0)
        : (isNumeric(item.weight) ? item.weight : 0) *
        (isNumeric(item.price) ? item.price : 0);
    return totalAmount;
  };



  const calculateTotalAfterDiscount = () => {
    let total = rows.reduce((sum, item) => {
      return sum + calculateAmountAfterDiscount(item);
    }, 0);

    if (state.useDiscountPercent) {
      total -= (total * state.discount_percent) / 100 ? (total * state.discount_percent) / 100 : 0.00;
    }
    if (state.useDiscountAmount) {
      total -= state.discount_amount ? state.discount_amount : 0.00;
    }

    return Number(total).toFixed(2);
  };
  // FROM HERE
  const calculateAmountAfterDiscount = (item) => {
    // Calculate base amount
    const baseAmount = calculateAmount(item || {});

    // Calculate discount based on percentage or amount
    let discountAmount = 0;
    if (item.discount_percent) {
      discountAmount = (baseAmount * item.discount_percent) / 100;
    } else {
      discountAmount = item.discount_amount || 0;
    }

    // Calculate amount after discount
    const afterDiscount = baseAmount - discountAmount;
    return afterDiscount;
  };

  const calculateTotalAmountAfterDiscount = () => {
    const subtotal = rows.reduce((sum, item) => {
      return sum + calculateAmountAfterDiscount(item);
    }, 0);

    let finalTotal = subtotal;

    if (state.useDiscountPercent) {
      finalTotal -= (finalTotal * state.discount_percent) / 100;
    }

    if (state.useDiscountAmount) {
      finalTotal -= state.discount_amount;
    }

    return Number(finalTotal).toFixed(2);
  };

  const calculateSubTotalAfterItemDiscounts = () => {
    // Sum of all item amounts after their individual discounts
    const subtotal = rows.reduce((sum, item) => {
      return sum + calculateAmountAfterDiscount(item);
    }, 0);

    return Number(subtotal).toFixed(2);
  };

  const calculateGrandTotal = () => {
    // Get total after all discounts
    const totalAfterDiscount = parseFloat(calculateTotalAmountAfterDiscount());

    // Calculate VAT on the discounted amount
    const totalAfterVAT = state.useVAT
      ? (totalAfterDiscount * state.vatAmount) / 100
      : 0;

    // Add other charges
    const otherCharge = parseFloat(state.otherCharge) || 0;

    // Final grand total
    const grandTotal = totalAfterDiscount + totalAfterVAT + otherCharge ? totalAfterDiscount + totalAfterVAT + otherCharge : 0.00;

    return Number(grandTotal).toFixed(2);
  };
  // TO HERE

  const calculateTotalAfterVAT = () => {
    if (state.useVAT) {
      return (calculateTotalAfterDiscount() * state.vatAmount) / 100;
    }
    return 0;
  };

  const calculateOtherPrice = (item) => {
    if (item.unit === "cts") {
      return Number((calculateAmount(item) / item.pcs).toFixed(2));
    } else if (item.unit === "pcs") {
      return Number((calculateAmount(item) / item.weight).toFixed(2));
    }
  };

  const handleDiscountPercenChangeInTalble = (index, value) => {
    const newValue = parseFloat(value) || 0;
    const calculatedDiscountAmount =
      (calculateAmount(rows[index]) * newValue) / 100;

    handleUpdate(index, "discount_percent", newValue);

    handleUpdate(
      index,
      "discount_amount",
      Number(calculatedDiscountAmount).toFixed(2)
    );

  };

  const handleDiscountAmountChangeInTable = (index, value) => {
    const newValue = parseFloat(value) || 0;
    const calculatedDiscountPercent =
      (newValue / calculateAmount(rows[index])) * 100;
    // dispatch({
    //   type: "UPDATE_ITEM",
    //   payload: { index, field: "discount_amount", value: newValue },
    // });
    handleUpdate(index, "discount_amount", newValue);

    handleUpdate(
      index,
      "discount_percent",
      Number(calculatedDiscountPercent).toFixed(2)
    );
    // dispatch({
    //   type: "UPDATE_ITEM",
    //   payload: {
    //     index,
    //     field: "discount_percent",
    //     value: calculatedDiscountPercent.toFixed(2),
    //   },
    // });
  };
  // THIS ONE ALSO

  const calculateTotalAfterDiscountPercent = () => {
    if (state.useDiscountPercent) {
      return (
        (calculateSubTotalAfterItemDiscounts() * state.discount_percent) / 100 ? (calculateSubTotalAfterItemDiscounts() * state.discount_percent) / 100 : 0.00
      );
    }

    return 0;
  };

  const [docDate, setDocDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [exchangeRate, setExchangeRateRaw] = useState("");

  // Wrapper setter to keep UI empty for 0, "", null but keep raw value
  const setExchangeRate = (value) => {
    if (value === 0 || value === "0" || value === "" || value === null) {
      setExchangeRateRaw("");
    } else {
      setExchangeRateRaw(value);
    }
  };


  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [lot, setLot] = useState("");
  const [stone, setStone] = useState("");
  const [note, setNote] = useState("");
  const [remark, setRemark] = useState("");
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [companyCurrency, setCompanyCurrency] = useState(null);

  // Reset functions for Recoil states
  const resetInvoiceAddressState = useResetRecoilState(QuotationInvoiceAddressState);
  const resetSelectedInvoiceAddressState = useResetRecoilState(QuotationSelectedInvoiceAddressState);
  const resetShippingAddressState = useResetRecoilState(QuotationShippingAddressState);
  const resetRowsState = useResetRecoilState(QuotationtableRowsState);
  const resetGrandTotalState = useResetRecoilState(grandTotalState);
  const resetMemoInfoState = useResetRecoilState(memoInfoState);

  // Reset all PurchaseOrder state
  const resetPurchaseOrderState = useCallback(() => {
    resetInvoiceAddressState();
    resetSelectedInvoiceAddressState();
    resetShippingAddressState();
    resetRowsState();
    resetGrandTotalState();
    resetMemoInfoState();
    // Reset local state
    setRef1("");
    setRef2("");
    setNote("");
    setRemark("");
  }, [
    resetInvoiceAddressState,
    resetSelectedInvoiceAddressState,
    resetShippingAddressState,
    resetRowsState,
    resetGrandTotalState,
    resetMemoInfoState,
  ]);

  // Determine if page has unsaved data
  // Only check for item rows, not header fields (account, ref1, ref2, exchange rate, etc.)
  const hasUnsavedData = useMemo(() => {
    // Check if daybook data is loaded
    if (memoInfo?.isDayBookEdit) {
      return true;
    }
    // Only check if there are rows with actual data (not just empty rows)
    if (rows && rows.length > 0) {
      // Check if any row has meaningful data
      const hasRowData = rows.some(row =>
        row?.stone || row?.stone_code || row?.pcs > 0 || row?.weight > 0 || row?.price > 0
      );
      if (hasRowData) {
        return true;
      }
    }
    // Header fields (account, ref1, ref2, exchange rate, invoice address, shipping address, note, remark) 
    // are not considered as unsaved data - only item rows trigger the warning
    return false;
  }, [memoInfo, rows]);


  const shouldShowUnsavedDialog = useMemo(() => {
    if (fsmState === "saved") {
      return false;
    }
    return hasUnsavedData;
  }, [fsmState, hasUnsavedData]);

  useTransactionNavigationGuard(shouldShowUnsavedDialog, resetPurchaseOrderState);

  const handleChange = (index, field, value) => {
    // dispatch({
    //   type: "UPDATE_ITEM",
    //   payload: { index, field, value },
    // })

    handleUpdate(index, field, value);
  };

  const handleCurrencyChange = (currency) => { };

  const handlePost = () => {
    setIsOpenModalConfrim(true);
  };

  const [warningText, setWarningText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const id = await getCompanyCurrencyId(apiRequest);
        setCompanyCurrency(id);
      } catch { }
    })();
  }, []);


  useEffect(() => {
    const isOnPurchaseOrderPage = location.pathname === "/purchase-order/purchase-order";
    const hasNoRows = !rows || rows.length === 0;
    const isNotDayBookEdit = !memoInfo?.isDayBookEdit;
    const isInSavedState = fsmState === "saved";

    if (isOnPurchaseOrderPage && hasNoRows && isNotDayBookEdit && isInSavedState) {
      setFsmState("initial");
      setEditMemoStatus(false);
      setIsDayBookDataLoaded(false);

      setFormData(null);
      setOriginalData(null);
      setMemoInfo(prev => ({
        ...prev,
        id: undefined,
        invoice_no: "",
        isPOEdit: false,
        account: null,
        currency: "",
        currencyCode: "",
      }));
    }
  }, [location.pathname, fsmState, rows, memoInfo?.isDayBookEdit]);

  const onHandleSave = async () => {
    const invalidList = [];

    if (memoInfo?.currency !== companyCurrency && !isNumeric(exchangeRate)) {

      invalidList.push({
        row: "Header",
        list: ["Exchange Rate"],
      });
    }

    // --------- Header Field Validations ---------
    if (!memoInfo?.currency) {
      invalidList.push({
        row: "Header",
        list: ["Currency"],
      });
    }


    if (!memoInfo?.account?.label || !memoInfo?.account?.code) {
      invalidList.push({
        row: "Header",
        list: ["Account"],
      });
    }



    // --------- Table Row Validations ---------
    rows.forEach((el, index) => {
      const rowErrors = [];

      if (!el.stone) {
        rowErrors.push("Stone");
      }
      if (!isNumeric(el.pcs)) {
        rowErrors.push("Pcs");
      }

      if (!isNumeric(el.weight) || parseFloat(el.weight) <= 0) {
        rowErrors.push("Weight");
      }

      if (!isNumeric(el.price) || parseFloat(el.price) <= 0) {
        rowErrors.push("Price");
      }


      const totalAmount = calculateAmountAfterDiscount(el);  // Assuming this function returns total_amount
      //  if (!isNumeric(totalAmount) || totalAmount <= 0) {
      //    rowErrors.push("Total Amount");
      //  }

      if (rowErrors.length > 0) {
        invalidList.push({
          row: `Table Row ${index + 1}`,
          list: rowErrors,
        });
      }
    });


    // --------- Summary Validation ---------

    const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount());



    // --------- Final Invalid Check ---------
    if (invalidList.length > 0) {


      const headerErrors = invalidList
        .filter(el => el.row === "Header")
        .flatMap(el => el.list);

      const rowErrors = invalidList.filter(el => el.row !== "Header");

      let warningText = "";

      if (headerErrors.length > 0) {
        warningText += `${headerErrors.join(", ")}`;
      }

      if (rowErrors.length > 0) {
        const rowText = rowErrors
          .map(el => `${el.row}: ${el.list.join(", ")}`)
          .join(" | ");

        warningText += warningText ? " | " + rowText : rowText;
      }

      setWarningText(`Please fill all required fields: ${warningText}`);
      setIsOpenModalConfrim(false);
      setIsOpenModalWarning(true);
      return;
    }

    // --------- Body Preparation ---------
    const sub_total = calculateSubTotalAfterItemDiscounts();
    const grand_total = calculateGrandTotal();
    const totalAfterVAT = parseFloat(calculateTotalAfterVAT());
    const otherCharge = parseFloat(state.otherCharge);
    const totaldiscountper = calculateTotalAfterDiscountPercent();



    let accountId = memoInfo?.account?._id || memoInfo?.account?.id;

    if (!accountId && vendorData.state === "hasValue" && Array.isArray(vendorData.contents)) {
      const foundAccount = vendorData.contents.find(acc => acc.code === memoInfo?.account?.code);
      if (foundAccount) {
        accountId = foundAccount._id || foundAccount.id;
      }
    }

    if (!accountId) {
      setInvalidList([{ row: "Header", list: ["Invalid Account Selected"] }]);
      setIsOpenModalConfrim(false);
      setIsOpenModalWarning(true);
      return;
    }

    const body = {
      invoice_no: memoInfo?.invoice_no || "",
      account: accountId,
      vendor_code_id: memoInfo?.account?.code,
      invoice_address: selectedInvoiceAddress?.label || invoiceAddress?.[0]?.label || "",
      shipping_address: shippingAddress?.[0]?.label,
      currency: memoInfo.currency,
      doc_date: docDate,
      due_date: dueDate,
      inventory_type: "purchase_po",
      exchange_rate:
        exchangeRate === "" || exchangeRate === null || Number(exchangeRate) === 0
          ? 1
          : Number(exchangeRate),
      ref_1: ref1,
      ref_2: ref2,
      remark: remark,
      note: note,
      items: rows.map((el) => {

        return {
          stone_code: el.stone_code,
          stock_id: el.stock_id,
          account: el.account,
          location: el.location,
          type: (el.isFromMemoPending || el.stock_id) ? "Cons." : (el.type || ""),
          stone: el.stone,
          shape: el.shape,
          size: el.size,
          color: el.color,
          cutting: el.cutting,
          quality: el.quality,
          clarity: el.clarity,
          cer_type: el.cer_type,
          cer_no: el.cer_no,
          lot_no: el.lot_no || "",
          ref_no: el.ref_no,
          pcs: Number(el.pcs),
          original_pcs: Number(el.pcs), // Set original_pcs to the same value as pcs during creation
          weight_per_piece: Number(el.weight_per_piece),
          weight: Number(el.weight),
          unit_price: Number(el.price),
          total_amount: Number(calculateAmountAfterDiscount(el)),
          price: Number(el.price),
          discount_percent: Number(el.discount_percent),
          discount_amount: Number(el.discount_amount),
          labour: el.labour,
          labour_price: Number(el.labour_price),
          amount: Number(el.amount).toFixed(2),
          remark: el.remark,
          unit: el.unit || "cts",
          status: "active",
        };
      }),

      summary: {
        sub_total: parseFloat(sub_total).toFixed(2),
        discount: parseFloat(totaldiscountper).toFixed(2),
        discount_amount: isNaN(parseFloat(state.discount_amount)) ? "0.00" : parseFloat(state.discount_amount).toFixed(2),
        total_after_discount: parseFloat(totalAfterDiscount).toFixed(2),
        vat: parseFloat(state.vatAmount).toFixed(2),
        vat_amount: parseFloat(totalAfterVAT).toFixed(2),
        other_charge: parseFloat(otherCharge).toFixed(2),
        grand_total: parseFloat(grand_total).toFixed(2),
      },
    };

    // --------- API Call ---------


    let method = "POST";
    let URL = "/po";
    if (memoInfo?.id) {
      method = "PUT";
      URL = `/po/${memoInfo?.id}`;
    }
    const postData = await apiRequest(method, URL, body);
    if (postData) {

      if (postData._id) {
        setMemoInfo(prev => ({
          ...prev,
          id: postData._id,
          invoice_no: postData.invoice_no,
        }));
      }
      setIsOpenModalConfrim(false);
      setIsOpenModalSuccess(true);
      handleSaveSuccess(postData);
    }

    setTimeout(() => {
      setIsOpenModalSuccess(false);
    }, 500);

  };

  const resetData = () => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const [isOpenModalError, setIsOpenModalError] = useState(false);
  const [isOpenModalWarning, setIsOpenModalWarning] = useState(false);
  const [isOpenModalConfirm, setIsOpenModalConfrim] = useState(false);
  const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false);
  const [invalidList, setInvalidList] = useState([]);

  const handleExportExcel = () => {
    try {
      if (!rows || rows.length === 0) {
        alert("No data to export");
        return;
      }

      const subTotal = calculateSubTotalAfterItemDiscounts();
      const grandTotal = calculateGrandTotal();
      const vatAmount = calculateTotalAfterVAT();

      const totalPcs = rows.reduce((a, r) => a + (Number(r.pcs) || 0), 0);
      const totalWeight = rows.reduce((a, r) => a + (Number(r.weight) || 0), 0);


      const summaryHeaders = [
        "Doc Date", "Due Date", "PO No.", "Account", "Ref 1", "Ref 2",
        "Currency", "Exc Rate", "Pcs", "Weight", "SubTotal",
        "Discount(%)", "Discount Amt", "VAT(%)", "VAT",
        "Other Charges", "Grand Total", "Remark", "Status"
      ];

      const summaryValues = [
        moment(docDate).format("DD/MM/YYYY"),
        moment(dueDate).format("DD/MM/YYYY"),
        memoInfo?.invoice_no || "",
        memoInfo?.account?.label || "",
        ref1 || "",
        ref2 || "",
        memoInfo?.currencyCode || "",
        Number(exchangeRate || 0),
        Number(totalPcs || 0),
        Number(totalWeight || 0),
        Number(subTotal || 0),
        state.useDiscountPercent ? Number(state.discount_percent || 0) : 0,
        state.useDiscountAmount ? Number(state.discount_amount || 0) : 0,
        state.useVAT ? Number(state.vatAmount || 0) : 0,
        Number(vatAmount || 0),
        Number(state.otherCharge || 0),
        Number(grandTotal || 0),
        remark || "",
        "Valid"
      ];

      const itemHeaders = [
        "Type", "Lot", "Ref No.", "Stone", "Shape", "Size", "Color",
        "Cutting", "Quality", "Clarity", "Cer Type", "Cer No.", "Pcs", "Weight", "Weight/Pc",
        "Price", "Unit", "Amount", "Remark"
      ];

      const itemRows = rows.map(row => ([
        row.type || row.stone_type || "",
        row.lot_no || "",
        row.ref_no || row["Ref No."] || "",
        row.stone || "",
        row.shape || "",
        row.size || "",
        row.color || "",
        row.cutting || "",
        row.quality || "",
        row.clarity || "",
        row.cer_type || "",
        row.cer_no || "",
        Number(row.pcs || 0),
        Number(row.weight || 0),
        Number(row.weight_per_piece || 0),
        Number(row.price || 0),
        row.unit || "cts",
        Number(calculateAmountAfterDiscount(row) || 0),
        row.remark || ""
      ]));

      exportTransactionToExcel({
        filename: memoInfo?.invoice_no || "Purchase Order",
        sheetName: "Purchase Order",
        summaryHeaders,
        summaryValues,
        itemHeaders,
        itemRows,
      });

    } catch (err) {
      console.error(err);
      alert("Failed to export Excel");
    }
  };

  const handleEdit = (item) => {
    setOpen(false);
    setEditMemoStatus(false);
    setIsDayBookDataLoaded(true);


    dispatch({ type: "RESET_STATE" });

    setFsmState("saved");
    setOriginalData(item);

    setDocDate(item.doc_date);
    setDueDate(item.due_date);


    let allInvoiceAddresses = [];
    const isNotApproved = item?.status !== "approved";
    if (isNotApproved) {
      // Not approved - fetch all addresses
      if (vendorData.state === "hasValue" && Array.isArray(vendorData.contents)) {
        const matchedAccount = vendorData.contents.find(
          (acc) => acc.code === item.vendor_code_id
        );
        if (matchedAccount) {
          allInvoiceAddresses = matchedAccount.invoiceAddress || [];
        }
      }

      if (allInvoiceAddresses.length > 0) {

        const savedAddressText = (item.invoice_address || "").trim();
        const savedAddress = allInvoiceAddresses.find(
          (addr) => (addr.label || "").trim() === savedAddressText
        );


        if (savedAddress) {
          setSelectedInvoiceAddress(savedAddress);

          setInvoiceAddress(allInvoiceAddresses);
        } else {

          const fallbackAddress = {
            label: item.invoice_address,
            code: "",
          };
          setSelectedInvoiceAddress(fallbackAddress);
          setInvoiceAddress([...allInvoiceAddresses, fallbackAddress]);
        }
      } else {
        // Fall back to saved address if account not found
        const fallbackAddress = {
          label: item.invoice_address,
          code: "",
        };
        setSelectedInvoiceAddress(fallbackAddress);
        setInvoiceAddress([fallbackAddress]);
      }
    } else {
      // Approved - use only saved address
      setInvoiceAddress([
        {
          label: item.invoice_address,
        },
      ]);
      setSelectedInvoiceAddress({
        label: item.invoice_address,
        code: "",
      });
    }

    setShippingAddress([
      {
        label: item.shipping_address,
      },
    ]);
    // Set exchangeRate state to "" if 0, "", or null for UI displayAdd commentMore actions

    setTimeout(() => {
      if (
        item.exchange_rate === 0 ||
        item.exchange_rate === "0" ||
        item.exchange_rate === "" ||
        item.exchange_rate === null
      ) {
        setExchangeRate("");
      } else {
        setExchangeRate(item.exchange_rate);
      }
    }, 900); // delay in milliseconds, adjust as needed 


    setRef1(item.ref_1);
    setRef2(item.ref_2);
    let accountObject = { label: item.account, code: item.vendor_code_id };
    if (vendorData.state === "hasValue" && Array.isArray(vendorData.contents)) {
      const found = vendorData.contents.find(acc => acc.code === item.vendor_code_id);
      if (found) accountObject = found;
    }

    setMemoInfo({
      ...memoInfo,
      currency: item?.currency?._id,
      currencyCode: item?.currency?.code,
      exchange_rate: parseFloat(item?.exchange_rate).toFixed(2),
      account: accountObject,
      invoice_no: item?.invoice_no,
      id: item?._id,
      _id: item?._id,
      isDayBookEdit: true,
      status: item?.status, // Add status to memoInfo
    });
    setRemark(item.remark);
    setNote(item.note);
    // Format numeric fields to two decimals before setting rowsAdd commentMore actions
    const itemsToFormat = item.items || [];

    const formattedItems = itemsToFormat.map((el) => ({
      ...el,
      total_amount: Number(el.total_amount).toFixed(2),
      weight_per_piece: Number(el.weight_per_piece).toFixed(2),
      weight: Number(el.weight).toFixed(3),
      price: Number(el.price).toFixed(2),
      discount_percent: Number(el.discount_percent).toFixed(2),
      discount_amount: Number(el.discount_amount).toFixed(2),
      labour_price: parseFloat(Number(el.labour_price).toFixed(2)),
      amount: Number(el.amount).toFixed(2),
      other_charge: el.other_charge !== undefined ? parseFloat(el.other_charge).toFixed(2) : "0.00",
      isFromMemoPending: el.stock_id ? true : (el.isFromMemoPending !== undefined ? el.isFromMemoPending : false),
      type: (el.isFromMemoPending || el.stock_id) ? "Cons." : (el.type || el.stone_type || ""),
    }));

    setRows(formattedItems);
    handleCurrencyChange(item?.currency?.code);

    const { summary = {} } = item;

    if (summary.discount > 0) {
      dispatch({
        type: "TOGGLE_DISCOUNT_PERCENT",
        payload: true,
      });
    }
    if (summary.discount_amount > 0) {
      dispatch({
        type: "TOGGLE_DISCOUNT_AMOUNT",
        payload: true,
      });
    }
    dispatch({
      type: "SET_DISCOUNT_AMOUNT",
      payload: summary.discount_amount,
    });

    dispatch({ type: "SET_OTHER_CHARGE", payload: summary.other_charge || 0 });

    if (summary.vat_amount > 0 || summary.vat > 0) {
      dispatch({ type: "SET_VAT_AMOUNT", payload: summary.vat });
      dispatch({ type: "TOGGLE_VAT", payload: true });
    }

    const calculateDiscountPercentFromAmount = () => {
      const subtotal = summary.sub_total || 0;
      const discountAmount = summary.discount;

      if (subtotal === 0) return 0;

      return Math.floor(parseFloat((discountAmount / subtotal) * 100));
    };

    const percentage = calculateDiscountPercentFromAmount();
    dispatch({
      type: "SET_DISCOUNT_PERCENT",
      payload: percentage,
    });
  };



  const renderDialogSuccess = () => {
    return (
      <Dialog
        open={isOpenModalSuccess}
        onClose={() => setIsOpenModalSuccess(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            padding: " 20px",
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
          Success
        </Typography>
      </Dialog>
    );
  };

  const renderDialogConfirm = () => {
    return (
      <Dialog
        open={isOpenModalConfirm}
        onClose={() => setIsOpenModalConfrim(false)}
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
          onClick={() => setIsOpenModalConfrim(false)}
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
              onClick={() => setIsOpenModalConfrim(false)}
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
              onClick={onHandleSave}
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
    );
  };

  const renderDialogWarning = () => {
    return (
      <Dialog
        open={isOpenModalWarning}
        onClose={() => setIsOpenModalWarning(false)}
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
            width="112"
            height="112"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_472_206422)">
              <path
                d="M56 105C43.0044 105 30.541 99.8375 21.3518 90.6482C12.1625 81.4589 7 68.9956 7 56C7 43.0044 12.1625 30.541 21.3518 21.3518C30.541 12.1625 43.0044 7 56 7C68.9956 7 81.4589 12.1625 90.6482 21.3518C99.8375 30.541 105 43.0044 105 56C105 68.9956 99.8375 81.4589 90.6482 90.6482C81.4589 99.8375 68.9956 105 56 105ZM56 112C70.8521 112 85.0959 106.1 95.598 95.598C106.1 85.0959 112 70.8521 112 56C112 41.1479 106.1 26.9041 95.598 16.402C85.0959 5.89998 70.8521 0 56 0C41.1479 0 26.9041 5.89998 16.402 16.402C5.89998 26.9041 0 41.1479 0 56C0 70.8521 5.89998 85.0959 16.402 95.598C26.9041 106.1 41.1479 112 56 112Z"
                fill="#ED9738"
              />
              <path
                d="M49.0142 77.0001C49.0142 76.0808 49.1952 75.1706 49.547 74.3213C49.8988 73.472 50.4144 72.7004 51.0644 72.0503C51.7144 71.4003 52.4861 70.8847 53.3354 70.5329C54.1847 70.1811 55.0949 70.0001 56.0142 70.0001C56.9334 70.0001 57.8437 70.1811 58.6929 70.5329C59.5422 70.8847 60.3139 71.4003 60.9639 72.0503C61.6139 72.7004 62.1295 73.472 62.4813 74.3213C62.8331 75.1706 63.0142 76.0808 63.0142 77.0001C63.0142 78.8566 62.2767 80.6371 60.9639 81.9498C59.6512 83.2626 57.8707 84.0001 56.0142 84.0001C54.1576 84.0001 52.3772 83.2626 51.0644 81.9498C49.7517 80.6371 49.0142 78.8566 49.0142 77.0001ZM49.7002 34.9651C49.6069 34.082 49.7004 33.1891 49.9746 32.3445C50.2487 31.4998 50.6973 30.7223 51.2914 30.0622C51.8854 29.4021 52.6116 28.8743 53.4228 28.5131C54.234 28.1518 55.1121 27.9651 56.0002 27.9651C56.8882 27.9651 57.7663 28.1518 58.5775 28.5131C59.3887 28.8743 60.1149 29.4021 60.7089 30.0622C61.303 30.7223 61.7516 31.4998 62.0258 32.3445C62.2999 33.1891 62.3934 34.082 62.3002 34.9651L59.8502 59.5141C59.7678 60.4785 59.3266 61.3769 58.6137 62.0315C57.9007 62.6862 56.9681 63.0495 56.0002 63.0495C55.0323 63.0495 54.0996 62.6862 53.3867 62.0315C52.6737 61.3769 52.2325 60.4785 52.1502 59.5141L49.7002 34.9651Z"
                fill="#ED9738"
              />
            </g>
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
          Warning !
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
          {warningText}
        </Typography>
      </Dialog>
    );
  };

  const renderDialogError = () => {
    return (
      <Dialog
        open={isOpenModalError}
        onClose={() => setIsOpenModalError(false)}
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
            width="112"
            height="112"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2788_204916)">
              <path
                d="M56 0C25.0723 0 0 25.0723 0 56C0 86.9295 25.0723 112 56 112C86.9295 112 112 86.9295 112 56C112 25.0723 86.9295 0 56 0ZM56 105.11C28.9818 105.11 7 83.0182 7 55.9998C7 28.9815 28.9818 6.99978 56 6.99978C83.0182 6.99978 105 28.9816 105 55.9998C105 83.0179 83.0182 105.11 56 105.11ZM75.7978 36.2023C74.431 34.8355 72.2155 34.8355 70.8488 36.2023L56 51.051L41.1512 36.2023C39.7845 34.8355 37.569 34.8355 36.2005 36.2023C34.8338 37.569 34.8338 39.7845 36.2005 41.1512L51.0492 56L36.2005 70.8488C34.8338 72.2138 34.8338 74.4329 36.2005 75.7979C37.5673 77.1646 39.7827 77.1646 41.1512 75.7979L56 60.9491L70.8488 75.7979C72.2155 77.1646 74.431 77.1646 75.7978 75.7979C77.1645 74.4329 77.1645 72.2138 75.7978 70.8488L60.949 56L75.7978 41.1512C77.1663 39.7827 77.1663 37.5672 75.7978 36.2023Z"
                fill="#D9214E"
              />
            </g>
            <defs>
              <clipPath id="clip0_2788_204916">
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
          Error !
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
          {errorText}
        </Typography>
      </Dialog>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box sx={{ marginLeft: "222px", Height: "100vh ", paddingBottom: "130px" }}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <PurchaseOrderHeader
              state={state}
              handleSaveMemo={handleSaveModalMemo}
              setDueDate={setDueDate}
              handleEdit={handleEdit}
              open={open}
              setOpen={setOpen}
              setIsDayBookDataLoaded={setIsDayBookDataLoaded}
              fsmState={fsmState}
              hasUnsavedData={() => rows.length > 0}
            />

            <PurchaseOrderBody
              state={state}
              dueDate={dueDate}
              handleEdit={handleEdit}
              handleAddRow={handleAddRow}
              handleNumberChange={handleNumberChange}
              handleSelectChange={handleSelectChange}
              calculateAmount={calculateAmount}
              calculateOtherPrice={calculateOtherPrice}
              handleDiscountPercenChangeInTalble={
                handleDiscountPercenChangeInTalble
              }
              handleDiscountAmountChangeInTable={
                handleDiscountAmountChangeInTable
              }
              calculateAmountAfterDiscount={calculateAmountAfterDiscount}
              handleDelete={handleDelete}
              calculateTotalAmountAfterDiscount={
                calculateTotalAmountAfterDiscount
              }
              calculateSubTotalAfterItemDiscounts={
                calculateSubTotalAfterItemDiscounts
              }
              handleDiscountPercentToggle={handleDiscountPercentToggle}
              handleDiscountPercentChange={handleDiscountPercentChange}
              handleDiscountAmountToggle={handleDiscountAmountToggle}
              handleDiscountAmountChange={handleDiscountAmountChange}
              handleVATToggle={handleVATToggle}
              handleVATChange={handleVATChange}
              handleOtherChargeChange={handleOtherChargeChange}
              onNoteChange={setNote}
              onRemarkChange={setRemark}
              calculateTotalAfterDiscountPercent={
                calculateTotalAfterDiscountPercent
              }
              calculateTotalAfterDiscount={calculateTotalAfterDiscount}
              calculateTotalAfterVAT={calculateTotalAfterVAT}
              calculateGrandTotal={calculateGrandTotal}
              formatNumberWithCommas={formatNumberWithCommas}
              onDocDateChange={setDocDate}
              docDate={docDate}
              onDueDateChange={setDueDate}
              onCurrencyChange={handleCurrencyChange}
              onExchangeRateChange={setExchangeRate}
              exchangeRate={exchangeRate}
              onRef1Change={setRef1}
              onRef2Change={setRef2}
              onLotChange={setLot}
              onStoneChange={setStone}
              onChange={handleChange}
              rows={rows}
              setRows={setRows}
              invoiceAddress={invoiceAddress}
              setInvoiceAddress={setInvoiceAddress}
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
              ref1={ref1}
              ref2={ref2}
              note={note}
              remark={remark}
              isDayBookDataLoaded={isDayBookDataLoaded}
              triggerFSMDirty={triggerFSMDirty}
              fsmState={fsmState}
            />
          </Box>
        </Box>
        <FooterVendor
          type="purchaseOrder"
          fsmState={fsmState}
          formData={formData}
          selectedData={originalData}
          isApproved={isApproved}
          onAddClick={handleAddClick}
          onEditToggle={handleEditToggle}
          onCancelEdit={handleCancelEdit}
          onSaveClick={() => setIsOpenModalConfrim(true)}
          onExportExcel={handleExportExcel}
          hasUnsavedData={() => rows.length > 0}
        />
      </Box>

      {renderDialogSuccess()}
      {renderDialogConfirm()}
      {renderDialogError()}
      {renderDialogWarning()}

      <ConfirmCancelDialog
        open={showCancelConfirmDialog}
        onClose={handleCancelConfirm}
        title="Confirm Cancel"
        message="You have unsaved data. Do you really want to cancel and refresh the page?"
        noButtonText="No"
        yesButtonText="Yes"
      />
    </Box>
  );
};

export default PurchaseOrder;
