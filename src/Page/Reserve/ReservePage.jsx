import React, { useReducer, useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import FooterVendor from "../../component/Layout/FooterVendor";
import apiRequest from "../../helpers/apiHelper.js";
import { API_URL } from "config/config.js";
import moment from "moment";
import { exportTransactionToExcel } from "../../helpers/excelHelper";
import {
  createDateChangeHandler,
  parseBackendDate,
  validateBodyDates,
  appendDatesToFormData,
} from "../../helpers/dateHelper.js";

import ReserveBody from "../../component/Reserve/ReserveBody";
import ReserveHeader from "../../component/Reserve/ReserveHeader";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
} from "recoil/Reserve/ReserveState";
import { grandTotalState, memoInfoState, keyEditState, editMemoState } from "recoil/Reserve/MemoState";
import { currencyState } from "recoil/state/CommonState";
import {
  reserveFSMState,
  reserveOriginalDataState,
  reserveFormDataState,
} from "../../recoil/state/ReserveFSMState";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import {
  initialData,
  initialData2,
  initialState,
  newAddTemplate,
} from "../../component/Quotations/Data.jsx";

import {
  QuotationtableRowsState,
  QuotationSelectedInvoiceAddressState,
  QuotationSelectedShippingAddressState,
  DayBookQuotationState,
} from "recoil/Reserve/ReserveState";
import { useRecoilState, useRecoilValueLoadable, useResetRecoilState } from "recoil";
import { getCustomerInfo } from "recoil/selector/CustomerSelector";
import useTransactionNavigationGuard from "../../hooks/useTransactionNavigationGuard";


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
        type: "",
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
      };
    default:
      return state;
  }
}

const ReservePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [rows, setRows] = useRecoilState(QuotationtableRowsState);
  const [open, setOpen] = useState(false);

  // FSM State Management
  const [fsmState, setFsmState] = useRecoilState(reserveFSMState);
  const [originalData, setOriginalData] = useRecoilState(reserveOriginalDataState);
  const [formData, setFormData] = useRecoilState(reserveFormDataState);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);

  const [accountNew] = useRecoilState(useQuotationAccountState);
  const [editMemoStatus, setEditMemoStatus] = useRecoilState(editMemoState);
  const [invoiceAddress, setInvoiceAddress] = useRecoilState(
    QuotationInvoiceAddressState
  );
  const [shippingAddress, setShippingAddress] = useRecoilState(
    QuotationShippingAddressState
  );
  const [selectedInvoiceAddress, setSelectedInvoiceAddress] = useRecoilState(
    QuotationSelectedInvoiceAddressState
  );
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useRecoilState(QuotationSelectedShippingAddressState);
  const customerInfoLoadable = useRecoilValueLoadable(getCustomerInfo);
  const [grandTotal, setGrandTotal] = useRecoilState(grandTotalState);

  const resetInvoiceAddressState = useResetRecoilState(QuotationInvoiceAddressState);
  const resetShippingAddressState = useResetRecoilState(QuotationShippingAddressState);
  const resetSelectedInvoiceAddressState = useResetRecoilState(QuotationSelectedInvoiceAddressState);
  const resetSelectedShippingAddressState = useResetRecoilState(QuotationSelectedShippingAddressState);
  const resetRowsState = useResetRecoilState(QuotationtableRowsState);
  const resetGrandTotalState = useResetRecoilState(grandTotalState);
  const resetMemoInfoState = useResetRecoilState(memoInfoState);
  const resetKeyEditState = useResetRecoilState(keyEditState);
  const resetDayBookQuotationState = useResetRecoilState(DayBookQuotationState);

  const resetReserveState = useCallback(() => {
    resetInvoiceAddressState();
    resetShippingAddressState();
    resetSelectedInvoiceAddressState();
    resetSelectedShippingAddressState();
    resetRowsState();
    resetGrandTotalState();
    resetMemoInfoState();
    resetKeyEditState();
    resetDayBookQuotationState();
  }, [
    resetDayBookQuotationState,
    resetGrandTotalState,
    resetInvoiceAddressState,
    resetKeyEditState,
    resetMemoInfoState,
    resetRowsState,
    resetSelectedInvoiceAddressState,
    resetSelectedShippingAddressState,
    resetShippingAddressState,
  ]);

  useEffect(() => {

    setFsmState("initial");
    setFormData(null);
    setOriginalData(null);
    resetReserveState();
    return () => {
      resetReserveState();
    };
  }, [resetReserveState, setFsmState, setFormData, setOriginalData]);



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
    dispatch({ type: "SET_SELECTED_ITEMS", payload: selectedItems });
  };




  const triggerFSMDirty = useCallback(() => {
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  }, [fsmState, setFsmState]);

  const handleUpdate = (index, field, newValue) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows]; // Clone array
      updatedRows[index] = { ...updatedRows[index], [field]: newValue }; // Update only the target row
      return updatedRows;
    });
    triggerFSMDirty();
  };

  const handleDelete = (id) => {
    // dispatch({ type: "DELETE_ITEM", payload: itemName });
    setRows((prevRows) => prevRows.filter((row) => row._id !== id));
    triggerFSMDirty();
  };

  const handleAddRow = () => {
    // dispatch({ type: "ADD_ROW" });

    const formData = {

      stock_id: "",
      type: "",
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
      labour: "",
      labour_price: "0.00",
      weight_per_piece: "0.00",
      description: "",
    };

    setRows((prevRows) => {
      const newItemIndex = prevRows.length + 1; // Incremental index
      let newName = `New Item ${newItemIndex}`; // Generate name
      let _id = "id" + newItemIndex;
      return [...prevRows, { account: newName, ...formData, _id: _id }];
    });
    triggerFSMDirty();
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
      !isNaN(str) &&
      !isNaN(parseFloat(str))
    );
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
    const totalAfterDiscount = parseFloat(calculateTotalAmountAfterDiscount());
    const totalAfterVAT = state.useVAT
      ? (totalAfterDiscount * state.vatAmount) / 100
      : 0;

    const otherCharge = parseFloat(state.otherCharge) || 0;


    const grandTotal = totalAfterDiscount + totalAfterVAT + otherCharge ? totalAfterDiscount + totalAfterVAT + otherCharge : 0.00;

    return Number(grandTotal).toFixed(2);
  };


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

    handleUpdate(index, "discount_amount", newValue);

    handleUpdate(
      index,
      "discount_percent",
      Number(calculatedDiscountPercent).toFixed(2)
    );

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


  const handleDocDateChange = createDateChangeHandler(setDocDate);
  const handleDueDateChange = createDateChangeHandler(setDueDate);

  const setExchangeRate = (value) => {
    if (value === 0 || value === "0" || value === "" || value === null) {
      setExchangeRateRaw("");
    } else {
      setExchangeRateRaw(value);
    }
  };


  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [account, setAccount] = useState("");
  const [lot, setLot] = useState("");
  const [stone, setStone] = useState("");
  const [note, setNote] = useState("");
  const [remark, setRemark] = useState("");
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [currency, setCurrency] = useRecoilState(currencyState);
  const isApproved = ((memoInfo?.status || "") + "").toLowerCase() === "approved" ||
    ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
  const [companyCurrency, setCompanyCurrency] = useState(null);

  const getCompanyInfo = async () => {
    try {
      const companyInfoData = await apiRequest("GET", "/companyProfile");
      setCompanyCurrency(companyInfoData.currency);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);


  const hasUnsavedData = () => {

    if (rows && rows.length > 0) {

      const hasRowData = rows.some(row =>
        row?.stone || row?.stone_code || row?.pcs > 0 || row?.weight > 0 || row?.price > 0
      );
      if (hasRowData) {
        return true;
      }
    }
    return false;
  };


  const shouldShowUnsavedDialog = useMemo(() => {
    if (fsmState === "saved") {
      return false;
    }
    return hasUnsavedData();
  }, [fsmState, rows]);

  useTransactionNavigationGuard(shouldShowUnsavedDialog, resetReserveState);

  const handleChange = (index, field, value) => {
    handleUpdate(index, field, value);
    triggerFSMDirty();
  };

  const handleCurrencyChange = (currencyCode) => {
    if (currencyCode) {
      setCurrency(currencyCode);
    }
  };

  const handlePost = () => {
    setIsOpenModalConfrim(true);
  };

  const [warningText, setWarningText] = useState("");
  const [errorText, setErrorText] = useState("");

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
    if (!account?.label || !account?.code) {
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

      const totalAmount = calculateAmountAfterDiscount(el);
      if (rowErrors.length > 0) {
        invalidList.push({
          row: `Table Row ${index + 1}`,
          list: rowErrors,
        });
      }
    });


    // --------- Summary Validation ---------

    const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount());

    // if (!isNumeric(totalAfterDiscount) || totalAfterDiscount <= 0) {
    //   invalidList.push({
    //     row: "Summary",
    //     list: ["Total After Discount"],
    //   });
    // }

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


    const resolvedInvoiceAddress =
      (selectedInvoiceAddress?.label || "").trim() ||
      (Array.isArray(invoiceAddress) && invoiceAddress[0]?.label) ||
      "";
    const resolvedShippingAddress =
      (selectedShippingAddress?.label || "").trim() ||
      (Array.isArray(shippingAddress) && shippingAddress[0]?.label) ||
      "";


    const validatedDates = validateBodyDates(
      { doc_date: docDate, due_date: dueDate },
      ['doc_date', 'due_date']
    );

    const body = {
      invoice_no: memoInfo?.invoice_no || "",

      vendor_code_id: account?.code,
      account: account?.label,
      invoice_address: resolvedInvoiceAddress,
      shipping_address: resolvedShippingAddress,
      currency: memoInfo.currency,
      doc_date: validatedDates.doc_date,
      due_date: validatedDates.due_date,
      exchange_rate:
        exchangeRate === "" || exchangeRate === null || Number(exchangeRate) === 0
          ? 1
          : Number(exchangeRate),
      ref_1: ref1,
      ref_2: ref2,
      remark: remark,
      note: note,
      items: rows.map((el) => ({
        _id: el.id,
        stock_id: el.stock_id,
        stone_code: el.stone_code,
        account: el.account,
        location: el.location,
        type: el.type,
        stone: el.stone,
        shape: el.shape,
        size: el.size,
        color: el.color,
        cutting: el.cutting,
        quality: el.quality,
        clarity: el.clarity,
        cer_type: el.cer_type,
        cer_no: el.cer_no,
        lot_no: el.lot_no,
        pcs: Number(el.pcs),
        weight_per_piece: Number(el.weight_per_piece),
        weight: Number(el.weight),
        unit_price: Number(el.price),
        total_amount: Number(calculateAmountAfterDiscount(el)),
        price: Number(el.price),
        discount_percent: Number(el.discount_percent),
        discount_amount: Number(el.discount_amount),
        labour: el.labour,
        labour_price: Number(el.labour_price).toFixed(2),
        pcs: Number(el.pcs),
        amount: Number(el.amount).toFixed(2),
        remark: el.remark,
        unit: el.unit || "cts",
        status: "active",

        image: el.imageFile ? undefined : (el.image ? (() => {
          const img = el.image;
          if (typeof img === 'string' && /^https?:\/\/.+?\/uploads\//.test(img)) {
            const match = img.match(/\/uploads\/.+$/);
            return match ? match[0] : img;
          }
          return img;
        })() : null),
      })),

      summary: {
        sub_total: parseFloat(sub_total) || 0,
        discount: parseFloat(totaldiscountper) || 0,
        discount_amount: isNaN(parseFloat(state.discount_amount)) ? 0 : parseFloat(state.discount_amount),
        total_after_discount: parseFloat(totalAfterDiscount) || 0,
        vat: parseFloat(state.vatAmount) || 0,
        vat_amount: parseFloat(totalAfterVAT) || 0,
        other_charge: parseFloat(otherCharge) || 0,
        grand_total: parseFloat(grand_total) || 0,
      },
    };

    // --------- API Call ---------

    let method = "POST";
    let URL = "/reserves";

    if (memoInfo?.id || memoInfo?._id) {
      method = "PUT";
      const reserveId = memoInfo?.id || memoInfo?._id;
      URL = `/reserves/${reserveId}`;
    }

    let payload = body;
    if (Array.isArray(rows) && rows.some(r => r && r.imageFile instanceof File)) {
      const formData = new FormData();

      const bodyWithoutItems = { ...body };
      delete bodyWithoutItems.items;
      delete bodyWithoutItems.summary;

      appendDatesToFormData(bodyWithoutItems, formData, ['doc_date', 'due_date']);

      formData.append("items", JSON.stringify(body.items || []));
      formData.append("summary", JSON.stringify(body.summary || {}));
      (rows || []).forEach((r, idx) => {
        if (r && r.imageFile instanceof File) {
          let token = String(idx);
          try {
            const isValidObjectId = typeof r._id === "string" && /^[0-9a-fA-F]{24}$/.test(r._id);
            if (isValidObjectId) token = r._id;
          } catch { }
          const fieldKey = `image_${token}`;
          formData.append(fieldKey, r.imageFile, r.imageFile.name || fieldKey);
        }
      });
      payload = formData;
    }

    const postData = await apiRequest(method, URL, payload);

    if (postData && !postData.error) {

      const reserveData = postData.reserve || postData.updatedReserve || postData;


      setMemoInfo(prevMemoInfo => ({
        ...prevMemoInfo,
        id: reserveData._id || reserveData.id || prevMemoInfo?.id,
        _id: reserveData._id || reserveData.id || prevMemoInfo?._id,
        invoice_no: reserveData.invoice_no || prevMemoInfo?.invoice_no,
      }));

      setIsOpenModalConfrim(false);
      setIsOpenModalSuccess(true);

      setTimeout(() => {
        setIsOpenModalSuccess(false);
        handleSaveSuccess();
      }, 500);
    } else {
      setIsOpenModalConfrim(false);
      setIsOpenModalError(true);
      setErrorText(postData?.message || "Save failed. Please try again.");
    }
  }



  const resetData = () => {

    setTimeout(() => {
      window.location.reload();
    }, 500)

  }


  const [isOpenModalError, setIsOpenModalError] = useState(false);
  const [isOpenModalWarning, setIsOpenModalWarning] = useState(false);
  const [isOpenModalConfirm, setIsOpenModalConfrim] = useState(false);
  const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false);

  // FSM Handler Functions
  const handleEditToggle = () => {
    setFsmState("editing");
    setEditMemoStatus(true);
  };

  const handleAddClick = () => {
    setFsmState("initial");
    setEditMemoStatus(false);
    setAccount("");
    setRef1("");
    setRef2("");
    setNote("");
    setRemark("");
    setDocDate(new Date());
    setDueDate(new Date());
    setExchangeRate("");
    dispatch({ type: "RESET_STATE" });
    resetReserveState();
    // Reset FSM states
    setFormData(null);
    setOriginalData(null);
  };

  const proceedWithCancel = () => {
    if (fsmState === "editing") {

      if (originalData) {


        setDocDate(parseBackendDate(originalData.doc_date));
        setDueDate(parseBackendDate(originalData.due_date));
        setAccount({
          label: originalData.account || "",
          code: originalData.vendor_code_id || ""
        });
        setRef1(originalData.ref_1 || "");
        setRef2(originalData.ref_2 || "");
        setNote(originalData.note || "");
        setRemark(originalData.remark || "");


        if (originalData.exchange_rate === 0 || originalData.exchange_rate === "0" || originalData.exchange_rate === "" || originalData.exchange_rate === null) {
          setExchangeRate("");
        } else {
          setExchangeRate(originalData.exchange_rate);
        }

        setMemoInfo(prev => ({
          ...prev,
          currency: originalData?.currency?._id || prev.currency,
          currencyCode: originalData?.currency?.code || prev.currencyCode,
          exchange_rate: originalData?.exchange_rate ? parseFloat(originalData.exchange_rate).toFixed(2) : prev.exchange_rate,
          invoice_no: originalData?.invoice_no || prev.invoice_no,
          id: originalData?._id || originalData?.id || prev.id,
          _id: originalData?._id || originalData?.id || prev._id,
          isDayBookEdit: false,
          status: originalData?.status || prev.status,
          status_approve: originalData?.status_approve || prev.status_approve
        }));


        if (originalData.items && Array.isArray(originalData.items)) {
          setRows(originalData.items);
        }


        setFormData(originalData);
        setFsmState("saved");
        setEditMemoStatus(false);
      }
    } else if (fsmState === "dirty") {

      setFsmState("initial");
      setEditMemoStatus(false);
      setAccount("");
      setRef1("");
      setRef2("");
      setNote("");
      setRemark("");
      setDocDate(new Date());
      setDueDate(new Date());
      setExchangeRate("");
      dispatch({ type: "RESET_STATE" });
      resetReserveState();
      setFormData(null);
      setOriginalData(null);
    }
  };

  const handleCancelEdit = () => {

    if (fsmState === "saved") {
      return;
    }


    if (hasUnsavedData()) {
      setShowConfirmDialog(true);
      setPendingSelection("CANCEL_EDIT");
      return;
    }


    proceedWithCancel();
  };

  const handleSaveSuccess = () => {
    setFsmState("saved");
    setEditMemoStatus(false);

    const recordId = memoInfo?.id || memoInfo?._id;

    if (recordId || rows.length > 0) {
      const completeData = {
        _id: recordId,
        id: recordId,
        invoice_no: memoInfo?.invoice_no || "",
        account: account?.label || memoInfo?.account?.label || "",
        vendor_code_id: account?.code || memoInfo?.account?.code || "",
        invoice_address: selectedInvoiceAddress?.label || invoiceAddress?.[0]?.label || "",
        shipping_address: shippingAddress?.[0]?.label || "",
        currency: {
          _id: memoInfo?.currency,
          code: memoInfo?.currencyCode,
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
        status: memoInfo?.status || "unapproved",
        status_approve: memoInfo?.status_approve,
        isDayBookEdit: false,
      };
      setOriginalData(completeData);
      setFormData(completeData);
    }
  };

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
        "Doc Date", "Due Date", "Reserve No.", "Account", "Ref 1", "Ref 2",
        "Currency", "Exc Rate", "Pcs", "Weight", "SubTotal",
        "Discount(%)", "Discount Amt", "VAT(%)", "VAT",
        "Other Charges", "Grand Total", "Remark", "Status"
      ];

      const summaryValues = [
        moment(docDate).format("DD/MM/YYYY"),
        moment(dueDate).format("DD/MM/YYYY"),
        memoInfo?.invoice_no || "",
        account?.label || memoInfo?.account?.label || "",
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
        "Type", "Lot", "Stone", "Shape", "Size", "Color",
        "Cutting", "Quality", "Clarity", "Cer Type", "Cer No.", "Pcs", "Weight",
        "Price", "Unit", "Amount", "Remark"
      ];

      const itemRows = rows.map(row => ([
        (row.type === "select" ? "" : (row.type || row.stone_type || "")),
        row.lot_no || "",

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
        Number(row.price || 0),
        row.unit || "cts",
        Number(calculateAmountAfterDiscount(row) || 0),
        row.remark || ""
      ]));

      exportTransactionToExcel({
        filename: memoInfo?.invoice_no || "Reserve",
        sheetName: "Reserve",
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


    setDocDate(parseBackendDate(item.doc_date));
    setDueDate(parseBackendDate(item.due_date));
    setAccount({
      label: item.account,
      code: item.vendor_code_id
    });

    let allInvoiceAddresses = [];
    let allShippingAddresses = [];
    if (
      customerInfoLoadable.state === "hasValue" &&
      Array.isArray(customerInfoLoadable.contents)
    ) {
      const matchedAccount = customerInfoLoadable.contents.find(
        (acc) => acc.code === item.vendor_code_id
      );
      if (matchedAccount) {
        allInvoiceAddresses = matchedAccount.invoiceAddress || [];
        allShippingAddresses = matchedAccount.shippingAddress || [];
      }
    }

    const savedInvoiceText = (item.invoice_address || "").trim();
    if (allInvoiceAddresses.length > 0) {
      const savedInvoice = allInvoiceAddresses.find(
        (addr) => (addr.label || "").trim() === savedInvoiceText
      );
      if (savedInvoice) {
        const remainingInvoice = allInvoiceAddresses.filter(
          (addr) => (addr.label || "").trim() !== savedInvoiceText
        );
        const reorderedInvoice = [savedInvoice, ...remainingInvoice];
        setInvoiceAddress(reorderedInvoice);
        setSelectedInvoiceAddress(savedInvoice);
      } else if (savedInvoiceText) {
        const fallbackInvoice = { label: item.invoice_address, code: "" };
        const combinedInvoice = [fallbackInvoice, ...allInvoiceAddresses];
        setInvoiceAddress(combinedInvoice);
        setSelectedInvoiceAddress(fallbackInvoice);
      } else {
        setInvoiceAddress(allInvoiceAddresses);
        setSelectedInvoiceAddress(allInvoiceAddresses[0] || null);
      }
    } else if (savedInvoiceText) {
      const fallbackInvoice = { label: item.invoice_address, code: "" };
      setInvoiceAddress([fallbackInvoice]);
      setSelectedInvoiceAddress(fallbackInvoice);
    } else {
      setInvoiceAddress([]);
      setSelectedInvoiceAddress(null);
    }

    const savedShippingText = (item.shipping_address || "").trim();
    if (allShippingAddresses.length > 0) {
      const savedShipping = allShippingAddresses.find(
        (addr) => (addr.label || "").trim() === savedShippingText
      );
      if (savedShipping) {
        const remainingShipping = allShippingAddresses.filter(
          (addr) => (addr.label || "").trim() !== savedShippingText
        );
        const reorderedShipping = [savedShipping, ...remainingShipping];
        setShippingAddress(reorderedShipping);
        setSelectedShippingAddress(savedShipping);
      } else if (savedShippingText) {
        const fallbackShipping = { label: item.shipping_address, code: "" };
        const combinedShipping = [fallbackShipping, ...allShippingAddresses];
        setShippingAddress(combinedShipping);
        setSelectedShippingAddress(fallbackShipping);
      } else {
        setShippingAddress(allShippingAddresses);
        setSelectedShippingAddress(allShippingAddresses[0] || null);
      }
    } else if (savedShippingText) {
      const fallbackShipping = { label: item.shipping_address, code: "" };
      setShippingAddress([fallbackShipping]);
      setSelectedShippingAddress(fallbackShipping);
    } else {
      setShippingAddress([]);
      setSelectedShippingAddress(null);
    }

    // Set exchangeRate state to "" if 0, "", or null for UI display
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
    }, 800); // delay in milliseconds, adjust as needed 


    setRef1(item.ref_1);
    setRef2(item.ref_2);
    setMemoInfo({
      ...memoInfo,
      currency: item?.currency?._id,
      currencyCode: item?.currency?.code,
      exchange_rate: parseFloat(item?.exchange_rate).toFixed(2),
      invoice_no: item?.invoice_no,
      id: item?._id,
      _id: item?._id,
      isDayBookEdit: true,
      status: item?.status,
      status_approve: item?.status_approve
    });
    setRemark(item.remark);
    setNote(item.note);



    const formattedItems = item.items.map((el) => ({
      ...el,
      // Always display original_pcs in DayBook rows 
      pcs: Number(el.original_pcs ?? el.pcs ?? 0),
      original_pcs: Number(el.original_pcs ?? el.pcs ?? 0),
      total_amount: Number(el.total_amount).toFixed(2),
      weight_per_piece: Number(el.weight_per_piece).toFixed(2),
      weight: Number(el.weight).toFixed(3),
      price: Number(el.price).toFixed(2),
      discount_percent: Number(el.discount_percent).toFixed(2),
      discount_amount: Number(el.discount_amount).toFixed(2),
      labour_price: parseFloat(Number(el.labour_price).toFixed(2)),
      amount: Number(el.amount).toFixed(2),
      other_charge: el.other_charge !== undefined ? parseFloat(el.other_charge).toFixed(2) : "0.00",
      // Ensure image path is absolute so <img> can load it in daybook
      image: el.image
        ? (/^https?:\/\//.test(el.image) ? el.image : `${API_URL}${el.image}`)
        : null,
      image_preview: el.image
        ? (/^https?:\/\//.test(el.image) ? el.image : `${API_URL}${el.image}`)
        : null,
      isFromDayBook: true, // Mark items from DayBook as editable
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


    setFsmState("saved");
    setFormData(item);
    setOriginalData(item);
  };


  const handleDayBookDataSelection = (data) => {
    setEditMemoStatus(false);
    handleEdit(data);
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
            padding: "25px",
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
            <ReserveHeader
              state={state}
              handleSaveMemo={handleSaveModalMemo}
              setDueDate={setDueDate}
              handleEdit={handleEdit}
              open={open}
              setOpen={setOpen}
              hasUnsavedData={hasUnsavedData}
              handleDataSelection={handleDayBookDataSelection}
            />

            <ReserveBody
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
              onDocDateChange={handleDocDateChange}
              docDate={docDate}
              onDueDateChange={handleDueDateChange}
              onCurrencyChange={handleCurrencyChange}
              onExchangeRateChange={setExchangeRate}
              exchangeRate={exchangeRate}
              onRef1Change={setRef1}
              onRef2Change={setRef2}
              account={account}
              setAccount={setAccount}
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
              triggerFSMDirty={triggerFSMDirty}
            />
          </Box>
        </Box>
        <FooterVendor
          type="reserve"
          fsmState={fsmState}
          formData={formData}
          selectedData={originalData}
          isApproved={isApproved}
          onCancelEdit={handleCancelEdit}
          onEditToggle={handleEditToggle}
          onAddClick={handleAddClick}
          onSaveClick={onHandleSave}
          onSaveSuccess={handleSaveSuccess}
          onExportExcel={handleExportExcel}
          hasUnsavedData={hasUnsavedData}
          isSaveDisabled={false}
        />

        <ConfirmCancelDialog
          open={showConfirmDialog}
          onClose={(confirmed) => {
            setShowConfirmDialog(false);
            if (confirmed) {
              if (pendingSelection === "CANCEL_EDIT") {

                proceedWithCancel();
              }
            }
            setPendingSelection(null);
          }}
          title="Confirm Cancel"
          message="You have unsaved changes. Do you want to continue without saving?"
        />
      </Box>

      {renderDialogSuccess()}
      {renderDialogConfirm()}
      {renderDialogError()}
      {renderDialogWarning()}
    </Box>
  );
};

export default ReservePage;
