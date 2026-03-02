import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStateMI",
    default: false
  });

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStateMI",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStateMI",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStateMI",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStateMI",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStateMI",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStateMI",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStateMI",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStateMI",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStateMI",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStateMI",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStateMI",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStateMI",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStateMI",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStateMI",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStateMI",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStateMI",
  default:Number(0.00)
})



export const useVATState = atom ({
  key : "useVATStateMI",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStateMI",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStateMI",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStateMI",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStateMI",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStateMI",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStateMI",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStateMI",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStateMI",
  default: false
})

export const memoInfoState = atom({
  key: "memoInfoStateMI",
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
  key : "memoItemStateMI",
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
  key:"grandTotalStateMI",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStateMI",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStateMI",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStateMI",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStateMI",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStateMI",
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