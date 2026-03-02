import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const labourTypeFSMState = atom({
  key: "labourTypeFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const labourTypeOriginalDataState = atom({
  key: "labourTypeOriginalDataState",
  default: null,
});

// Store the current form data
export const labourTypeFormDataState = atom({
  key: "labourTypeFormDataState",
  default: null,
});

