import { atom } from "recoil";


export const userAndPermissionFSMState = atom({
  key: "userAndPermissionFSMState",
  default: "add",
});

export const userAndPermissionOriginalDataState = atom({
  key: "userAndPermissionOriginalDataState",
  default: null,
});

export const userAndPermissionFormDataState = atom({
  key: "userAndPermissionFormDataState",
  default: null,
});

