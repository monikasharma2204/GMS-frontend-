import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarShape from "../../component/StoneMaster/Shape/SearchBarShape";
import ShapeBody from "../../component/StoneMaster/Shape/ShapeBody";
import ShapeHeader from "../../component/StoneMaster/Shape/ShapeHeader";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import apiRequest from "../../helpers/apiHelper";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  shapeFSMState,
  shapeOriginalDataState,
  shapeFormDataState,
} from "../../recoil/state/stone/ShapeState";
import axios from "axios";
import {API_URL} from "config/config.js";

const Shape = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [fsmState, setFsmState] = useRecoilState(shapeFSMState);
  const [originalData, setOriginalData] = useRecoilState(shapeOriginalDataState);
  const [formData, setFormData] = useRecoilState(shapeFormDataState);
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
        const formSizeIds = JSON.stringify(formData.master_info?.size_ids || []);
        const origSizeIds = JSON.stringify(originalData.master_info?.size_ids || []);
        return formData.code !== originalData.code || formData.name !== originalData.name || formData.master_status !== originalData.master_status || formSizeIds !== origSizeIds;
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
            `${API_URL}/master?master_type=master_stone_shape&code=${encodeURIComponent(finalData.code)}`
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

  const handleConfirmDialogClose = async (confirmed) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      await proceedWithSelection(pendingSelection);
    }
    setPendingSelection(null);
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
   
      setSelectedData(null);
      setOriginalData(null);
      setFormData(null);
      setFsmState("initial");
    }
  };

  const handleCancelView = () => {
  
    setSelectedData(null);
    setOriginalData(null);
    setFormData(null);
    setFsmState("initial");
  };

  const handleCodeChange = (newCode) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { size_ids: [], stone_group: "" } };
    const updatedData = {
      ...currentData,
      code: newCode,
      _id: currentData._id || originalData?._id,
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleNameChange = (newName) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { size_ids: [], stone_group: "" } };
    const updatedData = {
      ...currentData,
      name: newName,
      _id: currentData._id || originalData?._id,
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleSizeChange = (newShape) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { size_ids: [], stone_group: "" } };
    const updatedData = {
      ...currentData,
      master_info: {
        ...currentData.master_info,
        size_ids: newShape,
      },
      _id: currentData._id || originalData?._id,
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleStatusChange = (newStatus) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { size_ids: [], stone_group: "" } };
    const updatedData = {
      ...currentData,
      master_status: newStatus ? "active" : "inactive",
      _id: currentData._id || originalData?._id,
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
            `${API_URL}/master?master_type=master_stone_shape&code=${encodeURIComponent(formData.code)}`
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
  const navigatePath = "/stone-master/shape";
  const method = (fsmState === "dirty" && !formData?._id) || (fsmState === "initial" && !formData?._id) 
    ? "post" 
    : "put";

  const payLoadData = {
    ...(method === "put" && (originalData?._id || formData?._id || selectedData?._id) ? { 
      _id: originalData?._id || formData?._id || selectedData?._id 
    } : {}),
    code: formData?.code || "",
    name: formData?.name || "",
    master_info: {
      size_ids: formData?.master_info?.size_ids || [],
      stone_group: formData?.master_info?.stone_group || "",
    },
    master_status: formData?.master_status || "active",
    master_type: "master_stone_shape",
  };


  return (
    <Box sx={{ 
      // display: "flex"
       }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <ShapeHeader />
            <ShapeBody
              selectedData={formData}
              isEditing={isEditing}
              onCodeChange={handleCodeChange}
              onNameChange={handleNameChange}
              onStatusChange={handleStatusChange}
              onSizeChange={handleSizeChange}
            />
          </Box>
          <SearchBarShape
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
            if (idToUse) {
              return { ...formData, _id: idToUse };
            }
   
            return formData && '_id' in formData ? formData : { ...formData };
          })()}
          onCancelEdit={handleCancelEdit}
          onCancelView={handleCancelView}
          onEditToggle={handleEditToggle}
          onAddClick={handleAddClick}
          responseMessage={responseMessage}
          fsmState={fsmState}
          endpointPath={method === "post" ? "/master?master_type=master_stone_shape" : endpointPath}
          navigatePath={navigatePath}
          addNavigatePath="/stone-master/shape/add"
          method={method}
          isSaveDisabled={isSaveDisabled()}
          onSaveSuccess={handleSaveSuccess}
          payLoadData={payLoadData}
        />
      </Box>
    </Box>
  );
};

export default Shape;
