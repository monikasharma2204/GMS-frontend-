import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarCutting from "../../component/StoneMaster/Cutting/SearchBarCutting";
import CuttingBody from "../../component/StoneMaster/Cutting/CuttingBodyAdd";
import CuttingHeader from "../../component/StoneMaster/Cutting/CuttingHeader";
import {API_URL} from "config/config.js";
const CuttingAdd = () => {
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
      master_type: "master_stone_cutting",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_stone_cutting",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/cutting");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
        navigate("/stone-master/cutting/add");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const isSaveDisabled = () => {
    return !name.trim() || !code.trim();
  };
  const endpointPath = "/master?master_type=master_stone_cutting"
  const navigatePath = "/stone-master/cutting"
  const method = "post"
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <CuttingHeader />
            <CuttingBody
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
            <SearchBarCutting />
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
            master_type: "master_stone_cutting",
          }
        }
        />
      </Box>
    </Box>
  );
};

export default CuttingAdd;
