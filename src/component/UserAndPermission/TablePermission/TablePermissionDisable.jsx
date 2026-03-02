import React, { useState } from "react";
import { Typography, Checkbox, Grid, Box } from "@mui/material";
import {
  GridMainTitle,
  FontMainStyle,
  FontSubStyle,
  GridMainSubMenuTitle,
  GridSubMainTitle,
  GridSubMainSubMenuTitle,
} from "../../../Assets/styles/TablePermissionStyles.jsx";
import { initialList } from "./MockDataPermission.jsx";

const CheckboxComponent = ({ checked, onChange }) => (
  <Grid item sx={GridSubMainSubMenuTitle}>
    <Checkbox
      disabled
      checked={checked}
      onChange={onChange}
      color="primary"
      sx={{ padding: 0 }}
    />
  </Grid>
);

const renderHeader = () => (
  <Grid container sx={{ backgroundColor: "#EDEDED" }}>
    <Grid item sx={GridMainTitle}>
      <Typography sx={FontMainStyle}>Menu</Typography>
    </Grid>
    {["View", "Add", "Edit", "Delete", "Price"].map((header, index) => (
      <Grid item key={index} sx={GridMainSubMenuTitle}>
        <Typography sx={FontMainStyle}>{header}</Typography>
      </Grid>
    ))}
  </Grid>
);

