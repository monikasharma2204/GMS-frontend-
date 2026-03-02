import { atom } from "recoil";

export const mainLocationFSMState = atom({
  key: "mainLocationFSMState",
  default: "initial", 
});

export const mainLocationOriginalDataState = atom({
  key: "mainLocationOriginalDataState",
  default: null,
});

export const mainLocationFormDataState = atom({
  key: "mainLocationFormDataState",
  default: null,
});

