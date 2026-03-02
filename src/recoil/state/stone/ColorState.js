import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const colorFSMState = atom({
  key: "colorFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const colorOriginalDataState = atom({
  key: "colorOriginalDataState",
  default: null,
});

// Store the current form data
export const colorFormDataState = atom({
  key: "colorFormDataState",
  default: null,
});

