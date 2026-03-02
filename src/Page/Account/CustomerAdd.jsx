import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterVendor";
import AccountCustomerHeader from "../../component/Account/AccountCustomerHeader"
import SearchBar from "../../component/Account/SearchBar";
import AccountCustomerBodyAdd from "../../component/Account/AccountCustomerBodyAdd"
import { useParams } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { vendorDataState, enableEditState, vendorViewInfoState, vendorInvoiceAddressListState, vendorShippingAddressListState, vendorInfoState } from "recoil/state/VendorState";
const CustomerAdd = () => {

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

    const [selectedShippingCity, setSelectedShippingCity] = useState(null);
    const [selectedShippingState, setSelectedShippingState] = useState(null);
    const [selectedShippingCountry, setSelectedShippingCountry] = useState(null);
    
  
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
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <AccountCustomerHeader/>
            <AccountCustomerBodyAdd method={action} 
                {...{
                  selectedCountry,
                  selectedShippingCountry,
                  selectedCity,
                  selectedShippingCity,
                  selectedState,
                  selectedShippingState,
                  setSelectedCity,
                  setSelectedShippingCity,
                  setSelectedCountry,
                  setSelectedShippingCountry,
                  setSelectedState,
                  setSelectedShippingState,
                }}
                />
          </Box>
          <SearchBar base_url="account/customer" list_url="account/customer/list"/>
        </Box>
        <Footer account_type="customer" 
        type="add_customer"
            {...{ selectedCountry, selectedCity, selectedState ,selectedShippingCountry , selectedShippingState , selectedShippingCity}}/>
      </Box>
    </Box>
  );
};

export default CustomerAdd;
