import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import "../../Assets/font/font.css";

import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMain";
import PictureProfileImport from "../../component/CompanyProfile/ProfilePicture/PictureProfileImport";
import CompanyName from "../../component/CompanyProfile/GeneralTitle/CompanyName";
import TaxID from "../../component/CompanyProfile/GeneralTitle/TaxID";
import MailingName from "../../component/CompanyProfile/GeneralTitle/MailingName";
import Website from "../../component/CompanyProfile/GeneralTitle/Website";
import Currency from "../../component/CompanyProfile/GeneralTitle/Currency";
import RadioOAGroup from "../../component/CompanyProfile/OfficialAddress/RadioOAGroup";
import Address from "../../component/CompanyProfile/AddressTitle/Address";
import Country from "../../component/CompanyProfile/AddressTitle/Country";
import City from "../../component/CompanyProfile/AddressTitle/City";
import StateProvince from "../../component/CompanyProfile/AddressTitle/StateProvince";
import Postcode from "../../component/CompanyProfile/AddressTitle/PostCode";
import ContactPersonName from "../../component/CompanyProfile/ContactTitle/ContactPersonName";
import Email from "../../component/CompanyProfile/ContactTitle/Email";
import PhoneNo from "../../component/CompanyProfile/ContactTitle/PhoneNo";
import CompanyProfileHeader from "component/CompanyProfile/CompanyProfileHeader";
import apiRequest from "../../helpers/apiHelper";
import { checkTaxId } from "../../helpers/numberHelper";

import { useRecoilState} from "recoil";
import {
  showConfirmModalState,
  confirmValueState,
  successModalState,
  successValueState,
  failedValueState,
  failedModalState,
} from "recoil/DialogState";

import { currencyState, isEditingState } from "recoil/state/CommonState";
import { companyProfileFSMState } from "recoil/state/CompanyProfileFSMState";
import {
  Country as CountryData,
  State as StateData,
  City as CityData,
} from "country-state-city";
import {API_URL} from "config/config.js";

