import React, { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Checkbox,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getStockMovementByStoneCode } from "../../services/stockMovementService.js";

const InventoryStockMovementInSide = ({ selectedItem, onBack }) => {
  const [rowPP, setRowPP] = React.useState("");
  const [movementDetails, setMovementDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setRowPP(event.target.value);
  };


  // Fetch stock movement details when component mounts or selectedItem changes
  useEffect(() => {
    const fetchMovementDetails = async () => {
      if (!selectedItem?.stone_code) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getStockMovementByStoneCode(selectedItem.stone_code);
        setMovementDetails(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movement details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovementDetails();
  }, [selectedItem]);

  const container1Ref = useRef(null);
  const container2Ref = useRef(null);

  const syncScroll = (sourceRef, targetRef) => {
    if (targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          padding: "24px 24px 32px 24px",
        }}
      >
        <Box
          sx={{
            padding: "32px 32px 0px 32px",
            bgcolor: "#F8F8F8",
            minHeight: "687px",
          }}
        >
          <Box>
            <Box
              sx={{
                height: "38px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  onClick={onBack}
                  sx={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="31"
                    height="30"
                    viewBox="0 0 31 30"
                    fill="none"
                  >
                    <path
                      d="M19.7188 6.5625L11.2812 15L19.7188 23.4375"
                      stroke="#343434"
                      strokeWidth="1.875"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                  </svg>
                </Box>
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  {selectedItem ? `${selectedItem.stone_code} Lot ${selectedItem.lot_no}` : 'Stock Movement Details'}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Date :
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    defaultValue={dayjs()}
                    format="DD/MM/YYYY"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "150px",
                        height: "34px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "&:hover": {
                          backgroundColor: "#F5F8FF",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: "16px",
                          fontFamily: "Calibri",
                        },
                      },
                      marginRight: "8px",
                      marginLeft: "8px",
                    }}
                  />
                </LocalizationProvider>
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  To
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    defaultValue={dayjs()}
                    format="DD/MM/YYYY"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "150px",
                        height: "34px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "&:hover": {
                          backgroundColor: "#F5F8FF",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: "16px",
                          fontFamily: "Calibri",
                        },
                      },
                      marginRight: "24px",
                      marginLeft: "8px",
                    }}
                  />
                </LocalizationProvider>
                <TextField
                  placeholder="Search List ..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.4993 2C9.14387 2.00012 7.80814 2.32436 6.60353 2.94569C5.39893 3.56702 4.36037 4.46742 3.57451 5.57175C2.78866 6.67609 2.27829 7.95235 2.08599 9.29404C1.89368 10.6357 2.02503 12.004 2.46906 13.2846C2.91308 14.5652 3.65692 15.7211 4.63851 16.6557C5.6201 17.5904 6.81098 18.2768 8.11179 18.6576C9.4126 19.0384 10.7856 19.1026 12.1163 18.8449C13.447 18.5872 14.6967 18.015 15.7613 17.176L19.4133 20.828C19.6019 21.0102 19.8545 21.111 20.1167 21.1087C20.3789 21.1064 20.6297 21.0012 20.8151 20.8158C21.0005 20.6304 21.1057 20.3796 21.108 20.1174C21.1102 19.8552 21.0094 19.6026 20.8273 19.414L17.1753 15.762C18.1633 14.5086 18.7784 13.0024 18.9504 11.4157C19.1223 9.82905 18.8441 8.22602 18.1475 6.79009C17.4509 5.35417 16.3642 4.14336 15.0116 3.29623C13.659 2.44911 12.0952 1.99989 10.4993 2ZM3.99928 10.5C3.99928 8.77609 4.6841 7.12279 5.90308 5.90381C7.12207 4.68482 8.77537 4 10.4993 4C12.2232 4 13.8765 4.68482 15.0955 5.90381C16.3145 7.12279 16.9993 8.77609 16.9993 10.5C16.9993 12.2239 16.3145 13.8772 15.0955 15.0962C13.8765 16.3152 12.2232 17 10.4993 17C8.77537 17 7.12207 16.3152 5.90308 15.0962C4.6841 13.8772 3.99928 12.2239 3.99928 10.5Z"
                            fill="#57646F"
                          />
                        </svg>
                      </InputAdornment>
                    ),
                    sx: {
                      color: "#9A9A9A",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    },
                  }}
                  sx={{
                    "& .MuiInputLabel-asterisk": {
                      color: "red",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {},
                      borderRadius: "10px",
                      backgroundColor: "#FFF",
                      width: "330px",
                      height: "35px",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8BB4FF",
                      },
                      "&:hover": {
                        backgroundColor: "#F5F8FF",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8BB4FF",
                      },
                    },
                    marginRight: "24px",
                  }}
                />
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Rows per page
                </Typography>
                <FormControl
                  defaultValue="10"
                  sx={{
                    height: "40px",
                    width: "69px",
                    marginLeft: "8px",
                  }}
                >
                  <Select
                    sx={{
                      height: "40px",
                      width: "69px",
                      backgroundColor: "#FFF",
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                    value={rowPP}
                    onChange={handleChange}
                  >
                    <MenuItem
                      value={10}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      10
                    </MenuItem>
                    <MenuItem
                      value={20}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      20
                    </MenuItem>
                    <MenuItem
                      value={30}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      30
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Main Table - Show dynamic data when available, otherwise show loading/empty state */}
            {movementDetails && movementDetails.movements ? (
              <>
                <Box
                  sx={{
                    maxWidth: "1580px",
                    borderRadius: "5px",
                    border: "1px solid #C6C6C8",
                    marginTop: "24px",
                  }}
                >
                  <Box
                    ref={container1Ref}
                    onScroll={() => syncScroll(container1Ref, container2Ref)}
                    sx={{
                      display: "flex",
                      height: "550px",
                      overflowY: "scroll",
                      overflowX: "hidden",
                      bgcolor: "#FFF",
                      "&::-webkit-scrollbar": {
                        height: "10px",
                        width: "5px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#FFF",
                        borderRadius: "5px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#919191",
                        borderRadius: "5px",
                      },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          height: "42px",
                          gap: "4px",
                          bgcolor: "#EDEDED",
                          borderBottom: "1px solid #C6C6C8",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Checkbox />
                        </Box>
                        <Box sx={{ padding: "12px 8px" }}>
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            #
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Doc Date
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Ref
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Stock ID
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Account
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "556px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(5, 89, 91, 0.40)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            In
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "556px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(224, 4, 16, 0.40)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Out
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "986px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(139, 180, 255, 0.40)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Balance
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          height: "20px",
                          gap: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ marginLeft: "646px" }} />

                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(5, 89, 91, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Pcs
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(5, 89, 91, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Weight
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(5, 89, 91, 0.20)",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Price / Unit
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(5, 89, 91, 0.20)",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginRight: "12px",
                            }}
                          >
                            Amount
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(224, 4, 16, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Pcs
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(224, 4, 16, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Weight
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(224, 4, 16, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Price / Unit
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(224, 4, 16, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Amount
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Pcs
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Weight
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "283px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Stock Cost
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "283px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Stock Value
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            Profit
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          height: "20px",
                          gap: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ marginLeft: "646px" }} />

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "122px",
                            display: "flex",
                            alignItems: "center",
                            borderLeft: "1px solid #C6C6C8",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />

                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Price / Unit
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "139px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginRight: "12px",
                            }}
                          >
                            Amount
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Price / Unit
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "139px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginRight: "12px",
                            }}
                          >
                            Amount
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "122px",
                            padding: "9px",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(139, 180, 255, 0.20)",
                            justifyContent: "flex-end",
                          }} />
                      </Box>

                      {/* Dynamic Table Rows */}
                      {movementDetails.movements.map((movement, index) => (
                        <Box
                          key={index}
                          sx={{
                            height: "42px",
                            gap: "4px",
                            borderBottom: "1px solid #C6C6C8",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Checkbox />
                          </Box>
                          <Box sx={{ padding: "12px 8px" }}>
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {index + 1}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "124px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                                cursor: "pointer",
                              }}
                            >
                              {new Date(movement.doc_date).toLocaleDateString('en-GB')}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "124px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.ref}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "124px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.stock_id}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "124px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.account}
                            </Typography>
                          </Box>

                          {/* In Section */}
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "122px",
                              display: "flex",
                              alignItems: "center",
                              borderLeft: "1px solid #C6C6C8",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.in_pcs && movement.in_pcs !== 0 ? movement.in_pcs : ""}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.in_weight && movement.in_weight !== 0 ? movement.in_weight : ""}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.in_price && movement.in_price !== 0 ? `${movement.in_price.toLocaleString()} / pcs` : ""}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.in_amount && movement.in_amount !== 0 ? movement.in_amount.toLocaleString() : ""}
                            </Typography>
                          </Box>

                          {/* Out Section */}
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.out_pcs && movement.out_pcs !== 0 ? movement.out_pcs : ""}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.out_weight && movement.out_weight !== 0 ? movement.out_weight : ""}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.out_price && movement.out_price !== 0 ? `${movement.out_price.toLocaleString()} / pcs` : ""}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.out_amount && movement.out_amount !== 0 ? movement.out_amount.toLocaleString() : ""}
                            </Typography>
                          </Box>

                          {/* Balance Section */}
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.balance_pcs}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.balance_weight}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "122px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.stock_cost_price?.toLocaleString()} / pcs
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "123px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.stock_cost_amount?.toLocaleString() || '-'}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "124px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.stock_value_price?.toLocaleString() || '-'}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "122px",
                              display: "flex",
                              alignItems: "center",
                              borderRight: "1px solid #C6C6C8",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#343434",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.stock_value_amount?.toLocaleString() || '-'}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              padding: "12px 8px",
                              width: "124px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              bgcolor: "rgba(139, 180, 255, 0.40)",
                            }}
                          >
                            <Typography
                              sx={{
                                color: movement.profit >= 0 ? "#4CAF50" : "#F44336",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {movement.profit >= 0 ? '+' : ''}{movement.profit?.toLocaleString() || '-'}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    maxWidth: "1580px",
                    borderRadius: "5px",
                    borderLeft: "1px solid #C6C6C8",
                    borderRight: "1px solid #C6C6C8",
                    borderBottom: "1px solid #C6C6C8",
                    position: "absolute",
                    top: "806px"
                  }}
                >
                  <Box
                    ref={container2Ref}
                    onScroll={() => syncScroll(container2Ref, container1Ref)}
                    sx={{
                      display: "flex",
                      height: "52px",
                      borderBottomLeftRadius: "5px",
                      borderBottomRightRadius: "5px",
                      bgcolor: "#FFF",
                      overflow: "scroll",
                      "&::-webkit-scrollbar": {
                        height: "10px",
                        width: "5px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#FFF",
                        borderRadius: "5px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#919191",
                        borderRadius: "5px",
                      },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          height: "42px",
                          gap: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ padding: "12px 8px", marginLeft: "54px" }}></Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        ></Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        ></Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                            display: "flex",
                            alignItems: "center",
                          }}
                        ></Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            Total
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "122px",
                            display: "flex",
                            alignItems: "center",
                            borderLeft: "1px solid #C6C6C8",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.in_pcs || 0), 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.in_weight || 0), 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.in_amount || 0), 0).toLocaleString()}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.out_pcs || 0), 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.out_weight || 0), 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }} />
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.out_amount || 0), 0).toLocaleString()}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.balance_pcs || 0), 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.movements.reduce((sum, m) => sum + (m.balance_weight || 0), 0)}
                          </Typography>
                        </Box>
                       
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "122px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            -
                          </Typography>
                        </Box>
               
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "123px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            borderRight: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              borderRight: "1px solid #C6C6C8",
                            }}
                          >
                            {movementDetails.stock_cost_amount_total?.toLocaleString() || '-'}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "140px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "139px",
                            display: "flex",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.stock_value_amount_total?.toLocaleString() || '-'}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "124px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            bgcolor: "rgba(139, 180, 255, 0.40)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: movementDetails.profit >= 0 ? "#4CAF50" : "#F44336",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                            }}
                          >
                            {movementDetails.profit >= 0 ? '+' : ''}{movementDetails.profit?.toLocaleString() || '-'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryStockMovementInSide;
