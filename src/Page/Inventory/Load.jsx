import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import FooterVendor from "../../component/Layout/FooterVendor";
import InventoryLoadBody from "../../component/Inventory/InventoryLoadBody";
import InventoryLoadHeader from "../../component/Inventory/InventoryLoadHeader";
import apiRequest from "../../helpers/apiHelper.js";
import { API_URL } from "config/config.js";
import PopupDialog from "../../component/Validation/PopupDialog.jsx";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  memoInfoState,
  originalPUDataState,
  selectedPUItemsState,
} from "recoil/Load/MemoState";
import {
  useQuotationAccountState,
  QuotationInvoiceAddressState,
  QuotationShippingAddressState,
  DayBookQuotationState,
  QuotationtableRowsState,
} from "recoil/Load/LoadState";
import {
  loadFSMState,
  loadOriginalDataState,
  loadFormDataState,
} from "recoil/state/LoadFSMState";
import useTransactionNavigationGuard from "../../hooks/useTransactionNavigationGuard";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";

const Load = () => {
  const [state, setState] = useState({ selectedItems: [] });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [currentLoadId, setCurrentLoadId] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isOpenApprovalModal, setIsOpenApprovalModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isOpenModalWarning, setIsOpenModalWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
  const [originalPUData, setOriginalPUData] =
    useRecoilState(originalPUDataState);
  const [selectedPUItems, setSelectedPUItems] =
    useRecoilState(selectedPUItemsState);

  // FSM State Management
  const [fsmState, setFsmState] = useRecoilState(loadFSMState);
  const [originalData, setOriginalData] = useRecoilState(loadOriginalDataState);
  const [formData, setFormData] = useRecoilState(loadFormDataState);

  React.useEffect(() => {
    const storedSelectedPUItems = localStorage.getItem("selectedPUItems");
    if (storedSelectedPUItems) {
      try {
        const parsedItems = JSON.parse(storedSelectedPUItems);
        setSelectedPUItems(parsedItems);
      } catch (error) {
        console.error(
          "Load.jsx - Error parsing selectedPUItems from localStorage:",
          error,
        );
      }
    }
  }, []);

  React.useEffect(() => {
    if (!currentLoadId && !memoInfo?.isDayBookEdit) {
      setRows([]);
      setLoadItems([]);
      setRef1("");
      setRef2("");
      setNote("");
      setRemark("");
      setState({ selectedItems: [] });
      setCurrentLoadId(null);
      setIsApproved(false);
      setIsEditMode(false);
      setOperationType("normal");
      setDocDate(new Date());
      setDueDate(new Date());

      setMemoInfo((prev) => ({
        ...prev,
        account: null,
        invoice_no: "",
        isDayBookEdit: false,
        currency: "",
        doc_date: "",
        due_date: "",
        exchange_rate: "",
        ref_1: "",
        ref_2: "",
        remark: "",
        note: "",
      }));
    }
  }, []); // Only run on mount

  const [loadItems, setLoadItems] = useState([]);

  // Auto-close success modal after 2 seconds
  React.useEffect(() => {
    if (isOpenSuccessModal) {
      const timer = setTimeout(() => {
        setIsOpenSuccessModal(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpenSuccessModal]);

  const handleSaveModalMemo = (selectedItems) => {
    setState((prev) => ({ ...prev, selectedItems }));
  };

  const handleLoadSelect = (selectedLoads) => {
    // Handle selected loads from daybook
    console.log("=== handleLoadSelect called ===");
    console.log("Selected Loads:", selectedLoads);

    if (selectedLoads && selectedLoads.length > 0) {
      const selectedLoad = selectedLoads[0]; // Take the first selected load

      // Set the load ID and approval status
      setCurrentLoadId(selectedLoad._id);
      setIsApproved(selectedLoad.status === "approved");

      // Set operation type based on Load type
      if (selectedLoad.load_type === "merge") {
        setOperationType("merge");
      } else {
        setOperationType("normal");
      }

      // Set the Load No. (invoice_no) in memoInfo
      setMemoInfo((prev) => ({
        ...prev,
        invoice_no: selectedLoad.invoice_no || "",
      }));

      // Populate header fields
      setRef1(selectedLoad.ref_1 || "");
      setRef2(selectedLoad.ref_2 || "");
      setNote(selectedLoad.note || "");

      // Set account in memoInfo
      setMemoInfo((prev) => ({
        ...prev,
        account: selectedLoad.account || "",
      }));

      // Set dates
      if (selectedLoad.doc_date) {
        setDocDate(new Date(selectedLoad.doc_date));
      }
      if (selectedLoad.due_date) {
        setDueDate(new Date(selectedLoad.due_date));
      }

      if (selectedLoad.load_item && selectedLoad.load_item.length > 0) {
        const isMergeMode = selectedLoad.load_item.some(
          (loadItem) => loadItem.pu_refs && loadItem.pu_refs.length > 0,
        );

        if (isMergeMode) {
          const hasOriginalData = selectedLoad.load_item.some(
            (loadItem) => loadItem.original_pcs !== undefined,
          );

          if (hasOriginalData) {
            const puRows = selectedLoad.load_item.map((loadItem, index) => ({
              _id: `pu-item-${index}`,
              stone: loadItem.original_stone || loadItem.stone || "",
              shape: loadItem.original_shape || loadItem.shape || "",
              size: loadItem.original_size || loadItem.size || "",
              color: loadItem.original_color || loadItem.color || "",
              cutting: loadItem.original_cutting || loadItem.cutting || "",
              quality: loadItem.original_quality || loadItem.quality || "",
              clarity: loadItem.original_clarity || loadItem.clarity || "",
              pcs: loadItem.original_pcs || loadItem.pcs || 0,
              weight: loadItem.weight || 0,
              price:
                selectedLoad.load_type === "merge" &&
                  loadItem.original_price === ""
                  ? ""
                  : loadItem.original_price || loadItem.price || 0,
              unit:
                selectedLoad.load_type === "merge" &&
                  loadItem.original_unit === ""
                  ? ""
                  : loadItem.original_unit || loadItem.unit || "",
              amount: loadItem.total_amount  || 0,
              pu_no: loadItem.Pu_no || loadItem.pu_no || "",
              pu_id: loadItem.pu_id || "",
              pu_item_id: loadItem.pu_item_id || "",
            }));
            setRows(puRows);
            setOriginalPUData(puRows);
          } else {
            const fetchOriginalPUData = async () => {
              try {
                const allPURows = [];

                for (const loadItem of selectedLoad.load_item) {
                  if (loadItem.pu_refs && loadItem.pu_refs.length > 0) {
                    for (const puRef of loadItem.pu_refs) {
                      // Fetch current PU data using pu_id
                      const response = await apiRequest(
                        "GET",
                        `/pu/${puRef.pu_id}`,
                      );
                      if (response && response.items) {
                        // Find the specific item by pu_item_id
                        const puItem = response.items.find(
                          (item) => item._id === puRef.pu_item_id,
                        );
                        if (puItem) {
                          allPURows.push({
                            _id: `pu-item-${allPURows.length}`,
                            stone: puItem.stone || "",
                            shape: puItem.shape || "",
                            size: puItem.size || "",
                            color: puItem.color || "",
                            cutting: puItem.cutting || "",
                            quality: puItem.quality || "",
                            clarity: puItem.clarity || "",
                            pcs: puItem.pcs || 0,
                            weight: puItem.weight || 0,
                            price: puItem.price || 0,
                            unit: puItem.unit || "",
                            amount: puItem.total_amount || 0,
                            pu_no: response.invoice_no || "",
                            pu_id: puRef.pu_id,
                            pu_item_id: puRef.pu_item_id,
                          });
                        }
                      }
                    }
                  }
                }

                setRows(allPURows);
                // Store original PU data for consistent display
                setOriginalPUData(allPURows);
              } catch (error) {
                console.error("Error fetching original PU data:", error);
              }
            };

            fetchOriginalPUData();
          }
        } else {
          const puRows = selectedLoad.load_item.map((item, index) => ({
            _id: `pu-item-${index}`,
            stone: item.original_stone || item.stone || "",
            shape: item.original_shape || item.shape || "",
            size: item.original_size || item.size || "",
            color: item.original_color || item.color || "",
            cutting: item.original_cutting || item.cutting || "",
            quality: item.original_quality || item.quality || "",
            clarity: item.original_clarity || item.clarity || "",
            pcs: item.original_pcs || item.pcs || 0, // Use stored original_pcs or fallback to pcs
            weight: item.weight || 0,
            price: item.original_price || item.price || 0,
            unit: item.original_unit || item.unit || "",
            amount: item.total_amount || item.amount || item.totalAmount || 0,
            pu_no: item.Pu_no || item.pu_no || "",
            pu_id: item.pu_id || "",
            pu_item_id: item.pu_item_id || "",
          }));
          setRows(puRows);
        }

        // Convert load_item to Load format for the Load section
        const formRows = selectedLoad.load_item.map((item, index) => {
          // Add API_URL prefix for display (like PU does) - browser needs full URL to load image
          const imageUrl = item.image
            ? /^https?:\/\//.test(item.image)
              ? item.image
              : `${API_URL}${item.image}`
            : null;

          return {
            _id: item._id || `load-item-${index}-${Date.now()}`,
            stock_id: item.stock_id || "",
            stone_code: item.stone_code || "",
            stone: item.stone || "",
            shape: item.shape || "",
            size: item.size || "",
            color: item.color || "",
            cutting: item.cutting || "",
            quality: item.quality || "",
            clarity: item.clarity || "",
            cer_type: item.cer_type || "",
            cer_no: item.cer_no || "",
            lot_no: item.lot_no || "",
            pcs: item.pcs || 0,
            weight_per_piece: item.weight_per_piece || 0,
            weight: item.weight || 0,
            price: item.price || 0,
            stock_price: item.stock_price || 0,
            sale_price: item.sale_price || 0,
            unit: item.unit || "",
            stock_unit: item.stock_unit || "",
            sale_unit: item.sale_unit || "",
            amount: item.total_amount || item.amount || item.totalAmount || 0,
            stock_amount: item.stock_amount || 0,
            sale_amount: item.sale_amount || 0,
            remark: item.remark || "",
            pu_id: item.pu_id || "",
            pu_item_id: item.pu_item_id || "",
            pu_no: item.Pu_no || item.pu_no || "",
            location: item.location || "",
            image: imageUrl,
            image_preview: imageUrl,
          };
        });

        setLoadItems(formRows); // Set Load items in the Load section
      }
    }
  };

  const handleApprove = () => {
    if (!currentLoadId || isApproved) return;
    setIsOpenApprovalModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!currentLoadId) return;

    try {
      await apiRequest("PUT", `/load/${currentLoadId}/approve`, {});
      setIsApproved(true);

      const currentLoadPUIds = new Set(
        rows.map((row) => row.pu_item_id || row._id || row.stock_id)
      );

      const updatedSelectedPUItems = selectedPUItems.filter((item) => {
        const itemId = item.pu_item_id || item._id || item.stock_id;
        return !currentLoadPUIds.has(itemId);
      });

      setSelectedPUItems(updatedSelectedPUItems);
      localStorage.setItem("selectedPUItems", JSON.stringify(updatedSelectedPUItems));
      setIsOpenApprovalModal(false);
      setIsOpenSuccessModal(true);

      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error("Failed to approve load:", error);
      setIsOpenApprovalModal(false);
    }
  };

  const handleUpdate = (index, field, newValue) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows]; // Clone array
      updatedRows[index] = { ...updatedRows[index], [field]: newValue }; // Update only the target row
      return updatedRows;
    });
  };

  const handleDelete = (id) => {
    // dispatch({ type: "DELETE_ITEM", payload: itemName });
    setRows((prevRows) => prevRows.filter((row) => row._id !== id));
  };

  const handleAddRow = () => {
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
      pcs: 0,
      weight: 0,
      price: 0,
      unit: "",
      amount: 0,
      discount_percent: 0,
      discount_amount: 0,
      totalAmount: 0,
      "Ref No.": "",
      labour: "",
      labour_price: 0,
      weight_per_piece: 0,
      description: "",
    };

    setRows((prevRows) => {
      const newItemIndex = prevRows.length + 1; // Incremental index
      let newName = `New Item ${newItemIndex}`; // Generate name
      let _id = "id" + newItemIndex;
      return [...prevRows, { account: newName, ...formData, _id: _id }];
    });
  };
  const formatNumberWithCommas = (number) => {
    const numberString = number.toString();
    const [integerPart, decimalPart] = numberString.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ",",
    );

    if (decimalPart !== undefined) {
      return `${formattedIntegerPart}.${decimalPart}`;
    }

    return formattedIntegerPart;
  };

  // End_Dispatch

  const [docDate, setDocDate] = useState(new Date());
  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [note, setNote] = useState("");
  const [remark, setRemark] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [lot, setLot] = useState("");
  const [stone, setStone] = useState("");
  const [operationType, setOperationType] = useState("normal");

  const resetMemoInfoState = useResetRecoilState(memoInfoState);
  const resetOriginalPUDataState = useResetRecoilState(originalPUDataState);
  const resetAccountState = useResetRecoilState(useQuotationAccountState);
  const resetInvoiceAddressState = useResetRecoilState(
    QuotationInvoiceAddressState,
  );
  const resetShippingAddressState = useResetRecoilState(
    QuotationShippingAddressState,
  );
  const resetDayBookQuotationState = useResetRecoilState(DayBookQuotationState);
  const resetQuotationtableRowsState = useResetRecoilState(
    QuotationtableRowsState,
  );
  const resetLoadFSMState = useResetRecoilState(loadFSMState);
  const resetLoadOriginalDataState = useResetRecoilState(loadOriginalDataState);
  const resetLoadFormDataState = useResetRecoilState(loadFormDataState);

  const resetLoadState = useCallback(() => {
    resetOriginalPUDataState();
    resetAccountState();
    resetInvoiceAddressState();
    resetShippingAddressState();
    resetDayBookQuotationState();
    resetQuotationtableRowsState();
    setMemoInfo((prev) => ({
      ...prev,
      account: null,
      invoice_no: "",
      currency: "",
      inventory_type: "load",
      doc_date: "",
      due_date: "",
      exchange_rate: "",
      ref_1: "",
      ref_2: "",
      remark: "",
      note: "",
      isDayBookEdit: false,
    }));

    // Reset local state
    setRows([]);
    setLoadItems([]);
    setRef1("");
    setRef2("");
    setNote("");
    setRemark("");
    setState({ selectedItems: [] });
    setCurrentLoadId(null);
    setIsApproved(false);
    setIsEditMode(false);
    setOperationType("normal");

    // Reset FSM states
    resetLoadFSMState();
    resetLoadOriginalDataState();
    resetLoadFormDataState();
  }, [
    resetOriginalPUDataState,
    resetAccountState,
    resetInvoiceAddressState,
    resetShippingAddressState,
    resetDayBookQuotationState,
    resetQuotationtableRowsState,
    resetLoadFSMState,
    resetLoadOriginalDataState,
    resetLoadFormDataState,
    setMemoInfo,
  ]);

  const hasUnsavedData = useCallback(() => {
    if (isApproved) {
      return false;
    }

    if (memoInfo?.isDayBookEdit) {
      return true;
    }
    const hasRowData =
      rows &&
      rows.length > 0 &&
      rows.some(
        (row) =>
          row?.stone ||
          row?.stone_code ||
          row?.pcs > 0 ||
          row?.weight > 0 ||
          row?.price > 0,
      );

    if (hasRowData) {
      return true;
    }
    return false;
  }, [isApproved, memoInfo, rows]);

  const triggerFSMDirty = useCallback(() => {
    if (fsmState === "saved" || fsmState === "initial") {
      setFsmState("dirty");
    }
  }, [fsmState, setFsmState]);

  const handleEditToggle = useCallback(() => {
    if (isEditMode) {
      if (originalData) {
        restoreFromOriginalData();
      }
      setFsmState("saved");
      setIsEditMode(false);
    } else {
      const currentData = {
        docDate,
        dueDate,
        ref1,
        ref2,
        note,
        remark,
        rows: [...rows],
        loadItems: [...loadItems],
        account: memoInfo?.account,
        operationType,
      };
      setOriginalData(currentData);
      setFsmState("editing");
      setIsEditMode(true);
    }
  }, [
    isEditMode,
    fsmState,
    docDate,
    dueDate,
    ref1,
    ref2,
    note,
    remark,
    rows,
    loadItems,
    memoInfo,
    operationType,
    setFsmState,
    setOriginalData,
  ]);

  const restoreFromOriginalData = useCallback(() => {
    if (!originalData) return;

    setDocDate(originalData.docDate || new Date());
    setDueDate(originalData.dueDate || new Date());
    setRef1(originalData.ref1 || "");
    setRef2(originalData.ref2 || "");
    setNote(originalData.note || "");
    setRemark(originalData.remark || "");
    setRows(originalData.rows || []);
    setLoadItems(originalData.loadItems || []);
    if (originalData.account) {
      setMemoInfo((prev) => ({ ...prev, account: originalData.account }));
    }
    if (originalData.operationType) {
      setOperationType(originalData.operationType);
    }
  }, [originalData, setMemoInfo]);

  const handleCancelEdit = useCallback(() => {
    if (fsmState === "saved") {
      return;
    }

    if ((fsmState === "initial" || fsmState === "dirty") && hasUnsavedData()) {
      setShowConfirmDialog(true);
      return;
    }

    if (fsmState === "editing") {
      setShowConfirmDialog(true);
      return;
    } else if (fsmState === "dirty") {
      setFsmState("initial");
    }
  }, [fsmState, hasUnsavedData, setFsmState]);

  const handleCancelConfirm = useCallback(
    (confirmed) => {
      setShowConfirmDialog(false);
      if (confirmed) {
        if (fsmState === "editing") {
          if (originalData) {
            restoreFromOriginalData();
          }
          setFsmState("saved");
          setIsEditMode(false);
        } else {
          window.location.reload();
        }
      }
    },
    [fsmState, originalData, restoreFromOriginalData, setFsmState],
  );

  const handleSaveSuccess = useCallback(
    (savedData = null) => {
      console.log("[handleSaveSuccess] Called with savedData:", savedData);

      // Get current load items from the ref (most up-to-date source)
      const currentLoadItemsFromRef =
        bodyRef.current?.getCurrentLoadItems?.() || [];
      console.log(
        "[handleSaveSuccess] Current loadItems from ref count:",
        currentLoadItemsFromRef.length,
      );
      console.log(
        "[handleSaveSuccess] Current loadItems state count:",
        loadItems.length,
      );

      setFsmState("saved");
      setIsEditMode(false);

      // Extract saved data from API response
      const loadData = savedData?.load || savedData;
      const recordId = loadData?._id || loadData?.id || currentLoadId;
      const invoiceNo = loadData?.invoice_no || memoInfo?.invoice_no;

      console.log("[handleSaveSuccess] loadData:", loadData);
      console.log(
        "[handleSaveSuccess] loadData.load_item:",
        loadData?.load_item,
      );
      console.log(
        "[handleSaveSuccess] loadData.load_item length:",
        loadData?.load_item?.length,
      );

      // Update currentLoadId if this was a new save
      if (recordId && !currentLoadId) {
        setCurrentLoadId(recordId);
      }

      // Update memoInfo with saved invoice_no
      if (invoiceNo) {
        setMemoInfo((prev) => ({
          ...prev,
          invoice_no: invoiceNo,
          _id: recordId || prev._id,
          id: recordId || prev.id,
        }));
      }

      let updatedLoadItems =
        currentLoadItemsFromRef.length > 0
          ? currentLoadItemsFromRef
          : loadItems.length > 0
            ? [...loadItems]
            : [];

      if (
        loadData?.load_item &&
        Array.isArray(loadData.load_item) &&
        loadData.load_item.length > 0
      ) {
        console.log(
          "[handleSaveSuccess] Using load_item from API response, count:",
          loadData.load_item.length,
        );
        updatedLoadItems = loadData.load_item.map((loadItem, index) => {
          const imageUrl = loadItem.image
            ? /^https?:\/\//.test(loadItem.image)
              ? loadItem.image
              : `${API_URL}${loadItem.image}`
            : null;

          return {
            _id: loadItem._id || `load-item-${index}-${Date.now()}`,
            stock_id: loadItem.stock_id || "",
            stone_code: loadItem.stone_code || "",
            stone: loadItem.stone || "",
            shape: loadItem.shape || "",
            size: loadItem.size || "",
            color: loadItem.color || "",
            cutting: loadItem.cutting || "",
            quality: loadItem.quality || "",
            clarity: loadItem.clarity || "",
            cer_type: loadItem.cer_type || "",
            cer_no: loadItem.cer_no || "",
            lot_no: loadItem.lot_no || "",
            pcs: loadItem.pcs || 0,
            weight_per_piece: loadItem.weight_per_piece || 0,
            weight: loadItem.weight || 0,
            price: loadItem.price || 0,
            stock_price: loadItem.stock_price || 0,
            sale_price: loadItem.sale_price || 0,
            unit: loadItem.unit || "",
            stock_unit: loadItem.stock_unit || "",
            sale_unit: loadItem.sale_unit || "",
            amount: loadItem.total_amount || loadItem.amount || loadItem.totalAmount || 0,
            stock_amount: loadItem.stock_amount || 0,
            sale_amount: loadItem.sale_amount || 0,
            remark: loadItem.remark || "",
            pu_id: loadItem.pu_id || "",
            pu_item_id: loadItem.pu_item_id || "",
            pu_no: loadItem.Pu_no || loadItem.pu_no || "",
            location: loadItem.location || "",
            image: imageUrl,
            image_preview: imageUrl,
          };
        });
      } else {
        console.log(
          "[handleSaveSuccess] No load_item in API response, using current loadItems from ref/state",
        );
      }

      console.log(
        "[handleSaveSuccess] Final updatedLoadItems count:",
        updatedLoadItems.length,
      );
      console.log(
        "[handleSaveSuccess] updatedLoadItems:",
        updatedLoadItems.map((item) => ({
          _id: item._id,
          pu_item_id: item.pu_item_id,
          stone: item.stone,
        })),
      );

      setLoadItems(updatedLoadItems);

      const currentData = {
        docDate,
        dueDate,
        ref1,
        ref2,
        note,
        remark,
        rows: [...rows],
        loadItems: updatedLoadItems,
        account: memoInfo?.account,
        operationType,
      };
      setOriginalData(currentData);
      setFormData(currentData);
    },
    [
      docDate,
      dueDate,
      ref1,
      ref2,
      note,
      remark,
      rows,
      loadItems,
      memoInfo,
      currentLoadId,
      setFsmState,
      setOriginalData,
      setFormData,
      setMemoInfo,
      setLoadItems,
    ],
  );

  const handleAddClick = useCallback(() => {
    resetLoadState();
    setFsmState("initial");
    setIsEditMode(false);
    setCurrentLoadId(null);
    setIsApproved(false);
    setOperationType("normal");
    setDocDate(new Date());
    setDueDate(new Date());

    if (bodyRef.current?.genInvoiceNo) {
      bodyRef.current.genInvoiceNo();
    }
  }, [resetLoadState, setFsmState]);

  useTransactionNavigationGuard(hasUnsavedData, resetLoadState);
  React.useEffect(() => {
    return () => {
      resetOriginalPUDataState();
      resetAccountState();
      resetInvoiceAddressState();
      resetShippingAddressState();
      resetDayBookQuotationState();
      resetQuotationtableRowsState();

      setCurrentLoadId(null);
      setLoadItems([]);
      setRows([]);

      setMemoInfo((prev) => ({
        ...prev,
        account: null,
        isDayBookEdit: false,
        invoice_no: "",
        currency: "",
        doc_date: "",
        due_date: "",
        exchange_rate: "",
        ref_1: "",
        ref_2: "",
        remark: "",
        note: "",
      }));
    };
  }, [
    resetOriginalPUDataState,
    resetAccountState,
    resetInvoiceAddressState,
    resetShippingAddressState,
    resetDayBookQuotationState,
    resetQuotationtableRowsState,
    setMemoInfo,
  ]);

  const handleChange = (index, field, value) => {
    handleUpdate(index, field, value);
  };

  const resetData = (updatedSelectedPUItems = null) => {
    const itemsToStore = updatedSelectedPUItems || selectedPUItems;
    if (itemsToStore && itemsToStore.length > 0) {
      localStorage.setItem("selectedPUItems", JSON.stringify(itemsToStore));
    }
    window.location.reload();
  };

  const handleEdit = (item) => {
    setCurrentLoadId(item._id);
    setIsApproved(item.status === "approved");
    setIsEditMode(false);
    setFsmState("saved");

    if (item.load_type === "merge") {
      setOperationType("merge");
    } else {
      setOperationType("normal");
    }

    // Set dates
    if (item.doc_date) {
      setDocDate(new Date(item.doc_date));
    }
    if (item.due_date) {
      setDueDate(new Date(item.due_date));
    }

    // Set header fields
    setRef1(item.ref_1 || "");
    setRef2(item.ref_2 || "");
    setNote(item.note || "");

    // Set account and Load No. in memoInfo
    setMemoInfo((prev) => ({
      ...prev,
      account: item.account || "",
      invoice_no: item.invoice_no || "",
    }));

    // Set PU items in the PU section (Item table) - Show original PU data

    if (item.pu_item && item.pu_item.length > 0) {
      // Use original PU data from pu_item array

      const puRows = item.pu_item.map((puItem, index) => {
        const originalPcs = puItem.pcs || 0;

        return {
          _id: `pu-item-${index}`,
          stone: puItem.stone || "",
          shape: puItem.shape || "",
          size: puItem.size || "",
          color: puItem.color || "",
          cutting: puItem.cutting || "",
          quality: puItem.Quality || "",
          clarity: puItem.clarity || "",
          pcs: originalPcs, // Show original PCS (200) for daybook display
          weight: puItem.weight || 0,
          price: puItem.price || 0,
          unit: puItem.unit || "",
          amount: puItem.amount || 0,
          pu_no: puItem.Pu_no || "",
          pu_id: item.load_item[index]?.pu_id || "",
          pu_item_id: item.load_item[index]?.pu_item_id || "",
        };
      });
      setRows(puRows);
      setOriginalPUData(puRows);
    } else if (item.load_item && item.load_item.length > 0) {
      // Fallback: if no pu_item data, use load_item data

      const puRows = item.load_item.map((loadItem, index) => ({
        _id: `pu-item-${index}`,
        stone: loadItem.stone || "",
        shape: loadItem.shape || "",
        size: loadItem.size || "",
        color: loadItem.color || "",
        cutting: loadItem.cutting || "",
        quality: loadItem.quality || "",
        clarity: loadItem.clarity || "",
        pcs: loadItem.pcs || 0,
        weight: loadItem.weight || 0,
        price: loadItem.price || 0,
        unit: loadItem.unit || "",
        amount: loadItem.amount || 0,
        pu_no: loadItem.Pu_no || loadItem.pu_no || "",
        pu_id: loadItem.pu_id || "",
        pu_item_id: loadItem.pu_item_id || "",
      }));
      setRows(puRows);
    }

    // Set Load items in the Load section
    if (item.load_item && item.load_item.length > 0) {
      const formRows = item.load_item.map((loadItem, index) => {
        // Add API_URL prefix for display (like PU does) - browser needs full URL to load image
        const imageUrl = loadItem.image
          ? /^https?:\/\//.test(loadItem.image)
            ? loadItem.image
            : `${API_URL}${loadItem.image}`
          : null;

        return {
          _id: loadItem._id || `load-item-${index}-${Date.now()}`,
          stock_id: loadItem.stock_id || "",
          stone_code: loadItem.stone_code || "",
          stone: loadItem.stone || "",
          shape: loadItem.shape || "",
          size: loadItem.size || "",
          color: loadItem.color || "",
          cutting: loadItem.cutting || "",
          quality: loadItem.quality || "",
          clarity: loadItem.clarity || "",
          cer_type: loadItem.cer_type || "",
          cer_no: loadItem.cer_no || "",
          lot_no: loadItem.lot_no || "",
          pcs: loadItem.pcs || 0,
          weight_per_piece: loadItem.weight_per_piece || 0,
          weight: loadItem.weight || 0,
          price: loadItem.price || 0,
          stock_price: loadItem.stock_price || 0,
          sale_price: loadItem.sale_price || 0,
          unit: loadItem.unit || "",
          stock_unit: loadItem.stock_unit || "",
          sale_unit: loadItem.sale_unit || "",
          amount: loadItem.amount || 0,
          stock_amount: loadItem.stock_amount || 0,
          sale_amount: loadItem.sale_amount || 0,
          remark: loadItem.remark || "",
          pu_id: loadItem.pu_id || "",
          pu_item_id: loadItem.pu_item_id || "",
          pu_no: loadItem.Pu_no || loadItem.pu_no || "",
          location: loadItem.location || "",
          image: imageUrl,
          image_preview: imageUrl,
        };
      });

      setLoadItems(formRows);
    }

    setOpen(false);
  };

  const bodyRef = React.useRef(null);

  const [isOpenModalConfirm, setIsOpenModalConfrim] = useState(false);
  const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handlePost = () => {
    onHandleSave();
  };

  const onHandleSave = async () => {
    if (!bodyRef.current || !bodyRef.current.getSavePayload) return;
    const validationResult = bodyRef.current.validateBeforeSave();

    if (!validationResult.isValid) {
      setIsOpenModalConfrim(false);
      setWarningText(validationResult.message);
      setIsOpenModalWarning(true);
      return;
    }

    const payload = bodyRef.current.getSavePayload();
    try {
      const hasFiles =
        Array.isArray(payload?.load_item) &&
        payload.load_item.some((r) => r && r.imageFile instanceof File);
      const buildRequestBody = () => {
        if (!hasFiles) return payload;
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (k === "load_item" || k === "pu_item") return;
          if (v === undefined || v === null) return;
          if (v instanceof Date) formData.append(k, v.toISOString());
          else if (typeof v === "object") formData.append(k, JSON.stringify(v));
          else formData.append(k, String(v));
        });
        const loadItemsForJson = (payload.load_item || []).map(
          ({ imageFile, ...rest }) => rest,
        );
        console.log(" [Load Save] JSON payload check:");
        loadItemsForJson.forEach((item, idx) => {
          const hasImageField = "image" in item;
          const originalHasImageFile =
            payload.load_item[idx]?.imageFile instanceof File;
          console.log(
            `  Row ${idx}: has_image_field=${hasImageField}, image=${item.image}, original_has_imageFile=${originalHasImageFile}`,
          );
        });
        formData.append("load_item", JSON.stringify(loadItemsForJson));
        formData.append("pu_item", JSON.stringify(payload.pu_item || []));
        const fileCount = { total: 0, byIndex: {} };
        (payload.load_item || []).forEach((r, idx) => {
          if (r && r.imageFile instanceof File) {
            const token = String(idx);
            const fieldKey = `image_${token}`;
            fileCount.total++;
            fileCount.byIndex[idx] = {
              token,
              fieldKey,
              filename: r.imageFile.name,
            };
            console.log(` [Load Save] Appending file for row ${idx}:`, {
              token,
              fieldKey,
              has_id: !!r._id,
              _id: r._id,
              image_in_json: r.image,
              imageFile_exists: !!r.imageFile,
              fileSize: r.imageFile.size,
            });
            formData.append(
              fieldKey,
              r.imageFile,
              r.imageFile.name || fieldKey,
            );
          }
        });
        console.log(
          `[Load Save] Summary: Sending ${fileCount.total} image file(s) with field names:`,
          Object.keys(fileCount.byIndex).map(
            (idx) => fileCount.byIndex[idx].fieldKey,
          ),
        );
        return formData;
      };

      const requestBody = buildRequestBody();

      let savedData = null;
      if (currentLoadId) {

        if (rows && rows.length > 0) {
          const existingIds = new Set(
            selectedPUItems.map(
              (item) => item.pu_item_id || item._id || item.stock_id,
            ),
          );
          const newItems = rows.filter((row) => {
            const rowId = row.pu_item_id || row._id || row.stock_id;
            return rowId && !existingIds.has(rowId);
          });
          if (newItems.length > 0) {
            const updatedSelectedPUItems = [...selectedPUItems, ...newItems];
            setSelectedPUItems(updatedSelectedPUItems);
            try {
              localStorage.setItem(
                "selectedPUItems",
                JSON.stringify(updatedSelectedPUItems),
              );
            } catch (error) {
              console.error("Error saving selectedPUItems to localStorage:", error);
            }
          }
        }
        savedData = await apiRequest(
          "PUT",
          `/loads/${currentLoadId}`,
          requestBody,
        );
      } else {
        let updatedSelectedPUItems = selectedPUItems;
        if (rows && rows.length > 0) {
          setOriginalPUData(rows);
          const existingIds = new Set(
            selectedPUItems.map(
              (item) => item.pu_item_id || item._id || item.stock_id,
            ),
          );
          const newItems = rows.filter((row) => {
            const rowId = row.pu_item_id || row._id || row.stock_id;
            return !existingIds.has(rowId);
          });
          if (newItems.length > 0) {
            updatedSelectedPUItems = [...selectedPUItems, ...newItems];
            setSelectedPUItems(updatedSelectedPUItems);
            try {
              localStorage.setItem(
                "selectedPUItems",
                JSON.stringify(updatedSelectedPUItems),
              );
            } catch (error) {
              console.error(
                "Error saving selectedPUItems to localStorage:",
                error,
              );
            }
          }
        }

        savedData = await apiRequest("POST", "/loads", requestBody);
      }

      setIsOpenModalConfrim(false);

      setTimeout(() => {
        setIsOpenModalSuccess(true);

        setTimeout(() => {
          setIsOpenModalSuccess(false);
          handleSaveSuccess(savedData);
        }, 600);
      }, 1000);
    } catch (e) {
      setIsOpenModalConfrim(false);
    }
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
            padding: "0 20px"
          }}
        >
          {warningText}
        </Typography>
      </Dialog>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box
        sx={{ marginLeft: "222px", Height: "100vh ", paddingBottom: "130px" }}
      >
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <InventoryLoadHeader
              state={state}
              handleSaveMemo={handleSaveModalMemo}
              setDueDate={setDueDate}
              handleEdit={handleEdit}
              open={open}
              setOpen={setOpen}
              onLoadSelect={handleLoadSelect}
              currentLoadId={currentLoadId}
              isApproved={isApproved}
              onApprove={handleApprove}
              memoInfo={memoInfo}
              isEditMode={isEditMode}
              onEditToggle={handleEditToggle}
              fsmState={fsmState}
              hasUnsavedData={hasUnsavedData}
            />

            <InventoryLoadBody
              ref={bodyRef}
              state={state}
              dueDate={dueDate}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              onRemarkChange={setRemark}
              onDocDateChange={setDocDate}
              docDate={docDate}
              onDueDateChange={setDueDate}
              onRef1Change={setRef1}
              onRef2Change={setRef2}
              onNoteChange={setNote}
              onChange={handleChange}
              rows={
                originalPUData && originalPUData.length > 0
                  ? originalPUData
                  : rows
              }
              setRows={setRows}
              loadItems={loadItems}
              isFromDayBook={!!currentLoadId}
              isApproved={isApproved}
              memoInfo={memoInfo}
              isEditMode={isEditMode}
              ref1={ref1}
              ref2={ref2}
              note={note}
              remark={remark}
              operationType={operationType}
              selectedPUItems={selectedPUItems}
              setSelectedPUItems={setSelectedPUItems}
              fsmState={fsmState}
              triggerFSMDirty={triggerFSMDirty}
              formatNumberWithCommas={formatNumberWithCommas}
            />
          </Box>
        </Box>
        <FooterVendor
          fsmState={fsmState}
          formData={memoInfo}
          selectedData={memoInfo}
          onCancelEdit={handleCancelEdit}
          onEditToggle={handleEditToggle}
          onAddClick={handleAddClick}
          onSaveClick={handlePost}
          onSaveSuccess={handleSaveSuccess}
          type="load"
          hasUnsavedData={hasUnsavedData}
          isSaveDisabled={false}
          isApproved={isApproved}
          isEditMode={isEditMode}
        />
      </Box>

      <ConfirmCancelDialog
        open={showConfirmDialog}
        onClose={handleCancelConfirm}
        title="Confirm Cancel"
        message="You have entered some data. Do you really want to cancel?"
      />

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
      {/* Success Dialog */}
      <PopupDialog
        open={isOpenModalSuccess}
        onClose={() => setIsOpenModalSuccess(false)}
        type="success"
        title="Success"
        message="Load saved successfully!"
      />

      {/* Validation Error Dialog */}
      <PopupDialog
        open={!!validationError}
        onClose={() => setValidationError("")}
        type="error"
        message={validationError}
      />

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
              onClick={handleConfirmApprove}
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
      {renderDialogWarning()}
    </Box>
  );
};

export default Load;
