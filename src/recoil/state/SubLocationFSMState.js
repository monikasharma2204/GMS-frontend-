import { atom } from "recoil";

export const subLocationFSMState = atom({
  key: "subLocationFSMState",
  default: "initial", 
});

export const subLocationOriginalDataState = atom({
  key: "subLocationOriginalDataState",
  default: null,
});

export const subLocationFormDataState = atom({
  key: "subLocationFormDataState",
  default: null,
});

