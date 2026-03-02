import { useState } from "react";
import * as React from "react";
import { Box, Typography, Button, TextField, Select,  MenuItem, FormControl, InputLabel, InputAdornment, Checkbox, CssBaseline, FormControlLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import THB from "../pic/currency/thailand.png";
import JPY from "../pic/currency/japan.png";
import USA from "../pic/currency/united-states.png";
import CNY from "../pic/currency/china.png";
import wide from "../pic/wide.png";
import bin from "../pic/bin.png";

function createData(no) {
  return { no };
}

const rows = [createData("")];

const CustomBox = () => (
  <Box sx={{backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}/>
);

const PurchaseBody = ({ selectedRows }) => {
  const [setAge] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [showTextField, setShowTextField] = useState(false);
  const [value] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCheckboxChange = (event) => {
    setShowTextField(event.target.checked);
  };

  return (
    <>
      <Box  sx={{ height: "930px", maxWidth: "1800px", marginLeft: "25px", marginTop: "7px", }} >

        {/* Transaction Date & Last Update */}
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "white", }} >
          <Typography sx={{ fontSize: "11px", color: "#C6C6C8", marginRight: "30px" }}>Transaction Date : 29/01/2024 By : Super Admin</Typography>
          <Typography sx={{ fontSize: "11px", color: "#C6C6C8", marginRight: "5px" }}>Last Update : 29/01/2024 By : Super Admin</Typography>
        </Box>

        {/* Body */}
        <Box sx={{ height: "100%", maxWidth: "1800px", borderTop: "1px solid #ccc", borderLeft: "1px solid #ccc", borderRight: "1px solid #ccc", borderRadius: "4px" }}>

          {/* ด้านบน */}
          <Box sx={{ width: "100%", height: "156px", borderBottom: "1px solid #ccc" }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center",  width: "100%", height: "78px", paddingLeft: "31px", paddingTop: "10px" }}>
              <Box>
                <Typography sx={{ fontSize: "13px" }}>Purchase No. :</Typography>
                <Typography sx={{ color: "#05595B", fontSize: "23px",position: "relative",top: "-6px" }}>PU2024010022</Typography>
              </Box>
              <Box sx={{  display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", width: "100%", height: "78px", paddingRight: "31px" }}>
                <TextField id="date" label="Doc Date : *" type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} 
                           InputLabelProps={{ shrink: true, sx: {  fontSize: "16px", left: "-24px" }}}
                           InputProps={{ sx: { borderRadius: "10px",  height: "43px" }}}
                           sx={{ width: "225px", "& .MuiOutlinedInput-root": { borderRadius: "10px", position: "relative", left: "-24px", color: "#B3B3B3" }}}
                />

                <TextField id="date" label="Doc Date : *"  type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)}
                           InputLabelProps={{ shrink: true, sx: { fontSize: "16px" }}}
                           InputProps={{ sx: { borderRadius: "10px", height: "43px" }}}
                           sx={{ width: "205px", "& .MuiOutlinedInput-root": { borderRadius: "10px", color: "#B3B3B3" }}}
                />
              </Box>
            </Box>

            <Box sx={{ width: "100%", height: "78px", paddingTop: "10px",  paddingLeft: "31px" }}>
              <TextField id="outlined-number"
                         label="Account : *"
                         InputLabelProps={{ shrink: true, sx: {fontSize: "16px" }}}
                         InputProps={{ sx: { borderRadius: "10px",  height: "43px" }}}
                         sx={{ width: "500px", "& .MuiOutlinedInput-root": { borderRadius: "10px" }}}
              />
              <TextField id="outlined-number"
                         label="Ref. 1 :"
                         InputLabelProps={{
                         shrink: true, x: { fontSize: "16px", left: "24px" }}}
                         InputProps={{ sx: { borderRadius: "10px", height: "43px" }}}
                         sx={{ width: "300px", "& .MuiOutlinedInput-root": { borderRadius: "10px", position: "relative", left: "24px" }}}
              />
              <TextField id="outlined-number"
                         label="Ref. 2 :"
                         InputLabelProps={{ shrink: true, sx: { fontSize: "16px", left: "48px" }}}
                         InputProps={{ sx: { borderRadius: "10px", height: "43px" }}}
                         sx={{ width: "300px", "& .MuiOutlinedInput-root": { borderRadius: "10px", position: "relative", left: "48px" }}}
              />
              <FormControl sx={{ width: 235, position: "relative", left: "72px" }}>
                <InputLabel id="demo-simple-select-label" sx={{ fontWeight: "bold", fontSize: "16px" }}>Currency : *</InputLabel>
                <InputLabel id="demo-simple-select-label" sx={{ fontWeight: "bold", fontSize: "16px", color: "red", marginInlineStart: "65px"}}>*</InputLabel>

                <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Currency : *"
                        defaultValue={10}
                        sx={{ height: "43px", borderRadius: "10px" }}>
                  <MenuItem value={10}>
                    <Box sx={{ display: "flex" }}>
                      <img src={THB} alt="THB" style={{ width: 25, height: 25 }} />
                      <Typography sx={{ fontSize: "14px", paddingLeft: "10px" }} >THB - THAILAND</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={20}>
                    <Box sx={{ display: "flex" }}>
                      <img src={USA} alt="USA" style={{ width: 25, height: 25 }} />
                      <Typography sx={{ fontSize: "14px", paddingLeft: "10px" }}>USD - USA</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={30}>
                    <Box sx={{ display: "flex" }}>
                      <img src={JPY} alt="JPY" style={{ width: 25, height: 25 }} />
                      <Typography sx={{ fontSize: "14px", paddingLeft: "10px" }}>JPY - JAPAN</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={30}>
                    <Box sx={{ display: "flex" }}>
                      <img src={CNY} alt="CNY" style={{ width: 25, height: 25 }} />
                      <Typography sx={{ fontSize: "14px", paddingLeft: "10px" }} > CNY - CHINA </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField disabled id="outlined-disabled" label="Exchange Rate :"
                InputLabelProps={{  shrink: true, sx: { fontSize: "16px", fontWeight: "bold", left: "96px" }}}
                InputProps={{ sx: { borderRadius: "10px", height: "43px", backgroundColor: "#F0F0F0" }}}
                sx={{ width: "308px", "& .MuiOutlinedInput-root": { borderRadius: "10px", position: "relative", left: "96px" }}}
              />
            </Box>
          </Box>

          {/* ด้านล่าง */}
          <Box sx={{ width: "100%", height: "80%", display: "flex" }}>
            {/* ด้านซ้าย */}
            <Box sx={{ width: "2230px" }}>
              <Box sx={{ width: "1250px", height: "75px", paddingLeft: "30px", paddingTop: "20px" }}>
                <Typography sx={{ color: "#05595B", fontWeight: "bold", fontSize: "18px" }}>Item</Typography>
              </Box>

              <Box sx={{ width: "1250px", height: "450px", paddingLeft: "30px" }}>
                <TableContainer component={Paper} sx={{ borderRadius: "5px",borderColor: "#C6C6C8",border: "1px solid #ccc" }}>
                  <Table aria-label="selected rows table">
                    <TableHead sx={{ backgroundColor: "#EDEDED" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>#</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Location</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Stone</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Shape</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Size</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Color</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Cutting</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Quality</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Clarity</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Cer Type</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>CerNo.</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Lot</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Pcs</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Weight</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Price</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Unit</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Amount</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Discount(%)</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Discount Amt</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Total Amount</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}> Due Date</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Ref No.</Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#343434" }}>
                          <Box sx={{ height: "10px", display: "flex", alignItems: "center" }}>Remark</Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.no}</TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Location}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Stone}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "80px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Shape}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Size}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Color}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Cutting}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Quality}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.Clarity}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.CerType}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "130px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6"}}>{row.CerNo}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "80px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Lot}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "80px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Pcs}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Weight}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Price}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "80px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Unit}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Amount}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ backgroundColor: "#F0F0F0", width: "80px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Discount}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.DiscountAmt}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.Amount}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.DueDate}</Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: "110px", height: "40px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "5px", border: "1px solid #E6E6E6" }}>{row.PONo}</Box>
                          </TableCell>
                          <TableCell sx={{ display: "flex" }}>
                            <Box sx={{ display: "flex", alignItems: "center", height: "40px", width: "275px", paddingLeft: "10px", justifyContent: "space-between", border: "1px solid #E6E6E6", borderRadius: "5px", "&:hover": { border: "1px solid #1B84FF", borderRadius: "4px" }}}>
                              <Typography sx={{ color: "#B3B3B3", fontSize: "14px" }}> Description ... </Typography>
                              <Box component="img" src={wide} alt="wide" sx={{ width: "15px", height: "15px", marginRight: "10px" }}/></Box>
                            <Box component="img" src={bin} alt="bin" sx={{ width: "20px", height: "20px", marginLeft: "10px",marginTop: "8px" }}/>
                          </TableCell>
                        </TableRow>
                      ))}
                      {rows.map((row) => (
                        <TableRow key={row.no}>
                          <TableCell component="th" scope="row">{row.no}</TableCell>
                          {[...Array(21)].map((_, index) => (
                            <TableCell key={index}>
                              <CustomBox/>
                            </TableCell>
                          ))}
                          <TableCell sx={{ display: "flex" }}>
                            <Box sx={{ display: "flex", alignItems: "center", height: "40px", width: "275px", paddingLeft: "10px", justifyContent: "space-between", border: "1px solid #E6E6E6", borderRadius: "5px", "&:hover": {border: "1px solid #1B84FF", borderRadius: "4px"}}}>
                              <Typography sx={{ color: "#B3B3B3", fontSize: "14px" }}>Description ...</Typography>
                              <Box component="img" src={wide} alt="wide" sx={{ width: "15px", height: "15px", marginRight: "10px" }}/>
                            </Box>
                            <Box component="img" src={bin} alt="bin" sx={{ width: "20px", height: "20px", marginLeft: "10px", marginTop: "8px" }}/>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ width: "100%", height: "150px",  paddingLeft: "30px" }}>
                <Typography sx={{ color: "#1B84FF", fontWeight: "bold" }}>+ Add row</Typography>
                <Box sx={{ paddingTop: "20px" }}>
                  <TextField id="outlined-number"
                             label="Remark"
                             placeholder="This remark will be show on document"
                             InputLabelProps={{ shrink: true, sx: {  fontSize: "16px", alignItems: "flex-start" }}}
                             value={value}
                             onChange={handleChange}
                             inputProps={{ maxLength: 250 }}
                             InputProps={{ endAdornment: ( <InputAdornment position="end">{`${value.length}/250`}</InputAdornment> )}}
                             multiline
                             rows={4}
                             sx={{ backgroundColor: "white", width: "1220px", "& .MuiOutlinedInput-root": { borderRadius: "10px",},"& .MuiInputBase-root": {height: "100px" }}}/>
                </Box>
              </Box>
            </Box>


            

            {/* ด้านขวา */}
            <Box sx={{ width: "50%", borderLeft: "1px solid #ccc" }}>
              <Box sx={{ width: "100%",  height: "50px", display: "flex", alignItems: "flex-end", paddingBottom: "0px",  paddingLeft: "30px" }}>
                <Typography sx={{ fontWeight: "bold", color: "#05595B", fontSize: "18px" }}>Summary Value</Typography>
              </Box>

              <Box sx={{ width: "100%", height: "210px", paddingLeft: "68px" }}>
                <Box sx={{ width: "395px", height: "42px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "14px" }}>Product Total Amount</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "14px", paddingRight: "10px" }}>
                      {selectedRows.length > 0 ? (
                        selectedRows.map((row, index) => (
                          <Typography key={index}>{row.Amount}</Typography>
                        ))
                      ) : (
                        <Typography>0.00</Typography>
                      )}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>THB</Typography>
                  </Box>
                </Box>

                <Box sx={{ width: "395px",  height: "40px", display: "flex", alignItems: "flex-end", paddingBottom: "3px" }}>
                  <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography sx={{ fontSize: "14px" }}>Discount</Typography>
                    <TextField variant="outlined" sx={{ width: "50px", height: "20px",  marginLeft: "10px", marginRight: "3px", "& .MuiInputBase-root": { height: "20x", fontSize: "0.75rem" }, "& .MuiOutlinedInput-input": { padding: "2px" }}}/>
                    <Typography sx={{ fontSize: "14px" }}>%</Typography>
                  </Box>

                  <Box sx={{  display: "flex", alignItems: "center", paddingLeft: "163px" }}>
                    <TextField  variant="outlined" defaultValue="0.00" 
                                inputProps={{ style: { textAlign: "center" }}}
                                sx={{ width: "50px", height: "20px", marginLeft: "10px", marginRight: "3px", "& .MuiInputBase-root": { height: "20x", fontSize: "0.75rem" }, "& .MuiOutlinedInput-input": { padding: "2px" }}}
                    />
                    <Typography sx={{ fontSize: "14px", paddingLeft: "10px" }}>THB</Typography>
                  </Box>
                </Box>

                <Box sx={{ width: "395px", height: "33px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "14px" }}>Total after Discount</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "14px", paddingRight: "10px" }}>
                      {selectedRows.length > 0 ? (
                        selectedRows.map((row, index) => (
                          <Typography key={index}>{row.Amount}</Typography>
                        ))
                      ) : (
                        <Typography>0.00</Typography>
                      )}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>THB</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-end", width: "395px",  height: "50px" }}>
                  <Box sx={{  width: "50%", height: "100%",  display: "flex", alignItems: "flex-end" }}>
                    <CssBaseline />
                    <FormControlLabel 
                      control={ <Checkbox checked={showTextField} onChange={handleCheckboxChange} />}
                      label="VAT"
                      sx={{ ".MuiFormControlLabel-label": { fontSize: "14px" }}}/>
                    {showTextField && (
                      <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "10px", marginLeft: "-5px" }} >
                        <TextField variant="outlined"
                                   defaultValue={7}
                                   inputProps={{ style: { textAlign: "center" }}}
                                   sx={{ width: "50px", height: "20px", marginRight: "3px", "& .MuiInputBase-root": { height: "20x",fontSize: "0.75rem",},"& .MuiOutlinedInput-input": { padding: "2px",},}}
                        />
                        <Typography>%</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end",  width: "50%", height: "100%", marginBottom: "-5px" }}>
                    <Typography sx={{ fontSize: "14px", paddingRight: "10px" }}>
                      {showTextField ? "1004.50" : "0.00"}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>THB</Typography>
                  </Box>
                </Box>

                <Box sx={{ width: "395px",  height: "28px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "14px" }}>Other Charge</Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "14px", paddingRight: "10px" }}>
                      {selectedRows.length > 0 ? (
                        selectedRows.map((row, index) => (
                          <Typography key={index}>{row.OtherCharge}</Typography>
                        ))
                      ) : (
                        <Typography>0.00</Typography>
                      )}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>THB</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{  width: "395px", height: "90px", backgroundColor: "#F3F3F3",  marginLeft: "66px", border: "1px solid #ccc", borderRadius: "5px", display: "flex",  justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "15px" }}>Grand Total</Typography>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Typography sx={{ fontWeight: "bold", fontSize: "26px", paddingRight: "10px" }}>
                    {selectedRows.length > 0
                      ? (
                          selectedRows.reduce((accumulator, currentValue) => {
           
                            return (
                              accumulator + parseFloat(currentValue.Amount)
                            );
                          }, 0) +
                          selectedRows.reduce((accumulator, currentValue) => {
                            return (
                              accumulator + parseFloat(currentValue.OtherCharge)
                            );
                          }, 0) +
                          (showTextField ? 1004.5 : 0)
                        ).toFixed(2)
                      : "0.00"} 
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "26px", paddingRight: "15px" }}>THB</Typography>
                </Box>
              </Box>

              <Box sx={{ paddingTop: "20px" }}>
                <TextField
                  id="outlined-number"
                  label="Note"
                  placeholder="This note will be show on document"
                  InputLabelProps={{ shrink: true, sx: { fontSize: "16px", alignItems: "flex-start"}}}
                  value={value}
                  onChange={handleChange}
                  inputProps={{ maxLength: 250 }}
                  InputProps={{ endAdornment: ( <InputAdornment position="end">{`${value.length}/250`}</InputAdornment> )}}
                  multiline 
                  rows={4} 
                  sx={{ width: "395px",  height: "92px", marginLeft: "66px", "& .MuiOutlinedInput-root": { borderRadius: "10px" },"& .MuiInputBase-root": { height: "100px" }}}/>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Cancel Save Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", height: "80px", borderTop: "1px solid #ccc", marginTop: "16px", backgroundColor: "white" }}>
        <Box sx={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
          <Button variant="outlined" sx={{ textTransform: "none", borderColor: "#BFBFBF", color: "black", fontWeight: "bold", width: "93px", height: "46px" }}>Cancel</Button>
          <Button variant="outlined" sx={{ textTransform: "none", borderColor: "#17C653", color: "white", backgroundColor: "#17C653", fontWeight: "bold", width: "78px", height: "46px", marginLeft: "16px" }}>Save</Button>
        </Box>
      </Box>
    </>
  );
};

export default PurchaseBody;