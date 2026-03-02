import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarStone from "../../component/StoneMaster/Stone/SearchBarStone";
import StoneBodyAdd from "../../component/StoneMaster/Stone/StoneBodyAdd";
import StoneHeader from "../../component/StoneMaster/Stone/StoneHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {API_URL} from "config/config.js";

const StoneAdd = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [hsn, setHsn] = useState("");
  const [stg, setStg] = useState("");
  const [status, setStatus] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();

  const handlePost = async () => {
    const data = {
      code: code,
      name: name,
      master_info: {
        hsn: hsn,
        stone_group: stg,
      },
      master_type: "master_stone_name",
      master_status: status ? "active" : "inactive",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_stone_name",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/stone");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
      }
    }
  };

  const isSaveDisabled = () => {
    return !name.trim() || !code.trim() || !stg.trim();
  };
  const endpointPath = "/master?master_type=master_stone_name";
  const navigatePath = "/stone-master/stone";
  const method = "post";
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <StoneHeader />
            <StoneBodyAdd
              name={name}
              setName={setName}
              code={code}
              setCode={setCode}
              status={status}
              setStatus={setStatus}
              hsn={hsn}
              setHsn={setHsn}
              stg={stg}
              setStg={setStg}
            />
          </Box>
          <Box
            sx={{
              pointerEvents: "none",
              opacity: 0.5,
            }}
          >
            <SearchBarStone />
          </Box>
        </Box>
        <Footer
          endpointPath={endpointPath}
          navigatePath={navigatePath}
          method={method}
          responseMessage={responseMessage}
          isSaveDisabled={isSaveDisabled()}
          payLoadData={{
            code: code,
            name: name,
            master_info: {
              hsn: hsn,
              stone_group: stg,
            },
            master_type: "master_stone_name",
            master_status: status ? "active" : "inactive",
          }}
        />
      </Box>
    </Box>
  );
};

export default StoneAdd;
