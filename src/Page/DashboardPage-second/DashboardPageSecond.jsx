import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import DonutChart from '../../component/DashboardSecond/DonutChart';
import MultiLineChart from '../../component/DashboardSecond/MultiLineChart';
import CurrencyTable from '../../component/DashboardSecond/CurrencyTable';
import CurrencyProfitChart from '../../component/DashboardSecond/CurrencyProfitChart';
import MultiDetailChart from '../../component/DashboardSecond/MultiDetail/MultiDetailChart';
import MultiDetailTable from '../../component/DashboardSecond/MultiDetail/MultiDetailTable';
import DonutDetailDonutChart from '../../component/DashboardSecond/DonutDetail/DonutDetailDonutChart';
import DonutDetailTable from '../../component/DashboardSecond/DonutDetail/DonutDetailTable';
import CurrencyDetailChart from '../../component/DashboardSecond/CurrencyDetail/CurrencyDetailChart';
import CurrencyDetailTable from '../../component/DashboardSecond/CurrencyDetail/CurrencyDetailTable';
import NavBar from '../../component/NavBar/NavBar.jsx';
import Header from '../../component/Layout/Header.jsx';
import Footer from '../../component/Layout/Footer.jsx';
import DashboardHeader from '../../component/DashboardSecond/DashboardHeader.jsx';
import CommonDashboardHeader from '../../component/DashboardSecond/CommonDashboardHeader.jsx';

const DashboardPageSecond = () => {
  const [selectedView, setSelectedView] = useState(null); // 'donut' | 'multiLine' | 'currencyTable'
  const [selectedStone, setSelectedStone] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const handleBack = () => {
    setSelectedView(null);
    setSelectedStone(null);
    setSelectedCurrency(null);
  };

  const handleDonutSliceClick = (data) => {
    console.log("donut clicked");
    if (data && data.name) {
      setSelectedStone(data.name);
      setSelectedView('donut');
    }
  };

  const handleMultiLinePointClick = (data) => {
    console.log("Line clicked");
    setSelectedView('multiLine');
  };

  const handleCurrencyTableClick = (data) => {
    console.log("currency clicked");
    setSelectedCurrency(data);
    setSelectedView('currencyTable');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <Box sx={{ marginLeft: "222px", minHeight: "100vh", paddingBottom: "130px" }}>
        <Header />
        <DashboardHeader />

        <Box sx={{ padding: "50px 50px 0px 50px" }}>
          {!selectedView && <CommonDashboardHeader />}

          {selectedView === 'donut' && (
            <>
              <DonutDetailDonutChart onBack={handleBack} />
              <DonutDetailTable filterStone={selectedStone} />
            </>
          )}



          {selectedView === 'multiLine' && (
            <>
              <MultiDetailChart onBack={handleBack} />
              <MultiDetailTable />
            </>
          )}

          {selectedView === 'currencyTable' && (
            <>
              <CurrencyDetailChart currencyCode={selectedCurrency} onBack={handleBack} />
              <CurrencyDetailTable filterCurrency={selectedCurrency} />
            </>
          )}

          {/* Dashboard View */}
          {!selectedView && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DonutChart onSliceClick={handleDonutSliceClick} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MultiLineChart onPointClick={handleMultiLinePointClick} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CurrencyTable onRowClick={handleCurrencyTableClick} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CurrencyProfitChart />
                </Grid>
              </Grid>
          
            </>
          )}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardPageSecond;
