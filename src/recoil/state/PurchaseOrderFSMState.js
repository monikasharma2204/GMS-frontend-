import { atom } from "recoil";

export const purchaseOrderFSMState = atom({
  key: "purchaseOrderFSMState",
  default: "initial",
});

export const purchaseOrderOriginalDataState = atom({
  key: "purchaseOrderOriginalDataState",
  default: null,
});

export const purchaseOrderFormDataState = atom({
  key: "purchaseOrderFormDataState",
  default: null,
});

