import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  successValueState,
  failedModalState,
  failedValueState,
  displayConfirmSaveDialogState,
  suscessDialogState,
  unSuscessDialogState,
} from "recoil/DialogState";
import {
  payloadUrlState,
  payloadMethodState,
  payloadDataState,
  saveButtonStatusState,
  payloadDataCurrencyState,
  payloadDataMainLocationState,
  payloadDataSubLocationState,
} from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
import apiRequest from "helpers/apiHelper";
import ConfirmSaveDialog from "./Dialog/ConfirmSaveDialog";
import SuscessDialog from "./Dialog/SuccessDialog";
import {API_URL} from "config/config.js";
// { onClick, onCancelEdit, responseMessage, isSaveDisabled, disabled, handlePost }
const Footer = (props) => {
  const { type } = props;
  const [payloadData, setPayloadData] = useRecoilState(payloadDataState);
  const [payloadDataCurrency, setPayloadDataCurrency] = useRecoilState(
    payloadDataCurrencyState
  );
  const [payloadDataMainLocation, setPayloadDataMainLocation] = useRecoilState(
    payloadDataMainLocationState
  );
  const [payloadDataSubLocation, setPayloadDataSubLocation] = useRecoilState(
    payloadDataSubLocationState
  );
  const [successStatus, setSuccessStatus] = useRecoilState(successValueState);
  const [displayConfirmSaveDialog, setDisplayConfirmSaveDialog] =
    useRecoilState(displayConfirmSaveDialogState);
  const [saveButtonStatus, setSaveButtonStatus] = useRecoilState(
    saveButtonStatusState
  );

 
  const location = useLocation();

  const navigate = useNavigate();

  const saveData = async () => {
    const saveData = await apiRequest(
      props.method,
      props.endpointPath,
      payloadData
    );
    if (saveData) {
      alert("OK");
    }
  };

  const payload =
    type === "currency"
      ? payloadDataCurrency
      : type === "mainLocation"
      ? payloadDataMainLocation
      : type === "subLocation"
      ? payloadDataSubLocation
      : payloadData;

  return (
    <>
      <Box
        sx={{
          width: "1697px",
          height: "65px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          borderTop: "1px solid #BFBFBF",
          gap: "8px",
          position: "fixed",
          bottom: "0",
          backgroundColor: "#FFF",
          zIndex: 5,
        }}
      >
        <Button
          onClick={() => {
            // Call the cancel edit handler if provided (to reset form data)
            if (props.onCancelEdit) {
              props.onCancelEdit();
            }
            
            // Reset payload data based on type
            if (type === "currency") {
              setPayloadDataCurrency({});
            } else if (type === "mainLocation") {
              setPayloadDataMainLocation({});
            } else if (type === "subLocation") {
              setPayloadDataSubLocation({});
            } else {
              setPayloadData({});
            }
            
            // Navigate back to the main list view instead of just reloading
            navigate(props.navigatePath);
          }}
          sx={{
            height: "45px",
            padding: "12px 24px",
            borderRadius: "4px",
            border: "1px solid #BFBFBF",
            backgroundColor: "var(--jw-background-white-textwhite, #FFF)",
            "&:hover": {
              backgroundColor: "var(--jw-background-white-textwhite, #FFF)",
            },
          }}
        >
          <Typography
            sx={{
              textTransform: "none",
              color: "var(----jw-main__text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          disabled={saveButtonStatus ? false : true}
          // onClick={handleSaveClick}
          onClick={() => {
            setDisplayConfirmSaveDialog(true);
          }}
          sx={{
            height: "45px",
            padding: "12px 24px",
            borderRadius: "4px",
            marginRight: "32px",
            backgroundColor: saveButtonStatus === false ? "gray" : "#05595B",
            "&:hover": {
              backgroundColor: saveButtonStatus === false ? "gray" : "#05595B",
            },
          }}
        >
          <Typography
            sx={{
              textTransform: "none",
              color: "var(--jw-background-white-textwhite, #FFF)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Save
          </Typography>
        </Button>

        {displayConfirmSaveDialog ? (
          <ConfirmSaveDialog
            method={props.method}
            endpointPath={props.endpointPath}
            navigatePath={props.navigatePath}
            payloadData={payload}
          />
        ) : (
          ""
        )}
        {successStatus === true ? <SuscessDialog /> : <SuscessDialog />}
      </Box>
    </>
  );
};

export default Footer;
