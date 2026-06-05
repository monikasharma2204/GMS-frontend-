import React from "react";
import { Box, Button, Typography, Popover, TextField, List, ListItem, ListItemText, Checkbox } from "@mui/material";


const AccountFilterPopover = ({
  open,
  anchorEl,
  onClose,
  accountSortOrder,
  setAccountSortOrder,
  accountSearch,
  setAccountSearch,
  isAllSelected,
  isSomeSelected,
  handleSelectAllDropdown,
  setSelectedItemIds,
  uniqueAccounts,
  getAccountStatus,
  handleToggleAccount,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'left',
  },
  PaperProps = {},
  sortConfig,
  setSortConfig,
  showSort = true,
  handleClearFilter,
}) => {
  const isSortAscActive = sortConfig 
    ? (sortConfig.key === 'account' && sortConfig.direction === 'asc')
    : (accountSortOrder === "asc");

  const isSortDescActive = sortConfig 
    ? (sortConfig.key === 'account' && sortConfig.direction === 'desc')
    : (accountSortOrder === "desc");

  const handleSortAsc = () => {
    setAccountSortOrder("asc");
    if (setSortConfig) {
      setSortConfig({ key: 'account', direction: 'asc' });
    }
  };

  const handleSortDesc = () => {
    setAccountSortOrder("desc");
    if (setSortConfig) {
      setSortConfig({ key: 'account', direction: 'desc' });
    }
  };

  const calculatedMarginLeft = React.useMemo(() => {
    if (!anchorEl) return "-42px";
    try {
      const boxRect = anchorEl.getBoundingClientRect();
      const boxWidth = boxRect.width;

      const svgElement = anchorEl.querySelector("svg");
      const textElement = anchorEl.querySelector("p") || 
                          anchorEl.querySelector(".MuiTypography-root") || 
                          anchorEl.querySelector("span") || 
                          anchorEl.firstElementChild;

      if (boxWidth) {
        let contentRight = 0;
        if (svgElement) {
          contentRight = svgElement.getBoundingClientRect().right;
        } else if (textElement) {
          contentRight = textElement.getBoundingClientRect().right + 16;
        }

        if (contentRight > 0) {
          const shift = boxRect.right - contentRight;
          if (shift >= 0 && shift <= boxWidth) {
            return `-${shift}px`;
          }
        }
      }
    } catch (e) {
      console.error("Error calculating dynamic margin left:", e);
    }
    return "-42px";
  }, [anchorEl, open]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        ...PaperProps,
        sx: {
          width: "267px",
          maxWidth: "267px",
          padding: "16px",
          gap: "8px",
          maxHeight: "500px",
          borderRadius: "8px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          marginLeft: calculatedMarginLeft,
          ...PaperProps.sx,
        }
      }}
    >

      {showSort && (
        <Box sx={{ gap: "8px", display: "flex", flexDirection: "column", paddingBottom: "16px", borderBottom: "1px solid #EDEDED" }}>
        {/* Sort Section */}
        <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "12px", color: "#343434" }}>
          Sort
        </Typography>
        <Box sx={{ display: "flex", mb: "0px", gap: "8px" }}>
          <Button
            fullWidth
            onClick={handleSortAsc}
            sx={{
               height: "32px",
               bgcolor: isSortAscActive ? "#05595B" : "#FFF",
               color: isSortAscActive ? "#FFF" : "#57646E",
               border: "1px solid #EDEDED",
               textTransform: "none",
               fontFamily: "Calibri",
               lineHeight: "normal",
               fontWeight: 700,
               fontSize: "14px",
               borderRadius: "4px",
               display: "flex",
               gap: 1,
               justifyContent: "center",
               "&:hover": {
                 bgcolor: isSortAscActive ? "#04484a" : "#F8F8F8",
 
               }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", width: "20px" }}>
 
              {isSortAscActive ? (
                // Case 3: PASTE ACTIVE ASCENDING SVG HERE
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 13.3334L5.83333 16.6667L9.16667 13.3334" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83325 16.6667V3.33337" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.6667 6.66663H12.5" stroke="white" stroke-opacity="0.24" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 8.33337V5.41671C12.5 4.86417 12.7195 4.33427 13.1102 3.94357C13.5009 3.55287 14.0308 3.33337 14.5833 3.33337C15.1359 3.33337 15.6658 3.55287 16.0565 3.94357C16.4472 4.33427 16.6667 4.86417 16.6667 5.41671V8.33337" stroke="white" stroke-opacity="0.24" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 11.6666H16.6667L12.5 16.6666H16.6667" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
 
 
                </>
              ) : (
                // Case 1: PASTE INACTIVE ASCENDING SVG HERE
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 13.3334L5.83333 16.6667L9.16667 13.3334" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83325 16.6667V3.33337" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.6667 6.66663H12.5" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 8.33337V5.41671C12.5 4.86417 12.7195 4.33427 13.1102 3.94357C13.5009 3.55287 14.0308 3.33337 14.5833 3.33337C15.1359 3.33337 15.6658 3.55287 16.0565 3.94357C16.4472 4.33427 16.6667 4.86417 16.6667 5.41671V8.33337" stroke="#05595B" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 11.6666H16.6667L12.5 16.6666H16.6667" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
 
 
                </>
              )}
            </Box>
            Ascending
          </Button>
          <Button
            fullWidth
            onClick={handleSortDesc}
            sx={{
               height: "32px",
               bgcolor: isSortDescActive ? "#05595B" : "#FFF",
               color: isSortDescActive ? "#FFF" : "#57646E",
               border: "1px solid #EDEDED",
               textTransform: "none",
               lineHeight: "normal",
               fontFamily: "Calibri",
               fontWeight: 700,
               fontSize: "14px",
               borderRadius: "4px",
               display: "flex",
               gap: 1,
               justifyContent: "center",
               "&:hover": {
                 bgcolor: isSortDescActive ? "#04484a" : "#F8F8F8",
 
               }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", width: "20px" }}>
 
              {isSortDescActive ? (
                // Case 4: PASTE ACTIVE DESCENDING SVG HERE
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 13.3334L5.83333 16.6667L9.16667 13.3334" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83325 3.33337V16.6667" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.33337H16.6667L12.5 8.33337H16.6667" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 16.6666V13.75C12.5 13.1974 12.7195 12.6675 13.1102 12.2768C13.5009 11.8861 14.0308 11.6666 14.5833 11.6666C15.1359 11.6666 15.6658 11.8861 16.0565 12.2768C16.4472 12.6675 16.6667 13.1974 16.6667 13.75V16.6666" stroke="white" stroke-opacity="0.24" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.6667 15H12.5" stroke="white" stroke-opacity="0.24" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
 
                </>
              ) : (
                // Case 2: PASTE INACTIVE DESCENDING SVG HERE
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 13.3334L5.83333 16.6667L9.16667 13.3334" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83325 3.33337V16.6667" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 3.33337H16.6667L12.5 8.33337H16.6667" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5 16.6666V13.75C12.5 13.1974 12.7195 12.6675 13.1102 12.2768C13.5009 11.8861 14.0308 11.6666 14.5833 11.6666C15.1359 11.6666 15.6658 11.8861 16.0565 12.2768C16.4472 12.6675 16.6667 13.1974 16.6667 13.75V16.6666" stroke="#05595B" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.6667 15H12.5" stroke="#05595B" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
 
                </>
              )}
            </Box>
            Descending
          </Button>
        </Box>
        </Box>
      )}





      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "12px", color: "#343434" }}>
              Filter
            </Typography>
            <Typography
              onClick={handleClearFilter || (() => setSelectedItemIds([]))}
              sx={{
                fontSize: "12px",
                fontFamily: "Calibri",
                color: "#1B84FF",
                cursor: "pointer",
                fontWeight: 700,

              }}
            >
              Clear
            </Typography>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            value={accountSearch}
            onChange={(e) => setAccountSearch(e.target.value)}
            sx={{

              "& .MuiOutlinedInput-root": {
                height: "24px",
                paddingLeft: "8px",
                paddingRight: "8px",
                backgroundColor: "#FFF",
                borderRadius: "4px",
                "& fieldset": {
                  borderColor: "#EDEDED",
                },
                "&:hover fieldset": {
                  borderColor: "#EDEDED",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#05595B",
                  borderWidth: "1px",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "0px 0px 0px 6px",
                fontFamily: "Calibri",
                fontSize: "12px",
                color: "#343434",
                height: "24px",
                display: "flex",
                alignItems: "center",
                "&::placeholder": {
                  color: "#B5B5C3",
                  opacity: 1,
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                  <path d="M13.9998 14L11.1064 11.1067" stroke="#B5B5C3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#B5B5C3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            }}
          />
        </Box>


        {/* Account List */}
        <List sx={{ overflowY: "auto", flexGrow: 1, padding: "8px", border: "1px solid #EDEDED", borderRadius: "4px", gap: " 8px", display: "flex", flexDirection: "column" }}>
          <ListItem
            button
            onClick={handleSelectAllDropdown}
            sx={{
              gap: "8px",
              display: "flex",
              padding: "0px",
              bgcolor: "transparent"
            }}
          >
            <Checkbox
              checked={isAllSelected}
              size="small"
              indeterminate={isSomeSelected}
              onClick={handleSelectAllDropdown}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="white" />
                  <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#E2E8F0" />
                </svg>
              }
              checkedIcon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#1B84FF" />
                  <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#1B84FF" />
                  <path d="M15.3332 6L7.99984 13.3333L4.6665 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              indeterminateIcon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#1B84FF" />
                  <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#1B84FF" />
                  <path d="M5 10H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              sx={{ padding: "0px" }}
            />
            <ListItemText
              primary="Select All"
              sx={{ margin: 0, }}
              primaryTypographyProps={{ lineHeight: "24px", fontFamily: "Calibri", fontSize: "14px", fontWeight: 400, color: "#343434" }}
            />
          </ListItem>
          {uniqueAccounts
            .filter(acc => {
              const displayVal = acc === "" ? "(Blank)" : acc;
              return displayVal.toLowerCase().includes(accountSearch.toLowerCase());
            })
            .map((acc, idx) => {
              const status = getAccountStatus(acc);
              const displayVal = acc === "" ? "(Blank)" : acc;
              return (
                <ListItem
                  key={idx}
                  button
                  onClick={() => handleToggleAccount(acc)}
                  sx={{
                    gap: "8px",
                    display: "flex",
                    padding: "0px",
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "#F5F5F5" }
                  }}
                >
                  <Checkbox
                    checked={status === "all"}
                    indeterminate={status === "some"}
                    size="small"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="white" />
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#E2E8F0" />
                      </svg>
                    }
                    checkedIcon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#1B84FF" />
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#1B84FF" />
                        <path d="M15.3332 6L7.99984 13.3333L4.6665 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    indeterminateIcon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#1B84FF" />
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#1B84FF" />
                        <path d="M5 10H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    sx={{ padding: "0px" }}
                  />
                  <ListItemText
                    primary={displayVal}
                    sx={{ margin: 0, }}
                    primaryTypographyProps={{
                      fontFamily: "Calibri",
                      fontSize: "14px",
                      lineHeight: "24px",
                      fontWeight: 400,
                      color: "#343434"
                    }}
                  />
                </ListItem>
              )
            })}
        </List>
      </Box>

    </Popover>
  );
};

export default AccountFilterPopover;
