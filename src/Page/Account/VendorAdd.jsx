import React, { useState, useEffect } from "react";
import useEffectOnce from "../../hooks/useEffectOnce";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterVendor";
import AccountHeaderVendor from "../../component/Account/AccountVendorHeader";
import SearchBar from "../../component/Account/SearchBar";
import AccountVendorBodyVendor from "../../component/Account/AccountVendorBody";
import AccountVendorBodyAdd from "../../component/Account/AccountVendorBodyAdd";
import { useRecoilState, useResetRecoilState } from "recoil";
import { vendorDataState, enableEditState, vendorViewInfoState, vendorInvoiceAddressListState, vendorShippingAddressListState, vendorInfoState } from "recoil/state/VendorState";
import { useParams } from "react-router-dom";

const VendorAdd = () => {
  const { action } = useParams();
  
  // Reset key vendor-related states to clear any previous data
  const resetVendorData = useResetRecoilState(vendorDataState);
  const resetVendorViewInfo = useResetRecoilState(vendorViewInfoState);
  const resetVendorInvoiceAddress = useResetRecoilState(vendorInvoiceAddressListState);
  const resetVendorShippingAddress = useResetRecoilState(vendorShippingAddressListState);
  const resetVendorInfo = useResetRecoilState(vendorInfoState);
  
  const [editStatus, setEditStatus] = useRecoilState(enableEditState);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    // Clear key vendor states and set edit mode
    resetVendorData();
    resetVendorViewInfo();
    resetVendorInvoiceAddress();
    resetVendorShippingAddress();
    resetVendorInfo(); // This is crucial - resets the main vendor info that populates the form
    setEditStatus(true);
  }, [resetVendorData, resetVendorViewInfo, resetVendorInvoiceAddress, resetVendorShippingAddress, resetVendorInfo]);

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <div className="vendor_page">
        <Box
          sx={{ marginLeft: "222px", Height: "100vh ", paddingBottom: "130px" }}
        >
          <Header />
          <Box sx={{ display: "flex" }}>
            <Box>
              <AccountHeaderVendor />
              <AccountVendorBodyAdd
                method={action}
                {...{
                  selectedCountry,
                  selectedCity,
                  selectedState,
                  setSelectedCity,
                  setSelectedCountry,
                  setSelectedState,
                }}
              />
            </Box>
            <SearchBar
              base_url="account/vendor"
              list_url="account/vendor/list"
            />
          </Box>
          <Footer
            account_type="vendor"
            type="add_vendor"
            {...{ selectedCountry, selectedCity, selectedState }}
          />
        </Box>
      </div>
    </Box>
  );
};

export default VendorAdd;
