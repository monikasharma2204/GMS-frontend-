import { atom } from "recoil";

export const QuotationListState = atom({
    key: "customerListStateMI",
    default: [],
  });

  export const QuotationInvoiceAddressState = atom({
    key: "customerInvoiceAddressStateMI",
    default: [{code: "", label: ""}]
  })

  export const QuotationSelectedInvoiceAddressState = atom({
    key: "selectedInvoiceAddressStateMI",
    default: null
  })




  
  export const QuotationShippingAddressState =  atom({
    key: "customerShippingAddressStateMI",
    default: [{code: "", label: ""}]
  })

  export const useQuotationAccountState = atom ({
    key :"quotationAcountDetailsMI",
    default:null
  })
  
  export const QuotationtableRowsState = atom({
    key: "tableRowsStateMIP",
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
    key: 'tableRowsDropdownDataMI',
    default: [], // Default value is an empty array
  });

  export const DayBookQuotationState = atom({
    key: "dayBookQuotationStateMI",
    default: null,
  });
