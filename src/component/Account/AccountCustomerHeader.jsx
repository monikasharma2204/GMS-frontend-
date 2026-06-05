import React, { useState } from "react";
import { Box, Button, Typography, Modal, InputAdornment } from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField, Autocomplete } from "@mui/material";
import ModalList from "./ModalList.jsx";
import IOSSwitch from "../SwitchIOSStyle.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
};

const cities = [
  { value: "bangkok", label: "Bangkok" },
  { value: "tokyo", label: "Tokyo" },
  { value: "newyork", label: "New York" },
];

const AccountCustomerHeader = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [SelectCity, setSelectCity] = useState(null);

  return (
    <>
      <Box
        sx={{
          width: "1360px",
          height: "64px",
          flexShrink: 0,
          backgroundColor: "#FFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
        }}
      >
        <Box
          sx={{
            width: "388px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#05595B",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginLeft: "32px",
            }}
          >
            Customer
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box>
            <ModalList header="Customer" subheader="Customer List" />
          </Box>


        </Box>
      </Box>
    </>
  );
};

export default AccountCustomerHeader;
