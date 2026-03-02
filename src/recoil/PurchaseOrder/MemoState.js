import { atom, selector } from "recoil";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getAmount,calculateAmountAfterDiscount} from "helpers/priceHelper";
export const editMemoState = atom({
    key: "editMemoStatePO",
    default: false
  });

export const isApprovedState = atom({
  key: "isApprovedStatePO",
  default: false
});

export const checkViewEditDayBookInvoiceState = atom({
  key : "checkViewEditDayBookInvoiceStatePO",
  default:""
})


export const memoPendingListState = atom({
  key : "memoPendingListStatePO",
  default:[]
})
export const memoPendingListSelectedItemState = atom({
  key : "memoPendingListSelectedItemStatePO",
  default:false
})

export const currentPendingListSelectedItemState = atom({
  key : "currentPendingListSelectedItemStatePO",
  default:[]
})

export const memoPendingIdListSelectedItemState = atom({
  key : "memoPendingIdListSelectedItemStatePO",
  default:[]
})

export const openModalMemoPendingOrderState = atom ({
  key:"openModalMemoPendingOrderStatePO",
  default:false
})



export const dayBookInventoryDataState = atom({
  key: "dayBookInventoryDataStatePO",
  default:false
})

export const subTotalState = atom({
  key: "subTotalStatePO",
  default:false
})

export const keyEditState = atom({
  key: "keyEditStatePO",
  default:true
})

export const useDiscountPercentState = atom ({
  key : "useDiscountPercentStatePO",
  default : false
})

export const useDiscountAmountState = atom ({
  key : "useDiscountAmountStatePO",
  default : false
})



export const selectedCurrencyState = atom ({
  key : "selectedCurrencyStatePO",
  default:"THB"
})

export const discountPercentState = atom ({
  key : "discountPercentStatePO",
  default:Number(0.00)
})
export const discountPercentAmountState = atom ({
  key : "discountPercentAmountStatePO",
  default:Number(0.00)
})

export const discountAmountState  = atom ({
  key : "discountAmountStatePO",
  default:Number(0.00)
})


export const currentDiscountValueState  = atom ({
  key : "currentDiscountValueStatePO",
  default:Number(0.00)
})







export const useVATState = atom ({
  key : "useVATStatePO",
  default:false
})
export const vatPercentState = atom ({
  key : "vatPercentStatePO",
  default:Number(0.00)
})


export const vatAmountState = atom ({
  key : "vatAmountStatePO",
  default:Number(0.00)
})

export const discountAmountTotalState = atom ({
  key : "discountAmountTotalStatePO",
  default: Number(0.00)
})

export const otherChargeState = atom ({
  key : "otherChargeStatePO",
  default: Number(0.00)
})

export const totalAfterDiscountState = atom ({
  key : "totalAfterDiscountStatePO",
  default: Number(0.00)
})


export const currentAccountSelectionState = atom ({
  key : "currentAccountSelectionStatePO",
  default: false
})

export const choosenMemoInfoState = atom ({
  key : "currentMemoInfoStatePO",
  default: false
})

export const choosenMemoItemState = atom ({
  key : "choosenMemoItemStatePO",
  default: false
})

export const memoInfoState = atom({
  key: "memoInfoStatePO",
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
  key : "memoItemStatePO",
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
  key:"grandTotalStatePO",
  default:Number(0.00),
})




export const openModalPurchaseOrderState = atom ({
  key : "openModalPurchaseOrderStatePO",
  default: false
})

export const purchaseOrderListState = atom ({
  key : "purchaseOrderListStatePO",
  default: false
})

export const purchaseOrderIdListSelectedItemState = atom ({
  key : "purchaseOrderIdListSelectedItemStatePO",
  default: []
})


export const currentPurchaseOrderListSelectedItemState = atom ({
  key : "currentPurchaseOrderListSelectedItemStatePO",
  default: false
})

export const purchaseOrderSelectedListState = atom ({
  key : "purchaseOrderSelectedListStatePO",
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