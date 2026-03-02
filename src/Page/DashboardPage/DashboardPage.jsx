import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import DonutChart from '../../component/Dashboard/DonutChart';
import MultiLineChart from '../../component/Dashboard/MultiLineChart';
import CurrencyTable from '../../component/Dashboard/CurrencyTable';
import CurrencyProfitChart from '../../component/Dashboard/CurrencyProfitChart';
import MultiDetailChart from '../../component/Dashboard/MultiDetail/MultiDetailChart';
import MultiDetailTable from '../../component/Dashboard/MultiDetail/MultiDetailTable';
import DonutDetailDonutChart from '../../component/Dashboard/DonutDetail/DonutDetailDonutChart';
import DonutDetailTable from '../../component/Dashboard/DonutDetail/DonutDetailTable';
import CuurencyDetailChart from '../../component/Dashboard/CuurencyDetail/CuurencyDetailChart';
import CuurencyDetailTable from '../../component/Dashboard/CuurencyDetail/CuurencyDetailTable';
import NavBar from '../../component/NavBar/NavBar.jsx';
import Header from '../../component/Layout/Header.jsx';
import Footer from '../../component/Layout/Footer.jsx';
import DashboardHeader from '../../component/Dashboard/DashboardHeader.jsx';
import CommonDashboardHeader from '../../component/Dashboard/CommonDashboardHeader.jsx';

const DashboardPage = () => {
  const [selectedView, setSelectedView] = useState(null); // 'donut' | 'multiLine' | 'currencyTable'
  const [selectedStone, setSelectedStone] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const handleBack = () => {
    setSelectedView(null);
    setSelectedStone(null);
    setSelectedCurrency(null);
  };

  const handleDonutSliceClick = (data) => {
         console.log("donut cllicked")
    if (data && data.name) {
 
      setSelectedStone(data.name);
      setSelectedView('donut');
    }
  };

  const handleMultiLinePointClick = (data) => {
      console.log("Line cllicked")
    setSelectedView('multiLine');
  };

  const handleCurrencyTableClick = (data) => {
      console.log("currencyt cllicked")
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
              <CuurencyDetailChart currencyCode={selectedCurrency} onBack={handleBack} />
              <CuurencyDetailTable filterCurrency={selectedCurrency} />
            </>
          )}

          {/* Dashboard View */}
          {!selectedView && (
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
          )}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardPage;
