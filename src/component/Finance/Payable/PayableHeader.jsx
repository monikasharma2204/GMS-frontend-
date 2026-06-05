import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { payableDaybookOpenState, payableValidationErrorState, payableFSMState, payableFormDataState } from "../../../recoil/state/FinanceState";
import apiRequest from "../../../helpers/apiHelper";
import CancelConfirmDialog from "./CancelConfirmDialog";
import SuccessModal from "../../Commons/SuccessModal";

const PayableHeader = () => {
  const setDaybookOpen = useSetRecoilState(payableDaybookOpenState);
  const validationError = useRecoilValue(payableValidationErrorState);
  const [fsmState, setFsmState] = useRecoilState(payableFSMState);
  const [formData, setFormData] = useRecoilState(payableFormDataState);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [isCancelled, setIsCancelled] = React.useState(false);

  const handleCancelPayable = async (confirmed) => {
    setCancelConfirmOpen(false);
    if (!confirmed) return;

    try {
      const response = await apiRequest("PUT", `/payables/${formData.id}/cancel`);
      if (response) {
        setSuccessOpen(true);
        setIsCancelled(true);
      }
    } catch (error) {
      console.error("Failed to cancel payable:", error);
      alert("Error cancelling payable: " + (error.response?.data?.message || error.message));
    }
  };

  const effectiveIsCancelled = isCancelled || formData?.status === "cancelled";

  return (
    <Box
      sx={{
        width: "calc(100% - 64px)",
        height: "64px",
        padding: "0px 32px",
        flexShrink: 0,
        backgroundColor: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "#05595B",
            fontFamily: "Calibri",
            lineHeight: "normal",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Payable
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
        {validationError && (
          <Box
            sx={{
              position: "absolute",
              top: "15px",
              right: "0px",
              width: "479px",
              height: "42px",
              bgcolor: "#F43643",
              display: "flex",
              alignItems: "center",
              px: 2,
              gap: 2,
              borderRadius: "4px",
              zIndex: 10,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="white" />
            </svg>
            <Typography sx={{ color: "#FFF", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>
              {validationError}
            </Typography>
          </Box>
        )}
        <Button
          onClick={() => {
            if (fsmState === "view" && !effectiveIsCancelled) {
              setCancelConfirmOpen(true);
            } else if (fsmState !== "view") {
              window.location.reload();
            }
          }}
          disabled={effectiveIsCancelled}
          sx={{
            textTransform: "none",
            height: "32px",
            width: fsmState === "view" ? "130px" : "96px",
            borderRadius: "4px",
            backgroundColor: effectiveIsCancelled
              ? "rgba(180, 30, 56, 0.2)"
              : (fsmState === "view" ? "rgba(198, 169, 105, 0.2)" : "#E0E0E0"),
            color: effectiveIsCancelled
              ? "#B41E38"
              : (fsmState === "view" ? "#C6A969" : "#666"),
            border: effectiveIsCancelled
              ? "1px solid #B41E38"
              : (fsmState === "view" ? "1px solid #C6A969" : "none"),
            fontFamily: "Calibri",
            fontSize: "14px",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: effectiveIsCancelled
                ? "rgba(180, 30, 56, 0.2)"
                : (fsmState === "view" ? "rgba(198, 169, 105, 0.3)" : "#D0D0D0"),
            },
            "&.Mui-disabled": {
              backgroundColor: effectiveIsCancelled ? "rgba(180, 30, 56, 0.2)" : undefined,
              color: effectiveIsCancelled ? "#B41E38" : undefined,
              border: effectiveIsCancelled ? "1px solid #B41E38" : undefined,
            }
          }}
        >
          {fsmState === "view" ? "Cancel Payable" : "Cancel"}
        </Button>
        <Button
          onClick={() => setDaybookOpen(true)}
          sx={{
            textTransform: "none",
            height: "32px",
            width: "96px",
            borderRadius: "4px",
            backgroundColor: "#C6A969",
            color: "white",
            fontFamily: "Calibri",
            fontSize: "14px",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#B0955B",
            }
          }}
        >
          Daybook
        </Button>
      </Box>
      <CancelConfirmDialog
        open={cancelConfirmOpen}
        onConfirm={handleCancelPayable}
      />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="Payable cancelled successfully!"
      />
    </Box>
  );
};

export default PayableHeader;
