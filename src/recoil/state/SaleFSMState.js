import { atom } from "recoil";

export const saleFSMState = atom({
  key: "saleFSMState",
  default: "initial",
});

export const saleOriginalDataState = atom({
  key: "saleOriginalDataState",
  default: null,
});

export const saleFormDataState = atom({
  key: "saleFormDataState",
  default: null,
});

