import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CompanyProfile from "./Page/Company/CompanyProfile";
import UserAndPermission from "./Page/User&Per/UserAndPermission";
import ErrorPage from "./Page/Error/error-page.jsx";
import Vendor from "./Page/Account/Vendor.jsx";
import Customer from "./Page/Account/Customer.jsx";
import VendorEdit from "./Page/Account/VendorEdit.jsx";
import VendorAdd from "./Page/Account/VendorAdd.jsx";
import CustomerAdd from "./Page/Account/CustomerAdd.jsx";
import CustomerEdit from "./Page/Account/CustomerEdit.jsx";
import StoneGroup from "./Page/StoneMaster/StoneGroup.jsx";
import StoneGroupAdd from "./Page/StoneMaster/StoneGroupAdd.jsx";
import Bank from "./Page/Company/Bank/Bank";
import Stone from "./Page/StoneMaster/Stone.jsx";
import Shape from "./Page/StoneMaster/Shape.jsx";
import Size from "./Page/StoneMaster/Size.jsx";
import Color from "./Page/StoneMaster/Color.jsx";
import Cutting from "./Page/StoneMaster/Cutting.jsx";
import Quality from "./Page/StoneMaster/Quality.jsx";
import Clarity from "./Page/StoneMaster/Clarity.jsx";
import CertificateType from "./Page/StoneMaster/CertificateType.jsx";
import LabourType from "./Page/StoneMaster/LabourType.jsx";
import StoneAdd from "./Page/StoneMaster/StoneAdd.jsx";
import ShapeAdd from "./Page/StoneMaster/ShapeAdd.jsx";
import SizeAdd from "./Page/StoneMaster/SizeAdd.jsx";
import ColorAdd from "./Page/StoneMaster/ColorAdd.jsx";
import CuttingAdd from "./Page/StoneMaster/CuttingAdd.jsx";
import QualityAdd from "./Page/StoneMaster/QualityAdd.jsx";
import ClarityAdd from "./Page/StoneMaster/ClarityAdd.jsx";
import CertificateTypeAdd from "./Page/StoneMaster/CertificateTypeAdd.jsx";
import LabourTypeAdd from "./Page/StoneMaster/LabourTypeAdd.jsx";
import App from "./Test code/SubTest1.jsx";
import Home from "./Page/Home/Home.jsx";
import Login from "./Page/Login/Login.jsx";
import PurchaseOrder from "./Page/PuchaseOrder/PurchaseOrder";
import Purchase from "./Page/PuchaseOrder/Purchase.jsx";
import MemoIn from "./Page/Memo/MemoIn.jsx";
import MenoReturn from "./Page/Memo/MenoReturn.jsx";
import MemoOutReturn from "./Page/Memo/MemoOutReturn";
import MemoOut from "./Page/Memo/MemoOut";
import Load from "./Page/Inventory/Load.jsx";
import SalePage from "./Page/Sale/SalePage.jsx"
import Primary from "./Page/Inventory/Primary.jsx";
import Consignment from "./Page/Inventory/Consignment.jsx";
import StockMovement from "./Page/Inventory/StockMovement.jsx";


import PrimaryReportPage from "./Page/Inventory/Report/PrimaryReportPage.jsx";
import ConsignmentReportPage from "./Page/Inventory/Report/ConsignmentReportPage.jsx";
import ConsignmentTransferPage from "./Page/Inventory/Transfer/ConsignmentTransferPage.jsx";
import StockMovementReportPage from "./Page/Inventory/Report/StockMovementReportPage.jsx";
import ConsignmentCheckPage from "./Page/Inventory/Report/ConsignmentCheckPage.jsx";
import StockMovementTransferPage from "./Page/Inventory/Transfer/StockMovementTransferPage.jsx";
import Currency from "Page/Currency/Currency";
import MainLocation from "Page/MainLocation/MainLocation";
import SubLocation from "Page/SubLocation/SubLocation";
import { RecoilRoot } from 'recoil';
import './recoil.config.ts';
import Quotation from "Page/Quotation/QuotationsOrder";
import ReservePage from "Page/Reserve/ReservePage";
import DashboardPage from "Page/DashboardPage/DashboardPage"
import DashboardPageSecond from "Page/DashboardPage-second/DashboardPageSecond"
import NavigationGuardWrapper from "./component/Common/NavigationGuardWrapper";




