import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarColor from "../../component/StoneMaster/Color/SearchBarColor";
import ColorBody from "../../component/StoneMaster/Color/ColorBodyAdd";
import ColorHeader from "../../component/StoneMaster/Color/ColorHeader";
import axios from "axios";
import {API_URL} from "config/config.js";
const ColorAdd = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();

  const handlePost = async () => {
    const data = {
      code: code,
      name: name,
      master_info: {},
      master_status: status ? "active" : "inactive",
      master_type: "master_stone_color",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_stone_color",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/color");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
      }
    }
  };

  const isSaveDisabled = () => {
    return !name.trim() || !code.trim();
  };
  const endpointPath = "/master?master_type=master_stone_color"
  const navigatePath = "/stone-master/color"
  const method = "post"
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}} >
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <ColorHeader />
            <ColorBody
              name={name}
              setName={setName}
              code={code}
              setCode={setCode}
              status={status}
              setStatus={setStatus}
            />
          </Box>
          <Box
            sx={{
              pointerEvents: "none",
              opacity: 0.5,
            }}
          >
            <SearchBarColor />
          </Box>
        </Box>
        <Footer 
          endpointPath={endpointPath}
          navigatePath={navigatePath}
          method={method}
        responseMessage={responseMessage} 
        isSaveDisabled={isSaveDisabled()}
        payLoadData = { 

          {
            code: code,
            name: name,
            master_info: {},
            master_status: status ? "active" : "inactive",
            master_type: "master_stone_color",
          }      
        }
        />
      </Box>
    </Box>
  );
};

export default ColorAdd;
