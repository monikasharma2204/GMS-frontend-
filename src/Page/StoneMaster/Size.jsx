import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMaster";
import SearchBarSize from "../../component/StoneMaster/Size/SearchBarSize";
import SizeBody from "../../component/StoneMaster/Size/SizeBody";
import SizeHeader from "../../component/StoneMaster/Size/SizeHeader";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  sizeFSMState,
  sizeOriginalDataState,
  sizeFormDataState,
} from "../../recoil/state/stone/SizeState";
import {API_URL} from "config/config.js";

const Size = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [fsmState, setFsmState] = useRecoilState(sizeFSMState);
  const [originalData, setOriginalData] = useRecoilState(sizeOriginalDataState);
  const [formData, setFormData] = useRecoilState(sizeFormDataState);
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
        const formShapes = JSON.stringify(formData.master_info?.master_shapes || []);
        const origShapes = JSON.stringify(originalData.master_info?.master_shapes || []);
        return formData.code !== originalData.code || formData.name !== originalData.name || formData.master_status !== originalData.master_status || formData.master_info?.carat_size !== originalData.master_info?.carat_size || formShapes !== origShapes;
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
            `${API_URL}/master?master_type=master_stone_size&code=${encodeURIComponent(finalData.code)}`
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
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { carat_size: 0, master_shapes: [] } };
    const updatedData = {
      ...currentData,
      code: newCode,
      name: newCode,
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleCaratSizeChange = (newCaratSize) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { carat_size: 0, master_shapes: [] } };
    const updatedData = {
      ...currentData,
      master_info: {
        ...currentData.master_info,
        carat_size: newCaratSize,
      },
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleShapeChange = (newShape) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { carat_size: 0, master_shapes: [] } };
    const updatedData = {
      ...currentData,
      master_info: {
        ...currentData.master_info,
        master_shapes: newShape,
      },
    };
    setFormData(updatedData);
    setSelectedData(updatedData);
    if (fsmState === "initial") {
      setFsmState("dirty");
    }
  };

  const handleStatusChange = (newStatus) => {
    const currentData = formData || { code: "", name: "", master_status: "active", master_info: { carat_size: 0, master_shapes: [] } };
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
            `${API_URL}/master?master_type=master_stone_size&code=${encodeURIComponent(formData.code)}`
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
          // Continue to next attempt
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
    return !formData?.code?.trim();
  };

  const isEditing = fsmState === "initial" || fsmState === "dirty" || fsmState === "editing";
  const isListDisabled = fsmState === "editing";

  const endpointPath = "/master";
  const navigatePath = "/stone-master/size";
  const method = (fsmState === "dirty" && !formData?._id) || (fsmState === "initial" && !formData?._id) 
    ? "post" 
    : "put";
  return (
    <Box sx={{
      //  display: "flex"
        }}>
      <NavBar />
      <Box  sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <SizeHeader />
            <SizeBody
              selectedData={formData}
              isEditing={isEditing}
              onCodeChange={handleCodeChange}
              onStatusChange={handleStatusChange}
              onCaratSizeChange={handleCaratSizeChange}
              onShapeChange={handleShapeChange}
            />
          </Box>
          <SearchBarSize 
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
          endpointPath={method === "post" ? "/master?master_type=master_stone_size" : endpointPath}
          navigatePath={navigatePath}
          addNavigatePath="/stone-master/size/add"
          method={method}
          isSaveDisabled={isSaveDisabled()}
          onSaveSuccess={handleSaveSuccess}
          payLoadData={{
            ...(method === "put" && (originalData?._id || formData?._id || selectedData?._id) ? { 
              _id: originalData?._id || formData?._id || selectedData?._id 
            } : {}),
            code: formData?.code || "",
            name: formData?.name || formData?.code || "",
            master_info: {
              carat_size: formData?.master_info?.carat_size || 0,
              master_shapes: formData?.master_info?.master_shapes || [],
            },
            master_status: formData?.master_status || "active",
            master_type: "master_stone_size",
          }}
        />
      </Box>
    </Box>
  );
};

export default Size;
