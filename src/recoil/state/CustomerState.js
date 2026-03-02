import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing"
export const customerFSMState = atom({
  key: "customerFSMState",
  default: "initial",
});

export const customerOriginalDataState = atom({
  key: "customerOriginalDataState",
  default: null,
});

export const customerFormDataState = atom({
  key: "customerFormDataState",
  default: null,
});

export const CustomerListState = atom({
  key: "customerListState_Cust",
  default: [],
});

export const CustomerInvoiceAddressState = atom({
  key: "customerInvoiceAddressState_Cust",
  default: [{ code: "", label: "" }],
});

export const CustomerShippingAddressState = atom({
  key: "customerShippingAddressState_Cust",
  default: [{ code: "", label: "" }],
});

export const tableRowsState = atom({
  key: "tableRowsState_Cust",
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
      pcs: 0,
      weight: 0,
      price: 0,
      unit: "",
      amount: 0,
      discountPercentage: 0,
      discountAmount: 0,
      totalAmount: 0,
      "Ref No.": "",
      labour: "",
      description: "",
    },
  ], // Default value is an empty array
});

export const tableRowsDropdownData = atom({
  key: "tableRowsDropdownData_Cust",
  default: [], // Default value is an empty array
});
