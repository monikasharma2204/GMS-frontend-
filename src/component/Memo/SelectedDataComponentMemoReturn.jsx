import React, { useState } from "react";
import { Grid, Paper, TextField, Typography, Box, Button } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import customIcon from "../../Assets/image/mingcute_down-line.png";

const stone = [
  { value: "", label: "None" },
  { value: "stone_01", label: "Stone_01" },
];

const SelectedDataComponentMemoReturn = ({
  state,
  handleAddRow,
  handleNumberChange,
  handleSelectChange,
  calculateAmount,
  calculateOtherPrice,
  handleDiscountPercenChangeInTalble,
  handleDiscountAmountChangeInTable,
  calculateAmountAfterDiscount,
  handleDelete,
  formatNumberWithCommas,
}) => {
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Typography
        sx={{
          color: "var(--HeadPage, #05595B)",
          fontFamily: "Calibri",
          fontSize: "21px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
        }}
      >
        Item
      </Typography>
      <Box
        sx={{
          width: "1020px",
          alignItems: "flex-start",
          border: "1px solid var(--Line-Table, #C6C6C8)",
          borderRadius: "5px",
          bgcolor: "#FFF",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "294px",
            overflow: "scroll",
            "&::-webkit-scrollbar": {
              height: "5px",
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
                bgcolor: "var(--Head-Table, #EDEDED)",
                border: "0px solid var(--Line-Table, #C6C6C8)",
                display: "flex",
              }}
            >
              <Box sx={{ width: "34px" }}></Box>

              <Box
                sx={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
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
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Pic
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
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
                  width: "140px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Stone
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "100px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Shape
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Size
                </Typography>
              </Box>
            </Box>
            {state.selectedItems.map((item, index) =>
              item.type === "text" ? (
                <Box
                  key={index}
                  sx={{
                    height: "42px",
                    bgcolor: "#FFF",
                    border: "0px solid var(--Line-Table, #C6C6C8)",
                    display: "flex",
                  }}
                >
                  <Box
                    onClick={() => handleDelete(item.account)}
                    sx={{
                      width: "34px",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M6.1875 8.4375H11.8125C11.9617 8.4375 12.1048 8.49676 12.2102 8.60225C12.3157 8.70774 12.375 8.85082 12.375 9C12.375 9.14918 12.3157 9.29226 12.2102 9.39775C12.1048 9.50324 11.9617 9.5625 11.8125 9.5625H6.1875C6.03832 9.5625 5.89524 9.50324 5.78975 9.39775C5.68426 9.29226 5.625 9.14918 5.625 9C5.625 8.85082 5.68426 8.70774 5.78975 8.60225C5.89524 8.49676 6.03832 8.4375 6.1875 8.4375Z"
                        fill="#E00410"
                      />
                      <path
                        d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875Z"
                        fill="#E00410"
                      />
                    </svg>
                  </Box>

                  <Box
                    sx={{
                      width: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
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
                      width: "40px",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#F2F2F2",
                        height: "32px",
                        width: "32px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.stone}
                      onChange={(e) =>
                        handleNumberChange(index, "num1", e.target.value)
                      }
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "136px",
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

                  <Box
                    sx={{
                      width: "100px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.shape}
                      onChange={(e) =>
                        handleNumberChange(index, "num1", e.target.value)
                      }
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "96px",
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

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.size}
                      onChange={(e) =>
                        handleNumberChange(index, "num1", e.target.value)
                      }
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
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
                          width: "136px",
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
              ) : (
                <Box
                  key={index}
                  sx={{
                    height: "42px",
                    bgcolor: "#FFF",
                    border: "0px solid var(--Line-Table, #C6C6C8)",
                    display: "flex",
                  }}
                >
                  <Box
                    onClick={() => handleDelete(item.account)}
                    sx={{
                      width: "34px",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M6.1875 8.4375H11.8125C11.9617 8.4375 12.1048 8.49676 12.2102 8.60225C12.3157 8.70774 12.375 8.85082 12.375 9C12.375 9.14918 12.3157 9.29226 12.2102 9.39775C12.1048 9.50324 11.9617 9.5625 11.8125 9.5625H6.1875C6.03832 9.5625 5.89524 9.50324 5.78975 9.39775C5.68426 9.29226 5.625 9.14918 5.625 9C5.625 8.85082 5.68426 8.70774 5.78975 8.60225C5.89524 8.49676 6.03832 8.4375 6.1875 8.4375Z"
                        fill="#E00410"
                      />
                      <path
                        d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875Z"
                        fill="#E00410"
                      />
                    </svg>
                  </Box>

                  <Box
                    sx={{
                      width: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--Main-Text, #343434)",
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
                      width: "40px",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#F2F2F2",
                        height: "32px",
                        width: "32px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      width: "60px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "56px",
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

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="stone1">Stone_1</MenuItem>
                      <MenuItem value="stone2">Stone_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "100px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "96px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="Shape1">Shape_1</MenuItem>
                      <MenuItem value="Shape2">Shape_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="Size1">Size_1</MenuItem>
                      <MenuItem value="Size2">Size_2</MenuItem>
                    </Select>
                  </Box>
                </Box>
              )
            )}
          </Box>

          <Box
            sx={{
              width: "794px",
            }}
          >
            <Box
              sx={{
                width: "max-content",
                height: "42px",
                bgcolor: "var(--Head-Table, #EDEDED)",
                border: "0px solid var(--Line-Table, #C6C6C8)",
                display: "flex",
              }}
            >
              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Color
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Cutting
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Quality
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Clarity
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Cer Type
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "140px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Main-Text, #343434)",
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
                  borderLeft: "1px solid #C6C6C8",
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "90px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
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
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
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
              </Box>

              <Box
                sx={{
                  // borderLeft: "1px solid #C6C6C8",
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "90px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Return Pcs
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Return Weight
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end ",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      marginRight: "8px",
                    }}
                  >
                    Price
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "90px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      marginLeft: "8px",
                    }}
                  >
                    Unit
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      marginRight: "8px",
                    }}
                  >
                    Amount
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      marginRight: "8px",
                    }}
                  >
                    Other Price
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "90px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      marginLeft: "8px ",
                    }}
                  >
                    Unit
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "90px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Discount (%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Discount Amt
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "140px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Labour
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "120px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
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
                    width: "90px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
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
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid #C6C6C8",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "120px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Total Amount
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "140px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                    }}
                  >
                    Ref No.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "286px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
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
            </Box>
            {state.selectedItems.map((item, index) =>
              item.type === "text" ? (
                <Box
                  key={index}
                  sx={{
                    width: "max-content",
                    height: "42px",
                    bgcolor: "#FFF",
                    border: "0px solid var(--Line-Table, #C6C6C8)",
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.color}
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "136px",
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

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.cutting}
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "136px",
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

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.quality}
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "136px",
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

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.clarity}
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "136px",
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

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.cer_type}
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
                      inputProps={{
                        shrink: true,
                        sx: {
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          width: "136px",
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

                  <Box
                    sx={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={item.cer_no}
                      variant="outlined"
                      fullWidth
                      disabled={item.disabled}
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
                          width: "136px",
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

                  <Box
                    sx={{
                      borderLeft: "1px solid #C6C6C8",
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={item.pcs}
                        onChange={(e) =>
                          handleNumberChange(index, "pcs", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
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
                            width: "86px",
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
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={item.weight}
                        onChange={(e) =>
                          handleNumberChange(index, "weight", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          shrink: true,
                          type: "number",
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
                            width: "116px",
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
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end ",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={item.price}
                        onChange={(e) =>
                          handleNumberChange(index, "price", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
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
                            width: "116px",
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
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Select
                        value={item.unit_price}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                        displayEmpty
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "center",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          width: "86px",
                          height: "34px",
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                          // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                          //   WebkitTransform: "inherit !important",
                          //   transform: "inherit !important",
                          //   transition: "inherit !important",
                          // },
                          ".MuiSelect-icon": {
                            // display: "none",
                            color: "#666666",
                          },
                          ".stone_selectbox_icon_arrow": {
                            right: "8px",
                            position: "relative",
                            cursor: "pointer",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C4C4C4",
                          },
                        }}
                      >
                        <MenuItem value="pcs">Pcs</MenuItem>
                        <MenuItem value="cts">Cts</MenuItem>
                      </Select>
                    </Box>
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={calculateAmount(item).toFixed(2)}
                        variant="outlined"
                        fullWidth
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
                            width: "116px",
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

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={calculateOtherPrice(item)}
                        variant="outlined"
                        fullWidth
                        disabled={item.disabled}
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
                            width: "116px",
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
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={
                          item.unit_price === "pcs"
                            ? "Cts"
                            : item.unit_price === "cts"
                              ? "Pcs"
                              : ""
                        }
                        variant="outlined"
                        fullWidth
                        disabled={item.disabled}
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
                            width: "86px",
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

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={item.discount_percent}
                        onChange={(e) =>
                          handleDiscountPercenChangeInTalble(
                            index,
                            e.target.value
                          )
                        }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          // type: "number",
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
                            width: "86px",
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
                          // "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          //   {
                          //     display: "none",
                          //   },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={item.discount_amount}
                        onChange={(e) =>
                          handleDiscountAmountChangeInTable(
                            index,
                            e.target.value
                          )
                        }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          // type: "number",
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
                            width: "116px",
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
                          // "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          //   {
                          //     display: "none",
                          //   },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "2px",
                      }}
                    >
                      <Select
                        onChange={handleChange}
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "center",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          width: "136px",
                          height: "34px",
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                          // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                          //   WebkitTransform: "inherit !important",
                          //   transform: "inherit !important",
                          //   transition: "inherit !important",
                          // },
                          ".MuiSelect-icon": {
                            // display: "none",
                            color: "#666666",
                          },
                          ".stone_selectbox_icon_arrow": {
                            right: "8px",
                            position: "relative",
                            cursor: "pointer",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C4C4C4",
                          },
                        }}
                        defaultValue={item.labour_type}
                      >
                        <MenuItem value="Recutting">Recutting</MenuItem>
                        <MenuItem value="ReShape">ReShape</MenuItem>
                      </Select>
                    </Box>
                    <Box
                      sx={{
                        width: "120px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={item.labour_price}
                        onChange={(e) =>
                          handleNumberChange(
                            index,
                            "labour_price",
                            e.target.value
                          )
                        }
                        variant="outlined"
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
                            width: "116px",
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
                    <Box
                      sx={{
                        width: "90px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "2px",
                      }}
                    >
                      <Select
                        defaultValue={item.labour_unit}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "center",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          width: "86px",
                          height: "34px",
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                          // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                          //   WebkitTransform: "inherit !important",
                          //   transform: "inherit !important",
                          //   transition: "inherit !important",
                          // },
                          ".MuiSelect-icon": {
                            // display: "none",
                            color: "#666666",
                          },
                          ".stone_selectbox_icon_arrow": {
                            right: "8px",
                            position: "relative",
                            cursor: "pointer",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C4C4C4",
                          },
                        }}
                      >
                        <MenuItem value="pcs">Pcs</MenuItem>
                        <MenuItem value="cts">Cts</MenuItem>
                      </Select>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={calculateAmountAfterDiscount(item)}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          readOnly: true,
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
                            width: "116px",
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

                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "140px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        disabled
                        value={item.no}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          readOnly: true,
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
                            width: "136px",
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
                    <Box
                      sx={{
                        width: "286px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        fullWidth
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
                            width: "282px",
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
                </Box>
              ) : (
                <Box
                  key={index}
                  sx={{
                    width: "max-content",
                    height: "42px",
                    bgcolor: "#FFF",
                    border: "0px solid var(--Line-Table, #C6C6C8)",
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="color1">Color_1</MenuItem>
                      <MenuItem value="color2">Color_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="cutting1">Cutting_1</MenuItem>
                      <MenuItem value="cutting2">Cutting_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="quality1">Quality_1</MenuItem>
                      <MenuItem value="quality2">Quality_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="clarity1">Clarity_1</MenuItem>
                      <MenuItem value="clarity2">Clarity_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="cer_type1">CerType_1</MenuItem>
                      <MenuItem value="cer_type2">CerType_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      width: "140px",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        handleSelectChange(index, e.target.value)
                      }
                      displayEmpty
                      inputProps={{
                        shrink: true,
                        sx: {
                          textAlign: "center",
                          color: "black",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        },
                      }}
                      sx={{
                        width: "136px",
                        height: "34px",
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                        //   WebkitTransform: "inherit !important",
                        //   transform: "inherit !important",
                        //   transition: "inherit !important",
                        // },
                        ".MuiSelect-icon": {
                          // display: "none",
                          color: "#666666",
                        },
                        ".stone_selectbox_icon_arrow": {
                          right: "8px",
                          position: "relative",
                          cursor: "pointer",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#C4C4C4",
                        },
                      }}
                    >
                      <MenuItem value="cer_no1">CerNo_1</MenuItem>
                      <MenuItem value="cer_no2">CerNo_2</MenuItem>
                    </Select>
                  </Box>

                  <Box
                    sx={{
                      borderLeft: "1px solid #C6C6C8",
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={item.pcs}
                        onChange={(e) =>
                          handleNumberChange(index, "pcs", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
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
                            width: "86px",
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
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={item.weight}
                        onChange={(e) =>
                          handleNumberChange(index, "weight", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          shrink: true,
                          type: "number",
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
                            width: "116px",
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
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      // borderLeft: "1px solid #C6C6C8",
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        // value={item.pcs}
                        // onChange={(e) =>
                        //   handleNumberChange(index, "pcs", e.target.value)
                        // }
                        variant="outlined"
                        fullWidth
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
                            width: "86px",
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
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        // value={item.weight}
                        // onChange={(e) =>
                        //   handleNumberChange(index, "weight", e.target.value)
                        // }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          shrink: true,
                          type: "number",
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
                            width: "116px",
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
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end ",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={item.price}
                        onChange={(e) =>
                          handleNumberChange(index, "price", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
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
                            width: "116px",
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
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Select
                        value={item.unit_price}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                        displayEmpty
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "center",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          width: "86px",
                          height: "34px",
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                          // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                          //   WebkitTransform: "inherit !important",
                          //   transform: "inherit !important",
                          //   transition: "inherit !important",
                          // },
                          ".MuiSelect-icon": {
                            // display: "none",
                            color: "#666666",
                          },
                          ".stone_selectbox_icon_arrow": {
                            right: "8px",
                            position: "relative",
                            cursor: "pointer",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C4C4C4",
                          },
                        }}
                      >
                        <MenuItem value="pcs">Pcs</MenuItem>
                        <MenuItem value="cts">Cts</MenuItem>
                      </Select>
                    </Box>
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={calculateAmount(item).toFixed(2)}
                        variant="outlined"
                        fullWidth
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
                            width: "116px",
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

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={calculateOtherPrice(item)}
                        variant="outlined"
                        fullWidth
                        disabled
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
                            width: "116px",
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
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={
                          item.unit_price === "pcs"
                            ? "Cts"
                            : item.unit_price === "cts"
                              ? "Pcs"
                              : ""
                        }
                        variant="outlined"
                        fullWidth
                        disabled
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
                            width: "86px",
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

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "90px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={item.discount_percent}
                        onChange={(e) =>
                          handleDiscountPercenChangeInTalble(
                            index,
                            e.target.value
                          )
                        }
                        variant="outlined"
                        fullWidth
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
                            width: "86px",
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
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={item.discount_amount}
                        onChange={(e) =>
                          handleDiscountAmountChangeInTable(
                            index,
                            e.target.value
                          )
                        }
                        variant="outlined"
                        fullWidth
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
                            width: "116px",
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

                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "2px",
                      }}
                    >
                      <Select
                        onChange={handleChange}
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "center",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          width: "136px",
                          height: "34px",
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                          // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                          //   WebkitTransform: "inherit !important",
                          //   transform: "inherit !important",
                          //   transition: "inherit !important",
                          // },
                          ".MuiSelect-icon": {
                            // display: "none",
                            color: "#666666",
                          },
                          ".stone_selectbox_icon_arrow": {
                            right: "8px",
                            position: "relative",
                            cursor: "pointer",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C4C4C4",
                          },
                        }}
                        defaultValue={item.labour_type}
                      >
                        <MenuItem value="Recutting">Recutting</MenuItem>
                        <MenuItem value="ReShape">ReShape</MenuItem>
                      </Select>
                    </Box>
                    <Box
                      sx={{
                        width: "120px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={item.labour_price}
                        onChange={(e) =>
                          handleNumberChange(
                            index,
                            "labour_price",
                            e.target.value
                          )
                        }
                        variant="outlined"
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
                            width: "116px",
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
                    <Box
                      sx={{
                        width: "90px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "2px",
                      }}
                    >
                      <Select
                        defaultValue={item.labour_unit}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{
                          shrink: true,
                          sx: {
                            textAlign: "center",
                            color: "black",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                          },
                        }}
                        sx={{
                          width: "86px",
                          height: "34px",
                          "& .MuiInputLabel-root": {
                            display: "none",
                          },
                          // ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                          //   WebkitTransform: "inherit !important",
                          //   transform: "inherit !important",
                          //   transition: "inherit !important",
                          // },
                          ".MuiSelect-icon": {
                            // display: "none",
                            color: "#666666",
                          },
                          ".stone_selectbox_icon_arrow": {
                            right: "8px",
                            position: "relative",
                            cursor: "pointer",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C4C4C4",
                          },
                        }}
                      >
                        <MenuItem value="pcs">Pcs</MenuItem>
                        <MenuItem value="cts">Cts</MenuItem>
                      </Select>
                    </Box>
                  </Box>

                  {/* Total Amount */}
                  <Box
                    sx={{
                      borderRight: "1px solid #C6C6C8",
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        value={calculateAmountAfterDiscount(item)}
                        variant="outlined"
                        fullWidth
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
                            width: "116px",
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

                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Box
                      sx={{
                        width: "140px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "4px",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        fullWidth
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
                            width: "136px",
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
                    <Box
                      sx={{
                        width: "286px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        fullWidth
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
                            width: "282px",
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
                </Box>
              )
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "12px",
        }}
      >
        <Box
          onClick={handleAddRow}
          sx={{ display: "flex", cursor: "pointer", marginTop: "11px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18 12.9961H13V17.9961C13 18.2613 12.8946 18.5157 12.7071 18.7032C12.5196 18.8907 12.2652 18.9961 12 18.9961C11.7348 18.9961 11.4804 18.8907 11.2929 18.7032C11.1054 18.5157 11 18.2613 11 17.9961V12.9961H6C5.73478 12.9961 5.48043 12.8907 5.29289 12.7032C5.10536 12.5157 5 12.2613 5 11.9961C5 11.7309 5.10536 11.4765 5.29289 11.289C5.48043 11.1015 5.73478 10.9961 6 10.9961H11V5.99609C11 5.73088 11.1054 5.47652 11.2929 5.28899C11.4804 5.10145 11.7348 4.99609 12 4.99609C12.2652 4.99609 12.5196 5.10145 12.7071 5.28899C12.8946 5.47652 13 5.73088 13 5.99609V10.9961H18C18.2652 10.9961 18.5196 11.1015 18.7071 11.289C18.8946 11.4765 19 11.7309 19 11.9961C19 12.2613 18.8946 12.5157 18.7071 12.7032C18.5196 12.8907 18.2652 12.9961 18 12.9961Z"
              fill="#1B84FF"
            />
          </svg>
          <Typography
            sx={{
              color: "#1B84FF",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "noemal",
            }}
          >
            Add Row
          </Typography>
        </Box>
      </Box>
      <TextField
        label="Remark"
        placeholder="This remark will be shown on document"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        multiline
        rows={3}
        sx={{
          width: "1022px",
          "& .MuiOutlinedInput-root": { borderRadius: "8px" },
          marginTop: "24px",
          bgcolor: "#FFF",
        }}
      />
    </>
  );
};

export default SelectedDataComponentMemoReturn;
