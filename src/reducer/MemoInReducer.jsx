import {
  initialData,
  initialData2,
  initialState,
  newAddTemplate,
} from "../component/Memo/Data.jsx";


export const memoInReducer = (state, action) => {

  switch (action.type) {
    case "TOGGLE_ITEM": {
      const exists = state.selectedItems.some(
        (item) => item.account === action.payload.account
      );
      return {
        ...state,
        selectedItems: exists
          ? state.selectedItems.filter(
            (item) => item.account !== action.payload.account
          )
          : [...state.selectedItems, action.payload],
      };
    }
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload };
    case "OPEN_MODAL_PO":
      return { ...state, openModalPO: true };
    case "CLOSE_MODAL_PO":
      return { ...state, openModalPO: false };
    case "OPEN_MODAL_Memo":
      return { ...state, openModalMemo: true };
    case "CLOSE_MODAL_Memo":
      return { ...state, openModalMemo: false };
    case "ADD_ROW": {
      let newItemIndex = 1;
      let newName = `New Item ${newItemIndex}`;

      while (state.selectedItems.some((item) => item.account === newName)) {
        newItemIndex++;
        newName = `New Item ${newItemIndex}`;
      }

      const newSelectBox = {
        ...newAddTemplate,
        account: newName,
        type: "select",
      };
      return {
        ...state,
        selectedItems: [...state.selectedItems, newSelectBox],
      };
    }
    case "DELETE_ITEM":
      return {
        ...state,
        selectedItems: state.selectedItems.filter(
          (item) => item.account !== action.payload
        ),
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        selectedItems: state.selectedItems.map((item, idx) =>
          idx === action.payload.index
            ? { ...item, [action.payload.field]: action.payload.value }
            : item
        ),
      };
    case "TOGGLE_DISCOUNT_PERCENT":
      return {
        ...state,
        useDiscountPercent: action.payload,
        discountPercent: action.payload ? state.discountPercent : 0,
        useDiscountAmount: false,
        discountAmount: 0,
      };
    case "TOGGLE_DISCOUNT_AMOUNT":
      return {
        ...state,
        useDiscountAmount: action.payload,
        discountAmount: action.payload ? state.discountAmount : 0,
        useDiscountPercent: false,
        discountPercent: 0,
      };
    case "SET_DISCOUNT_PERCENT":
      return {
        ...state,
        discountPercent: action.payload,
      };
    case "SET_DISCOUNT_AMOUNT":
      return {
        ...state,
        discountAmount: action.payload,
      };
    case "TOGGLE_VAT":
      return {
        ...state,
        useVAT: action.payload,
        vatAmount: action.payload ? state.vatAmount : 0,
      };
    case "SET_VAT_AMOUNT":
      return {
        ...state,
        vatAmount: action.payload,
      };
    case "SET_OTHER_CHARGE":
      return {
        ...state,
        otherCharge: action.payload,
      };
    case "TOGGLE_ALL_ITEMS_PO":
      return {
        ...state,
        selectedItems: action.payload ? initialData : [],
      };
    case "TOGGLE_ALL_ITEMS_MEMO":
      return {
        ...state,
        selectedItems: action.payload ? initialData2 : [],
      };
    default:
      return state;
  }
}