import React,{useEffect, useState, useMemo} from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useRecoilState } from "recoil";
import {consignmentListState} from "recoil/Inventory/consignment.js"
import apiRequest from "helpers/apiHelper.js";

const InventoryConsignmentBody = ({}) => {
  const [rowPP, setRowPP] = React.useState("");
  const [loading, setLoading]= useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [consignmentList, setConsignmentList]=useRecoilState(consignmentListState);


  useEffect(()=>{
    fetchConsignmentList();
  },[])


   const fetchConsignmentList = async () => {
        try {
          setLoading(true); // Set loading to true before fetch
          const response = await apiRequest("GET", `/consignments`);
          setConsignmentList(response);
      
        } catch (error) {
          
        } finally {
          setLoading(false); // Set loading to false after fetch
        }
      };
  
      
  
  const handleChange = (event) => {
    setRowPP(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter consignment data based on search term (Ref, Stone code, Stock ID, Lot)
  const filteredConsignmentList = useMemo(() => {
    if (!searchTerm.trim()) {
      return consignmentList;
    }
    const searchLower = searchTerm.toLowerCase().trim();
    return consignmentList.filter((row) => {
      const ref = (row.ref_no || "").toLowerCase();
      const stoneCode = (row.stone_code || "").toLowerCase();
      const stockId = (row.stock_id || "").toLowerCase();
      const lotNo = (row.lot_no || "").toLowerCase();
      
      return (
        ref.includes(searchLower) ||
        stoneCode.includes(searchLower) ||
        stockId.includes(searchLower) ||
        lotNo.includes(searchLower)
      );
    });
  }, [consignmentList, searchTerm]);
  return (
    <>
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
                Inventory Consignment List
              </Typography>
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
                  value={searchTerm}
                  onChange={handleSearchChange}
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

            <Box
              sx={{
                maxWidth: "1580px",
                borderRadius: "5px",
                border: "1px solid #C6C6C8",
                marginTop: "24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  height: "600px",
                  maxWidth: "1567px",
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
                  bgcolor: "#FFF",
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
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent : "center"
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
                        Location
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                        Type
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box sx={{ padding: "12px 8px", width: "140px" , justifyContent: "center", display: "flex",
                        alignItems: "center",}}>
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
                        Memo In NO.
                      </Typography>
                    </Box>
                   
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        Ref.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        Stone Code
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
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
                        }}
                      >
                        Lot
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        Stone
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
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
                        Shape
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
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
                        Size
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        Color
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
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
                        Cutting
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
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
                        Quality
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
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
                        Clarity
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        Cer Type
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        CerNo.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
                        display: "flex",
                        justifyContent: "center",
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
                        Pcs
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "center",
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
                        Weight
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        borderLeft: "1px solid #C6C6C8",
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
                        Price
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
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
                        Unit
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "flex-end",
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
                        Amount
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "90px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderLeft: "1px solid #C6C6C8",
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
                        Currency
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "286px",
                        display: "flex",
                        justifyContent: "center",
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
                        Remark
                      </Typography>
                    </Box>
                  </Box>

                        {loading ? (
                                          <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '200px',
                                            width: '300px'
                                          }}>
                                            <Typography sx={{
                                              color: "#666666",
                                              fontFamily: "Calibri",
                                              fontSize: "16px"
                                            }}>
                                              Loading...
                                            </Typography>
                                          </Box>
                                        ) : filteredConsignmentList.length === 0 ? (
                                          <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '200px',
                                            width: '300px'
                                          }}>
                                            <Typography sx={{
                                              color: "#666666",
                                              fontFamily: "Calibri",
                                              fontSize: "16px"
                                            }}>
                                              No data available
                                            </Typography>
                                          </Box>
                                        ) :filteredConsignmentList.map((row,rowIndex)=>{

                                          return (<React.Fragment>
                                          <Box
                    sx={{
                      height: "42px",
                      gap: "4px",
                      bgcolor: "#FFF",
                      borderBottom: "1px solid #C6C6C8",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    
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
                        {rowIndex+1}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent : "center"
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
                        {row.location}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                        {row.type}
                      </Typography>
                    </Box>
                    <Box sx={{ padding: "12px 8px", width: "140px" , justifyContent: "center", display : "flex",
                        alignItems: "center", }}>
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
                        {row.memo_no}
                      </Typography>
                    </Box>
                  
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        {dayjs(row.doc_date || "").format("DD/MM/YYYY")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        
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
                        {row.account}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        {row.ref_no}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        {row.stone_code}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                        {row.stock_id}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "58px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRight: "1px solid #C6C6C8",
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
                       {row.lot_no}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
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
                        {row.stone}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
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
                        {row.shape}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
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
                         {row.size}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                           {row.color}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                          {row.cutting}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                           {row.quality}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                           {row.clarity}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                           {row.cer_type}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
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
                           {row.cer_no}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                           {row.pcs}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        alignItems: "center",
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
                           {row.weight}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        borderLeft: "1px solid #C6C6C8",
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
                           {row.price}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
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
                           {row.unit}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        alignItems: "center",
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
                           {row.amount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "90px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeft: "1px solid #C6C6C8",
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
                           {row?.currency?.code || ""}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "295px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={row.remark}
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "right",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            width: "295px",
                            height: "34px",
                            borderRadius: "4px",
                          },
                          "& .MuiInputBase-root.Mui-disabled": {
                            "& > fieldset": {
                              borderColor: "#E6E6E6",
                            },
                            bgcolor: "#F0F0F0",
                            borderRadius: "4px",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                                          </React.Fragment>)
                                        })}

                  
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default InventoryConsignmentBody;