const PermissionsList = () => {
  const [showCompanySections, setShowCompanySections] = useState(false);
  const [showAccountSections, setShowAccountSections] = useState(false);
  const [showStoneMasterSections, setShowStoneMasterSections] = useState(false);
  const [showPurchaseOrderSections, setShowPurchaseOrderSections] =
    useState(false);
  const [showMemoSections, setShowMemoSections] = useState(false);
  const [showInventorySections, setShowInventorySections] = useState(false);
  const [showFinanceSections, setShowFinanceSections] = useState(false);
  const [showOtherSections, setShowOtherSections] = useState(false);

  const toggleSection = (setStateFunction) => {
    setStateFunction((prev) => !prev);
  };

  const toggleCompanySections = () => toggleSection(setShowCompanySections);
  const toggleAccountSections = () => toggleSection(setShowAccountSections);
  const toggleStoneMasterSections = () =>
    toggleSection(setShowStoneMasterSections);
  const togglePurchaseOrderSection = () =>
    toggleSection(setShowPurchaseOrderSections);
  const toggleInventorySection = () => toggleSection(setShowInventorySections);
  const toggleMemoSection = () => toggleSection(setShowMemoSections);
  const toggleFinanceSection = () => toggleSection(setShowFinanceSections);
  const toggleOtherSection = () => toggleSection(setShowOtherSections);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ width: "1000px", backgroundColor: "#FFFFFF", }}>
        {renderHeader()}

        {/* Select All */}
        <Grid container>
          <Grid item sx={GridSubMainTitle}>
            <Typography sx={FontMainStyle}>SelectAll</Typography>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>

        {/* Company */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleCompanySections}
          >
            <Typography sx={FontMainStyle}>Company</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showCompanySections &&
          Object.entries(initialList[0].company).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {category === "profile" ? "• Company Profile" : "• Bank"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* User And Permission */}
        {initialList.map((item, index) => (
          <Box key={index}>
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>
                      User & Permission
                    </Typography>
                  </Grid>
                  {Object.keys(item.userPermission).map(
                    (permission, permIndex) => (
                      <Grid item key={permIndex}>
                        <CheckboxComponent />
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Account */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleAccountSections}
          >
            <Typography sx={FontMainStyle}>Account</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showAccountSections &&
          Object.entries(initialList[2].account).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {category === "vendor" ? "• Vendor" : "• Customer"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* Stone Master */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleStoneMasterSections}
          >
            <Typography sx={FontMainStyle}>Stone Master</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showStoneMasterSections &&
          Object.entries(initialList[3].stoneMaster).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {showStoneMasterSections &&
                        category === "stoneGroup" &&
                        "• Stone Group"}
                      {showStoneMasterSections &&
                        category === "stone" &&
                        "• Stone"}
                      {showStoneMasterSections &&
                        category === "shape" &&
                        "• Shape"}
                      {showStoneMasterSections &&
                        category === "size" &&
                        "• Size"}
                      {showStoneMasterSections &&
                        category === "color" &&
                        "• Color"}
                      {showStoneMasterSections &&
                        category === "cutting" &&
                        "• Cutting"}
                      {showStoneMasterSections &&
                        category === "quality" &&
                        "• Quality"}
                      {showStoneMasterSections &&
                        category === "clarity" &&
                        "• Clarity"}
                      {showStoneMasterSections &&
                        category === "certificateType" &&
                        "• Certificate Type"}
                      {showStoneMasterSections &&
                        category === "labourType" &&
                        "• Labour Type"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* Quotation */}
        {initialList.map((item, index) => (
          <Box key={index}>
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Quotation</Typography>
                  </Grid>
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Reserve */}
        {initialList.map((item, index) => (
          <Box key={index}>
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Reserve</Typography>
                  </Grid>
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Purchase Order */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={togglePurchaseOrderSection}
          >
            <Typography sx={FontMainStyle}>Purchase Order</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showPurchaseOrderSections &&
          Object.entries(initialList[6].purchaseOrder).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {showPurchaseOrderSections &&
                        category === "po" &&
                        "• Purchase Order"}
                      {showPurchaseOrderSections &&
                        category === "pu" &&
                        "• Purchase"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* Memo */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleMemoSection}
          >
            <Typography sx={FontMainStyle}>Memo</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showMemoSections &&
          Object.entries(initialList[7].memo).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {showMemoSections && category === "memoIn" && "• Memo In"}
                      {showMemoSections &&
                        category === "memoReturn" &&
                        "• Memo Return"}
                        {showMemoSections && category === "memoOut" && "• Memo Out"}
                        {showMemoSections && category === "memoOutReturn" && "• Memo Out Return"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* Inventory */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleInventorySection}
          >
            <Typography sx={FontMainStyle}>Inventory</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showInventorySections &&
          Object.entries(initialList[8].inventory).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {showInventorySections && category === "all" && "• All"}
                      {showInventorySections &&
                        category === "primary" &&
                        "• Primary"}
                      {showInventorySections &&
                        category === "consignment" &&
                        "• Consignment"}
                      {showInventorySections && category === "load" && "• Load"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* Sale */}
        {initialList.map((item, index) => (
          <Box key={index}>
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Sale</Typography>
                  </Grid>
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Finance */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleFinanceSection}
          >
            <Typography sx={FontMainStyle}>Finance</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showFinanceSections &&
          Object.entries(initialList[10].finance).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {showFinanceSections &&
                        category === "outstandingReceiptPayable" &&
                        "• Payable"}
                      {showFinanceSections &&
                        category === "outstandingReceiptReceivable" &&
                        "• Outstanding Receipt Receivable"}
                      {showFinanceSections &&
                        category === "transaction" &&
                        "• Transaction"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/* Report */}
        {initialList.map((item, index) => (
          <Box key={index}>
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Report</Typography>
                  </Grid>
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Setup */}
        <Grid container>
          <Grid
            item
            sx={{ ...GridSubMainTitle, cursor: "pointer" }}
            onClick={toggleOtherSection}
          >
            <Typography sx={FontMainStyle}>Setup</Typography>
            <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                  fill="#666666"
                />
              </svg>
            </Box>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent />
            </Grid>
          ))}
        </Grid>
        {showOtherSections &&
          Object.entries(initialList[12].other).map(
            ([category, permissions], catIndex) => (
              <Box key={catIndex}>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontSubStyle}>
                      {showOtherSections &&
                        category === "mainLocation" &&
                        "• Main Location"}
                      {showOtherSections &&
                        category === "subLocation" &&
                        "• Sub Location"}
                      {showOtherSections &&
                        category === "currency" &&
                        "• Currency"}
                    </Typography>
                  </Grid>
                  {Object.keys(permissions).map((permission, permIndex) => (
                    <CheckboxComponent />
                  ))}
                </Grid>
              </Box>
            )
          )}

        {/*  */}
        {/* {initialList.map((item, index) => (
          <Box key={index}>
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Setup</Typography>
                  </Grid>
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                  <CheckboxComponent />
                </Grid>
              </Box>
            )}
          </Box>
        ))} */}
      </Box>
    </Box>
  );
};

export default PermissionsList;
