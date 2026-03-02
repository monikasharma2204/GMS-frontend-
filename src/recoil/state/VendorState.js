
import { atom } from "recoil";

// FSM States: "initial" | "dirty" | "saved" | "editing"
export const vendorFSMState = atom({
  key: "vendorFSMState",
  default: "initial",
});

export const vendorOriginalDataState = atom({
  key: "vendorOriginalDataState",
  default: null,
});

export const vendorFormDataState = atom({
  key: "vendorFormDataState",
  default: null,
});
 
export const vendorDataState = atom({
  key: "vendorDataState",
  default:{}
})

export const vendorViewInfoState = atom({
  key: "vendorViewInfoState",
  default:{},
  // effects:[
  //   ({ setSelf, onSet }) => {
  //     onSet(newValue=>{
  //       console.log(newValue<"onset")
  //     })
  //   }
  // ]
})



export const enableEditState = atom({
  key: "enableEditState",
  default: true // Default to enabled for initial state
})

  
export const vendorInvoiceAddressListState = atom({
  key: "vendorInvoiceAddressState",
  default: [
    {
      company_name : "",
      tax_id : "",
      address: "",
      country: { code: "", label: "" },
      city: { code: "", label: "" },
      state: { code: "", label: "" },
      postcode: "",
    },
  ],
});

export const vendorShippingAddressListState = atom({
  key: "vendorShippingAddressListState",
  default: [
    {
      address: "",
      country: { code: "", label: "" },
      city: { code: "", label: "" },
      state: { code: "", label: "" },
      postcode: "",
    },
  ],
});


  export const vendorCountryState = atom({
  key: "vendorCountryState",
  default: { code: "", label: "" }
});

export const vendorStateState = atom({
  key: "vendorStateState",
  default: { code: "", label: "" }
});

export const vendorCityState = atom({
  key: "vendorCityState",
  default: { code: "", label: "" }
});


export const vendorInfoState = atom({
    key: "vendorInfoState",
    default: {
        _id : "",
        business_type : "corporation",
        vendor_code_id : "",
        vendor_code_name:"",
        account_status:"active",
        currency:"THB",
        contact_person:"",
        phone_no:"",
        email:"",
    }
  })


export const vendorListState = atom ({
  key : "vendorListState",
  default:false
})


  
export const vendorInfoIDState = atom({
  key: "vendorInfoIDState",
  default:""
})


export const vendorInfoCodeNameState = atom({
  key: "vendorInfoCodeNameState",
  default:false
})



export const vendorInfoCurrencyState = atom({
  key: "vendorInfoCurrencyState",
  default:"THB"
})


export const vendorInfoContactPersonState = atom({
  key: "vendorInfoContactPersonState",
  default:"THB"
})


export const vendorInfoPhoneNoState = atom({
  key: "vendorInfoPhoneNoState",
  default:""
})
export const vendorInfoEmailState = atom({
  key: "vendorInfoEmailState",
  default:""
})
export const invoiceDetailsState = atom({
  key: "invoiceDetailsState",
  default:""
})

export const viewVendorIdState = atom({
   key: "viewVendorIdState",
  default:""
})

export const vendorFieldErrorsState = atom({
  key: "vendorFieldErrorsState",
  default: {
    business_type: "",
    vendor_code_id: "",
    vendor_code_name: "",
    contact_person: "",
    phone_no: "",
    email: "",
    currency: "",
    invoice_address: "",
    shipping_address: "",
  }
})