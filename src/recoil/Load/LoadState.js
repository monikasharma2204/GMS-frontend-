import { atom } from "recoil";

export const QuotationListState = atom({
  key: "customerListStateLD",
  default: [],
});

export const QuotationInvoiceAddressState = atom({
  key: "customerInvoiceAddressStateLD",
  default: [{code: "", label: ""}]
})

export const QuotationShippingAddressState =  atom({
  key: "customerShippingAddressStateLD",
  default: [{code: "", label: ""}]
})

export const useQuotationAccountState = atom ({
  key :"quotationAcountDetailsLD",
  default:null
})

export const QuotationtableRowsState = atom({
  key: "tableRowsStateLD",
  default: [
    {
      _id: "",
      pu_id: "",
      pu_item_id: "",
      pu_no: "",
      stone_code: "",
      location: "",
      stone: "",
      shape: "",
      size: "",
      color: "",
      cutting: "",
      quality: "",
      clarity: "",
      cer_type: "",
      cer_no: "",
      lot_no: "",
      pcs: "",
      weight_per_piece: "",
      weight: "",
      price: "",
      unit: "",
      amount: "",
      remark: "",
      discount_percent: 0,
      discount_amount: 0,
      totalAmount: "",
      labour: "",
      labour_price: 0,
      stock_price: "",
      stock_unit: "cts",
      stock_amount: 0,
      sale_price: "",
      sale_unit: "cts",
      sale_amount: 0,
      isFromPU: false,
      doc_date: "",
      vendor_code_id: "",
      currency: "",
      stone_master: null,
      shape_master: null,
      size_master: null,
      color_master: null,
      quality_master: null,
      clarity_master: null,
    }
  ]
})

export const DayBookQuotationState = atom({
  key: "dayBookQuotationStateLD",
  default: null
});

export const QuotationtableRowsDropdownData = atom({
  key: "quotationtableRowsDropdownDataLD",
  default: []
});
