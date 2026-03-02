import {
  selector,
  DefaultValue,
  selectorFamily,
  useSetRecoilState,
} from "recoil";
import {
  vendorInvoiceAddressListState,
  vendorShippingAddressListState,
  vendorInfoState,
  vendorViewInfoState,
} from "recoil/state/VendorState";
import apiRequest from "helpers/apiHelper";

export const VendorDataSelector = selector({
  // get all of information including invoice detail
  key: "VendorSelector",
  get: ({ get }) => {
    return {
      ...get(vendorInfoState),
      invoice_address: get(vendorInvoiceAddressListState),
      shipping_address: get(vendorShippingAddressListState),
    };
  },
  set: ({ set, get }, newValue) => {
    switch (newValue.type) {
      case "account_infomation":
        const vendorInfoData = get(vendorInfoState);
        var obj = {};
        Object.keys(get(vendorInfoState)).map((v, k) => {
          obj[v] = vendorInfoData[v];
          if (newValue.hasOwnProperty(v)) {
            obj[v] = newValue[v];
          }
        });

        set(
          vendorInfoState,

          newValue instanceof DefaultValue ? obj : obj
        );
        break;
    }
  },
});

export const viewVendorInfo = selectorFamily({
  key: "viewVendorInfo",

  get:
    (id) =>
    async ({ get, set }) => {
      console.log(id);
      // if(id==""){
      //     return false;
      // }else{
      //     let vendorInfo = get(vendorViewInfoState)
      //     console.log(vendorInfo,'vendorInfo')
      //     const vendor_info_data = await apiRequest("GET","/account/vendor/get-info?_id="+id);
      //     if (vendor_info_data.error) {
      //         throw vendor_info_data.error;
      //       }
      //       vendorInfo = vendor_info_data;

      //     return vendorInfo

      // }
    },
});

export const getVendorInfo = selector({
  key: "getVendorInfo",
  get: async () => {
    try {
      const response = await apiRequest("GET", `/account/vendor/list`);
      if (!response || response.error) {
        throw new Error(response?.error || "Invalid response");
      }

      const vendorInfo = response
        ? response
            .filter((item) => item?.account_status === 'active') // Only show active accounts
            .map((item) => ({
              code: item?.vendor_code_id,
              label: item?.vendor_code_name,
              id: item?._id || item?.id,
              _id: item?._id || item?.id,
              account_status : item?.account_status, 
              invoiceAddress:
                item?.invoice_address?.map((invoiceAddressItem) => ({
                  code: invoiceAddressItem?.postcode,
                  label: invoiceAddressItem?.address,
                  cityLabel: invoiceAddressItem?.city?.label || '',
                })) || [],
              // shippingAddress:
              //   item?.vendor_shipping_address_list?.map(
              //     (shippingAddressItem) => ({
              //       code: shippingAddressItem?.postcode,
              //       label: shippingAddressItem?.address,
              //     })
              //   ) || [],
            }))
        : [];
      return vendorInfo;
    } catch (error) {
      console.error("Error fetching vendor info:", error);
      return [];
    }
  },
});
