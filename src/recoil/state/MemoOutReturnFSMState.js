import { atom } from "recoil";

export const memoOutReturnFSMState = atom({
  key: "memoOutReturnFSMState",
  default: "initial",
});

export const memoOutReturnOriginalDataState = atom({
  key: "memoOutReturnOriginalDataState",
  default: null,
});

export const memoOutReturnFormDataState = atom({
  key: "memoOutReturnFormDataState",
  default: null,
});

