import { atom } from "recoil";

export const buttonStatusState = atom({
  key: "buttonStatusState",
  default: "",
});

export const saveButtonStatusState = atom({
  key: "saveButtonStatusState",
  default: "",
});

export const editStatusState = atom({
  key: "editStatusState",
  default: false,
});
export const addStatusState = atom({
  key: "addStatusState",
  default: false,
});

export const viewStatusState = atom({
  key: "viewStatusState",
  default: false,
});

export const successStatusState = atom({
  key: "successStatusState",
  default: false,
});

export const listUrlState = atom({
  key: "listUrlState",
  default: "",
});
export const updateUrlState = atom({
  key: "updateUrlState",
  default: "",
});
export const editUrlState = atom({
  key: "editUrlState",
  default: "",
});

export const rowPerPageState = atom({
  key: "rowPerPageState",
  default: 10,
});

export const isEditingState = atom({
  key: "isEditingState",
  default: "",
});

export const payloadUrlState = atom({
  key: "payloadUrlState",
  default: "",
});
export const payloadMethodState = atom({
  key: "payloadMethodState",
  default: "",
});
export const payloadDataState = atom({
  key: "payloadDataState",
  default: false,
});
export const currencyState = atom({
  key: "currencyState",
  default: "",
});

export const exchnageState = atom({
  key: "exchnageState",
  default: "",
});

export const payloadDataMainLocationState = atom({
  key: "payloadDataMainLocationState",
  default: {},
});

export const payloadDataCurrencyState = atom({
  key: "payloadDataCurrencyState",
  default: {},
});

export const payloadDataSubLocationState = atom({
  key: "payloadDataSubLocationState",
  default: {},
});
