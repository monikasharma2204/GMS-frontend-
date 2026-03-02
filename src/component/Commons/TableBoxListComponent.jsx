import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link,redirect,useNavigate } from "react-router-dom";
import  "./common.css"
import {
  Box,
  Button,
  Typography,
  Modal,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import apiRequest from "helpers/apiHelper";
import * as XLSX from "xlsx";
import { listUrlState,editUrlState ,updateUrlState,rowPerPageState} from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
import SwitchWithLabel from "../../component/SwitchIOSStyleLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
};

const TableBoxListComponent = (props) => {
    const [listUrl,setListUrl] = useRecoilState(listUrlState)
    const [updateUrl,setUpdateUrl] = useRecoilState(updateUrlState)
    const [editUrl,setEditUrl] = useRecoilState(editUrlState)

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [rowPerPage,setRowPerPage] = useRecoilState(rowPerPageState)

  const navigate = useNavigate();


  const handleCheckboxChange = (event, stone) => {
    if (event.target.checked) {
      setSelectedCheckboxes([...selectedCheckboxes, stone]);
    } else {
      setSelectedCheckboxes(
        selectedCheckboxes.filter((item) => item !== stone)
      );
    }
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Select all items
      setSelectedCheckboxes(data);
    } else {
      // Deselect all items
      setSelectedCheckboxes([]);
    }
  };

  const exportToExcel = (selectedCheckboxes) => {
    // เลือกเฉพาะฟิลด์ที่ต้องการ เช่น code, name, และ master_status
    const filteredData = selectedCheckboxes.map((item) => ({
      code: item.code,
      name: item.name,
      master_status: item.master_status,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Stones");
  
    // Exporting the excel file
    XLSX.writeFile(workbook, "selected_stones.xlsx");
  };

  const handleExport = () => {
    exportToExcel(selectedCheckboxes);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // window.location.reload();
  };



  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          props.list_url
        );
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSwitchChange =async (id,status) => {
  let newStatus = status;
    // Update the local state for the specific item


    try {
      // Send an update request to the server
      await apiRequest("PUT", props.update_url, {
        _id: id,
        status: newStatus,
      });
      setData((prevData) => {
        const updatedData = prevData.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        );
        console.log("Updated Data:", updatedData); // Log updated data
        return updatedData;
      });
      console.log("Update Success:", id, "New Status:", newStatus);
    } catch (err) {
      console.error("Update Error:", err); // Log update errors
 
    }
  };

//   if (loading) return <CircularProgress />;
//   if (error)
//     return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <TableContainer >
      <Table sx={{ minWidth: 650 }} aria-label="simple table" className="table_list_data">
        <TableHead>
          <TableRow>
            <TableCell>   
                 <Checkbox checked={selectAll}
    onChange={handleSelectAllChange}/></TableCell>
            <TableCell >Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell >Description</TableCell>
            <TableCell >Selling Rate</TableCell>
            <TableCell >Buying rate</TableCell>
            <TableCell >Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row,key) => (


<TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          
            >
          
              <TableCell align="right">    <Checkbox
    checked={selectedCheckboxes.includes(row)}
    onChange={(event) =>
      handleCheckboxChange(event, row)
    } 
  /></TableCell>
              <TableCell     onClick={()=>{
                 console.log( window.location.host ,'sss')
                 navigate(props.edit_list_url+"/"+row._id);
                   // window.location.href = window.location.protocol+"//"+window.location.host+"/"+props.edit_list_url+"/"+row._id
                //   location.replace(window.location.protocol+"/"+window.location.host+"/"+props.edit_list_url+"/"+row._id);
            }}>{row.code}</TableCell>
              <TableCell >{row.currency_name}</TableCell>
              <TableCell>{row.currency_detail}</TableCell>
              <TableCell >{row.selling_rate}</TableCell>
              <TableCell >{row.buying_rate}</TableCell>
              <TableCell>    
                   

                           
                           <SwitchWithLabel
              checked={row.status === "active"}
              onChange={(e) =>  {
           
                let status = e.target.checked?"active":"inactive"
                handleSwitchChange(row._id,status)
              }
            
            } label={row.status}
            /> 
                        </TableCell>
            </TableRow>


       

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableBoxListComponent;
