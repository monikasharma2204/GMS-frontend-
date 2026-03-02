import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarSize from "../../component/StoneMaster/Size/SearchBarSize";
import SizeBody from "../../component/StoneMaster/Size/SizeBodyAdd";
import SizeHeader from "../../component/StoneMaster/Size/SizeHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {API_URL} from "config/config.js";

const SizeAdd = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState(name);
  const [status, setStatus] = useState(true);
  const [caratSize, setCaratSize] = useState("");
  const [masterShapes, setMasterShapes] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();

  const handlePost = async () => {
    const data = {
      code: code,
      name: name,
      master_info: {
        carat_size: caratSize,
        master_shapes: masterShapes
      },
      master_status: status ? "active" : "inactive",
      master_type: "master_stone_size",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_stone_size",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/size");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
      }
    }
  };

  const isSaveDisabled = () => {
    return !name.trim() || !code.trim() || !caratSize.trim();
  };
  const endpointPath = "/master?master_type=master_stone_size"
  const navigatePath = "/stone-master/size"
  const method = "post"
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <SizeHeader />
            <SizeBody
              name={name}
              setName={setName}
              code={code}
              setCode={setCode}
              status={status}
              setStatus={setStatus}
              caratSize={caratSize}
              setCaratSize={setCaratSize}
              masterShapes={masterShapes}
              setMasterShapes={setMasterShapes}
            />
          </Box>
          <Box
            sx={{
              pointerEvents: "none",
              opacity: 0.5,
            }}
          >
            <SearchBarSize />
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
          master_info: {
            carat_size: caratSize,
            master_shapes: masterShapes
          },
          master_status: status ? "active" : "inactive",
          master_type: "master_stone_size",
        }
        }
        />

      </Box>
    </Box>
  );
};

export default SizeAdd;
