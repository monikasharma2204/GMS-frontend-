import React from "react";
import { Grid, Box } from "@mui/material";
import NavBar from "../../component/NavBar/NavBar";
import Header from "../../component/Layout/Header";
import Homey from "../../component/Home/Home";

const Home = () => {
  return (
    <Grid sx={{ display: "flex" }}>
      <NavBar />
      <Box  sx ={{marginLeft: "222px" , Height : "100vh " ,width:"100%"}}>
        <Header />
        <Homey />
      </Box>
    </Grid>
  );
};

export default Home;
 