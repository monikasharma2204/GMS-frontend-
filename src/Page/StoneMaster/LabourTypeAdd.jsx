import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarLabourType from "../../component/StoneMaster/LabourType/SearchBarLabourType";
import LabourTypeBody from "../../component/StoneMaster/LabourType/LabourTypeBodyAdd";
import LabourTypeHeader from "../../component/StoneMaster/LabourType/LabourTypeHeader";
import { unformatNumber } from "../../helpers/numberHelper";
import {API_URL} from "config/config.js";

const LabourTypeAdd = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(true);
  const [pricePcs, setPricePcs] = useState("");
  const [priceCts, setPriceCts] = useState("");
  const [priceType, setPriceType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
useEffect(()=>{
console.log(pricePcs)
},[])
  const navigate = useNavigate();

  const handlePost = async () => {
    const data = {
      code: code,
      name: name,
      master_info: {
        price_pcs: parseFloat(pricePcs).toFixed(2),
        price_cts: parseFloat(priceCts).toFixed(2),
        price_type: priceType,
      },
      master_status: status ? "active" : "inactive",
      master_type: "master_labour_type",
    };

    try {
      const response = await axios.post(
        API_URL + "/master?master_type=master_labour_type",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/labour-type/");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
        navigate("/stone-master/labour-type/add");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  const isSaveDisabled = () => {
    return !name.trim() || !code.trim()|| !priceType.trim();
  };
  const endpointPath = "/master?master_type=master_labour_type"
  const navigatePath = "/stone-master/labour-type"
  const method = "post"
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <LabourTypeHeader />
            <LabourTypeBody
              name={name}
              setName={setName}
              code={code}
              setCode={setCode}
              status={status}
              setStatus={setStatus}
              pricePcs={pricePcs}
              setPricePcs={setPricePcs}
              priceCts={priceCts}
              setPriceCts={setPriceCts}
              priceType={priceType}
              setPriceType={setPriceType}
            />
          </Box>
          <Box
            sx={{
              pointerEvents: "none",
              opacity: 0.5,
            }}
          >
            <SearchBarLabourType />
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
        price_pcs: parseFloat(unformatNumber(pricePcs)).toFixed(2),
        price_cts: parseFloat(unformatNumber(priceCts)).toFixed(2),
        price_type: priceType,
      },
      master_status: status ? "active" : "inactive",
      master_type: "master_labour_type",
    }
        }
        />      </Box>
    </Box>
  );
};

export default LabourTypeAdd;
