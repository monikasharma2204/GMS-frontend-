import { atom } from "recoil";

export const editMemoState = atom({
  key: "editMemoStateLD",
  default: false
});

export const memoInfoState = atom({
  key: "memoInfoStateLD",
  default:{
    account: {
      label :"",
      code : ""
    },
    invoice_no: "",
    currency: "",
    inventory_type: 'load',
    doc_date: "",
    due_date: "",
    exchange_rate: "",
    ref_1: "",
    ref_2: "",
    remark: "",
    note: "",
  }
})

export const memoItemState = atom({
  key : "memoItemStateLD",
  default : [{
    _id: "",
    pu_id: "",
    pu_item_id: "",
    pu_no: "",
    stone_code: "",
    location: "",
    stone: "",
    shape: "",
    size: "",
    color: "",
    cutting: "",
    quality: "",
    clarity: "",
    cer_type: "",
    cer_no: "",
    lot_no: "",
    pcs: "",
    weight_per_piece: "",
    weight: "",
    price: "",
    unit: "",
    amount: "",
    remark: "",
    discount_percent: 0,
    discount_amount: 0,
    totalAmount: "",
    labour: "",
    labour_price: 0,
    stock_price: "",
    stock_unit: "cts",
    stock_amount: 0,
    sale_price: "",
    sale_unit: "cts",
    sale_amount: 0,
    isFromPU: false,
    doc_date: "",
    vendor_code_id: "",
    currency: "",
    stone_master: null,
    shape_master: null,
    size_master: null,
    color_master: null,
    quality_master: null,
    clarity_master: null,
  }]
})

export const grandTotalState = atom({
  key:"grandTotalStateLD",
  default:Number(0.00),
})

export const totalAfterDiscountState =  ({
  key : "totalAfterDiscountStateLD",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateLD",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "choosenMemoInfoStateLD",
  default: false
})

export const choosenMemoItemState =  ({
  key : "choosenMemoItemStateLD",
  default: false
})

export const originalPUDataState = atom({
  key: "originalPUDataStateLD",
  default: []
});

export const selectedPUItemsState = atom({
  key: "selectedPUItemsStateLD", 
  default: []
});