const CompanyProfile = () => {

  const [currency, setCurrency] = useRecoilState(currencyState);
  const [openConfirm, setOpenConfirm] = useRecoilState(showConfirmModalState);
  const [openSuccess, setOpenSuccess] = useRecoilState(successModalState);
  const [openUnsuccess, setOpenUnsuccess] = useRecoilState(failedModalState);
  const [confirmValue, setConfirmValue] = useRecoilState(confirmValueState);
  const [isEditing, setIsEditing] = useRecoilState(isEditingState);
  const [fsmState, setFsmState] = useRecoilState(companyProfileFSMState);
  const [createNew, setCreateNew] = useState(false);

  

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textCompanyName, setTextCompanyName] = useState("");
  const [textTaxID, setTextTaxID] = useState("");
  const [textMailingName, setTextMailingName] = useState("");
  const [textWebsite, setTextWebsite] = useState("");
  const [textAddress, setTextAddress] = useState("");
  const [textPostcode, setTextPostcode] = useState("");
  const [textContactPersonName, setTextContactPersonName] = useState("");
  const [textEmail, setTextEmail] = useState("");
  const [textPhoneNo, setTextPhoneNo] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [officialAddress, setOfficialAddress] = useState("head_office");
  const [currencyInfo, setCurrencyInfo] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [imageUrlSaved, setImageUrlSaved] = useState("");
  const [companyId, setCompanyId] = useState("");
  

  // สถานะข้อผิดพลาด
  const [errors, setErrors] = useState({
    companyName: "",
    taxID: "",
    mailingName: "",
    currency: "",
    address: "",
    country: "",
    stateProvince: "",
    city: "",
    postcode: "",
    contactPersonName: "",
    email: "",
    phoneNo: "",
    branchCode: "",
    officialAddress: "",
    companyImage: "",
  });
  

  // ฟังก์ชันดึงข้อมูลบริษัท
  const getCompanyInfo = async () => {
    try {
      const companyInfoData = await apiRequest("GET", "/companyProfile");

      if(companyInfoData.key === "notFound"){

        setCreateNew(true);
        setIsEditing(true);
        setFsmState("add");
      }else{
        setCreateNew(false);
        setIsEditing(false);
        setFsmState("view"); 
      }

      setCompanyId(companyInfoData._id ||'');
      setTextCompanyName(companyInfoData.company_name);
      setTextTaxID(companyInfoData.tax_id);
      setTextMailingName(companyInfoData.mailing_name);
      setTextWebsite(companyInfoData.website);
      setTextAddress(companyInfoData.address);
      setCurrency(companyInfoData.currency);
      setTextPostcode(companyInfoData.postcode);
      setTextContactPersonName(companyInfoData.contact_person);
      setTextEmail(companyInfoData.email);
      setTextPhoneNo(companyInfoData.phone);
      setBranchCode(
        companyInfoData.branch_code ? companyInfoData.branch_code : ""
      );
      setOfficialAddress(companyInfoData.official_address);
      setCurrencyInfo(companyInfoData.currency);
      setImageUrlSaved(companyInfoData.image_logo_url);
      if (companyInfoData.image_logo_url!=="undefined"&&companyInfoData.image_logo_url!==undefined) {
        setImagePreview(
          `${API_URL}${companyInfoData.image_logo_url}`
        );
      }

      const selectedCountryObj = CountryData.getAllCountries().find(
        (country) =>
          (country.name ||"").toLowerCase() === (companyInfoData.country.label || "").toLowerCase()
      );
      
      setSelectedCountry(
        companyInfoData.country || null
      );

      let selectedStateObj = null;
      if (companyInfoData.state_province && selectedCountryObj) {
        selectedStateObj = StateData.getStatesOfCountry(
          selectedCountryObj.isoCode
        ).find(
          (state) =>
            state.name.toLowerCase() ===
            companyInfoData.state_province.label.toLowerCase()
        );
      }
      setSelectedState(
        companyInfoData.state_province || null
      );

      let selectedCityObj = null;
      if (companyInfoData.city && selectedCountryObj && selectedStateObj) {
        const allCities = CityData.getCitiesOfState(
          selectedCountryObj.isoCode,
          selectedStateObj.isoCode
        );
        selectedCityObj = allCities.find(
          (city) =>
            city.name.toLowerCase() === companyInfoData.city.label.toLowerCase()
        );
      }
      setSelectedCity(
        companyInfoData.city || null
      );

      // ดึงข้อมูลรัฐตามประเทศ
      if (selectedCountryObj) {
        const statesData = StateData.getStatesOfCountry(
          selectedCountryObj.isoCode
        ).map((state) => ({
          code: state.isoCode,
          label: state.name,
        }));
        setStates(statesData);
      }

      
      // ดึงข้อมูลเมืองตามประเทศและรัฐ
      if (selectedCountryObj && selectedStateObj) {
  
        const citiesData = CityData.getCitiesOfState(
          selectedCountryObj.isoCode,
          selectedStateObj.isoCode
        ).map((city) => ({
          code: city.name,
          label: city.name,
        }));
        setCities(citiesData);
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

 
  const hasAnyDataFilled = useCallback(() => {
    return !!(
      textCompanyName?.trim() ||
      textTaxID?.trim() ||
      textMailingName?.trim() ||
      textWebsite?.trim() ||
      currency ||
      textAddress?.trim() ||
      selectedCountry ||
      selectedState ||
      selectedCity ||
      textPostcode?.trim() ||
      textContactPersonName?.trim() ||
      textEmail?.trim() ||
      textPhoneNo?.trim() ||
      officialAddress?.trim() ||
      branchCode?.trim() ||
      image ||
      imagePreview
    );
  }, [
    textCompanyName,
    textTaxID,
    textMailingName,
    textWebsite,
    currency,
    textAddress,
    selectedCountry,
    selectedState,
    selectedCity,
    textPostcode,
    textContactPersonName,
    textEmail,
    textPhoneNo,
    officialAddress,
    branchCode,
    image,
    imagePreview,
  ]);

 
  const handleUserInput = useCallback(() => {
    if (fsmState === "add" || fsmState === "edit") {
      setFsmState("dirty");
    }
  }, [fsmState, setFsmState]);



  // ฟังก์ชันตรวจสอบข้อมูล
  const validateInputs = () => {
    const newErrors = {};

    if (!textCompanyName.trim()) {
      newErrors.companyName = "Company Name is required.";
    }

    if (!textTaxID.trim()) {
      newErrors.taxID = "Tax ID is required.";
    } else if (textTaxID.length > 18) {
      newErrors.taxID = "Tax ID cannot be more than 18 digits.";
    }

    if (!textMailingName.trim()) {
      newErrors.mailingName = "Mailing Name is required.";
    }

    if (!currency) {
      newErrors.currency = "Currency is required.";
    }

    if (!textAddress.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!selectedCountry) {
      newErrors.country = "Country is required.";
    }

    if (!selectedState) {
      newErrors.stateProvince = "State/Province is required.";
    }

    if (!selectedCity) {
      newErrors.city = "City is required.";
    }

    if (!textPostcode.trim()) {
      newErrors.postcode = "Postcode is required.";
    } else if (textPostcode.length > 10) {
      newErrors.postcode = "Postcode cannot be more than 10 digits.";
    }

    if (!textContactPersonName.trim()) {
      newErrors.contactPersonName = "Contact Person Name is required.";
    }

    if (!textEmail.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(textEmail)) {
      newErrors.email = "Email is invalid.";
    }

    if (!textPhoneNo.trim()) {
      newErrors.phoneNo = "Phone Number is required.";
    }

    if (!officialAddress.trim()) {
      newErrors.officialAddress = "Official Address is required.";
    }

    // เพิ่มการตรวจสอบอื่นๆ ตามต้องการ

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  // ฟังก์ชันจัดการการส่งข้อมูล
  const handleClick = async () => {
    // ก่อนอื่นให้ตรวจสอบฟิลด์ต่างๆ
    if (!validateInputs()) {
      return;
    }
    // เปิด modal ยืนยัน
    setOpenConfirm(true);
    setConfirmValue(true);

    // ฟังก์ชันจัดการการยืนยันจาก modal

    if (confirmValue) {
      const payload = {
        _id: companyId,
        website: textWebsite,
        currency: currency,
        address: textAddress,
        country: JSON.stringify(selectedCountry), // ใช้ชื่อประเทศ
        state_province: JSON.stringify(selectedState), // ใช้ชื่อรัฐ/จังหวัด
        city: JSON.stringify(selectedCity), // ใช้ชื่อเมือง
        postcode: textPostcode,
        branch_code: branchCode || "",
        email: textEmail,
        phone: textPhoneNo,
        company_name: textCompanyName,
        contact_person: textContactPersonName,
        mailing_name: textMailingName,
        official_address: officialAddress,
        tax_id: textTaxID,
      };

      const formToSubmit = new FormData();
      Object.keys(payload).forEach((key) => {
        formToSubmit.append(key, payload[key]);
      });

      if (image) {
        formToSubmit.append("image_logo_url", image);
      } else if (!createNew){
        formToSubmit.append("image_logo_url", imageUrlSaved);
      }

      try {
        const update = await apiRequest(
          createNew ?"POST": "PUT",
          "/companyProfile",
          formToSubmit
        );

       
          setOpenConfirm(false);
          setOpenSuccess(true);
          setConfirmValue(false);
          setTimeout(() => {
            setOpenSuccess(false);
            getCompanyInfo();
            setIsEditing(false);
            setFsmState("view"); 
          }, 500);
       
      } catch (error) {
        console.error("Error updating company profile:", error);
        setOpenConfirm(false);
        setOpenUnsuccess(true);
      }
    }
  };
  
  const onCancelEdit = () => {
    setIsEditing(false);
    
  
    if (createNew) {
 
      setTextCompanyName("");
      setTextTaxID("");
      setTextMailingName("");
      setTextWebsite("");
      setTextAddress("");
      setTextPostcode("");
      setTextContactPersonName("");
      setTextEmail("");
      setTextPhoneNo("");
      setBranchCode("");
      setOfficialAddress("head_office");
      setCurrencyInfo(false);
      setCurrency(null);
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setStates([]);
      setCities([]);
      setImage(null);
      setImagePreview(null);
      setImageUrlSaved("");
      setCompanyId("");
      setFsmState("add");
    } else {
      
      getCompanyInfo();
     
      setFsmState("view");
    }
    
    // Clear all errors
    setErrors({
      companyName: "",
      taxID: "",
      mailingName: "",
      currency: "",
      address: "",
      country: "",
      stateProvince: "",
      city: "",
      postcode: "",
      contactPersonName: "",
      email: "",
      phoneNo: "",
      branchCode: "",
      officialAddress: "",
      companyImage: "",
    });
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงต่างๆ พร้อมการตรวจสอบแบบ real-time
  const handleChangeCompanyName = (event) => {
    const value = event.target.value;
    setTextCompanyName(value);
    handleUserInput(); 

    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        companyName: "Company Name is required.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, companyName: "" }));
    }
  };
  const handleChangeTaxID = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setTextTaxID(value);
      handleUserInput(); // 
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          taxID: "Tax ID is required.",
        }));
      } else if (value.length > 18) {
        setErrors((prev) => ({
          ...prev,
          taxID: "Tax ID cannot be more than 18 digits.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, taxID: "" }));
      }
    }
  };
  const handleImageValue = (data) => {
    setImage(data);
    setImagePreview(URL.createObjectURL(data));
    handleUserInput(); 
  };
  const handleChangeMailingName = (event) => {
    const value = event.target.value;
    setTextMailingName(value);
    handleUserInput();
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        mailingName: "Mailing Name is required.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, mailingName: "" }));
    }
  };
  const handleChangeAddress = (event) => {
    const value = event.target.value;
    setTextAddress(value);
    handleUserInput(); 
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, address: "Address is required." }));
    } else {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };
  const handleChangeCountry = (newValue) => {
    setSelectedCountry(newValue);
    handleUserInput(); 
    setErrors((prev) => ({
      ...prev,
      country: newValue ? "" : "Country is required.",
    }));

    // เมื่อเลือกประเทศใหม่ ให้ดึงข้อมูลรัฐ
    if (newValue) {
      const statesData = StateData.getStatesOfCountry(newValue.code).map(
        (state) => ({
          code: state.isoCode,
          label: state.name,
        })
      );
      setStates(statesData);
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);
    } else {
      setStates([]);
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);
    }
  };
  const handleChangeState = (newValue) => {
    setSelectedState(newValue);
    handleUserInput(); 
    setErrors((prev) => ({
      ...prev,
      stateProvince: newValue ? "" : "State/Province is required.",
    }));

    // เมื่อเลือกรัฐใหม่ ให้ดึงข้อมูลเมือง
    if (newValue && selectedCountry) {
      const citiesData = CityData.getCitiesOfState(
        selectedCountry.code,
        newValue.code
      ).map((city) => ({
        code: city.name,
        label: city.name,
      }));
      setCities(citiesData);
      setSelectedCity(null);
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  };
  const handleChangeCity = (newValue) => {
    setSelectedCity(newValue);
    handleUserInput(); 
    setErrors((prev) => ({
      ...prev,
      city: newValue ? "" : "City is required.",
    }));
  };
  const handleChangePostcode = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setTextPostcode(value);
      handleUserInput(); 
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, postcode: "Postcode is required." }));
      } else if (value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          postcode: "Postcode cannot be more than 10 digits.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, postcode: "" }));
      }
    }
  };
  const handleChangeContactPersonName = (event) => {
    const value = event.target.value;
    setTextContactPersonName(value);
    handleUserInput(); 
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        contactPersonName: "Contact Person Name is required.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, contactPersonName: "" }));
    }
  };
  const handleChangeEmail = (event) => {
    const value = event.target.value;
    setTextEmail(value);
    handleUserInput(); 
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid." }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };
  const handleChangePhoneNo = (val) => {
    setTextPhoneNo(val);
    handleUserInput(); 
    if (!val.trim()) {
      setErrors((prev) => ({ ...prev, phoneNo: "Phone Number is required." }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNo: "" }));
    }
  };
  const handleChangeWebsite = (event) => {
    const value = event.target.value;
    setTextWebsite(value);
    handleUserInput(); 
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, website: "Website is required." }));
    } else {
      setErrors((prev) => ({ ...prev, website: "" }));
    }
  };
  const handleChangeCurrency = (event) => {
    const value = event.target.value;
    setCurrencyInfo(value);
    handleUserInput(); 
    if (!value) {
      setErrors((prev) => ({ ...prev, currency: "Currency is required." }));
    } else {
      setErrors((prev) => ({ ...prev, currency: "" }));
    }
  };
  const handleBranchCode = (event) => {
    setBranchCode(event.target.value);
    handleUserInput(); 
    if (!event.target.value.trim()) {
      setErrors((prev) => ({
        ...prev,
        branchCode: "Branch Code is required.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, branchCode: "" }));
    }
  };
  const handleOfficialAddress = (event) => {
    const selectedValue = event.target.value;
    setOfficialAddress(selectedValue);
    handleUserInput(); 
    if (selectedValue === "head_office") {
      setBranchCode("");
      setErrors((prev) => ({ ...prev, branchCode: "" }));
    }
    if (!event.target.value.trim()) {
      setErrors((prev) => ({
        ...prev,
        officialAddress: "Official Address is required.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, officialAddress: "" }));
    }
  };

  return (
    <Box sx={{ display: "flex"}}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " }}>
        <Header />
        <CompanyProfileHeader />

        <Box
          sx={{
            // width: "1680px",
            // height: "auto",
            // display: "flex",
            // flexShrink: 0,
            // flexDirection: "column,
           
          }}
        >
          <Box
            sx={{
              // width: "1646px",
              // backgroundColor: "var(--BG-Paper, #F8F8F8)",
              // borderRadius: "5px",
              // marginTop: "24px",
              // marginLeft: "24px",
              // padding: "32px",
              // boxSizing: "border-box",
              padding: "20px 32px 0px 24px",
              bgcolor: "#F8F8F8",
              minHeight: "687px",
              marginLeft : "29px"
            }}
          >
            {/* Create Company */}
           {createNew && <Box>
              <Typography
                sx={{
                  color: "var(--HeadPage, #05595B)",
                  fontFamily: "Calibri",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Create Company
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E2D784",
                  marginTop: "12px",
                }}
              />
            </Box> }

            {/* General */}
            <Box sx={{ display: "flex", marginTop: "20px" }}>
              {/* Company Image */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <PictureProfileImport
                  label="Company Image"
                  defaultValue={imagePreview}
                  handleImageValue={handleImageValue}
                />
                {errors.companyImage && (
                  <Typography color="error" variant="body2">
                    {errors.companyImage}
                  </Typography>
                )}
              </Box>

              {/* General Information */}
              <Box
                sx={{
                  marginLeft: "93px",
                  height: "auto",
                
                  flex: 1,
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {/* General Section */}
                <Box>
                  <Typography
                    sx={{
                      color: "var(--HeadPage, #05595B)",
                      fontFamily: "Calibri",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    General
                  </Typography>

                  <CompanyName
                    value={textCompanyName}
                    onChange={handleChangeCompanyName}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                  />

                  <TaxID
                    value={textTaxID}
                    onChange={handleChangeTaxID}
                    error={!!errors.taxID}
                    helperText={errors.taxID}
                  />

                  <Box sx={{ marginTop: "24px" }}>
                    <MailingName
                      value={textMailingName}
                      onChange={handleChangeMailingName}
                      error={!!errors.mailingName}
                      helperText={errors.mailingName}
                    />
                    <Website
                      value={textWebsite}
                      onChange={handleChangeWebsite}
                      error={!!errors.website}
                      helperText={errors.website}
                    />
                    <Currency
                      comp_use="company_profile"
                      value={currency}
                      onChange={handleChangeCurrency}
                      error={!!errors.currency}
                      helperText={errors.currency}
                    />
                  </Box>
                </Box>

                {/* Official Address Section */}
                <Box sx={{ marginTop: "20px" }}>
                  <Typography
                    sx={{
                      color: "var(--HeadPage, #05595B)",
                      fontFamily: "Calibri",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      marginBottom: "14px",
                    }}
                  >
                    Official Address
                  </Typography>

                  <RadioOAGroup
                    value={officialAddress || null}
                    branchCode={branchCode}
                    onChangeBranchCode={handleBranchCode}
                    onChange={handleOfficialAddress}
                    error={!!errors.officialAddress}
                    helperText={errors.officialAddress}
                  />

                  <Box sx={{ display: "flex", marginTop: "15px" }}>
                    {/* Address Fields */}
                    <Box sx={{ width: "434px", marginRight: "165px" }}>
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginBottom: "14px",
                        }}
                      >
                        • Address
                      </Typography>

                      <Address
                        value={textAddress}
                        onChange={handleChangeAddress}
                        error={!!errors.address}
                        helperText={errors.address}
                      />

                      {/* Country Select */}
                      <Country
                        options={CountryData.getAllCountries().map(
                          (country) => ({
                            code: country.isoCode,
                            label: country.name,
                          })
                        )}
                        value={selectedCountry}
                        onChange={handleChangeCountry}
                        error={!!errors.country}
                        helperText={errors.country}
                      />

                      {/* State/Province Select */}
                      <StateProvince
                        options={states}
                        value={selectedState}
                        onChange={handleChangeState}
                        error={!!errors.stateProvince}
                        helperText={errors.stateProvince}
                      />

                      {/* City Select */}
                      <City
                        options={cities}
                        value={selectedCity}
                        onChange={handleChangeCity}
                        error={!!errors.city}
                        helperText={errors.city}
                      />

                      <Postcode
                        value={textPostcode}
                        onChange={handleChangePostcode}
                        error={!!errors.postcode}
                        helperText={errors.postcode}
                      />
                    </Box>

                    {/* Contact Fields */}
                    <Box>
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginBottom: "14px",
                        }}
                      >
                        • Contact
                      </Typography>

                      <ContactPersonName
                        value={textContactPersonName}
                        onChange={handleChangeContactPersonName}
                        error={!!errors.contactPersonName}
                        helperText={errors.contactPersonName}
                      />
                      <Box sx={{ marginTop: "24px" }}>
                        <Email
                          value={textEmail}
                          onChange={handleChangeEmail}
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Box>

                      <Box sx={{ marginTop: "24px" }}>
                        <PhoneNo
                          value={textPhoneNo}
                          onChange={handleChangePhoneNo}
                          error={!!errors.phoneNo}
                          helperText={errors.phoneNo}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Footer
          onClick={handleClick}
          handlePost={handleClick}
          onCancelEdit={onCancelEdit}
          onEdit={() => {
            setIsEditing(true);
            setFsmState("edit");
          }}
        />
      </Box>
    </Box>
  );
};

export default CompanyProfile;
