import { atom } from "recoil";

export const currencyFSMState = atom({
  key: "currencyFSMState",
  default: "initial", 
});

export const currencyOriginalDataState = atom({
  key: "currencyOriginalDataState",
  default: null,
});

export const currencyFormDataState = atom({
  key: "currencyFormDataState",
  default: null,
});

