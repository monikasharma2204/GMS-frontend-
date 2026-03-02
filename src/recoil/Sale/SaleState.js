import { atom } from "recoil";

export const QuotationListState = atom({
    key: "customerListStateSA",
    default: [],
  });

  export const QuotationInvoiceAddressState = atom({
    key: "customerInvoiceAddressStateSA",
    default: [{code: "", label: ""}]
  })

  export const QuotationSelectedInvoiceAddressState = atom({
    key: "selectedInvoiceAddressStateSA",
    default: null
  })




  
  export const QuotationShippingAddressState =  atom({
    key: "customerShippingAddressStateSA",
    default: [{code: "", label: ""}]
  })

  export const QuotationSelectedShippingAddressState = atom({
    key: "selectedShippingAddressStateSA",
    default: null
  })

  export const useQuotationAccountState = atom ({
    key :"quotationAcountDetailsSA",
    default:null
  })
  
  export const QuotationtableRowsState = atom({
    key: "quotationTableRowsStateSA",
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
    key: "tableRowsDropdownDataSA",
    default: [], // Default value is an empty array
  });

  export const DayBookQuotationState = atom({
    key: "dayBookQuotationStateSA",
    default: null,
  });
