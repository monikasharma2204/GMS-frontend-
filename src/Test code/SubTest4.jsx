import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Container, Box, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import {API_URL} from "config/config.js";
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const DataPoster = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(false);
  const [hsn, setHsn] = useState("");
  const [stg, setStg] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handlePost = () => {
    const data = {
      code: code,
      name: name,
      master_info: {
        stone_group: "66a9bed580e5daedf4d28c6d",
        hsn: hsn
      },
      master_type: "master_stone_name",
      master_status: status ? "active" : "inactive",
    };

    console.log("Data being sent:", data); // Debugging line

    axios
      .post(
        API_URL + "/master?master_type=master_stone_name",
        data
      )
      .then((response) => {
        setResponseMessage("Data posted successfully");
        // handle success
      })
      .catch((error) => {
        setResponseMessage("Failed to post data");
        // handle error
      });
  };

  return (
    <Container>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextField
          fullWidth
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          variant="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextField
          fullWidth
          label="HSN"
          value={hsn}
          onChange={(e) => setHsn(e.target.value)}
          variant="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextField
          fullWidth
          label="Stone Group Code"
          value={stg}
          onChange={(e) => setStg(e.target.value)}
          variant="outlined"
          style={{ marginBottom: 16 }}
        />
        <Box mb={2}>
          <IOSSwitch
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          <label>{status ? "Active" : "Inactive"}</label>
        </Box>
        <Button variant="contained" color="primary" onClick={handlePost}>
          Post Data
        </Button>
      </Box>
      {responseMessage && <div>{responseMessage}</div>}
    </Container>
  );
};

export default DataPoster;
