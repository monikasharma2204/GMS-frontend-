import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStatePU",
    default: false
  });

export const isApprovedState = atom({
  key: "isApprovedStatePU",
  default: false
});

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStatePU",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStatePU",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStatePU",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStatePU",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStatePU",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStatePU",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStatePU",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStatePU",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStatePU",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStatePU",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStatePU",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStatePU",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStatePU",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStatePU",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStatePU",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStatePU",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStatePU",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStatePU",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStatePU",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStatePU",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStatePU",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStatePU",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStatePU",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStatePU",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStatePU",
  default: false
})

export const memoInfoState = atom({
  key: "memoInfoStatePU",
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
  key : "memoItemStatePU",
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
  key:"grandTotalStatePU",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStatePU",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStatePU",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStatePU",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStatePU",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStatePU",
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