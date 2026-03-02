import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import "../../Assets/font/font.css";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import AccountInformationAdd from "./Vendor/AccountInformationAdd.jsx";
import IOSSwitch from "../SwitchIOSStyle.jsx";
import CompanyName from "../Account/InvoiceDetails/CompanyName.jsx";
import TaxID from "../Account/InvoiceDetails/TaxID.jsx";
import Address from "./InvoiceDetails/Address.jsx";
import City from "./InvoiceDetails/City";
import StateProvince from "./InvoiceDetails/StateProvince";
import PostCode from "./InvoiceDetails/PostCode";
import Country from "./InvoiceDetails/Country";
import Name from "./InvoiceDetails/Name.jsx";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  vendorInvoiceAddressListState,
  enableEditState,
  vendorShippingAddressListState,
  vendorViewInfoState,
} from "recoil/state/VendorState.js";
import {
  replaceArrayItemAtIndex,
  removeArrayItemAtIndex,
} from "../../helpers/objHelper.js";
import { VendorDataSelector } from "recoil/selector/VendorSelector";
import SwitchWithLabel from "../../component/SwitchIOSStyleLabel";
import { useParams } from "react-router-dom";
import apiRequest from "helpers/apiHelper";

const AccountVendorEdit = ({
    selectedCountry,
  selectedCity,
  selectedState,
  setSelectedCity,
  setSelectedCountry,
  setSelectedState, 
}) => {
  const [selectedValue, setSelectedValue] = useState("Corporation");
  const [vendorData, setVendorData] = useRecoilState(VendorDataSelector);

    const [states, setStates] = useState([]);
  
    const [cities, setCities] = useState([]); 

  const editStatus = useRecoilValue(enableEditState);
  const { id } = useParams();
  const [vendorListAddress, setVendorListAddress] = useRecoilState(
    vendorInvoiceAddressListState
  );
  const [vendorListShippingAddress, setVendorListShippingAddress] =
    useRecoilState(vendorShippingAddressListState);

  const handleChangeValue = (event) => {
    setSelectedValue(event.target.value);
  };


    const validateInputs = () => {
    const newErrors = {};

    if (!selectedCountry) {
      newErrors.country = "Country is required.";
    }

    if (!selectedState) {
      newErrors.stateProvince = "State/Province is required.";
    }

    if (!selectedCity) {
      newErrors.city = "City is required.";
    }
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  // const handleSwitchChange = (event) => {
  //   setIsSwitchOn(event.target.checked);
  // };

  const handleSwitchChange = async (id, status) => {
    let newStatus = status;

    console.log("Switch Change ID:", id, "New Status:", newStatus); // Log switch change

    // Update the local state for the specific item

    try {
      // Send an update request to the server
      await apiRequest("PUT", "/account/vendor/setactive", {
        _id: id,
        status: newStatus,
      });
      setVendorData((prevData) => {
        const updatedData = prevData.map((item) =>
          item._id === id
            ? {
                ...item,
                account_status: newStatus,
              }
            : item
        );
        return updatedData;
      });

      console.log("Update Success:", id, "New Status:", newStatus);
    } catch (err) {
      console.error("Update Error:", err); // Log update errors
      // Optional: Revert the local state update if the request fails
      setVendorData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: item.account_status } : item
        )
      );
    }
    setIsSwitchOn(newStatus);
  };
  //

  const handleChangeCountry = (newValue) => {
    setSelectedCountry(newValue);
    setVendorData({ ...vendorData, country: newValue });
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

  const handleChangeCity = (newValue) => {
    setSelectedCity(newValue);
    setErrors((prev) => ({
      ...prev,
      city: newValue ? "" : "City is required.",
    }));
  };

  const handleChangeState = (newValue) => {
    setSelectedState(newValue);
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
  //

  const vendorViewInfo = useRecoilValue(vendorViewInfoState);

  // const [idVendor,setIdVendor] = useRecoilState(false)

  const setViewEdit = async (data) => {
    if (data.vendor_code_name) {
      setVendorData({
        type: "account_infomation",
        business_type: data.business_type,
      });
    }
  };

  useEffect(() => {
    setViewEdit(vendorViewInfo);
  }, [vendorViewInfo]);

  const addInvoiceDetailList = () => {
    const templateData = {
      no: vendorListAddress.length + 1,
      company_name: "",
      tax_id: "",
      address: "",
      country: { code: "", label: "" },
      city: { code: "", label: "" },
      state_province: { code: "", label: "" },
      postcode: "",
    };

    console.log("dd");
    setVendorListAddress([...vendorListAddress, templateData]);
  };

  const removeInvoiceDetailList = (index) => {
    setVendorListAddress(removeArrayItemAtIndex(vendorListAddress, index));
  };
  const addShippingDetailList = () => {
    const templateData = {
      no: vendorListAddress.length + 1,
      company_name: "",
      tax_id: "",
      address: "",
      country: { code: "", label: "" },
      city: { code: "", label: "" },
      state_province: { code: "", label: "" },
      postcode: "",
    };

    setVendorListShippingAddress([...vendorListShippingAddress, templateData]);
  };

  const UpdateItem = (listItem, indexArrKey, propName, newValue) => {
    let item = listItem;
    console.log(listItem, "before");
    let obj = {
      company_name:
        propName == "company_name"
          ? newValue
          : listItem[indexArrKey]["company_name"],
      business_type:
        propName == "business_type"
          ? newValue
          : listItem[indexArrKey]["business_type"],
      tax_id: propName == "tax_id" ? newValue : listItem[indexArrKey]["tax_id"],
      address:
        propName == "address" ? newValue : listItem[indexArrKey]["address"],
      country:
        propName == "country" ? newValue : listItem[indexArrKey]["country"],
      state_province:
        propName == "state_province"
          ? newValue
          : listItem[indexArrKey]["state_province"],
      city: propName == "city" ? newValue : listItem[indexArrKey]["city"],
      postcode:
        propName == "postcode" ? newValue : listItem[indexArrKey]["postcode"],
    };

    setVendorListAddress(
      replaceArrayItemAtIndex(vendorListAddress, indexArrKey, obj)
    );
  };

  const UpdateShippingAddress = (listItem, indexArrKey, propName, newValue) => {
    let item = listItem;
    console.log(listItem, "before");
    let obj = {
      company_name:
        propName == "company_name"
          ? newValue
          : listItem[indexArrKey]["company_name"],
      business_type:
        propName == "business_type"
          ? newValue
          : listItem[indexArrKey]["business_type"],
      tax_id: propName == "tax_id" ? newValue : listItem[indexArrKey]["tax_id"],
      address:
        propName == "address" ? newValue : listItem[indexArrKey]["address"],
      country:
        propName == "country" ? newValue : listItem[indexArrKey]["country"],
      state_province:
        propName == "state_province"
          ? newValue
          : listItem[indexArrKey]["state_province"],
      city: propName == "city" ? newValue : listItem[indexArrKey]["city"],
      postcode:
        propName == "postcode" ? newValue : listItem[indexArrKey]["postcode"],
    };

    setVendorListShippingAddress(
      replaceArrayItemAtIndex(vendorListShippingAddress, indexArrKey, obj)
    );
  };

  useEffect(() => {}, [vendorListAddress, vendorListShippingAddress]);

  return (
    <div id="vendorName">
      <Box
        sx={{
          width: "1360px",
          height: "720px",
          flexShrink: 0,
        }}
      >
        {/* Business Type and Account Information*/}
        <Box
          sx={{
            width: "1300px",
            height: "55px",
            backgroundColor: "var(--BG-Paper, #F8F8F8)",
            borderTopLeftRadius: "5px",
            marginTop: "24px",
            marginLeft: "24px",
            paddingTop: "24px",
            paddingLeft: "24px",
          }}
        >
          <Box
            sx={{
              width: "512px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "#343434",
                fontFamily: "Calibri",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "20px",
                width: "130px",
              }}
            >
              Bussiness Type:
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="options"
                name="options"
                value={vendorData.business_type}
                onChange={(e) => {
                  setVendorData({
                    type: "account_infomation",
                    business_type: e.target.value,
                  });
                }}
                row
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "24px",
                  },
                }}
              >
                <FormControlLabel
                  disabled={editStatus ? false : true}
                  classes={
                    editStatus
                      ? "business_type"
                      : "business_type disabled_input"
                  }
                  value="corporation"
                  control={<Radio />}
                  label="Corporation"
                  sx={{
                    marginLeft: "16px",
                    "& .MuiTypography-root": {
                      color: "#343434",
                      fontFamily: "Calibri",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "20px",
                    },
                  }}
                />
                <FormControlLabel
                  disabled={editStatus ? false : true}
                  classes={
                    editStatus
                      ? "business_type"
                      : "business_type disabled_input"
                  }
                  value="personal"
                  control={<Radio />}
                  label="Personal"
                  sx={{
                    marginLeft: "32px",
                    "& .MuiTypography-root": {
                      color: "#343434",
                      fontFamily: "Calibri",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "20px",
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        {/* Invoice Dertails */}
        <Box>
          <Box
            sx={{
              width: "1300px",
              height: "640px",
              backgroundColor: "var(--BG-Paper, #F8F8F8)",
              marginLeft: "24px",
            }}
          >
            {/* Account Information */}
            <Box sx={{ marginLeft: "24px" }}>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    color: "var(--HeadPage, #05595B)",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  Account Information
                </Typography>
                <Box
                  sx={{
                    marginLeft: "40px",
                    display: "flex",
                    marginTop: "-5px",
                  }}
                >
                  {id !== "" ? (
                    <SwitchWithLabel
                      checked={vendorData.account_status === "active"}
                      onChange={(e) => {
                        let status = e.target.checked ? "active" : "inactive";

                        setVendorData({
                          type: "account_infomation",
                          account_status: status,
                        });

                        //handleSwitchChange(vendorData._id,status)
                      }}
                      label={vendorData.account_status}
                    />
                  ) : (
                    <SwitchWithLabel
                      checked={vendorData.account_status === "active"}
                      onChange={(e) => {
                        let status = e.target.checked ? "active" : "inactive";

                        setVendorData({
                          type: "account_infomation",
                          account_status: status,
                        });
                      }}
                      label={vendorData.account_status}
                    />
                  )}

                  {/* 

                    <IOSSwitch
                      checked={vendorData.account_status=="active"?true:false}
                      onChange={(event)=>{
                        
                        setVendorData({
                          type:"account_infomation",
                          account_status:event.target.checked===true?"active":"inactive"
                    
                    
                        })
                        console.log(event.target.checked)
                        console.log(vendorData)

                      }}
                    /> */}
                </Box>
                {/* <Typography
                    sx={{
                      color: isSwitchOn ? "#17C653" : "#9A9A9A",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      marginLeft: "16px",
                      marginTop: "2.5px",
                    }}
                  >
                    Active
                  </Typography> */}
              </Box>

              <AccountInformationAdd parent_class_name="corporation" />
            </Box>
            {/* Invoice Details */}
            <Box
              sx={{
                overflow: "auto",
                maxHeight: "450px",
                "::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                float: "left",
              }}
            >
              <Box
                sx={{
                  marginLeft: "24px",
                  width: "435px",
                  marginTop: "24px",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--HeadPage, #05595B)",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  • Invoice Details
                </Typography>
                <Box
                  sx={{
                    maxHeight: "365px",
                    overflow: "auto",
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {vendorListAddress.map((v, index) => (
                    <Box key={index} mb={2}>
                      {index > 0 && (
                        <Box sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              color: "var(--HeadPage, #05595B)",
                              fontFamily: "Calibri",
                              fontSize: "20px",
                              fontStyle: "normal",
                              float: "left",
                              fontWeight: 700,
                              width: "95%",
                            }}
                          >
                            • Invoice Address {index + 1}
                          </Typography>
                          {editStatus ? (
                            <Box
                              sx={{
                                marginTop: "2px",
                                marginLeft: "0",
                                cursor: "pointer",
                                float: "right",
                              }}
                              onClick={() => removeInvoiceDetailList(index)}
                              aria-label="delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M20.5 6H3.5M18.833 8.5L18.373 15.4C18.196 18.054 18.108 19.381 17.243 20.19C16.378 21 15.047 21 12.387 21H11.613C8.953 21 7.622 21 6.757 20.19C5.892 19.381 5.803 18.054 5.627 15.4L5.167 8.5M9.5 11L10 16M14.5 11L14 16"
                                  stroke="#E00410"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M6.5 6H6.61C7.01245 5.98972 7.40242 5.85822 7.72892 5.62271C8.05543 5.3872 8.30325 5.05864 8.44 4.68L8.474 4.577L8.571 4.286C8.654 4.037 8.696 3.913 8.751 3.807C8.85921 3.59939 9.01451 3.41999 9.20448 3.28316C9.39444 3.14633 9.6138 3.05586 9.845 3.019C9.962 3 10.093 3 10.355 3H13.645C13.907 3 14.038 3 14.155 3.019C14.3862 3.05586 14.6056 3.14633 14.7955 3.28316C14.9855 3.41999 15.1408 3.59939 15.249 3.807C15.304 3.913 15.346 4.037 15.429 4.286L15.526 4.577C15.6527 4.99827 15.9148 5.36601 16.2717 5.62326C16.6285 5.88051 17.0603 6.01293 17.5 6"
                                  stroke="#E00410"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </Box>
                          ) : (
                            ""
                          )}
                        </Box>
                      )}

                      <CompanyName
                        value={v.company_name}
                        label={
                          vendorData.business_type === "corporation"
                            ? "Company Name"
                            : "Name"
                        }
                        onChange={(event) => {
                          UpdateItem(
                            vendorListAddress,
                            index,
                            "company_name",
                            event.target.value
                          );
                        }}
                      />
                      <TaxID
                        value={v.tax_id}
                        onChange={(event) => {
                          UpdateItem(
                            vendorListAddress,
                            index,
                            "tax_id",
                            event.target.value
                          );
                        }}
                      />
                      <Address
                        value={v.address}
                        onChange={(event) => {
                          UpdateItem(
                            vendorListAddress,
                            index,
                            "address",
                            event.target.value
                          );
                        }}
                      />
                      <Country
                        // value={v.country}
                        // onChange={(event, newValue) => {
                        //   UpdateItem(
                        //     vendorListAddress,
                        //     index,
                        //     "country",
                        //     newValue
                        //   );
                        // }}
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

                         <StateProvince
                        // value={v.state_province}
                        // onChange={(event, newValue) => {
                        //   UpdateItem(
                        //     vendorListAddress,
                        //     index,
                        //     "state_province",
                        //     newValue
                        //   );
                        // }}
                                options={states}
                        value={selectedState}
                        onChange={handleChangeState}
                        error={!!errors.stateProvince}
                        helperText={errors.stateProvince}
                      />
                      <City
                        // value={v.city}
                        // onChange={(event, newValue) => {
                        //   UpdateItem(
                        //     vendorListAddress,
                        //     index,
                        //     "city",
                        //     newValue
                        //   );
                        // }}
                        options={cities}
                        value={selectedCity}
                        onChange={handleChangeCity}
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                   
                      <PostCode
                        value={v.postcode}
                        onChange={(event) => {
                          UpdateItem(
                            vendorListAddress,
                            index,
                            "postcode",
                            event.target.value
                          );
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                {editStatus ? (
                  <Box
                    sx={{
                      display: "flex",
                      cursor: "pointer",
                      marginTop: "11px",
                    }}
                    onClick={addInvoiceDetailList}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M18 12.998H13V17.998C13 18.2633 12.8946 18.5176 12.7071 18.7052C12.5196 18.8927 12.2652 18.998 12 18.998C11.7348 18.998 11.4804 18.8927 11.2929 18.7052C11.1054 18.5176 11 18.2633 11 17.998V12.998H6C5.73478 12.998 5.48043 12.8927 5.29289 12.7052C5.10536 12.5176 5 12.2633 5 11.998C5 11.7328 5.10536 11.4785 5.29289 11.2909C5.48043 11.1034 5.73478 10.998 6 10.998H11V5.99805C11 5.73283 11.1054 5.47848 11.2929 5.29094C11.4804 5.1034 11.7348 4.99805 12 4.99805C12.2652 4.99805 12.5196 5.1034 12.7071 5.29094C12.8946 5.47848 13 5.73283 13 5.99805V10.998H18C18.2652 10.998 18.5196 11.1034 18.7071 11.2909C18.8946 11.4785 19 11.7328 19 11.998C19 12.2633 18.8946 12.5176 18.7071 12.7052C18.5196 12.8927 18.2652 12.998 18 12.998Z"
                        fill="#1B84FF"
                      />
                    </svg>
                    <Typography
                      sx={{
                        color: "#1B84FF",
                        fontFamily: "Calibri",
                        fontSize: "18px",
                        fontStyle: "18px",
                        fontWeight: 700,
                      }}
                    >
                      Add More
                    </Typography>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </Box>

            {/* Shipping */}

            <Box
              sx={{
                marginLeft: "160px",
                overflow: "auto",
                maxHeight: "450px",
                "::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                float: "left",
              }}
            >
              <Box
                sx={{
                  marginLeft: "24px",
                  width: "435px",
                  marginTop: "24px",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--HeadPage, #05595B)",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  • Shipping Details
                </Typography>
                <Box
                  sx={{
                    maxHeight: "365px",
                    overflow: "auto",
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {vendorListShippingAddress.map((vs, index) => (
                    <Box key={index} mb={2}>
                      {index > 0 && (
                        <Box sx={{ display: "flex" }}>
                          <Typography
                            sx={{
                              color: "var(--HeadPage, #05595B)",
                              fontFamily: "Calibri",
                              fontSize: "20px",
                              fontStyle: "normal",
                              float: "left",
                              fontWeight: 700,
                              width: "95%",
                            }}
                          >
                            • Shipping Address {index + 1}
                          </Typography>
                          {editStatus ? (
                            <Box
                              sx={{
                                marginTop: "2px",
                                marginLeft: "0",
                                cursor: "pointer",
                                float: "right",
                              }}
                              onClick={() => removeInvoiceDetailList(index)}
                              aria-label="delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M20.5 6H3.5M18.833 8.5L18.373 15.4C18.196 18.054 18.108 19.381 17.243 20.19C16.378 21 15.047 21 12.387 21H11.613C8.953 21 7.622 21 6.757 20.19C5.892 19.381 5.803 18.054 5.627 15.4L5.167 8.5M9.5 11L10 16M14.5 11L14 16"
                                  stroke="#E00410"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M6.5 6H6.61C7.01245 5.98972 7.40242 5.85822 7.72892 5.62271C8.05543 5.3872 8.30325 5.05864 8.44 4.68L8.474 4.577L8.571 4.286C8.654 4.037 8.696 3.913 8.751 3.807C8.85921 3.59939 9.01451 3.41999 9.20448 3.28316C9.39444 3.14633 9.6138 3.05586 9.845 3.019C9.962 3 10.093 3 10.355 3H13.645C13.907 3 14.038 3 14.155 3.019C14.3862 3.05586 14.6056 3.14633 14.7955 3.28316C14.9855 3.41999 15.1408 3.59939 15.249 3.807C15.304 3.913 15.346 4.037 15.429 4.286L15.526 4.577C15.6527 4.99827 15.9148 5.36601 16.2717 5.62326C16.6285 5.88051 17.0603 6.01293 17.5 6"
                                  stroke="#E00410"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </Box>
                          ) : (
                            ""
                          )}
                        </Box>
                      )}

                      <Address
                        value={vs.address}
                        onChange={(event) => {
                          UpdateShippingAddress(
                            vendorListShippingAddress,
                            index,
                            "address",
                            event.target.value
                          );
                        }}
                      />

                      <Country
                        // value={vs.country}
                        // onChange={(event, newValue) => {
                        //   UpdateShippingAddress(
                        //     vendorListShippingAddress,
                        //     index,
                        //     "country",
                        //     newValue
                        //   );
                        // }}
                             options={CountryData.getAllCountries().map(
                                                  (country) => ({
                                                    code: country.isoCode,
                                                    label: country.name,
                                                  })
                                                )}
                                                value={selectedShippingCountry}
                                                onChange={handleChangeShippingCountry}
                                                error={!!errors.country}
                                                helperText={errors.country}
                      />

                            <StateProvince
                        // value={vs.state_province}
                        // onChange={(event, newValue) => {
                        //   UpdateShippingAddress(
                        //     vendorListShippingAddress,
                        //     index,
                        //     "state_province",
                        //     newValue
                        //   );
                        // }}
                            options={shippingStates}
                        value={selectedShippingState}
                        onChange={handleChangeShippingState}
                        error={!!errors.stateProvince}
                        helperText={errors.stateProvince}
                      />
                      <City
                        // value={vs.city}
                        // onChange={(event, newValue) => {
                        //   UpdateShippingAddress(
                        //     vendorListShippingAddress,
                        //     index,
                        //     "city",
                        //     newValue
                        //   );
                        // }}
                           options={shippingCities}
                        value={selectedShippingCity}
                        onChange={handleChangeShippingCity}
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                
                      <PostCode
                        value={vs.postcode}
                        onChange={(event) => {
                          UpdateShippingAddress(
                            vendorListShippingAddress,
                            index,
                            "postcode",
                            event.target.value
                          );
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {editStatus ? (
                  <Box
                    sx={{
                      display: "flex",
                      cursor: "pointer",
                      marginTop: "11px",
                    }}
                    onClick={addShippingDetailList}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M18 12.998H13V17.998C13 18.2633 12.8946 18.5176 12.7071 18.7052C12.5196 18.8927 12.2652 18.998 12 18.998C11.7348 18.998 11.4804 18.8927 11.2929 18.7052C11.1054 18.5176 11 18.2633 11 17.998V12.998H6C5.73478 12.998 5.48043 12.8927 5.29289 12.7052C5.10536 12.5176 5 12.2633 5 11.998C5 11.7328 5.10536 11.4785 5.29289 11.2909C5.48043 11.1034 5.73478 10.998 6 10.998H11V5.99805C11 5.73283 11.1054 5.47848 11.2929 5.29094C11.4804 5.1034 11.7348 4.99805 12 4.99805C12.2652 4.99805 12.5196 5.1034 12.7071 5.29094C12.8946 5.47848 13 5.73283 13 5.99805V10.998H18C18.2652 10.998 18.5196 11.1034 18.7071 11.2909C18.8946 11.4785 19 11.7328 19 11.998C19 12.2633 18.8946 12.5176 18.7071 12.7052C18.5196 12.8927 18.2652 12.998 18 12.998Z"
                        fill="#1B84FF"
                      />
                    </svg>
                    <Typography
                      sx={{
                        color: "#1B84FF",
                        fontFamily: "Calibri",
                        fontSize: "18px",
                        fontStyle: "18px",
                        fontWeight: 700,
                      }}
                    >
                      Add More
                    </Typography>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </Box>
            {/* end of shipping address */}
          </Box>
        </Box>
      </Box>
      {/* end of invoice detail */}
    </div>
  );
};

export default AccountVendorEdit;
