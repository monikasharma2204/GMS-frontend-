import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const cuttingFSMState = atom({
  key: "cuttingFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const cuttingOriginalDataState = atom({
  key: "cuttingOriginalDataState",
  default: null,
});

// Store the current form data
export const cuttingFormDataState = atom({
  key: "cuttingFormDataState",
  default: null,
});

