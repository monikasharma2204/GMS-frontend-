import { atom } from "recoil";

export const purchaseFSMState = atom({
  key: "purchaseFSMState",
  default: "initial",
});

export const purchaseOriginalDataState = atom({
  key: "purchaseOriginalDataState",
  default: null,
});

export const purchaseFormDataState = atom({
  key: "purchaseFormDataState",
  default: null,
});

