import { selector } from "recoil";
import apiRequest from "helpers/apiHelper";


export const getMemoOutAccountInfo = selector({
    key: "getMemoOutAccountInfo",
    get: async () => {
        try {
            const response = await apiRequest("GET", `/account/customer/list`);
            if (!response || response.error) {
                throw new Error(response?.error || "Invalid response");
            }

            // Store the mapped response in a variable
            const customerInfo = Array.isArray(response)
                ? response
                    .filter((item) => item?.account_status === 'active') // Only show active accounts
                    .map((item) => ({
                        code: item?.vendor_code_id,
                        label: item?.vendor_code_name,
                        account_status: item?.account_status,
                        invoiceAddress: item?.invoice_address?.map((invoiceAddressItem) => ({
                            code: invoiceAddressItem?.postcode,
                            label: invoiceAddressItem?.address,
                            cityLabel: invoiceAddressItem?.city?.label || '',
                        })) || [],
                        shippingAddress: item?.shipping_address?.map((shippingAddressItem) => ({
                            code: shippingAddressItem?.postcode,
                            label: shippingAddressItem?.address,
                            cityLabel: shippingAddressItem?.city?.label || '',
                        })) || [],
                    }))
                : [];

            return customerInfo;
        } catch (error) {
            console.error("Error fetching customer info:", error);
            return [];
        }
    },
});