const router = createBrowserRouter([
  {
    path: "/",
    element: <NavigationGuardWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "dashboard-second",
        element: <DashboardPageSecond />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "company/company-profile",
        element: <CompanyProfile />,
      },


      {
        path: "company/bank",
        element: <Bank />,
      },
      {
        path: "company/bank/:action",
        element: <Bank />,
      },
      {
        path: "company/bank/:action/:id",
        element: <Bank />,
      },
  // { 

  //   path : "/company/bank",
  //   element : <Bank />,
  //   errorElement : <ErrorPage />
  // },
      {
        path: "userandpermission/add",
        element: <UserAndPermission />,
      },
      {
        path: "userandpermission",
        element: <UserAndPermission />,
      },
      {
        path: "account/vendor",
        element: <Vendor />,
      },
      {
        path: "account/vendor/edit/:id",
        element: <VendorEdit />,
      },
      {
        path: "account/vendor/add",
        element: <VendorAdd />,
      },
      {
        path: "account/customer",
        element: <Customer />,
      },
      {
        path: "account/customer/:action",
        element: <CustomerAdd />,
      },
      {
        path: "account/customer/:action/:id",
        element: <CustomerEdit />,
      },
      {
        path: "stone-master/stone-group",
        element: <StoneGroup />,
      },
      {
        path: "stone-master/stone/",
        element: <Stone />,
      },
      {
        path: "stone-master/shape/",
        element: <Shape />,
      },
      {
        path: "stone-master/size/",
        element: <Size />,
      },
      {
        path: "stone-master/color",
        element: <Color />,
      },
      {
        path: "stone-master/cutting/",
        element: <Cutting />,
      },
      {
        path: "stone-master/quality/",
        element: <Quality />,
      },
      {
        path: "stone-master/clarity/",
        element: <Clarity />,
      },
      {
        path: "stone-master/certificate-type/",
        element: <CertificateType />,
      },
      {
        path: "stone-master/labour-type/",
        element: <LabourType />,
      },
      {
        path: "stone-master/stone-group/add",
        element: <StoneGroupAdd />,
      },
      {
        path: "stone-master/stone/add/",
        element: <StoneAdd />,
      },
      {
        path: "stone-master/shape/add/",
        element: <ShapeAdd />,
      },
      {
        path: "stone-master/size/add/",
        element: <SizeAdd />,
      },
      {
        path: "stone-master/color/add/",
        element: <ColorAdd />,
      },
      {
        path: "stone-master/cutting/add/",
        element: <CuttingAdd />,
      },
      {
        path: "stone-master/quality/add/",
        element: <QualityAdd />,
      },
      {
        path: "stone-master/clarity/add/",
        element: <ClarityAdd />,
      },
      {
        path: "stone-master/certificate-type/add/",
        element: <CertificateTypeAdd />,
      },
      {
        path: "stone-master/labour-type/add/",
        element: <LabourTypeAdd />,
      },
      {
        path: "quotation",
        element: <Quotation />,
      },
      {
        path: "reserve",
        element: <ReservePage />,
      },
      {
        path: "purchase-order/purchase",
        element: <Purchase inventory_type="purchase_pu" inventory_label_type="Purchase (PU)" />,
      },
      {
        path: "purchase-order/purchase-order",
        element: <PurchaseOrder inventory_type="purchase_po" inventory_label_type="Purchase Order (PO)" />,
      },
      {
        path: "memo/memo-in",
        element: <MemoIn inventory_type="memo_in" inventory_label_type="Memo In" />,
      },
      {
        path: "memo/memo-return",
        element: <MenoReturn />,
      },
      {
        path: "memo/memo-out-return",
        element: <MemoOutReturn />,
      },
      {
        path: "memo/memo-out",
        element: <MemoOut />,
      },
      {
        path: "inventory/load",
        element: <Load />,
      },
      {
        path: "inventory/primary",
        element: <PrimaryReportPage />,
      },
      {
        path: "sale",
        element: <SalePage />,
      },
      {
        path: "inventory/consignment",
        element: <Consignment />,
      },
      {
        path: "inventory/stockmovement",
        element: <StockMovement />,
      },
   
      {
        path: "inventory/report/primary",
        element: <PrimaryReportPage />,
      },
      {
        path: "inventory/report/consignment",
        element: <ConsignmentReportPage />,
      },
      {
        path: "inventory/report/stock-check",
        element: <StockMovementReportPage />,
      },
      {
        path: "inventory/report/cons-check",
        element: <ConsignmentCheckPage />,
      },
      {
        path: "inventory/transfer/consignment",
        element: <ConsignmentTransferPage />,
      },
      {
        path: "inventory/transfer/stock-check",
        element: <StockMovementTransferPage />,
      },
      {
        path: "settings/currency",
        element: <Currency />,
      },
      {
        path: "settings/currency/:action",
        element: <Currency />,
      },
      {
        path: "settings/currency/:action/:id",
        element: <Currency />,
      },
      {
        path: "settings/main-location",
        element: <MainLocation />,
      },
      {
        path: "settings/main-location/:action",
        element: <MainLocation />,
      },
      {
        path: "settings/main-location/:action/:id",
        element: <MainLocation />,
      },
      {
        path: "settings/sub-location",
        element: <SubLocation />,
      },
      {
        path: "settings/sub-location/:action",
        element: <SubLocation />,
      },
      {
        path: "settings/sub-location/:action/:id",
        element: <SubLocation />,
      },
    ],
  },



  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
     <RecoilRoot>
         <RouterProvider router={router} />
     </RecoilRoot>
  </>
);
