import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const certificateTypeFSMState = atom({
  key: "certificateTypeFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const certificateTypeOriginalDataState = atom({
  key: "certificateTypeOriginalDataState",
  default: null,
});

// Store the current form data
export const certificateTypeFormDataState = atom({
  key: "certificateTypeFormDataState",
  default: null,
});

