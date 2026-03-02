import { atom } from "recoil";

export const QuotationListState = atom({
  key: "customerListState_MemoOutReturn",
  default: [],
});

export const QuotationInvoiceAddressState = atom({
  key: "customerInvoiceAddressState_MemoOutReturn",
  default: [{ code: "", label: "" }],
});

export const QuotationSelectedInvoiceAddressState = atom({
  key: "selectedInvoiceAddressState_MemoOutReturn",
  default: null,
});

export const QuotationShippingAddressState = atom({
  key: "customerShippingAddressState_MemoOutReturn",
  default: [{ code: "", label: "" }],
});

export const useQuotationAccountState = atom({
  key: "quotationAcountDetails_MemoOutReturn",
  default: null,
});

export const QuotationtableRowsState = atom({
  key: "tableRowsState_MemoOutReturn",
  default: [
    {
      account: "New Item 1",
      stone: "",
      shape: "",
      size: "",
      color: "",
      cutting: "",
      quality: "",
      clarity: "",
      cerType: "",
      certificateNumber: "",
      weight_per_piece: 0,
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
      description: "",
      labour_price: 0,
    },
  ], // Default value is an empty array
});

export const QuotationtableRowsDropdownData = atom({
  key: "tableRowsDropdownData_MemoOutReturn",
  default: [], // Default value is an empty array
});

export const DayBookQuotationState = atom({
  key: "dayBookQuotationState_MemoOutReturn",
  default: null,
});
