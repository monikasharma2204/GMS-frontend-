import { atom } from "recoil";

export const receivableFSMState = atom({
  key: "receivableFSMState",
  default: "initial",
});

export const receivableOriginalDataState = atom({
  key: "receivableOriginalDataState",
  default: null,
});

export const receivableFormDataState = atom({
  key: "receivableFormDataState",
  default: {
    receivableNo: "",
    docDate: null,
    account: null,
    ref1: "",
    ref2: "",
    currency: "",
    exchangeRate: 1,
    note: "",
    items: [],
    paymentMethods: {
      cash: { amount: 0, note: "" },
      bankTransfer: { amount: 0, note: "", slip_image: null },
      creditCard: { amount: 0, note: "" },
      other: { amount: 0, note: "" },
    }
  },
});

export const daybookOpenState = atom({
  key: "daybookOpenState",
  default: false,
});

export const outstandingModalOpenState = atom({
  key: "outstandingModalOpenState",
  default: false,
});

export const receivableValidationErrorState = atom({
  key: "receivableValidationErrorState",
  default: null,
});

export const bankImageModalOpenState = atom({
  key: "bankImageModalOpenState",
  default: false,
});

export const payableFSMState = atom({
  key: "payableFSMState",
  default: "initial",
});

export const payableOriginalDataState = atom({
  key: "payableOriginalDataState",
  default: null,
});

export const payableFormDataState = atom({
  key: "payableFormDataState",
  default: {
    payableNo: "",
    docDate: null,
    account: null,
    ref1: "",
    ref2: "",
    currency: "",
    currencyId: "",
    exchangeRate: 1,
    note: "",
    items: [],
    paymentMethods: {
      cash: { amount: 0, note: "" },
      bankTransfer: { amount: 0, note: "", slip_image: null },
      creditCard: { amount: 0, note: "" },
      other: { amount: 0, note: "" },
    }
  },
});

export const payableDaybookOpenState = atom({
  key: "payableDaybookOpenState",
  default: false,
});

export const payableOutstandingModalOpenState = atom({
  key: "payableOutstandingModalOpenState",
  default: false,
});

export const payableValidationErrorState = atom({
  key: "payableValidationErrorState",
  default: null,
});

export const payableBankImageModalOpenState = atom({
  key: "payableBankImageModalOpenState",
  default: false,
});
