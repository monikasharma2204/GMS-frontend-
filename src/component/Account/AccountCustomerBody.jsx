import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import "../../Assets/font/font.css";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import AccountInformation from "./Vendor/AccountInformation.jsx";
import InvoiceDetailsCorporation from "./Vendor/InvoiceDetailsCorporation.jsx";
import ShippingAddress from "./Customer/ShippingAddress.jsx";
import IOSSwitch from "../SwitchIOSStyle.jsx";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { enableEditState, vendorInvoiceAddressListState, vendorShippingAddressListState } from "recoil/state/VendorState";
import { VendorDataSelector } from "recoil/selector/VendorSelector";

const AccountCustomerBody = ({}) => {
  const vendorData = useRecoilValue(VendorDataSelector);
  const setVendorData = useSetRecoilState(VendorDataSelector);
  const [selectedValue, setSelectedValue] = useState("Corporation");
  const editStatus = useRecoilValue(enableEditState);
  const [vendorListAddress, setVendorListAddress] = useRecoilState(vendorInvoiceAddressListState);
  const [vendorListShippingAddress, setVendorListShippingAddress] = useRecoilState(vendorShippingAddressListState);

  useEffect(() => {
    if (vendorData?.business_type) {
 
      const businessTypeLower = vendorData.business_type.toLowerCase();
      const businessType = businessTypeLower === "corporation" ? "Corporation" : 
                          businessTypeLower === "personal" ? "Personal" : 
                          vendorData.business_type.charAt(0).toUpperCase() + vendorData.business_type.slice(1);
      setSelectedValue(businessType);
    } else {
    
      setSelectedValue("Corporation");
    }
  }, [vendorData?.business_type]);

  const handleChangeValue = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    setVendorData({
      type: "account_infomation",
      business_type: newValue.toLowerCase(), 
    });
  };

  const handleAddMoreInvoiceAddress = () => {
    if (!editStatus) return; 
    const newAddress = {
      company_name: "",
      tax_id: "",
      address: "",
      country: { code: "", label: "" },
      city: { code: "", label: "" },
      state: { code: "", label: "" },
      postcode: "",
      account_status: "active",
    };
    setVendorListAddress([...vendorListAddress, newAddress]);
  };

  const handleAddMoreShippingAddress = () => {
    if (!editStatus) return; 
    const newAddress = {
      address: "",
      country: { code: "", label: "" },
      city: { code: "", label: "" },
      state: { code: "", label: "" },
      postcode: "",
      account_status: "active",
    };
    setVendorListShippingAddress([...vendorListShippingAddress, newAddress]);
  };

  return (
    <>
      <Box
        sx={{
          width: "1360px",
          height: "720px",
          flexShrink: 0,
        }}
      >
       
        <Box
          sx={{
            width: "1360px",
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
                value={selectedValue}
                onChange={handleChangeValue}
                row
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "24px",
                  },
                }}
              >
                <FormControlLabel
                  disabled={!editStatus}
                  value="Corporation"
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
                  disabled={!editStatus}
                  value="Personal"
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

        {/* Invoice Details */}
        {(selectedValue === "Corporation" || selectedValue === "Personal") && (
          <Box>
            <Box
              sx={{
                width: "1360px",
                height: "620px",
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
                      marginTop: "5px",
                    }}
                  >
                    <IOSSwitch 
                      checked={vendorData?.account_status === "active"}
                      disabled={!editStatus}
                      onChange={(event) => {
                        if (editStatus) {
                          const newStatus = event.target.checked ? "active" : "inactive";
                          setVendorData({
                            type: "account_infomation",
                            account_status: newStatus,
                          });
                        }
                      }}
                    />
                  </Box>
                  {/* <Typography
                    sx={{
                      color: "var(--Text-Dis-Field, #9A9A9A)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      marginLeft: "16px",
                      marginTop: "2.5px",
                    }}
                  >
                    Inactive
                  </Typography> */}
                </Box>
                <AccountInformation />
              </Box>
              {/* Invoice Details */}
              <Box>
                <Box sx={{ display: "flex", marginTop: "24px" }}>
                  <Box>
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
                          • Invoice Details
                        </Typography>
                        <Box
                          sx={{
                            marginLeft: "40px",
                            display: "flex",
                            marginTop: "5px",
                          }}
                        >
                          {/* <IOSSwitch disabled /> */}
                        </Box>

                      
                      </Box>

                      <Box
                        sx={{
                          overflow: "auto",
                          maxHeight: "365px",
                          "::-webkit-scrollbar": {
                            display: "none",
                          },
                          msOverflowStyle: "none",
                          scrollbarWidth: "none",
                        }}
                      >
                        <InvoiceDetailsCorporation businessType={selectedValue} />
                      </Box>

                      <Box
                        onClick={handleAddMoreInvoiceAddress}
                        sx={{
                          display: "flex",
                          marginTop: "11px",
                          cursor: editStatus ? "pointer" : "not-allowed",
                          opacity: editStatus ? 1 : 0.5,
                          "&:hover": {
                            opacity: editStatus ? 0.8 : 0.5,
                          },
                        }}
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
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginLeft: "160px",
                    }}
                  >
                    <Box>
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
                          • Shipping Address
                        </Typography>

                        <Box
                          sx={{
                            marginLeft: "40px",
                            display: "flex",
                            marginTop: "5px",
                          }}
                        >
                          {/* <IOSSwitch disabled /> */}
                        </Box>

                     
                      </Box>

                      <Box
                        sx={{
                          overflow: "auto",
                          maxHeight: "365px",
                          "::-webkit-scrollbar": {
                            display: "none",
                          },
                          msOverflowStyle: "none",
                          scrollbarWidth: "none",
                        }}
                      >
                      <ShippingAddress />
                      </Box>

                      <Box
                        onClick={handleAddMoreShippingAddress}
                        sx={{
                          display: "flex",
                          marginTop: "11px",
                          cursor: editStatus ? "pointer" : "not-allowed",
                          opacity: editStatus ? 1 : 0.5,
                          "&:hover": {
                            opacity: editStatus ? 0.8 : 0.5,
                          },
                        }}
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
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: "var(--BG-Paper, #F8F8F8)",
                height: "20px",
                width: "1360px",
                marginLeft: "24px",
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default AccountCustomerBody;
