import { useState } from "react";
import * as React from "react";
import { Box, Typography, Button, Modal, Checkbox, TextField } from "@mui/material";
import Printer from "../pic/printer.png";
import Excel from "../pic/excel.png";
import scan from "../pic/scan.png";
import scan1 from "../pic/scan1.png";
import close from "../pic/Scan/close.png";
import closeRun from "../pic/Scan/closerun.png";
import QRCode from "../pic/Scan/QRCode.png";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import wide from "../pic/wide.png";
import Printer1 from "../pic/printer1.png";
import Excel1 from "../pic/excel1.png";
import Printer2 from "../pic/printer2.png";
import Excel2 from "../pic/excel2.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../Style/PurchaseTitleStyles.css";

function createData( no,TranDate, DocDate, DueDate, PONo, Account, Ref1, Ref2, Pcs, Weight, Amount, Currency, Location, Stone, Shape, Size, Color, Cutting, Quality, Clarity, CerType, CerNo, Lot, Price, Unit, Discount, DiscountAmt, OtherCharge ) {
  return { no, TranDate, DocDate, DueDate, PONo, Account, Ref1, Ref2, Pcs, Weight, Amount, Currency, Location, Stone, Shape, Size, Color, Cutting, Quality, Clarity, CerType, CerNo, Lot, Price, Unit, Discount, DiscountAmt, OtherCharge };
}

const rows = [
  createData( "1", "25/01/2024", "25/01/2024", "25/01/2024", "PO202410022", "Lopster", "", "", "1", "0.5000", "14350.00", "THB", "Consign-G15", "Diamond", "Emerald", "5.5x4 MM", "White", "Full Cut", "AAA", "VS2", "GIA", "1235412110263", "", "28700.00", "Cts", "", "0.00", "200.00" ),
  createData( "2", "25/01/2024", "25/01/2024", "25/01/2024", "PO202410228", "Lopster", "", "", "1", "1.5000", "21,350.00", "THB" ),
  createData( "3", "22/01/2024", "06/01/2024", "06/01/2024", "PO202410106", "Lopster", "", "", "1", "0.5000", "9,050.00", "THB" ),
  createData( "" ),
  createData( "" ),
];

