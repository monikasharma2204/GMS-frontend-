import { atom } from "recoil";


export const companyProfileFSMState = atom({
  key: "companyProfileFSMState",
  default: "add",
});

export const companyProfileOriginalDataState = atom({
  key: "companyProfileOriginalDataState",
  default: null,
});

export const companyProfileFormDataState = atom({
  key: "companyProfileFormDataState",
  default: null,
});

