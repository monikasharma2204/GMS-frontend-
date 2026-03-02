import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Footer from "../../component/Layout/FooterMain";
import UserAndPermissionHeader from "../../component/UserAndPermission/UserAndPermissionHeader";
import SearchBar from "../../component/Account/SearchBar";
import UserAndPermissionBody from "../../component/UserAndPermission/UserAndPermissionBody";
import { isEditingState } from "recoil/state/CommonState";
import { userAndPermissionFSMState } from "recoil/state/UserAndPermissionFSMState";

const UserAndPermission = () => {
  const [isEditing, setIsEditing] = useRecoilState(isEditingState);
  const [fsmState, setFsmState] = useRecoilState(userAndPermissionFSMState);
  const [createNew, setCreateNew] = useState(false);
  const [resetKey, setResetKey] = useState(0); 
  
  const userPermission_add = true; 
  const userPermission_edit = true; 


  useEffect(() => {

    setFsmState("add"); 
    setCreateNew(false);
    setIsEditing(true); 
  }, [setFsmState]);


  const handleUserInput = useCallback(() => {
    if (fsmState === "add" || fsmState === "edit") {
      setFsmState("dirty");
    }
  }, [fsmState, setFsmState]);

  // Handle save
  const handleClick = async () => {
    setFsmState("view");
    setIsEditing(false);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    
    if (createNew || fsmState === "add" || fsmState === "dirty") {
      setResetKey(prev => prev + 1);
      setFsmState("add");
      setCreateNew(false);
      setIsEditing(true); 
    } else {
      setFsmState("view");
    }
  };


  const onAddClick = () => {
    setFsmState("add");
    setCreateNew(true);
    setIsEditing(true);

  };

  return (
    <Box sx={{ 
      // display: "flex" 
      }}>
      <NavBar />
      <Box   sx={{marginLeft: "222px" , Height : "100vh " , paddingBottom : "130px"}} >
        <Header />
        <Box sx={{ display: "flex" }}>
          <Box>
            <UserAndPermissionHeader />
            <UserAndPermissionBody key={resetKey} handleUserInput={handleUserInput} />
          </Box>
          <SearchBar />
        </Box>

        <Footer
          onClick={handleClick}
          handlePost={handleClick}
          onCancelEdit={onCancelEdit}
          onAddClick={onAddClick}
          userPermission_add={userPermission_add}
          userPermission_edit={userPermission_edit}
          onEdit={() => {
            setIsEditing(true);
            setFsmState("edit");
          }}
        />
      </Box>
    </Box>
  );
};

export default UserAndPermission;
