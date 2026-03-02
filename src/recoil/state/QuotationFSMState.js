import { atom } from "recoil";

export const quotationFSMState = atom({
  key: "quotationFSMState",
  default: "initial",
});

export const quotationOriginalDataState = atom({
  key: "quotationOriginalDataState",
  default: null,
});

export const quotationFormDataState = atom({
  key: "quotationFormDataState",
  default: null,
});
