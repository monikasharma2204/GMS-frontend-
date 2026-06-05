import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilState } from "recoil";
import { bankImageModalOpenState, receivableFormDataState, receivableFSMState } from "../../../recoil/state/FinanceState";
import imgBox from "../../../Assets/image/img-box.png";
import { API_URL } from "../../../config/config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 484,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  outline: "none",
  display: "flex",
  flexDirection: "column",
};

const BankImageModal = () => {
  const [open, setOpen] = useRecoilState(bankImageModalOpenState);
  const [formData, setFormData] = useRecoilState(receivableFormDataState);
  const [fsmState] = useRecoilState(receivableFSMState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const savedImage = formData.paymentMethods.bankTransfer.slip_image;
      if (savedImage) {
        setSelectedFile(savedImage);

        if (savedImage instanceof File) {
          setPreviewUrl(URL.createObjectURL(savedImage));
        } else if (typeof savedImage === "string") {
          setPreviewUrl(savedImage.startsWith('http') ? savedImage : `${API_URL}${savedImage}`);
        }
      }
    }
  }, [open, formData.paymentMethods.bankTransfer.slip_image]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleView = () => {
    if (previewUrl) {
      setIsPreviewOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      setSelectedFile(null);
      setPreviewUrl(null);
    }, 300);
  };

  const handleSave = () => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        bankTransfer: {
          ...prev.paymentMethods.bankTransfer,
          slip_image: selectedFile
        }
      }
    }));
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px",
              borderBottom: "1px solid #EDEDED",
            }}
          >
            <Typography
              id="modal-modal-title"
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: "Calibri",
                color: "#343434",
                lineHeight: "normal",
              }}
            >
              Change Profile Picture
            </Typography>
            <Box onClick={handleClose} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.625 0.625L12.625 12.625" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.625 0.625L0.625 12.625" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flexGrow: 1,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                border: selectedFile ? "none" : "1px dashed #E3E3E3",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: selectedFile ? "default" : "pointer",
                position: "relative",
                bgcolor: selectedFile ? "#F8F8F8" : "transparent",
                "&:hover": {
                  bgcolor: selectedFile ? "#F8F8F8" : "#F9F9F9",
                },
              }}
              onClick={(!selectedFile && fsmState !== "view") ? handleBrowseClick : undefined}
            >
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img src={imgBox} alt="upload" style={{ width: "56px", height: "56px" }} />
                    <Typography
                      sx={{
                        fontFamily: "Calibri",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#343434",
                        mt: 1,
                      }}
                    >
                      Drop your image here, or{" "}
                      <span style={{
                        color: "#05595B", fontWeight: 700, fontFamily: "Calibri",
                        fontSize: "14px",
                      }}>
                        browse
                      </span>
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Calibri",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#666666",
                        mt: 0.5,
                      }}
                    >
                      Supports: JPEG, PNG, GIF, WebP (max 5MB)
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    maxHeight: "295px",
                    overflow: "hidden"
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      display: "flex",
                      gap: "8px",
                      zIndex: 10,
                    }}
                  >
                    {/* View Icon */}
                    <Box
                      onClick={handleView}
                      sx={{
                        width: "24px",
                        height: "24px",
                        bgcolor: "#FFF",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "#F0F0F0",
                          "& svg path, & svg circle": {
                            stroke: "#05595B"
                          }
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Box>

                    {/* Remove Icon */}
                    {fsmState !== "view" && (
                      <Box
                        onClick={handleRemove}
                        sx={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0px 2px 4px rgba(0,0,0,0.2)"
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#B41E38" stroke="#B41E38" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15 9L9 15" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M9 9L15 15" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </Box>
                    )}
                  </Box>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      height: "100%",
                      width: "auto",
                      borderRadius: "4px"
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              borderTop: "1px solid #EDEDED",
            }}
          >
            {fsmState === "view" ? (
              <Button
                onClick={handleClose}
                sx={{
                  height: "32px",
                  width: "96px",
                  borderRadius: "4px",
                  backgroundColor: "#05595B",
                  color: "#FFF",
                  textTransform: "none",
                  fontFamily: "Calibri",
                  fontWeight: 700,
                  fontSize: "14px",
                  "&:hover": { backgroundColor: "#044a4c" },
                }}
              >
                OK
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleClose}
                  sx={{
                    height: "32px",
                    width: "96px",
                    borderRadius: "4px",
                    border: "1px solid #EDEDED",
                    bgcolor: "#FFF",
                    color: "#343434",
                    textTransform: "none",
                    fontFamily: "Calibri",
                    fontWeight: 700,
                    fontSize: "14px",
                    "&:hover": {
                      bgcolor: "#F5F5F5",
                      border: "1px solid #BFBFBF",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    height: "32px",
                    borderRadius: "4px",
                    width: "126px",
                    bgcolor: selectedFile ? "#05595B" : "#E6E6E6",
                    color: selectedFile ? "#FFF" : "#57646E",
                    textTransform: "none",
                    padding: "0px",
                    fontFamily: "Calibri",
                    fontWeight: 700,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: selectedFile ? "#04484a" : "#E6E6E6",
                    },
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12.5V2.5Z" fill={selectedFile ? "white" : "#57646E"} />
                    <path d="M10 12.5V2.5" stroke={selectedFile ? "white" : "#57646E"} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke={selectedFile ? "white" : "#57646E"} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83203 8.3335L9.9987 12.5002L14.1654 8.3335" stroke={selectedFile ? "white" : "#57646E"} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Save Image
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        aria-labelledby="preview-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
            borderRadius: "8px",
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          <Box
            sx={{
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={previewUrl}
              alt="Slip Preview"
              style={{
                width: "320px",
                height: " 595px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BankImageModal;
