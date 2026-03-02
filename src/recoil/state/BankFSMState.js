import { atom } from "recoil";

export const bankFSMState = atom({
  key: "bankFSMState",
  default: "initial",
});

export const bankOriginalDataState = atom({
  key: "bankOriginalDataState",
  default: null,
});

export const bankFormDataState = atom({
  key: "bankFormDataState",
  default: null,
});

