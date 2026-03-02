import { atom } from "recoil";

export const memoReturnFSMState = atom({
  key: "memoReturnFSMState",
  default: "initial",
});

export const memoReturnOriginalDataState = atom({
  key: "memoReturnOriginalDataState",
  default: null,
});

export const memoReturnFormDataState = atom({
  key: "memoReturnFormDataState",
  default: null,
});

