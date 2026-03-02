import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStateMO",
    default: false
  });

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStateMO",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStateMO",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStateMO",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStateMO",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStateMO",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStateMO",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStateMO",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStateMO",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStateMO",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStateMO",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStateMO",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStateMO",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStateMO",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStateMO",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStateMO",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStateMO",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStateMO",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStateMO",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStateMO",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStateMO",
  default: Number(0.00)
})

export const selectedMemoOutItemState = atom({
  key: "selectedMemoOutItemStateMO",
  default: null,
})

export const otherChargeState = atom ({
  key : "otherChargeStateMO",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStateMO",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateMO",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStateMO",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStateMO",
  default: false
})



export const memoInfoState = atom({
  key: "memoInfoStateMO",
  default:{
    account: {
      label :"",
      code : ""
    },
    invoice_no: "",
    currency: "",
    inventory_type: 'memo_out',
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
  key : "memoItemStateMO",
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
  key:"grandTotalStateMO",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStateMO",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStateMO",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStateMO",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStateMO",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStateMO",
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