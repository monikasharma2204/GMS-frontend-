import { atom } from "recoil";

export const CustomerListState = atom({
    key: "customerListState_PO_Vendor",
    default: [],
  });

  export const CustomerInvoiceAddressState = atom({
    key: "customerInvoiceAddressState_PO_Vendor",
    default: [{code: "", label: ""}]
  })

  export const SelectedInvoiceAddressState = atom({
    key: "selectedInvoiceAddressState_PO_Vendor",
    default: null
  })




  


  export const CustomerShippingAddressState =  atom({
    key: "customerShippingAddressState_PO_Vendor",
    default: [{code: "", label: ""}]
  })
  
  export const tableRowsState = atom({
    key: "tableRowsState_PO_Vendor",
    default: [
      {
        account: "New Item 1",
        stone: "",
        shape: "",
        size: "",
        color: "",
        cutting: "",
        quality: "",
        clarity: "",
        cerType: "",
        certificateNumber: "",
        pcs: 0,
        weight: 0,
        price: 0,
        unit: "",
        amount: 0,
        discountPercentage: 0,
        discountAmount: 0,
        totalAmount: 0,
        "Ref No.": "",
        labour: "",
        description: "",
      },
    ], // Default value is an empty array
  });

  export const tableRowsDropdownData = atom({
    key: 'tableRowsDropdownData_PO_Vendor',
    default: [], // Default value is an empty array
  });