const Purchase = ({ onShowSelectedRows }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isHoveredScan, setIsHoveredScan] = useState(false);
  const [isHoveredClose, setIsHoveredClose] = useState(false);
  const [isHoveredPrinter, setIsHoveredPrinter] = useState(false);
  const [isHoveredExcel, setIsHoveredExcel] = useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleHoverScan = () => {
    setIsHoveredScan(true);
  };

  const handleUnhoverScan = () => {
    setIsHoveredScan(false);
  };

  const handleHoverClose = () => {
    setIsHoveredClose(true);
  };

  const handleUnhoverClose = () => {
    setIsHoveredClose(false);
  };

  const handleHoverPrinter = () => {
    setIsHoveredPrinter(true);
  };

  const handleUnhoverPrinter = () => {
    setIsHoveredPrinter(false);
  };

  const handleHoverExcel = () => {
    setIsHoveredExcel(true);
  };

  const handleUnhoverExcel = () => {
    setIsHoveredExcel(false);
  };

  const handleCheckboxChange = (event, row) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow !== row)
      );
    }
  };

  const handleShowSelectedRows = () => {
    onShowSelectedRows(selectedRows);
    handleClose();
  };

  return (
    <>
      <Box className="box1">
        <Box className="box2">
          <Box className="box3">
            <Typography className="text1">Purchase </Typography>
          </Box>

          <Box className="box4">
            <Button variant="contained" className="customButtonDayBook" sx={{ backgroundColor: "#C6A969", marginRight: "25px" }}>Day Book</Button>

            <Button variant="contained" className="background-color: #C6A969;" sx={{ backgroundColor:"#C6A969", marginRight: "25px" }} onClick={handleOpen}>PO</Button>
            <Modal open={open}
                   // onClose={handleClose}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description"
                   className="modal1">
              <Box className="box5">
                <Box className="box6">
                  <Typography className="text1"> Purchase Order </Typography>
                </Box>
                <Box className="box7">
                  <Box className="box8">
                    <Box className="displayflex">
                      <Box>
                        <TextField id="outlined-number"
                                   label="Account : "
                                   InputLabelProps={{ shrink: true, sx: { fontSize: "16px" }}}
                                   InputProps={{ sx: { borderRadius: "10px",  height: "43px" }}}
                                   sx={{  width: "590px", "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "white" }}}/>
                      </Box>

                      <Box className="box9">
                        <Typography className="marginRight">Rows per page</Typography>
                        <Box className="box10">
                          <Typography variant="h6" className="fontsize14">20</Typography>
                          <KeyboardArrowDownIcon />
                        </Box>

                        <Box className="customBox1">
                          <img src={isHoveredPrinter ? Printer1 : Printer2}
                               alt="Printer"
                               className="img1"
                               onMouseEnter={handleHoverPrinter}
                               onMouseLeave={handleUnhoverPrinter}/>
                        </Box>

                        <Box className="customBox2">
                          <img src={isHoveredExcel ? Excel1 : Excel2}
                               alt="Excel"
                               className="img1"
                               onMouseEnter={handleHoverExcel}
                               onMouseLeave={handleUnhoverExcel}/>
                        </Box>
                      </Box>
                    </Box>

                    <Box className="box12">
                      <TableContainer component={Paper} className="box11">
                        <Table aria-label="simple table">
                          <TableHead className="backgroundcolor1">
                            <TableRow>
                              <TableCell padding="checkbox" className="font1"></TableCell>
                              <TableCell> # </TableCell>
                              <TableCell className="font1">TranDate</TableCell>
                              <TableCell className="font1">Doc Date</TableCell>
                              <TableCell className="font1">Due Date</TableCell>
                              <TableCell className="font1">PO No.</TableCell>
                              <TableCell className="font1">Account</TableCell>
                              <TableCell className="font1">Ref&nbsp;1</TableCell>
                              <TableCell className="font1">Ref&nbsp;2</TableCell>
                              <TableCell className="font1">Pcs</TableCell>
                              <TableCell className="font1">Weight</TableCell>
                              <TableCell className="font1">Amount</TableCell>
                              <TableCell className="font1">Currency</TableCell>
                              <TableCell className="font1">Remark</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <TableRow key={row.no}>
                                <TableCell padding="checkbox">
                                  <Checkbox checked={selectedRows.includes(row)}
                                            onChange={(event) => handleCheckboxChange(event, row)}
                                  />
                                </TableCell>
                                <TableCell component="th" scope="row">{row.no}</TableCell>
                                <TableCell align="right">{row.TranDate}</TableCell>
                                <TableCell align="right">{row.DocDate}</TableCell>
                                <TableCell align="right">{row.DueDate}</TableCell>
                                <TableCell align="right">{row.PONo}</TableCell>
                                <TableCell align="right"> {row.Account}</TableCell>
                                <TableCell align="right">{row.Ref1}</TableCell>
                                <TableCell align="right">{row.Ref2}</TableCell>
                                <TableCell align="right">{row.Pcs}</TableCell>
                                <TableCell align="right">{row.Weight}</TableCell>
                                <TableCell align="right">{row.Amount}</TableCell>
                                <TableCell align="right">{row.Currency}</TableCell>
                                <TableCell align="right">
                                  <Box className="customBox3">
                                    <Typography className="fontcolor1"> Description ...</Typography>
                                    <Box component="img" src={wide} alt="wide" className="box13"/>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Box>
                </Box>

                <Box className="box14">
                  <Button variant="outlined" onClick={handleClose} sx={{ borderColor: "#BFBFBF", color: "black", fontWeight: "bold", textTransform: "none" }} className="customButtonCancel">Cancel</Button>
                  <Button variant="outlined" onClick={handleShowSelectedRows}  className="customButtonOK" sx={{ backgroundColor: "#17C653", borderColor: "#17C653", color: "white", fontWeight: "bold", textTransform: "none" }}>OK</Button>
                </Box>
              </Box>
            </Modal>

            <Button variant="contained" sx={{ backgroundColor: "#C6A969", marginRight: "25px" }}>Memo Pending</Button>

            <Box className="box15">
              <img src={Printer} alt="Printer" className="img2"/>
            </Box>
            <Box className="box15">
              <img src={Excel} alt="Excel" className="img2"/>
            </Box>

            <Box className="customBox4" onClick={handleOpen2} >
              <img src={isHoveredScan ? scan1 : scan} alt="scan" className="img1" onMouseEnter={handleHoverScan} onMouseLeave={handleUnhoverScan}/>
            </Box>

            <Modal open={open2}
                   // onClose={handleClose2}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description"
                   className="modal1">
              <Box className="box16">

                {/* X */}
                <Box className="box17">
                  <Box className="customIcon1" onClick={handleClose2}>
                    <img src={isHoveredClose ? closeRun : close} alt="scan" className="img3" onMouseEnter={handleHoverClose} onMouseLeave={handleUnhoverClose}/>
                  </Box>
                </Box>

                {/* Text Scan */}
                <Box className="box18">
                  <Typography className="fontWeight">Scan QR Code</Typography>
                  <Typography className="fontsize12">Hold your device over a QR Code to scan it</Typography>
                  <Typography className="fontsize12">Tap the pop-up notification</Typography>
                </Box>

                {/* QR Pic */}
                <Box className="box19">
                  <img src={QRCode} alt="QRCode"/>
                </Box>

                {/* Button SCAN */}
                <Box className="box20">
                  <Button onClick={handleClose2}
                          sx={{ width: "220px", height: "43px", backgroundColor: "#E6E6E6", borderRadius: "20px", "&:hover": { backgroundColor: "#E6E6E6" }}}>
                    <Typography sx={{ fontWeight: "bold", color: "black" }}>SCAN</Typography>
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Purchase;
