import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarClarity from "../../component/StoneMaster/Clarity/SearchBarClarity";
import ClarityBody from "../../component/StoneMaster/Clarity/ClarityBodyAdd";
import ClarityHeader from "../../component/StoneMaster/Clarity/ClarityHeader";
import {API_URL} from "config/config.js";
const ClarityAdd = () => {
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
      master_type: "master_stone_clarity",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_stone_clarity",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/clarity");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
        navigate("/stone-master/clarity/add");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const isSaveDisabled = () => {
    return !name.trim() || !code.trim();
  };
  const endpointPath = "/master?master_type=master_stone_clarity"
  const navigatePath = "/stone-master/clarity"
  const method = "post"
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <ClarityHeader />
            <ClarityBody
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
            <SearchBarClarity />
          </Box>
        </Box>
        <Footer 
          endpointPath={endpointPath}
          navigatePath={navigatePath}
          method={method}
        responseMessage={responseMessage} 
        isSaveDisabled={isSaveDisabled()}
        payLoadData = { {
          code: code,
          name: name,
          master_info: {},
          master_status: status ? "active" : "inactive",
          master_type: "master_stone_clarity",
        }
        }
        />
        
              </Box>
    </Box>
  );
};

export default ClarityAdd;
