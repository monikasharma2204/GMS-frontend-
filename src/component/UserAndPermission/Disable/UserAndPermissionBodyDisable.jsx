import React from "react";
import { Box, Typography } from "@mui/material";
import "../../../Assets/font/font.css";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IOSSwitch from "../../SwitchIOSStyle.jsx";
import PictureProfileImport from "../../CompanyProfile/ProfilePicture/PictureProfileImport.jsx";
import NameUser from "../Disable/NameUser.jsx";
import Departmant from "../Disable/Departmant.jsx";
import UsernameUser from "../Disable/UsernameUser.jsx";
import PasswordUser from "../Disable/PasswordUser.jsx";
import PhoneNo from "../../UserAndPermission/Disable/PhoneNo.jsx";
import Email from "../../UserAndPermission/Disable/Email.jsx";
import TablePermissionDisable from "../TablePermission/TablePermissionDisable.jsx";

const UserAndPermissionBody = ({}) => {
  return (
    <>
      <Box
        sx={{
          width: "1360px",
          height: "743px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: "1390px",
            height: "205px",
            backgroundColor: "var(--BG-Paper, #F8F8F8)",
            borderTopLeftRadius: "5px",
            marginTop: "24px",
            marginLeft: "24px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginLeft: "32px", marginTop: "32px" }}>
              <PictureProfileImport />
            </Box>

            <Box sx={{ marginLeft: "64px", marginTop: "32px" }}>
              <Box sx={{ display: "flex" }}>
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
                  Personal Information
                </Typography>
                <Box sx={{ marginLeft: "15px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5.6582 6.216V3.906C5.65831 3.53306 5.77534 3.17544 5.98357 2.91178C6.1918 2.64812 6.47417 2.5 6.7686 2.5H16.3899C16.6844 2.5 16.9668 2.64818 17.1751 2.91195C17.3833 3.17572 17.5003 3.53347 17.5003 3.9065V16.094C17.5002 16.4669 17.3832 16.8244 17.1751 17.088C16.9669 17.3517 16.6847 17.4999 16.3903 17.5H14.5461"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.2321 6.5H3.60961C3.31525 6.50027 3.03302 6.64857 2.82495 6.91231C2.61688 7.17605 2.5 7.53365 2.5 7.9065V20.0935C2.5 20.4665 2.61699 20.8243 2.82523 21.088C3.03347 21.3518 3.3159 21.5 3.61039 21.5H13.2321C13.5265 21.4999 13.8087 21.3517 14.0169 21.088C14.225 20.8244 14.342 20.4669 14.3421 20.094V7.9055C14.3419 7.53273 14.2249 7.17532 14.0167 6.91178C13.8086 6.64824 13.5264 6.50013 13.2321 6.5Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Box>

              <Box
                sx={{
                  width: "1123px",
                  height: "1px",
                  backgroundColor: "#E2D784",
                  marginTop: "10px",
                }}
              />

              <Box sx={{ display: "flex", marginTop: "14px" }}>
                <Box
                  sx={{
                    width: "178px",
                    height: "39px",
                    borderRadius: "8px",
                    backgroundColor: "var(--Colors-Grayscale-White, #FFF)",
                    border: "1px solid #D2D5D9",
                  }}
                >
                  <FormControl fullWidth>
                    <Select
                      disabled
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#F0F0F0",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        color: "var(--Text-Field, #666)",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        "& .MuiSelect-select": {
                          padding: "8px",
                        },
                      }}
                    ></Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    marginLeft: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <IOSSwitch disabled />
                
                </Box>
              </Box>

              <Box>
                <NameUser />
                <Departmant />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "1390px",
            height: "503px",
            backgroundColor: "var(--BG-Paper, #F8F8F8)",
            borderBottomLeftRadius: "5px",
            marginLeft: "24px",
            paddingTop: "12px",
            overflow: "auto",
            "::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box>
            <Box>
              <Box sx={{ marginLeft: "248px" }}>
                <Box sx={{ display: "flex" }}>
                  <UsernameUser />
                  <Box sx={{ marginLeft: "64px" }}>
                    <PasswordUser />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", marginTop: "24px" }}>
                  <PhoneNo />
                  <Box sx={{ marginLeft: "64px" }}>
                    <Email />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ marginTop: "55px", marginLeft: "32px" }}>
                <Typography
                  sx={{
                    color: "var(--HeadPage, #05595B)",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                  }}
                >
                  Permission
                </Typography>
                <Box sx={{ marginTop: "12px" }}>
                  <TablePermissionDisable />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserAndPermissionBody;
