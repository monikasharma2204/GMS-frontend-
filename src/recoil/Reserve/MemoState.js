import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStateRE",
    default: false
  });

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStateRE",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStateRE",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStateRE",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStateRE",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStateRE",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStateRE",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStateRE",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStateRE",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStateRE",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStateRE",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStateRE",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStateRE",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStateRE",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStateRE",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStateRE",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStateRE",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStateRE",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStateRE",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStateRE",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStateRE",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStateRE",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStateRE",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateRE",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStateRE",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStateRE",
  default: false
})

export const memoInfoState = atom({
  key: "memoInfoStateRE",
  default:{
    account: {
      label :"",
      code : ""
    },
    invoice_no: "",
    currency: "",
    inventory_type: 'memo_in',
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
  key : "memoItemStateRE",
  default : [{
    amount:Number(0),
    location: '',
    stone: '',
    shape: '',
    size: '',
    color: '',
    cutting: '',
    quality: '',
    clarity: '',
    cer_type:'',
    cer_no:'',
    lot_no: '',
    pcs: Number(0),
    weight: Number(0.00),
    total_amount: Number(0.00),
    price: Number(0.00),
    discount_percent: Number(0),
    discount_amount: Number(0.00),
    labour_type: '',
    labour_unit:'',
    labour_price:  Number(0.00),
    other_price:  Number(0),
    unit_price:'pcs',
    ref_no:'',
    remark: '',
    status: 'active'
  }],
  effects: [
    ({onSet,setSelf}) => {
      onSet(v => {
        console.log(v,'onSet')
        const updatedArray = v.map((item,key) => {
          console.log(calculateAmountAfterDiscount(item),'updating item  '+key)
          console.log(item.discount_percent,'updating discount_percent ___ '+key)
          console.log(getPriceValueFromPercent( item.amount,item.discount_percent ),'getPriceValueFromPercent( item.amount,item.discount_percent )')
          return { ...item
            // ,
            //discount_amount:Math.ceil(getPriceValueFromPercent( item.amount,parseFloat(item.discount_percent)) ) 
          
          }
        }
        );
        setSelf(updatedArray);
     
        console.debug("Current value:", updatedArray);
      });




    },
  ],
})


export const grandTotalState = atom({
  key:"grandTotalStateRE",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStateRE",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStateRE",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStateRE",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStateRE",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStateRE",
  default: false
})



// export const addItem = atom({
  
// })

// export const removeItem = atom({

// })

// function replaceItemAtIndex(arr, index, newValue) {
//   return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
// }

// function removeItemAtIndex(arr, index) {
//   return [...arr.slice(0, index), ...arr.slice(index + 1)];
// }