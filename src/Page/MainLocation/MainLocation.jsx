import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import FooterMaster from "../../component/Layout/FooterMaster";
import HeaderPage from "../../layouts/BaseLayout/HeaderPage";
import TableBoxListComponent from "component/Commons/TableBoxListComponent";
import { useParams, useNavigate } from "react-router-dom";
import FormBodyLayout from "layouts/BaseLayout/FormBodyLayout";
import {
  payloadDataMainLocationState,
  saveButtonStatusState,
  isEditingState,
} from "recoil/state/CommonState";
import {
  mainLocationFSMState,
  mainLocationOriginalDataState,
  mainLocationFormDataState,
} from "recoil/state/MainLocationFSMState";
import { useRecoilState } from "recoil";
import StatusSwitch from "../../component/SwitchIOSStyleLabel";
import ConfirmCancelDialog from "../../component/Commons/ConfirmCancelDialog";
import SideBarList from "layouts/BaseLayout/SideBarList";
import "App.css";
import apiRequest from "helpers/apiHelper";

const FormBody = ({ main, currentFormData, onUpdateFormData, fsmState, method, onStatusChange, setSaveButtonStatus, setIsEditing }) => {
  const required_field = ["code", "location_name"];

  useEffect(() => {
    if (main) {
      setIsEditing(false);
    }

    let validate_field = false;
    if (currentFormData) {
      validate_field = true;
      for (let i = 0; i < required_field.length; i++) {
        const fieldValue = currentFormData[required_field[i]];
        if (fieldValue !== "" || (fieldValue && i === required_field.length - 1)) {
        } else {
          validate_field = false;
          break;
        }
      }
      setSaveButtonStatus(validate_field);
    } else {
      setSaveButtonStatus(false);
    }
  }, [currentFormData, main, setSaveButtonStatus, setIsEditing, required_field]);

  return (
    <div className="form_container" style={{ height: "655px" }}>
      <div className="input_text_group">
        <label htmlFor="code">
          Code: <span className="required_red">*</span>
        </label>
        <input
          type="text"
          id="code"
          className={fsmState === "saved" ? "disabled_input_field" : ""}
          disabled={fsmState === "saved"}
          onChange={(e) => {
            onUpdateFormData(e.target.value, "code");
          }}
          value={currentFormData.code || ""}
          placeholder={method === "POST" ? "" : ""}
        />
      </div>

      <div className="input_text_group">
        <label htmlFor="location_name">
          Name: <span className="required_red">*</span>
        </label>
        <input
          type="text"
          id="location_name"
          className={fsmState === "saved" ? "disabled_input_field" : ""}
          disabled={fsmState === "saved"}
          onChange={(e) => {
            onUpdateFormData(e.target.value, "location_name");
          }}
          value={currentFormData.location_name || ""}
          placeholder={method === "POST" ? "" : ""}
        />
      </div>

      <div className="input_text_group">
        <label htmlFor="location_detail">Description: </label>
        <input
          type="text"
          className={fsmState === "saved" ? "disabled_input_field" : ""}
          disabled={fsmState === "saved"}
          id="location_detail"
          onChange={(e) => {
            onUpdateFormData(e.target.value, "location_detail");
          }}
          value={currentFormData.location_detail || ""}
          placeholder={method === "POST" ? "" : ""}
        />
      </div>

      <div className="input_text_group ">
        <div className="exchange_rate_block">
          <div className="block">
            <label htmlFor="status">
              <StatusSwitch
                checked={currentFormData.status === "active"}
                disabled={fsmState === "saved"}
                onChange={(e) => {
                  onStatusChange(e.target.checked);
                }}
                label={currentFormData.status ? currentFormData.status.charAt(0).toUpperCase() +
                  currentFormData.status.slice(1) : "Active"}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainLocation = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [isEditing, setIsEditing] = useRecoilState(isEditingState);
  const [fsmState, setFsmState] = useRecoilState(mainLocationFSMState);
  const [originalData, setOriginalData] = useRecoilState(mainLocationOriginalDataState);
  const [formData, setFormData] = useRecoilState(mainLocationFormDataState);
  const [payloadData, setPayloadData] = useRecoilState(payloadDataMainLocationState);
  const [responseMessage, setResponseMessage] = useState("");
  const [refreshListKey, setRefreshListKey] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingListAction, setPendingListAction] = useState(null);
  const [saveButtonStatus, setSaveButtonStatus] = useRecoilState(saveButtonStatusState);
  const navigate = useNavigate();
  const { action, id } = useParams();

  const currentId = id || selectedData?._id || formData?._id;
  const shouldUsePost = fsmState === "initial" || fsmState === "dirty" || !currentId;
  const method = shouldUsePost ? "POST" : "PUT";
  const endpointPath = shouldUsePost ? "/locations" : "/locations/" + currentId;
  const navigatePath = "/settings/main-location";

  const currentFormData = useMemo(() => {
    if (!formData && !payloadData) {
      return {};
    }
    return formData || payloadData || {};
  }, [formData, payloadData]);

  const onFormDataUpdate = useCallback(
    (value, keyName) => {
      const updated = { ...currentFormData, [keyName]: value };
      setPayloadData(updated);
      setFormData(updated);
      setSelectedData(updated);
      if (fsmState === "initial") {
        setFsmState("dirty");
      }
    },
    [currentFormData, fsmState, setPayloadData, setFormData, setSelectedData, setFsmState]
  );

  const handleStatusChange = useCallback(
    (checked) => {
      onFormDataUpdate(checked ? "active" : "inactive", "status");
    },
    [onFormDataUpdate]
  );

  const getViewData = useCallback(async () => {
    if (!id) return;
    const data = await apiRequest("GET", `/locations/${id}`);
    setPayloadData(data);
    setFormData(data);
    setSelectedData(data);
    setOriginalData(data);
    setFsmState("saved");
    setIsEditing(false);
  }, [id, setPayloadData, setFormData, setSelectedData, setOriginalData, setFsmState, setIsEditing]);

  const hasUnsavedData = useCallback(() => {
    if (fsmState === "initial") return false;
    if (fsmState === "saved") return false;
    return fsmState === "dirty" || fsmState === "editing";
  }, [fsmState]);

  useEffect(() => {
    if (action === "add") {
      setFsmState("initial");
      setIsEditing(false);
      setFormData(null);
      setPayloadData(null);
      setOriginalData(null);
      setSelectedData(null);
      setSaveButtonStatus(false);
    } else if (action === "edit" && id) {
      getViewData();
    } else if (!action || action === "list") {
      setFsmState("initial");
      setIsEditing(false);
      setFormData(null);
      setPayloadData(null);
      setOriginalData(null);
      setSelectedData(null);
      setSaveButtonStatus(false);
    }
  }, [action, id, setFsmState, setIsEditing, getViewData, setFormData, setPayloadData, setOriginalData, setSaveButtonStatus]);

  const handleEditToggle = () => {
    if (selectedData && fsmState === "saved") {
      setFsmState("editing");
      setIsEditing(true);
    }
  };

  const handleAddClick = () => {
    setSelectedData(null);
    setOriginalData(null);
    setFormData(null);
    setFsmState("initial");
    setIsEditing(false);
    setPayloadData(null);
    navigate("/settings/main-location");
  };

  const handleCancelEdit = () => {
    if (fsmState === "editing" || fsmState === "dirty" || fsmState === "initial") {
      setShowConfirmDialog(true);
    }
  };

  const handleCancelConfirm = useCallback(
    (confirmed) => {
      setShowConfirmDialog(false);
      if (confirmed) {
        if (pendingListAction && typeof pendingListAction === 'object' && pendingListAction._id) {
          const item = pendingListAction;
          setPendingListAction(null);
          handleDataSelectionFromSideList(item);
        } else if (pendingListAction === true) {
          setPendingListAction(null);
          navigate("/settings/main-location/list");
        } else if (fsmState === "initial" || fsmState === "dirty") {
          window.location.reload();
        } else if (fsmState === "editing") {
          if (originalData) {
            setFormData(originalData);
            setSelectedData(originalData);
            setFsmState("saved");
            setIsEditing(false);
          }
        }
      } else {
        setPendingListAction(null);
      }
    },
    [fsmState, originalData, setFormData, setFsmState, setIsEditing, navigate, pendingListAction]
  );

  const handleDataSelectionFromSideList = useCallback(async (item) => {
    if (!item || !item._id) return;

    const data = await apiRequest("GET", `/locations/${item._id}`);
    if (data) {
      setPayloadData(data);
      setFormData(data);
      setSelectedData(data);
      setOriginalData(data);
      setFsmState("saved");
      setIsEditing(false);

      navigate(`/settings/main-location/edit/${item._id}`);
    }
  }, [setPayloadData, setFormData, setSelectedData, setOriginalData, setFsmState, setIsEditing, navigate]);

  const handleSaveSuccess = useCallback(
    (savedData = null) => {
      setFsmState("saved");
      setIsEditing(false);
      const locationData = savedData || formData;
      if (locationData) {
        setSelectedData(locationData);
        setOriginalData(locationData);
        setFormData(locationData);
      }
      // Refresh the side list after save
      setRefreshListKey(prev => prev + 1);
    },
    [formData, setFsmState, setIsEditing, setOriginalData, setFormData]
  );

  const handleListButtonClick = (e) => {
    if (hasUnsavedData()) {
      e.preventDefault();
      setPendingListAction(true);
      setShowConfirmDialog(true);
    }
  };

  const handleListConfirm = (confirmed) => {
    if (confirmed && pendingListAction) {
      setPendingListAction(false);
      navigate("/settings/main-location/list");
    } else {
      setPendingListAction(false);
    }
  };

  const handleSideListItemClick = useCallback((item, event) => {
    if (fsmState === "editing") {
      event.preventDefault();
      event.stopPropagation();
      setPendingListAction(item);
      setShowConfirmDialog(true);
      return false;
    }
    return true;
  }, [fsmState]);

  const isList = action === "list";
  const showForm = !isList;
  const mainProp = showForm && (!action || (action !== "add" && action !== "edit")) ? true : false;

  return (
    <Box className="page_container" sx={{}}>
      <NavBar />
      <Box sx={{ marginLeft: "222px", height: "100vh", paddingBottom: "130px" }}>
        <Header />
        <Box sx= {{display : "flex"}}>
          <Box className="form_content_wrp">
            <HeaderPage
              modalList={true}
              modalListHeader="Locations"
              modalListSubHeader="Location List"
              modalListEndpoint="/locations"
              modalUpdateStatusEndpoint="/locations/id/togglestatus"
              modalStatusCustomField="status"
              modalListSearchCustomFieldHeader={["Code", "Name", "Description"]}
              modalListSearchCustomFieldName={[
                "code",
                "location_name",
                "location_detail",
              ]}
              hasEditButton={false}
              headerName="Main Location"
              selectedData={selectedData}
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onStatusChange={handleStatusChange}
              baseUrl="/settings/main-location"
              onListButtonClick={handleListButtonClick}
            />
            <Box sx={{  }}>
              {isList ? (
                <TableBoxListComponent list_url="/settings/main-location" edit_list_url="/settings/main-location/edit" update_url="/settings/main-location" />
              ) : (
                <FormBodyLayout>
                  <FormBody
                    main={mainProp}
                    currentFormData={currentFormData}
                    onUpdateFormData={onFormDataUpdate}
                    fsmState={fsmState}
                    method={method}
                    onStatusChange={handleStatusChange}
                    setSaveButtonStatus={setSaveButtonStatus}
                    setIsEditing={setIsEditing}
                  />
                </FormBodyLayout>
              )}
            </Box>
          </Box>
          <div className="search_wrp">
            <SideBarList
              list_url="locations"
              base_url="settings/main-location"
              isEditing={fsmState === "editing"}
              method={method}
              onConfirmedDataSelection={handleDataSelectionFromSideList}
              refreshKey={refreshListKey}
            />
          </div>
        </Box>
        <FooterMaster
          selectedData={formData || selectedData}
          onCancelEdit={handleCancelEdit}
          onEditToggle={handleEditToggle}
          onAddClick={handleAddClick}
          responseMessage={responseMessage}
          fsmState={fsmState}
          endpointPath={endpointPath}
          navigatePath={navigatePath}
          method={method === "POST" ? "post" : "put"}
          isSaveDisabled={!saveButtonStatus}
          onSaveSuccess={handleSaveSuccess}
          payLoadData={formData || selectedData}
        />
        <ConfirmCancelDialog
          open={showConfirmDialog}
          onClose={pendingListAction ? handleListConfirm : handleCancelConfirm}
          title="Confirm Cancel"
          message="You have entered some data. Do you really want to cancel?"
        />
      </Box>
    </Box>
  );
};

export default MainLocation;
