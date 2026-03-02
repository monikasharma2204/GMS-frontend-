export const validateAccountFields = (vendorData, invoiceAddressList = []) => {
  const errors = {};
  const invalidFields = [];


  if (!vendorData.business_type || (vendorData.business_type !== "corporation" && vendorData.business_type !== "personal")) {
    errors.business_type = "Business Type is required.";
    invalidFields.push("Business Type");
  }

  if (!vendorData.vendor_code_id || vendorData.vendor_code_id.trim() === "") {
    errors.vendor_code_id = "ID is required.";
    invalidFields.push("ID");
  }


  if (!vendorData.vendor_code_name || vendorData.vendor_code_name.trim() === "") {
    errors.vendor_code_name = "Code Name is required.";
    invalidFields.push("Code Name");
  }


  if (!vendorData.contact_person || vendorData.contact_person.trim() === "") {
    errors.contact_person = "Contact Person is required.";
    invalidFields.push("Contact Person");
  }

  if (!vendorData.phone_no || vendorData.phone_no.trim() === "") {
    errors.phone_no = "Phone Number is required.";
    invalidFields.push("Phone Number");
  }


  if (!vendorData.email || vendorData.email.trim() === "") {
    errors.email = "Email is required.";
    invalidFields.push("Email");
  } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
    errors.email = "Email is invalid.";
    invalidFields.push("Email");
  }


  if (!vendorData.currency || vendorData.currency.trim() === "") {
    errors.currency = "Currency is required.";
    invalidFields.push("Currency");
  }

  if (!invoiceAddressList || invoiceAddressList.length === 0) {
    errors.invoice_address = "At least one Invoice Address is required.";
    invalidFields.push("Invoice Address");
  } else {
 
    invoiceAddressList.forEach((addr, index) => {
      const prefix = `invoice_address_${index}`;
      
      if (!addr.company_name || addr.company_name.trim() === "") {
        errors[`${prefix}_company_name`] = "Company Name is required.";
        if (!invalidFields.includes("Company Name")) {
          invalidFields.push("Company Name");
        }
      }

      if (!addr.tax_id || addr.tax_id.trim() === "") {
        errors[`${prefix}_tax_id`] = "Tax ID is required.";
        if (!invalidFields.includes("Tax ID")) {
          invalidFields.push("Tax ID");
        }
      }

      if (!addr.address || addr.address.trim() === "") {
        errors[`${prefix}_address`] = "Address is required.";
        if (!invalidFields.includes("Address")) {
          invalidFields.push("Address");
        }
      }

      if (!addr.country || !addr.country.code || addr.country.code.trim() === "") {
        errors[`${prefix}_country`] = "Country is required.";
        if (!invalidFields.includes("Country")) {
          invalidFields.push("Country");
        }
      }

      if (!addr.state || !addr.state.code || addr.state.code.trim() === "") {
        errors[`${prefix}_state`] = "State/Province is required.";
        if (!invalidFields.includes("State/Province")) {
          invalidFields.push("State/Province");
        }
      }

      if (!addr.city || !addr.city.code || addr.city.code.trim() === "") {
        errors[`${prefix}_city`] = "City is required.";
        if (!invalidFields.includes("City")) {
          invalidFields.push("City");
        }
      }

      if (!addr.postcode || addr.postcode.trim() === "") {
        errors[`${prefix}_postcode`] = "Postcode is required.";
        if (!invalidFields.includes("Postcode")) {
          invalidFields.push("Postcode");
        }
      }
    });
  }

  if (!vendorData.shipping_address || vendorData.shipping_address.length === 0) {
    errors.shipping_address = "At least one Shipping Address is required.";
    invalidFields.push("Shipping Address");
  }

  return {
    isValid: invalidFields.length === 0,
    errors,
    invalidFields,
    warningText: invalidFields.length > 0 
      ? `Please fill all required fields: ${invalidFields.join(", ")}`
      : ""
  };
};

