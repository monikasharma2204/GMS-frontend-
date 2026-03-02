import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const stoneFSMState = atom({
  key: "stoneFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const stoneOriginalDataState = atom({
  key: "stoneOriginalDataState",
  default: null,
});

// Store the current form data
export const stoneFormDataState = atom({
  key: "stoneFormDataState",
  default: null,
});

