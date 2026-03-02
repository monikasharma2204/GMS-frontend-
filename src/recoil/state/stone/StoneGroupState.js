import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing" | "approved"
export const stoneGroupFSMState = atom({
  key: "stoneGroupFSMState",
  default: "initial", // initial state when page first loads
});

// Store the original data for comparison (to detect changes)
export const stoneGroupOriginalDataState = atom({
  key: "stoneGroupOriginalDataState",
  default: null,
});

// Store the current form data
export const stoneGroupFormDataState = atom({
  key: "stoneGroupFormDataState",
  default: null,
});


export const stoneGroupListState = atom({
  key: "stoneGroupListState",
  default: [],
});
