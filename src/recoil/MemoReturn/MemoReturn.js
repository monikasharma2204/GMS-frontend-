import { atom } from "recoil";

export const QuotationListState = atom({
    key: "customerListStateMR",
    default: [],
  });

  export const QuotationInvoiceAddressState = atom({
    key: "customerInvoiceAddressStateMR",
    default: [{code: "", label: ""}]
  })

export const QuotationSelectedInvoiceAddressState = atom({
  key: "selectedInvoiceAddressStateMR",
  default: null
})




  
  export const QuotationShippingAddressState =  atom({
    key: "customerShippingAddressStateMR",
    default: [{code: "", label: ""}]
  })

  export const useQuotationAccountState = atom ({
    key :"quotationAcountDetailsMR",
    default:null
  })
  
  export const QuotationtableRowsState = atom({
    key: "tableRowsStateMR",
    default: [
      // {
      //   account: "New Item 1",
      //   stone: "",
      //   shape: "",
      //   size: "",
      //   color: "",
      //   cutting: "",
      //   quality: "",
      //   clarity: "",
      //   cerType: "",
      //   certificateNumber: "",
      //   weight_per_piece: 0,
      //   pcs: 0,
      //   weight: 0,
      //   price: 0,
      //   unit: "",
      //   amount: 0,
      //   discount_percent: 0,
      //   discount_amount: 0,
      //   totalAmount: 0,
      //   "Ref No.": "",
      //   labour: "",
      //   description: "",
      //   labour_price: 0,
      // },
    ], // Default value is an empty array
  });

  export const QuotationtableRowsDropdownData = atom({
    key: 'tableRowsDropdownDataMR',
    default: [], // Default value is an empty array
  });

  export const DayBookQuotationState = atom({
    key: "dayBookQuotationStateMR",
    default: null,
  });
