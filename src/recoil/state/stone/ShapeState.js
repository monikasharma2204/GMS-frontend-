import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const shapeFSMState = atom({
  key: "shapeFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const shapeOriginalDataState = atom({
  key: "shapeOriginalDataState",
  default: null,
});

// Store the current form data
export const shapeFormDataState = atom({
  key: "shapeFormDataState",
  default: null,
});

