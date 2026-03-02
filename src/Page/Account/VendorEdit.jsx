import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMain";
import AccountVendorHeaderEdit from "../../component/Account/AccountVendorHeaderEdit";
import SearchBar from "../../component/Account/SearchBar";
import AccountVendorBodyAdd from "../../component/Account/AccountVendorBodyAdd";
import { useRecoilState, useRecoilValue, RecoilRoot, useRecoilRefresher_UNSTABLE } from "recoil";
import { vendorDataState, vendorShippingAddressListState, vendorInvoiceAddressListState, vendorInfoIDState, vendorViewInfoState ,vendorCountryState , vendorStateState , vendorCityState} from "recoil/state/VendorState";
import { VendorDataSelector } from "recoil/selector/VendorSelector";
import apiRequest from "../../helpers/apiHelper";
import useEffectOnce from "../../hooks/useEffectOnce";
import { useNavigate} from 'react-router-dom'
import {  enableEditState } from "recoil/state/VendorState";

import { showConfirmModalState, confirmValueState, successModalState, successValueState, failedValueState, failedModalState } from "recoil/DialogState";
import { activeSaveButtonState, activeEditButtonState } from "recoil/ButtonState";

const VendorEdit = () => {
  const { id } = useParams();
const navigation = useNavigate();
    const [editStatus, setEditStatus] = useRecoilState(enableEditState);
     const [selectedCity, setSelectedCity] = useState(null);
        const [selectedState, setSelectedState] = useState(null);
        const [selectedCountry, setSelectedCountry] = useState(null);
    
        const [selectedShippingCity, setSelectedShippingCity] = useState(null);
        const [selectedShippingState, setSelectedShippingState] = useState(null);
        const [selectedShippingCountry, setSelectedShippingCountry] = useState(null);
  // let _id = id?id:""
  const [vendorId, setVendorId] = useState(false);
  // const [vendorInfoID,setVendorInfoID] = useRecoilState(vendorInfoIDState)




  const [activeSaveButton, setActiveSaveButton] = useRecoilState(activeSaveButtonState);
  const [activeEditButton, setActiveEditButton] = useRecoilState(activeEditButtonState);
  const [vendorViewInfo, setVendorViewInfo] = useRecoilState(vendorViewInfoState)
  const [vendorListAddress, setVendorListAddress] = useRecoilState(vendorInvoiceAddressListState);
  const [vendorListShippingAddress, setVendorListShippingAddress] = useRecoilState(vendorShippingAddressListState);
  const [countryList,setCountryList] = useRecoilState(vendorCountryState);
  const [stateList,setStateList] = useRecoilState(vendorStateState);
  const [cityList, setCityList] = useRecoilState(vendorCityState);


  const [openConfirm, setOpenConfirm] = useRecoilState(showConfirmModalState);
  const [openSuccess, setOpenSuccess] = useRecoilState(successModalState);
  const [openUnsuccess, setOpenUnsuccess] = useRecoilState(failedModalState);
  const [confirmValue, setConfirmValue] = useRecoilState(confirmValueState)


  const [vendorData, setVendorData] = useRecoilState(VendorDataSelector)



  const handleConfirmClose = () => {

    setConfirmValue(false)
    setOpenConfirm(false)
    setOpenSuccess(false)
    setOpenUnsuccess(false)
    // setTimeout(()=>{
    // window.location.reload()
    // },100)
  }

  const handleCancelEdit = () => {
    // Reset edit status to false (disable all fields)
    setEditStatus(false);
    // Navigate back to vendor list page to clear all data
    navigation('/account/vendor');
  }

  const handleClick = async (id) => {
    setOpenConfirm(true)

    
    // Merge selected location states into vendorData before sending      yha  ek se jada  address ho skte h   to 0 index  fix nhi krna muje 
    const updatedVendorData = {
      ...vendorData,
      type: "account_infomation",
      _id: id,
      invoice_address: vendorListAddress && vendorListAddress.length > 0 ? 
        vendorListAddress
       : [],
      shipping_address: vendorListShippingAddress && vendorListShippingAddress.length > 0 ? vendorListShippingAddress : [],
    };

    setVendorData(updatedVendorData)

    setConfirmValue(true)
    if (confirmValue) {
      const update = await apiRequest("PUT", "/account/vendor", updatedVendorData)

      if (update.code == 200) {
        setOpenConfirm(false)
        setOpenSuccess(true)
        setConfirmValue(false)
        setTimeout(() => {
          setOpenSuccess(false)
           navigation('/account/vendor')
          window.location.reload();
        }, 500)
      } else {
        setOpenConfirm(false)
        setOpenUnsuccess(true)
      }

    }
  }


  const clearVendorData = useRecoilRefresher_UNSTABLE(vendorData)
  const clearVendorListAddress = useRecoilRefresher_UNSTABLE(vendorListAddress)
  const clearVendorViewInfo = useRecoilRefresher_UNSTABLE(vendorViewInfo)

  const getVendor = async (id) => {
    console.log(id)
    if (!id) {
      return false;
    }
    const vendor_info_data = await apiRequest("GET", "/account/vendor/get-info?_id=" + id);

  setVendorViewInfo(vendor_info_data)
  setVendorListAddress(vendor_info_data.invoice_address)
  setVendorListShippingAddress(vendor_info_data.shipping_address)
  setVendorData(vendor_info_data)

  // Set selected location states based on first invoice and shipping address
  if (vendor_info_data.invoice_address && vendor_info_data.invoice_address.length > 0) {
    const firstInvoice = vendor_info_data.invoice_address[0];
    setSelectedCountry(firstInvoice.country || null);
    setSelectedState(firstInvoice.state || null);
    setSelectedCity(firstInvoice.city || null);
  }
  if (vendor_info_data.shipping_address && vendor_info_data.shipping_address.length > 0) {
    const firstShipping = vendor_info_data.shipping_address[0];
    setSelectedShippingCountry(firstShipping.country || null);
    setSelectedShippingState(firstShipping.state || null);
    setSelectedShippingCity(firstShipping.city || null);
  }
}

useEffect(()=>{
  console.log('dd')
  if(id){
    setVendorId(id)
    getVendor(vendorId)
    setEditStatus(false)  // Set edit mode false initially, user must click Edit button
  } else {
    setEditStatus(false)
  }
},[vendorId,id])

  useEffectOnce(() => {

  })

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <div className="vendor_page">

            <Box>

              <AccountVendorHeaderEdit />
              <AccountVendorBodyAdd   method={id}
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
                }} />
            </Box>
          </div>

          <SearchBar base_url="account/vendor" list_url="account/vendor/list" />
        </Box>
        <Footer   account_type="vendor"   type= "account_infomation"  {...{ selectedCountry, selectedCity, selectedState }} onClick={() => { handleClick(id) }} handlePost={() => { handleClick(id) }} handleConfirmClose={handleConfirmClose} onCancelEdit={handleCancelEdit} />
      </Box>
    </Box>
  );
};

export default VendorEdit;
