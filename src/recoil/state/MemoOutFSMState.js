import { atom } from "recoil";

export const memoOutFSMState = atom({
  key: "memoOutFSMState",
  default: "initial",
});

export const memoOutOriginalDataState = atom({
  key: "memoOutOriginalDataState",
  default: null,
});

export const memoOutFormDataState = atom({
  key: "memoOutFormDataState",
  default: null,
});

