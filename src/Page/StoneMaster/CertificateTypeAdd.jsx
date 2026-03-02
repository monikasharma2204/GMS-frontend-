import React, { useState } from "react";
import apiRequest from "../../helpers/apiHelper";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarCertificateType from "../../component/StoneMaster/CertificateType/SearchBarCertificateType";
import CertificateTypeBody from "../../component/StoneMaster/CertificateType/CertificateTypeBodyAdd";
import CertificateTypeHeader from "../../component/StoneMaster/CertificateType/CertificateTypeHeader";

const CertificateType = () => {
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
      master_type: "master_certificate_type",
    };

    try {
      const response = await apiRequest(
        "POST",
        "/master?master_type=master_certificate_type",
        data
      );
      const statusCode = response.status;
      setResponseMessage(`${statusCode}`);

      setTimeout(() => {
        window.location.reload();
        navigate("/stone-master/certificate-type");
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        setResponseMessage(`${statusCode}`);
        navigate("/stone-master/certificate-type/add");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };
  const endpointPath = "/master?master_type=master_certificate_type"
  const navigatePath = "/stone-master/certificate-type"
  const method = "post"
  const isSaveDisabled = () => {
    return !name.trim() || !code.trim();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header  />
        <Box sx={{ display: "flex" }}>
          <Box>
            <CertificateTypeHeader />
            <CertificateTypeBody
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
            <SearchBarCertificateType />
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
          master_type: "master_certificate_type",
        }
        }
        />
      </Box>
    </Box>
  );
};

export default CertificateType;
