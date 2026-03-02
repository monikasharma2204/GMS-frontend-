import { atom } from "recoil";

export const CustomerListState = atom({
    key: "customerListStateMI_Vendor",
    default: [],
  });

  export const CustomerInvoiceAddressState = atom({
    key: "customerInvoiceAddressStateMI_Vendor",
    default: [{code: "", label: ""}]
  })




  


  export const CustomerShippingAddressState =  atom({
    key: "customerShippingAddressStateMI_Vendor",
    default: [{code: "", label: ""}]
  })
  
  export const tableRowsState = atom({
    key: "tableRowsStateMI",
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
    key: 'tableRowsDropdownDataMI_Vendor',
    default: [], // Default value is an empty array
  });
