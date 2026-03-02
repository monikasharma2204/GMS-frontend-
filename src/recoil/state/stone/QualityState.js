import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const qualityFSMState = atom({
  key: "qualityFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const qualityOriginalDataState = atom({
  key: "qualityOriginalDataState",
  default: null,
});

// Store the current form data
export const qualityFormDataState = atom({
  key: "qualityFormDataState",
  default: null,
});

