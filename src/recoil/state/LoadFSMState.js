import { atom } from "recoil";

export const loadFSMState = atom({
  key: "loadFSMState",
  default: "initial",
});

export const loadOriginalDataState = atom({
  key: "loadOriginalDataState",
  default: null,
});

export const loadFormDataState = atom({
  key: "loadFormDataState",
  default: null,
});

