import { atom } from "recoil";

export const reserveFSMState = atom({
  key: "reserveFSMState",
  default: "initial",
});

export const reserveOriginalDataState = atom({
  key: "reserveOriginalDataState",
  default: null,
});

export const reserveFormDataState = atom({
  key: "reserveFormDataState",
  default: null,
});

