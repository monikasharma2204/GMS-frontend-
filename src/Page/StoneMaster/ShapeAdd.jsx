import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarShape from "../../component/StoneMaster/Shape/SearchBarShape";
import ShapeBody from "../../component/StoneMaster/Shape/ShapeBodyAdd";
import ShapeHeader from "../../component/StoneMaster/Shape/ShapeHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {API_URL} from "config/config.js";
const ShapeAdd = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(true);
    const [masterShapes, setMasterShapes] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
    const [ stoneGroup, setStoneGroup] = useState("");

  const navigate = useNavigate();

  const handlePost = async () => {
    const data = {
      code: code,
      name: name,
         master_info: {
        stone_group:stoneGroup ,
      size_ids: masterShapes
      },
      master_type: "master_stone_shape",
      master_status: status ? "active" : "inactive",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_stone_shape",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/shape");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };
  const endpointPath = "/master?master_type=master_stone_shape";
  const navigatePath = "/stone-master/shape";
  const method = "post";
  const isSaveDisabled = () => {
    return !name.trim() || !code.trim();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <ShapeHeader />
            <ShapeBody
              name={name}
              setName={setName}
              code={code}
              setCode={setCode}
              status={status}
              setStatus={setStatus}
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
            <SearchBarShape />
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
        stone_group:stoneGroup ,
      size_ids: masterShapes
      },
            master_status: status ? "active" : "inactive",
            master_type: "master_stone_shape",
          }}
        />
      </Box>
    </Box>
  );
};

export default ShapeAdd;
