import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarLabourType from "../../component/StoneMaster/LabourType/SearchBarLabourType";
import LabourTypeBody from "../../component/StoneMaster/LabourType/LabourTypeBody";
import LabourTypeHeader from "../../component/StoneMaster/LabourType/LabourTypeHeader";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  labourTypeFSMState,
  labourTypeOriginalDataState,
  labourTypeFormDataState,
} from "../../recoil/state/stone/LabourTypeState";
import {API_URL} from "config/config.js";

const LabourType = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [fsmState, setFsmState] = useRecoilState(labourTypeFSMState);
  const [originalData, setOriginalData] = useRecoilState(labourTypeOriginalDataState);
  const [formData, setFormData] = useRecoilState(labourTypeFormDataState);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigate = useNavigate();


  useEffect(() => {
    if (selectedData) {
      setFormData(selectedData);
    } else if (!selectedData && formData && formData._id) {
      setFormData(null);
    }

  }, [selectedData?._id]);


  useEffect(() => {
    setFsmState("initial");
    setFormData(null);
    setOriginalData(null);
    setSelectedData(null);
  }, []);


  const hasUnsavedData = () => {
    if (fsmState === "dirty" || fsmState === "editing") {
      return true;
    }
    if (formData && (formData.code?.trim() || formData.name?.trim())) {
      if (originalData) {
        const formInfo = JSON.stringify(formData.master_info || {});
        const origInfo = JSON.stringify(originalData.master_info || {});
        return formData.code !== originalData.code || formData.name !== originalData.name || formData.master_status !== originalData.master_status || formInfo !== origInfo;
      }
      return true;
    }
    return false;
  };

  const handleDataSelection = async (data) => {
    if (hasUnsavedData()) {
      setPendingSelection(data);
      setShowConfirmDialog(true);
      return;
    }
    await proceedWithSelection(data);
  };

  const proceedWithSelection = async (data) => {
    if (data) {
      let finalData = { ...data };
      
      if ((!finalData._id || finalData._id === undefined) && finalData.code) {
        try {
          const response = await axios.get(
            `${API_URL}/master?master_type=master_labour_type&code=${encodeURIComponent(finalData.code)}`
          );
          
          let records = [];
          if (Array.isArray(response.data)) {
            records = response.data;
          } else if (response.data && typeof response.data === 'object') {
            records = [response.data];
          }
          
          if (records && records.length > 0) {
            const fetchedRecord = records.find(
              (record) => 
                record.code === finalData.code && 
                record.name === finalData.name
            ) || records[0];
            
            const recordId = fetchedRecord?._id || fetchedRecord?.id;
            if (fetchedRecord && recordId) {
              finalData = { ...finalData, _id: recordId };
            }
          }
        } catch (error) {

        }
      }
      
      setSelectedData(finalData);
      setOriginalData(finalData);
      setFormData(finalData);
      setFsmState("saved");
    } else {
      setSelectedData(null);
      setOriginalData(null);
      setFormData(null);
      setFsmState("initial");
    }
  };

  const handleEditToggle = () => {
    if (fsmState === "saved" && formData) {
      if (!originalData || !originalData._id) {
        setOriginalData(formData);
      }
    }
    setFsmState("editing");
  };

  const handleAddClick = () => {
    setSelectedData(null);
    setOriginalData(null);
    setFormData(null);
    setFsmState("initial");
  };

  const handleCancelEdit = () => {
    if (fsmState === "editing") {
      if (originalData) {
        setFormData(originalData);
        setSelectedData(originalData);
        setFsmState("saved");
      }
    } else if (fsmState === "dirty") {
      setShowConfirmDialog(true);
    }
  };

  const handleCancelView = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDialogClose = async (confirmed) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      if (pendingSelection) {
        await proceedWithSelection(pendingSelection);
        setPendingSelection(null);
      } else {
        window.location.reload();
      }
    } else {
      setPendingSelection(null);
    }
  };

  const handleCodeChange = (newCode) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: {} };
    const updatedData = {
      ...currentData,
      code: newCode,
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleNameChange = (newName) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: {} };
    const updatedData = {
      ...currentData,
      name: newName,
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handlePriceTypeChange = (newPriceType) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: {} };
    const updatedData = {
      ...currentData,
      master_info: {
        ...currentData.master_info,
        price_type: newPriceType,
      },
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handlePricePcsChange = (newPricePcs) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: {} };
    const updatedData = {
      ...currentData,
      master_info: {
        ...currentData.master_info,
        price_pcs: newPricePcs,
      },
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handlePriceCtsChange = (newPriceCts) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: {} };
    const updatedData = {
      ...currentData,
      master_info: {
        ...currentData.master_info,
        price_cts: newPriceCts,
      },
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };
  
  const handleStatusChange = (newStatus) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: {} };
    const updatedData = {
      ...currentData,
      master_status: newStatus ? "active" : "inactive",
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleSaveSuccess = async (savedData) => {
    setResponseMessage("");

    let savedId = savedData?._id 
      || savedData?.id 
      || (savedData?.data && savedData.data._id)
      || (savedData?.data && savedData.data.id);
    
    if (!savedId && formData?.code) {
      let fetchedRecord = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 500 + (attempt * 500)));
          
          const response = await axios.get(
            `${API_URL}/master?master_type=master_labour_type&code=${encodeURIComponent(formData.code)}`
          );
          
          let records = [];
          if (Array.isArray(response.data)) {
            records = response.data;
          } else if (response.data && typeof response.data === 'object') {
            records = [response.data];
          }
          
          if (records && records.length > 0) {
            fetchedRecord = records.find(
              (record) => 
                record.code === formData.code && 
                record.name === formData.name
            ) || records[0];
            
            const recordId = fetchedRecord?._id || fetchedRecord?.id;
            if (fetchedRecord && recordId) {
              savedId = recordId;
              break;
            }
          }
        } catch (error) {
  
        }
      }
      
      if (fetchedRecord && (fetchedRecord._id || fetchedRecord.id)) {
        const recordId = fetchedRecord._id || fetchedRecord.id;
        const dataToUse = {
          ...formData,
          _id: recordId,
          code: fetchedRecord.code || formData.code,
          name: fetchedRecord.name || formData.name,
          master_status: fetchedRecord.master_status || formData.master_status,
          master_info: fetchedRecord.master_info || formData.master_info,
        };
        
        setFormData(dataToUse);
        setOriginalData(dataToUse);
        setSelectedData(dataToUse);
        setFsmState("saved");
        setRefreshTrigger(prev => prev + 1);
        return;
      }
    }

    if (savedId || formData?._id) {
      const dataToUse = {
        ...formData,
        _id: savedId || formData._id,
      };

      if (savedData?.code && typeof savedData.code !== 'number' && savedData.code.toString() !== '200' && savedData.code.toString() !== '201') {
        dataToUse.code = savedData.code;
      }
      if (savedData?.name && typeof savedData.name === 'string' && !['success', 'ok', 'saved'].includes(savedData.name.toLowerCase()) && !Number.isInteger(Number(savedData.name))) {
        dataToUse.name = savedData.name;
      }
      if (savedData?.master_status) {
        dataToUse.master_status = savedData.master_status;
      }
      if (savedData) {
        Object.keys(savedData).forEach(key => {
          if (!['code', 'name', 'master_status', 'msg'].includes(key) && savedData[key] !== undefined) {
            dataToUse[key] = savedData[key];
          }
        });
      }
      
      setFormData(dataToUse);
      setOriginalData(dataToUse);
      setSelectedData(dataToUse);
      setFsmState("saved");
      setRefreshTrigger(prev => prev + 1);
    } else {
      if (formData) {
        setOriginalData(formData);
        setSelectedData(formData);
      }
      setFsmState("saved");
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const isSaveDisabled = () => {
    return !formData?.name?.trim() || !formData?.code?.trim();
  };

  const isEditing = fsmState === "initial" || fsmState === "dirty" || fsmState === "editing";
  const isListDisabled = fsmState === "editing";

  const endpointPath = "/master";
  const navigatePath = "/stone-master/labour-type";
  const method = (fsmState === "dirty" && !formData?._id) || (fsmState === "initial" && !formData?._id) 
    ? "post" 
    : "put";
  return (
    <Box sx={{ 
      
      // display: "flex" 
      }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <LabourTypeHeader />
            <LabourTypeBody
              selectedData={formData}
              isEditing={isEditing}
              onCodeChange={handleCodeChange}
              onNameChange={handleNameChange}
              onStatusChange={handleStatusChange}
              onPriceTypeChange={handlePriceTypeChange}
              onPricePcsChange={handlePricePcsChange}
              onPriceCtsChange={handlePriceCtsChange}
            />
          </Box>
          <SearchBarLabourType 
            key={refreshTrigger}
            onDataSelect={handleDataSelection} 
            isEditing={isListDisabled} 
            selectedData={formData}
            refreshTrigger={refreshTrigger}
          />
        </Box>
        
        <ConfirmCancelDialog
          open={showConfirmDialog}
          onClose={handleConfirmDialogClose}
        />

        <Footer
          selectedData={(() => {
            const idToUse = formData?._id || originalData?._id || selectedData?._id;
            return idToUse ? { ...formData, _id: idToUse } : formData;
          })()}
          onCancelEdit={handleCancelEdit}
          onCancelView={handleCancelView}
          onEditToggle={handleEditToggle}
          onAddClick={handleAddClick}
          responseMessage={responseMessage}
          fsmState={fsmState}
          endpointPath={method === "post" ? "/master?master_type=master_labour_type" : endpointPath}
          navigatePath={navigatePath}
          addNavigatePath="/stone-master/labour-type/add"
          method={method}
          isSaveDisabled={isSaveDisabled()}
          onSaveSuccess={handleSaveSuccess}
          masterType="master_labour_type"
          payLoadData={{
            ...(method === "put" && (originalData?._id || formData?._id || selectedData?._id) ? { 
              _id: originalData?._id || formData?._id || selectedData?._id 
            } : {}),
            code: formData?.code || "",
            name: formData?.name || "",
            master_info: {
              price_pcs: formData?.master_info?.price_pcs || 0,
              price_cts: formData?.master_info?.price_cts || 0,
              price_type: formData?.master_info?.price_type || "",
            },
            master_status: formData?.master_status || "active",
            master_type: "master_labour_type",
          }}
        />
      </Box>
    </Box>
  );
};

export default LabourType;
