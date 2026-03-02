import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const clarityFSMState = atom({
  key: "clarityFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const clarityOriginalDataState = atom({
  key: "clarityOriginalDataState",
  default: null,
});

// Store the current form data
export const clarityFormDataState = atom({
  key: "clarityFormDataState",
  default: null,
});

