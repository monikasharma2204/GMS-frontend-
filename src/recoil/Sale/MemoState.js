import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStateSA",
    default: false
  });

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStateSA",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStateSA",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStateSA",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStateSA",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStateSA",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStateSA",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStateSA",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStateSA",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStateSA",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStateSA",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStateSA",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStateSA",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStateSA",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStateSA",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStateSA",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStateSA",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStateSA",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStateSA",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStateSA",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStateSA",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStateSA",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStateSA",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateSA",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStateSA",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStateSA",
  default: false
})


export const memoInfoState = atom({
  key: "memoInfoStateSA",
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
  key : "memoItemStateSA",
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
  key:"grandTotalStateSA",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStateSA",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStateSA",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStateSA",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStateSA",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStateSA",
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