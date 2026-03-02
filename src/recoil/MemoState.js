import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStateQT",
    default: false
  });

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStateQT",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStateQT",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStateQT",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStateQT",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStateQT",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStateQT",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStateQT",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStateQT",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStateQT",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStateQT",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStateQT",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStateQT",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStateQT",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStateQT",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStateQT",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStateQT",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStateQT",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStateQT",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStateQT",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStateQT",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStateQT",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStateQT",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateQT",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStateQT",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStateQT",
  default: false
})

export const memoInfoState = atom({
  key: "memoInfoStateQT",
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
  key : "memoItemStateQT",
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
  key:"grandTotalStateQT",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStateQT",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStateQT",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStateQT",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStateQT",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStateQT",
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