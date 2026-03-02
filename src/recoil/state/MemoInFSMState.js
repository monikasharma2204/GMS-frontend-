import { atom } from "recoil";

export const memoInFSMState = atom({
  key: "memoInFSMState",
  default: "initial",
});

export const memoInOriginalDataState = atom({
  key: "memoInOriginalDataState",
  default: null,
});

export const memoInFormDataState = atom({
  key: "memoInFormDataState",
  default: null,
});


