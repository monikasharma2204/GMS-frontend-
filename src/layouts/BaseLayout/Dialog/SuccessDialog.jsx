
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
// import { editStatusState,addStatusState,viewStatusState } from "recoil/state/CommonState";
import {showConfirmModalState,confirmValueState,successModalState,successValueState,failedModalState,failedValueState,displayConfirmSaveDialogState,suscessDialogState,unSuscessDialogState} from "recoil/DialogState"
import { useRecoilState } from "recoil";





const SuscessDialog = (props)=> 




{

const [successStatus,setSuccessStatus] = useRecoilState(successValueState)


   

    return (
<>
<Dialog
        open={successStatus===true}
        onClose={()=>{
            setSuccessStatus(false)
        }}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box sx={{ marginBottom: "24px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="113"
            height="112"
            viewBox="0 0 113 112"
            fill="none"
          >
            <g clipPath="url(#clip0_472_206422)">
              <path
                d="M56.5 0C25.5722 0 0.5 25.0722 0.5 56C0.5 86.9295 25.5722 112 56.5 112C87.4295 112 112.5 86.9295 112.5 56C112.5 25.0722 87.4295 0 56.5 0ZM56.5 105.11C29.4817 105.11 7.5 83.0182 7.5 55.9998C7.5 28.9815 29.4817 6.99978 56.5 6.99978C83.5182 6.99978 105.5 28.9816 105.5 55.9998C105.5 83.0179 83.5182 105.11 56.5 105.11ZM78.8493 35.5093L45.9929 68.572L31.1966 53.7757C29.8299 52.409 27.6144 52.409 26.2459 53.7757C24.8791 55.1425 24.8791 57.358 26.2459 58.7247L43.5691 76.0498C44.9359 77.4147 47.1514 77.4147 48.5199 76.0498C48.6774 75.8923 48.8122 75.7206 48.9347 75.5423L83.8018 40.4599C85.1668 39.0931 85.1668 36.8776 83.8018 35.5093C82.4333 34.1425 80.2178 34.1425 78.8493 35.5093Z"
                fill="#17C653"
              />
            </g>
            <defs>
              <clipPath id="clip0_472_206422">
                <rect
                  width="112"
                  height="112"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </Box>
        <Typography
          sx={{
            marginBottom: "24px",
            color: "#343434",
            textAlign: "center",
            fontFamily: "Calibri",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          Successfully!
        </Typography>
      </Dialog>

      {/* Unsuccess Dialog */}
      <Dialog
        open={successStatus==="unsuccess"}
        onClose={()=>{
            setSuccessStatus(false)
        }}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box sx={{ marginBottom: "24px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="113"
            height="112"
            viewBox="0 0 113 112"
            fill="none"
          >
            <g clipPath="url(#clip0_472_206422)">
              <path
                d="M56.5 0C25.5722 0 0.5 25.0722 0.5 56C0.5 86.9295 25.5722 112 56.5 112C87.4295 112 112.5 86.9295 112.5 56C112.5 25.0722 87.4295 0 56.5 0ZM56.5 105.11C29.4817 105.11 7.5 83.0182 7.5 55.9998C7.5 28.9815 29.4817 6.99978 56.5 6.99978C83.5182 6.99978 105.5 28.9816 105.5 55.9998C105.5 83.0179 83.5182 105.11 56.5 105.11ZM78.8493 35.5093L45.9929 68.572L31.1966 53.7757C29.8299 52.409 27.6144 52.409 26.2459 53.7757C24.8791 55.1425 24.8791 57.358 26.2459 58.7247L43.5691 76.0498C44.9359 77.4147 47.1514 77.4147 48.5199 76.0498C48.6774 75.8923 48.8122 75.7206 48.9347 75.5423L83.8018 40.4599C85.1668 39.0931 85.1668 36.8776 83.8018 35.5093C82.4333 34.1425 80.2178 34.1425 78.8493 35.5093Z"
                fill="#17C653"
              />
            </g>
            <defs>
              <clipPath id="clip0_472_206422">
                <rect
                  width="112"
                  height="112"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </Box>
        <Typography
          sx={{
            marginBottom: "24px",
            color: "#343434",
            textAlign: "center",
            fontFamily: "Calibri",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          Unsuccessfully!
        </Typography>
      </Dialog>
</>
    )
}

export default SuscessDialog;