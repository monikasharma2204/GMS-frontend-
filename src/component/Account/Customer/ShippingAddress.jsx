import React from "react";
import { Box, Typography } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { vendorShippingAddressListState, enableEditState } from "recoil/state/VendorState";
import Address from "../InvoiceDetails/Address";
import Country from "../InvoiceDetails/Country";
import City from "../InvoiceDetails/City";
import StateProvince from "../InvoiceDetails/StateProvince";
import PostCode from "../InvoiceDetails/PostCode";
import {
  Country as CountryData,
  State as StateData,
  City as CityData,
} from "country-state-city";
import { replaceArrayItemAtIndex, removeArrayItemAtIndex } from "../../../helpers/objHelper";

const ShippingAddress = ({}) => {
  const [vendorListShippingAddress, setVendorListShippingAddress] = useRecoilState(vendorShippingAddressListState);
  const editStatus = useRecoilValue(enableEditState);

  const UpdateShippingAddress = (listItem, indexArrKey, propName, newValue) => {
    let obj = {
      address: propName == "address" ? newValue : listItem[indexArrKey]["address"],
      country: propName == "country" ? newValue : listItem[indexArrKey]["country"],
      state: propName == "state" ? newValue : listItem[indexArrKey]["state"],
      city: propName == "city" ? newValue : listItem[indexArrKey]["city"],
      postcode: propName == "postcode" ? newValue : listItem[indexArrKey]["postcode"],
    };

    setVendorListShippingAddress(
      replaceArrayItemAtIndex(vendorListShippingAddress, indexArrKey, obj)
    );
  };

  const removeShippingDetailList = (index) => {
    if (vendorListShippingAddress.length > 1) {
      setVendorListShippingAddress(removeArrayItemAtIndex(vendorListShippingAddress, index));
    }
  };

 
  const addressesToRender = vendorListShippingAddress && vendorListShippingAddress.length > 0 
    ? vendorListShippingAddress 
    : [{
        address: "",
        country: null,
        state: null,
        city: null,
        postcode: "",
      }];

  return (
    <>
      <div className="list_shipping_address">
        {addressesToRender.map((v, index) => (
          <Box key={index} mb={index > 0 ? 2 : 0}>
            {index > 0 && (
              <Box sx={{ display: "flex", marginBottom: "16px" }}>
                <Typography
                  sx={{
                    color: "var(--HeadPage, #05595B)",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    float: "left",
                    width: "95%",
                  }}
                >
                  • Shipping Address {index + 1}
                </Typography>
                {editStatus && (
                  <Box
                    sx={{
                      marginTop: "2px",
                      marginLeft: "0",
                      cursor: "pointer",
                      float: "right",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => removeShippingDetailList(index)}
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
                )}
              </Box>
            )}

            <Box>
              <Address
                value={v.address || ""}
                onChange={(event) => {
                  UpdateShippingAddress(
                    vendorListShippingAddress,
                    index,
                    "address",
                    event.target.value
                  );
                }}
              />
            </Box>
            <Box>
              <Country
                value={v.country || null}
                onChange={(newValue) => {
                  UpdateShippingAddress(
                    vendorListShippingAddress,
                    index,
                    "country",
                    newValue
                  );
                }}
                options={CountryData.getAllCountries().map((country) => ({
                  code: country.isoCode,
                  label: country.name,
                }))}
              />
            </Box>
            <Box>
              <StateProvince
                value={v.state || null}
                onChange={(newValue) => {
                  UpdateShippingAddress(
                    vendorListShippingAddress,
                    index,
                    "state",
                    newValue
                  );
                }}
                options={
                  v?.country?.code
                    ? StateData.getStatesOfCountry(v.country.code).map((state) => ({
                        code: state.isoCode,
                        label: state.name,
                      }))
                    : []
                }
              />
            </Box>
            <Box>
              <City
                value={v.city || null}
                onChange={(newValue) => {
                  UpdateShippingAddress(
                    vendorListShippingAddress,
                    index,
                    "city",
                    newValue
                  );
                }}
                options={
                  v?.state?.code
                    ? CityData.getCitiesOfState(v.country.code, v.state.code).map((city) => ({
                        code: city.name,
                        label: city.name,
                      }))
                    : []
                }
              />
            </Box>
            <Box>
              <PostCode
                value={v.postcode || ""}
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
          </Box>
        ))}
      </div>
    </>
  );
};

export default ShippingAddress;
