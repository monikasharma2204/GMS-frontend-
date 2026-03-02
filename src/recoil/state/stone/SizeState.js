import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const sizeFSMState = atom({
  key: "sizeFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const sizeOriginalDataState = atom({
  key: "sizeOriginalDataState",
  default: null,
});

// Store the current form data
export const sizeFormDataState = atom({
  key: "sizeFormDataState",
  default: null,
});

