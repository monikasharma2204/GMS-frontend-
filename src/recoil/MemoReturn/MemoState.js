import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStateMR",
    default: false
  });

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStateMR",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStateMR",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStateMR",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStateMR",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStateMR",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStateMR",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStateMR",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStateMR",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStateMR",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStateMR",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStateMR",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStateMR",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStateMR",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStateMR",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStateMR",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStateMR",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStateMR",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStateMR",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStateMR",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStateMR",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStateMR",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStateMR",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateMR",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStateMR",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStateMR",
  default: false
})

export const memoInfoState = atom({
  key: "memoInfoStateMR",
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
  key : "memoItemStateMR",
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
  key:"grandTotalStateMR",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStateMR",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStateMR",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStateMR",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStateMR",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStateMR",
  default: false
})

// Store original PU data for Load daybook to always show original values
export const originalPUDataState = atom({
  key: "originalPUDataStateMR",
  default: []
})

// Track PU items that are currently in unapproved Loads (to disable them in Purchase modal)
export const selectedPUItemsState = atom({
  key: "selectedPUItemsStateMR",
  default: []
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