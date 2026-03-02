import React, { useState, useEffect } from "react";
import { Typography, Checkbox, Grid, Box } from "@mui/material";
import {
  GridMainTitle,
  FontMainStyle,
  FontSubStyle,
  GridMainSubMenuTitle,
  GridSubMainTitle,
  GridSubMainSubMenuTitle,
} from "../../../Assets/styles/TablePermissionStyles.jsx";
import { initialList } from "../TablePermission/MockDataPermission.jsx";

const CheckboxComponent = ({ checked, onChange }) => (
  <Grid item sx={GridSubMainSubMenuTitle}>
    <Checkbox
      checked={checked}
      onChange={onChange}
      color="primary"
      sx={{ padding: 0 }}
    />
  </Grid>
);

const renderHeader = () => (
  <Grid container sx={{ backgroundColor: "#EDEDED" }}>
    <Grid item sx={GridMainTitle}>
      <Typography sx={FontMainStyle}>Menu</Typography>
    </Grid>
    {["View", "Add", "Edit", "Delete", "Price"].map((header, index) => (
      <Grid item key={index} sx={GridMainSubMenuTitle}>
        <Typography sx={FontMainStyle}>{header}</Typography>
      </Grid>
    ))}
  </Grid>
);

const PermissionsList = () => {

  // For set MockData to Value

  const [maincompanyPermissions, setMainCompanyPermissions] = useState(
    initialList[0].company
  );
  const [userPermissions, setUserPermissions] = useState(
    initialList[1].userPermission
  );
  const [mainaccountPermissions, setMainAccountPermissions] = useState(
    initialList[2].account
  );
  const [mainstonemasterPermissions, setMainStoneMasterPermissions] = useState(
    initialList[3].stoneMaster
  );
  const [quotationPermissions, setQuotationPermissions] = useState(
    initialList[4].quotation
  );
  const [reservePermissions, setReservePermissions] = useState(
    initialList[5].reserve
  );
  const [mainpurchaseOrderPermissions, setMainPurchaseOrderPermissions] =
    useState(initialList[6].purchaseOrder);

  const [mainmemoPermissions, setMainMemoPermissions] = useState(
    initialList[7].memo
  );
  const [maininventoryPermissions, setMainInventoryPermissions] = useState(
    initialList[8].inventory
  );

  const [salePermissions, setSalePermissions] = useState(initialList[9].sale);

  const [financePermission, setFinancePermission] = useState(
    initialList[10].finance
  );

  const [reportPermissions, setReportPermissions] = useState(
    initialList[11].report
  );

  const [mainOtherPermissions, setMainOtherPermissions] = useState(
    initialList[12].other
  );

  const [setupPermissions, setSetupPermissions] = useState(
    initialList[13].setup
  );

  // For Open Another Sections

  const [showCompanySections, setShowCompanySections] = useState(false);
  const [showAccountSections, setShowAccountSections] = useState(false);
  const [showStoneMasterSections, setShowStoneMasterSections] = useState(false);
  const [showPurchaseOrderSections, setShowPurchaseOrderSections] =
    useState(false);
  const [showMemoSections, setShowMemoSections] = useState(false);
  const [showInventorySections, setShowInventorySections] = useState(false);
  const [showFinanceSections, setShowFinanceSections] = useState(false);
  const [showOtherSections, setShowOtherSections] = useState(false);

  // For ButtonSubmit and NewData Function

  const [submitted, setIsSubmitted] = useState(false);
  const [newDataList, setNewDataList] = useState([]);
  const [newDataIndex, setNewDataIndex] = useState(1);

  // For SelectAllFunction

  const [selectAll, setSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [companySelectAll, setCompanySelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [accountSelectAll, setAccountSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [stonemasterSelectAll, setStoneMasterSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [purchaseOrderSelectAll, setPurchaseOrderSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [memoSelectAll, setMemoSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [inventorySelectAll, setInventorySelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [otherSelectAll, setOtherSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });
  const [financeSelectAll, setFinanceSelectAll] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
    price: false,
  });

  useEffect(() => {
    setSelectAll((prevState) => ({
      ...prevState,
      view:
        maincompanyPermissions.profile.company_profile_view &&
        maincompanyPermissions.bank.company_bank_view &&
        userPermissions.userPermission_view &&
        mainaccountPermissions.vendor.account_vendor_view &&
        mainaccountPermissions.customer.account_customer_view &&
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_view &&
        mainstonemasterPermissions.stone.stoneMaster_stone_view &&
        mainstonemasterPermissions.shape.stoneMaster_shape_view &&
        mainstonemasterPermissions.size.stoneMaster_size_view &&
        mainstonemasterPermissions.color.stoneMaster_color_view &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_view &&
        mainstonemasterPermissions.quality.stoneMaster_quality_view &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_view &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_view &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_view &&
        quotationPermissions.quotation_view &&
        reservePermissions.reserve_view &&
        mainpurchaseOrderPermissions.po.purchaseOrder_po_view &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_view &&
        mainmemoPermissions.memoIn.memo_memoIn_view &&
        mainmemoPermissions.memoReturn.memo_memoReturn_view &&
        mainmemoPermissions.memoOut.memo_memoOut_view &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_view &&
        maininventoryPermissions.all.inventory_all_view &&
        maininventoryPermissions.primary.inventory_primary_view &&
        maininventoryPermissions.consignment.inventory_consignment_view &&
        maininventoryPermissions.load.inventory_load_view &&
        salePermissions.sale_view &&
        reportPermissions.report_view &&
        mainOtherPermissions.mainLocation.other_mainLocation_view &&
        mainOtherPermissions.subLocation.other_subLocation_view &&
        mainOtherPermissions.currency.other_currency_view &&
        setupPermissions.setup_view &&
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_view &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_view &&
        financePermission.transaction.finance_transaction_view,
      add:
        maincompanyPermissions.profile.company_profile_add &&
        maincompanyPermissions.bank.company_bank_add &&
        userPermissions.userPermission_add &&
        mainaccountPermissions.vendor.account_vendor_add &&
        mainaccountPermissions.customer.account_customer_add &&
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_add &&
        mainstonemasterPermissions.stone.stoneMaster_stone_add &&
        mainstonemasterPermissions.shape.stoneMaster_shape_add &&
        mainstonemasterPermissions.size.stoneMaster_size_add &&
        mainstonemasterPermissions.color.stoneMaster_color_add &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_add &&
        mainstonemasterPermissions.quality.stoneMaster_quality_add &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_add &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_add &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_add &&
        quotationPermissions.quotation_add &&
        reservePermissions.reserve_add &&
        mainpurchaseOrderPermissions.po.purchaseOrder_po_add &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_add &&
        mainmemoPermissions.memoIn.memo_memoIn_add &&
        mainmemoPermissions.memoReturn.memo_memoReturn_add &&
        mainmemoPermissions.memoOut.memo_memoOut_add &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_add &&
        maininventoryPermissions.all.inventory_all_add &&
        maininventoryPermissions.primary.inventory_primary_add &&
        maininventoryPermissions.consignment.inventory_consignment_add &&
        maininventoryPermissions.load.inventory_load_add &&
        salePermissions.sale_add &&
        reportPermissions.report_add &&
        mainOtherPermissions.mainLocation.other_mainLocation_add &&
        mainOtherPermissions.subLocation.other_subLocation_add &&
        mainOtherPermissions.currency.other_currency_add &&
        setupPermissions.setup_add &&
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_add &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_add &&
        financePermission.transaction.finance_transaction_add,
      edit:
        maincompanyPermissions.profile.company_profile_edit &&
        maincompanyPermissions.bank.company_bank_edit &&
        userPermissions.userPermission_edit &&
        mainaccountPermissions.vendor.account_vendor_edit &&
        mainaccountPermissions.customer.account_customer_edit &&
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_edit &&
        mainstonemasterPermissions.stone.stoneMaster_stone_edit &&
        mainstonemasterPermissions.shape.stoneMaster_shape_edit &&
        mainstonemasterPermissions.size.stoneMaster_size_edit &&
        mainstonemasterPermissions.color.stoneMaster_color_edit &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_edit &&
        mainstonemasterPermissions.quality.stoneMaster_quality_edit &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_edit &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_edit &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_edit &&
        quotationPermissions.quotation_edit &&
        reservePermissions.reserve_edit &&
        mainpurchaseOrderPermissions.po.purchaseOrder_po_edit &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_edit &&
        mainmemoPermissions.memoIn.memo_memoIn_edit &&
        mainmemoPermissions.memoReturn.memo_memoReturn_edit &&
        mainmemoPermissions.memoOut.memo_memoOut_edit &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_edit &&
        maininventoryPermissions.all.inventory_all_edit &&
        maininventoryPermissions.primary.inventory_primary_edit &&
        maininventoryPermissions.consignment.inventory_consignment_edit &&
        maininventoryPermissions.load.inventory_load_edit &&
        salePermissions.sale_edit &&
        reportPermissions.report_edit &&
        mainOtherPermissions.mainLocation.other_mainLocation_edit &&
        mainOtherPermissions.subLocation.other_subLocation_edit &&
        mainOtherPermissions.currency.other_currency_edit &&
        setupPermissions.setup_edit &&
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_edit &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_edit &&
        financePermission.transaction.finance_transaction_edit,
      delete:
        maincompanyPermissions.profile.company_profile_delete &&
        maincompanyPermissions.bank.company_bank_delete &&
        userPermissions.userPermission_delete &&
        mainaccountPermissions.vendor.account_vendor_delete &&
        mainaccountPermissions.customer.account_customer_delete &&
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_delete &&
        mainstonemasterPermissions.stone.stoneMaster_stone_delete &&
        mainstonemasterPermissions.shape.stoneMaster_shape_delete &&
        mainstonemasterPermissions.size.stoneMaster_size_delete &&
        mainstonemasterPermissions.color.stoneMaster_color_delete &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_delete &&
        mainstonemasterPermissions.quality.stoneMaster_quality_delete &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_delete &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_delete &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_delete &&
        quotationPermissions.quotation_delete &&
        reservePermissions.reserve_delete &&
        mainpurchaseOrderPermissions.po.purchaseOrder_po_delete &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_delete &&
        mainmemoPermissions.memoIn.memo_memoIn_delete &&
        mainmemoPermissions.memoReturn.memo_memoReturn_delete &&
        mainmemoPermissions.memoOut.memo_memoOut_delete &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_delete &&
        maininventoryPermissions.all.inventory_all_delete &&
        maininventoryPermissions.primary.inventory_primary_delete &&
        maininventoryPermissions.consignment.inventory_consignment_delete &&
        maininventoryPermissions.load.inventory_load_delete &&
        salePermissions.sale_delete &&
        reportPermissions.report_delete &&
        mainOtherPermissions.mainLocation.other_mainLocation_delete &&
        mainOtherPermissions.subLocation.other_subLocation_delete &&
        mainOtherPermissions.currency.other_currency_delete &&
        setupPermissions.setup_delete &&
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_delete &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_delete &&
        financePermission.transaction.finance_transaction_delete,
      price:
        maincompanyPermissions.profile.company_profile_price &&
        maincompanyPermissions.bank.company_bank_price &&
        userPermissions.userPermission_price &&
        mainaccountPermissions.vendor.account_vendor_price &&
        mainaccountPermissions.customer.account_customer_price &&
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_price &&
        mainstonemasterPermissions.stone.stoneMaster_stone_price &&
        mainstonemasterPermissions.shape.stoneMaster_shape_price &&
        mainstonemasterPermissions.size.stoneMaster_size_price &&
        mainstonemasterPermissions.color.stoneMaster_color_price &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_price &&
        mainstonemasterPermissions.quality.stoneMaster_quality_price &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_price &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_price &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_price &&
        quotationPermissions.quotation_price &&
        reservePermissions.reserve_price &&
        mainpurchaseOrderPermissions.po.purchaseOrder_po_price &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_price &&
        mainmemoPermissions.memoIn.memo_memoIn_price &&
        mainmemoPermissions.memoReturn.memo_memoReturn_price &&
        mainmemoPermissions.memoOut.memo_memoOut_price &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_price &&
        maininventoryPermissions.all.inventory_all_price &&
        maininventoryPermissions.primary.inventory_primary_price &&
        maininventoryPermissions.consignment.inventory_consignment_price &&
        maininventoryPermissions.load.inventory_load_price &&
        salePermissions.sale_price &&
        reportPermissions.report_price &&
        mainOtherPermissions.mainLocation.other_mainLocation_price &&
        mainOtherPermissions.subLocation.other_subLocation_price &&
        mainOtherPermissions.currency.other_currency_price &&
        setupPermissions.setup_price &&
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_price &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_price &&
        financePermission.transaction.finance_transaction_price,
    }));

    setCompanySelectAll((prevState) => ({
      ...prevState,
      view:
        maincompanyPermissions.profile.company_profile_view &&
        maincompanyPermissions.bank.company_bank_view,
      add:
        maincompanyPermissions.profile.company_profile_add &&
        maincompanyPermissions.bank.company_bank_add,
      edit:
        maincompanyPermissions.profile.company_profile_edit &&
        maincompanyPermissions.bank.company_bank_edit,
      delete:
        maincompanyPermissions.profile.company_profile_delete &&
        maincompanyPermissions.bank.company_bank_delete,
      price:
        maincompanyPermissions.profile.company_profile_price &&
        maincompanyPermissions.bank.company_bank_price,
    }));

    setAccountSelectAll((prevState) => ({
      ...prevState,
      view:
        mainaccountPermissions.vendor.account_vendor_view &&
        mainaccountPermissions.customer.account_customer_view,
      add:
        mainaccountPermissions.vendor.account_vendor_add &&
        mainaccountPermissions.customer.account_customer_add,
      edit:
        mainaccountPermissions.vendor.account_vendor_edit &&
        mainaccountPermissions.customer.account_customer_edit,
      delete:
        mainaccountPermissions.vendor.account_vendor_delete &&
        mainaccountPermissions.customer.account_customer_delete,
      price:
        mainaccountPermissions.vendor.account_vendor_price &&
        mainaccountPermissions.customer.account_customer_price,
    }));

    setStoneMasterSelectAll((prevState) => ({
      ...prevState,
      view:
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_view &&
        mainstonemasterPermissions.stone.stoneMaster_stone_view &&
        mainstonemasterPermissions.shape.stoneMaster_shape_view &&
        mainstonemasterPermissions.size.stoneMaster_size_view &&
        mainstonemasterPermissions.color.stoneMaster_color_view &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_view &&
        mainstonemasterPermissions.quality.stoneMaster_quality_view &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_view &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_view &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_view,
      add:
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_add &&
        mainstonemasterPermissions.stone.stoneMaster_stone_add &&
        mainstonemasterPermissions.shape.stoneMaster_shape_add &&
        mainstonemasterPermissions.size.stoneMaster_size_add &&
        mainstonemasterPermissions.color.stoneMaster_color_add &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_add &&
        mainstonemasterPermissions.quality.stoneMaster_quality_add &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_add &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_add &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_add,
      edit:
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_edit &&
        mainstonemasterPermissions.stone.stoneMaster_stone_edit &&
        mainstonemasterPermissions.shape.stoneMaster_shape_edit &&
        mainstonemasterPermissions.size.stoneMaster_size_edit &&
        mainstonemasterPermissions.color.stoneMaster_color_edit &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_edit &&
        mainstonemasterPermissions.quality.stoneMaster_quality_edit &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_edit &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_edit &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_edit,
      delete:
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_delete &&
        mainstonemasterPermissions.stone.stoneMaster_stone_delete &&
        mainstonemasterPermissions.shape.stoneMaster_shape_delete &&
        mainstonemasterPermissions.size.stoneMaster_size_delete &&
        mainstonemasterPermissions.color.stoneMaster_color_delete &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_delete &&
        mainstonemasterPermissions.quality.stoneMaster_quality_delete &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_delete &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_delete &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_delete,
      price:
        mainstonemasterPermissions.stoneGroup.stoneMaster_stoneGroup_price &&
        mainstonemasterPermissions.stone.stoneMaster_stone_price &&
        mainstonemasterPermissions.shape.stoneMaster_shape_price &&
        mainstonemasterPermissions.size.stoneMaster_size_price &&
        mainstonemasterPermissions.color.stoneMaster_color_price &&
        mainstonemasterPermissions.cutting.stoneMaster_cutting_price &&
        mainstonemasterPermissions.quality.stoneMaster_quality_price &&
        mainstonemasterPermissions.clarity.stoneMaster_clarity_price &&
        mainstonemasterPermissions.certificateType
          .stoneMaster_certificateType_price &&
        mainstonemasterPermissions.labourType.stoneMaster_labourType_price,
    }));

    setPurchaseOrderSelectAll((prevState) => ({
      ...prevState,
      view:
        mainpurchaseOrderPermissions.po.purchaseOrder_po_view &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_view,
      add:
        mainpurchaseOrderPermissions.po.purchaseOrder_po_add &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_add,
      edit:
        mainpurchaseOrderPermissions.po.purchaseOrder_po_edit &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_edit,
      delete:
        mainpurchaseOrderPermissions.po.purchaseOrder_po_delete &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_delete,
      price:
        mainpurchaseOrderPermissions.po.purchaseOrder_po_price &&
        mainpurchaseOrderPermissions.pu.purchaseOrder_pu_price,
    }));

    setMemoSelectAll((prevState) => ({
      ...prevState,
      view:
        mainmemoPermissions.memoIn.memo_memoIn_view &&
        mainmemoPermissions.memoReturn.memo_memoReturn_view &&
        mainmemoPermissions.memoOut.memo_memoOut_view &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_view,
      add:
        mainmemoPermissions.memoIn.memo_memoIn_add &&
        mainmemoPermissions.memoReturn.memo_memoReturn_add &&
        mainmemoPermissions.memoOut.memo_memoOut_add &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_add,
      edit:
        mainmemoPermissions.memoIn.memo_memoIn_edit &&
        mainmemoPermissions.memoReturn.memo_memoReturn_edit &&
        mainmemoPermissions.memoOut.memo_memoOut_edit &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_edit,
      delete:
        mainmemoPermissions.memoIn.memo_memoIn_delete &&
        mainmemoPermissions.memoReturn.memo_memoReturn_delete &&
        mainmemoPermissions.memoOut.memo_memoOut_delete &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_delete,
      price:
        mainmemoPermissions.memoIn.memo_memoIn_price &&
        mainmemoPermissions.memoReturn.memo_memoReturn_price &&
        mainmemoPermissions.memoOut.memo_memoOut_price &&
        mainmemoPermissions.memoOutReturn.memo_memoOutReturn_price,
    }));

    setInventorySelectAll((prevState) => ({
      ...prevState,
      view:
        maininventoryPermissions.all.inventory_all_view &&
        maininventoryPermissions.primary.inventory_primary_view &&
        maininventoryPermissions.consignment.inventory_consignment_view &&
        maininventoryPermissions.load.inventory_load_view,
      add:
        maininventoryPermissions.all.inventory_all_add &&
        maininventoryPermissions.primary.inventory_primary_add &&
        maininventoryPermissions.consignment.inventory_consignment_add &&
        maininventoryPermissions.load.inventory_load_add,
      edit:
        maininventoryPermissions.all.inventory_all_edit &&
        maininventoryPermissions.primary.inventory_primary_edit &&
        maininventoryPermissions.consignment.inventory_consignment_edit &&
        maininventoryPermissions.load.inventory_load_edit,
      delete:
        maininventoryPermissions.all.inventory_all_delete &&
        maininventoryPermissions.primary.inventory_primary_delete &&
        maininventoryPermissions.consignment.inventory_consignment_delete &&
        maininventoryPermissions.load.inventory_load_delete,
      price:
        maininventoryPermissions.all.inventory_all_price &&
        maininventoryPermissions.primary.inventory_primary_price &&
        maininventoryPermissions.consignment.inventory_consignment_price &&
        maininventoryPermissions.load.inventory_load_price,
    }));

    setOtherSelectAll((prevState) => ({
      ...prevState,
      view:
        mainOtherPermissions.mainLocation.other_mainLocation_view &&
        mainOtherPermissions.subLocation.other_subLocation_view &&
        mainOtherPermissions.currency.other_currency_view,
      add:
        mainOtherPermissions.mainLocation.other_mainLocation_add &&
        mainOtherPermissions.subLocation.other_subLocation_add &&
        mainOtherPermissions.currency.other_currency_add,
      edit:
        mainOtherPermissions.mainLocation.other_mainLocation_edit &&
        mainOtherPermissions.subLocation.other_subLocation_edit &&
        mainOtherPermissions.currency.other_currency_edit,
      delete:
        mainOtherPermissions.mainLocation.other_mainLocation_delete &&
        mainOtherPermissions.subLocation.other_subLocation_delete &&
        mainOtherPermissions.currency.other_currency_delete,
      price:
        mainOtherPermissions.mainLocation.other_mainLocation_price &&
        mainOtherPermissions.subLocation.other_subLocation_price &&
        mainOtherPermissions.currency.other_currency_price,
    }));

    setFinanceSelectAll((prevState) => ({
      ...prevState,
      view:
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_view &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_view &&
        financePermission.transaction.finance_transaction_view,
      add:
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_add &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_add &&
        financePermission.transaction.finance_transaction_add,
      edit:
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_edit &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_edit &&
        financePermission.transaction.finance_transaction_edit,
      delete:
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_delete &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_delete &&
        financePermission.transaction.finance_transaction_delete,
      price:
        financePermission.outstandingReceiptPayable
          .finance_outstandingReceiptPayable_price &&
        financePermission.outstandingReceiptReceivable
          .finance_outstandingReceiptReceivable_price &&
        financePermission.transaction.finance_transaction_price,
    }));
  }, [
    maincompanyPermissions,
    userPermissions,
    mainaccountPermissions,
    mainstonemasterPermissions,
    quotationPermissions,
    reservePermissions,
    mainpurchaseOrderPermissions,
    mainmemoPermissions,
    maininventoryPermissions,
    salePermissions,
    reportPermissions,
    mainOtherPermissions,
    setupPermissions,
    financePermission,
  ]);

  const handleCheckboxChange = (section, category, permission) => {
    if (section === "company") {
      setMainCompanyPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        [category]: {
          ...prevmainCompanyPermissions[category],
          [permission]: !prevmainCompanyPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "userPermission") {
      setUserPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [permission]: !prevUserPermissions[permission],
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "account") {
      setMainAccountPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "stonemaster") {
      setMainStoneMasterPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "quotation") {
      setQuotationPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [permission]: !prevUserPermissions[permission],
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "reserve") {
      setReservePermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [permission]: !prevUserPermissions[permission],
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "purchaseOrder") {
      setMainPurchaseOrderPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "memo") {
      setMainMemoPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "inventory") {
      setMainInventoryPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "sale") {
      setSalePermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [permission]: !prevUserPermissions[permission],
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "report") {
      setReportPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [permission]: !prevUserPermissions[permission],
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "other") {
      setMainOtherPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "setup") {
      setSetupPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [permission]: !prevUserPermissions[permission],
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    } else if (section === "finance") {
      setFinancePermission((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        [category]: {
          ...prevmainAccountPermissions[category],
          [permission]: !prevmainAccountPermissions[category][permission],
        },
      }));

      setSelectAll({
        view: selectAll.view,
        add: selectAll.add,
        edit: selectAll.edit,
        delete: selectAll.delete,
        price: selectAll.price,
      });
    }
  };

  // HandleSelect

  const handleSelectAllChange = (type) => {
    setSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainCompanyPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        profile: {
          ...prevmainCompanyPermissions.profile,
          [`company_profile_${type}`]: newCheckboxState,
        },
        bank: {
          ...prevmainCompanyPermissions.bank,
          [`company_bank_${type}`]: newCheckboxState,
        },
      }));
      setUserPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [`userPermission_${type}`]: newCheckboxState,
      }));
      setMainAccountPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        vendor: {
          ...prevmainAccountPermissions.vendor,
          [`account_vendor_${type}`]: newCheckboxState,
        },
        customer: {
          ...prevmainAccountPermissions.customer,
          [`account_customer_${type}`]: newCheckboxState,
        },
      }));
      setMainStoneMasterPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        stoneGroup: {
          ...prevmainAccountPermissions.stoneGroup,
          [`stoneMaster_stoneGroup_${type}`]: newCheckboxState,
        },
        stone: {
          ...prevmainAccountPermissions.stone,
          [`stoneMaster_stone_${type}`]: newCheckboxState,
        },
        shape: {
          ...prevmainAccountPermissions.shape,
          [`stoneMaster_shape_${type}`]: newCheckboxState,
        },
        size: {
          ...prevmainAccountPermissions.size,
          [`stoneMaster_size_${type}`]: newCheckboxState,
        },
        color: {
          ...prevmainAccountPermissions.color,
          [`stoneMaster_color_${type}`]: newCheckboxState,
        },
        cutting: {
          ...prevmainAccountPermissions.cutting,
          [`stoneMaster_cutting_${type}`]: newCheckboxState,
        },
        quality: {
          ...prevmainAccountPermissions.quality,
          [`stoneMaster_quality_${type}`]: newCheckboxState,
        },
        clarity: {
          ...prevmainAccountPermissions.clarity,
          [`stoneMaster_clarity_${type}`]: newCheckboxState,
        },
        certificateType: {
          ...prevmainAccountPermissions.certificateType,
          [`stoneMaster_certificateType_${type}`]: newCheckboxState,
        },
        labourType: {
          ...prevmainAccountPermissions.labourType,
          [`stoneMaster_labourType_${type}`]: newCheckboxState,
        },
      }));
      setQuotationPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [`quotation_${type}`]: newCheckboxState,
      }));
      setReservePermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [`reserve_${type}`]: newCheckboxState,
      }));
      setMainPurchaseOrderPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        po: {
          ...prevmainCompanyPermissions.po,
          [`purchaseOrder_po_${type}`]: newCheckboxState,
        },
        pu: {
          ...prevmainCompanyPermissions.pu,
          [`purchaseOrder_pu_${type}`]: newCheckboxState,
        },
      }));
      setMainMemoPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        memoIn: {
          ...prevmainCompanyPermissions.memoIn,
          [`memo_memoIn_${type}`]: newCheckboxState,
        },
        memoReturn: {
          ...prevmainCompanyPermissions.memoReturn,
          [`memo_memoReturn_${type}`]: newCheckboxState,
        },
        memoOut: {
          ...prevmainCompanyPermissions.memoOut,
          [`memo_memoOut_${type}`]: newCheckboxState,
        },
        memoOutReturn: {
          ...prevmainCompanyPermissions.memoOutReturn,
          [`memo_memoOutReturn_${type}`]: newCheckboxState,
        },
      }));
      setMainInventoryPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        all: {
          ...prevmainCompanyPermissions.all,
          [`inventory_all_${type}`]: newCheckboxState,
        },
        primary: {
          ...prevmainCompanyPermissions.primary,
          [`inventory_primary_${type}`]: newCheckboxState,
        },
        consignment: {
          ...prevmainCompanyPermissions.consignment,
          [`inventory_consignment_${type}`]: newCheckboxState,
        },
        load: {
          ...prevmainCompanyPermissions.load,
          [`inventory_load_${type}`]: newCheckboxState,
        },
      }));
      setSalePermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [`sale_${type}`]: newCheckboxState,
      }));
      setReportPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [`report_${type}`]: newCheckboxState,
      }));
      setMainOtherPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        mainLocation: {
          ...prevmainCompanyPermissions.mainLocation,
          [`other_mainLocation_${type}`]: newCheckboxState,
        },
        subLocation: {
          ...prevmainCompanyPermissions.subLocation,
          [`other_subLocation_${type}`]: newCheckboxState,
        },
        currency: {
          ...prevmainCompanyPermissions.currency,
          [`other_currency_${type}`]: newCheckboxState,
        },
      }));
      setSetupPermissions((prevUserPermissions) => ({
        ...prevUserPermissions,
        [`setup_${type}`]: newCheckboxState,
      }));
      setFinancePermission((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        outstandingReceiptPayable: {
          ...prevmainCompanyPermissions.outstandingReceiptPayable,
          [`finance_outstandingReceiptPayable_${type}`]: newCheckboxState,
        },
        outstandingReceiptReceivable: {
          ...prevmainCompanyPermissions.outstandingReceiptReceivable,
          [`finance_outstandingReceiptReceivable_${type}`]: newCheckboxState,
        },
        transaction: {
          ...prevmainCompanyPermissions.transaction,
          [`finance_transaction_${type}`]: newCheckboxState,
        },
      }));
      return {
        ...prevState,
        [type]: newCheckboxState,
      };
    });
  };

  const handleCompanySelectAllChange = (type) => {
    setCompanySelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainCompanyPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        profile: {
          ...prevmainCompanyPermissions.profile,
          [`company_profile_${type}`]: newCheckboxState,
        },
        bank: {
          ...prevmainCompanyPermissions.bank,
          [`company_bank_${type}`]: newCheckboxState,
        },
      }));

      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handleAccountSelectAllChange = (type) => {
    setAccountSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainAccountPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        vendor: {
          ...prevmainAccountPermissions.vendor,
          [`account_vendor_${type}`]: newCheckboxState,
        },
        customer: {
          ...prevmainAccountPermissions.customer,
          [`account_customer_${type}`]: newCheckboxState,
        },
      }));

      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handleStoneMasterSelectAllChange = (type) => {
    setStoneMasterSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainStoneMasterPermissions((prevmainAccountPermissions) => ({
        ...prevmainAccountPermissions,
        stoneGroup: {
          ...prevmainAccountPermissions.stoneGroup,
          [`stoneMaster_stoneGroup_${type}`]: newCheckboxState,
        },
        stone: {
          ...prevmainAccountPermissions.stone,
          [`stoneMaster_stone_${type}`]: newCheckboxState,
        },
        shape: {
          ...prevmainAccountPermissions.shape,
          [`stoneMaster_shape_${type}`]: newCheckboxState,
        },
        size: {
          ...prevmainAccountPermissions.size,
          [`stoneMaster_size_${type}`]: newCheckboxState,
        },
        color: {
          ...prevmainAccountPermissions.color,
          [`stoneMaster_color_${type}`]: newCheckboxState,
        },
        cutting: {
          ...prevmainAccountPermissions.cutting,
          [`stoneMaster_cutting_${type}`]: newCheckboxState,
        },
        quality: {
          ...prevmainAccountPermissions.quality,
          [`stoneMaster_quality_${type}`]: newCheckboxState,
        },
        clarity: {
          ...prevmainAccountPermissions.clarity,
          [`stoneMaster_clarity_${type}`]: newCheckboxState,
        },
        certificateType: {
          ...prevmainAccountPermissions.certificateType,
          [`stoneMaster_certificateType_${type}`]: newCheckboxState,
        },
        labourType: {
          ...prevmainAccountPermissions.labourType,
          [`stoneMaster_labourType_${type}`]: newCheckboxState,
        },
      }));
      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handlePurchaseOrderSelectAllChange = (type) => {
    setPurchaseOrderSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainPurchaseOrderPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        po: {
          ...prevmainCompanyPermissions.po,
          [`purchaseOrder_po_${type}`]: newCheckboxState,
        },
        pu: {
          ...prevmainCompanyPermissions.pu,
          [`purchaseOrder_pu_${type}`]: newCheckboxState,
        },
      }));

      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handleMemoSelectAllChange = (type) => {
    setMemoSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainMemoPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        memoIn: {
          ...prevmainCompanyPermissions.memoIn,
          [`memo_memoIn_${type}`]: newCheckboxState,
        },
        memoReturn: {
          ...prevmainCompanyPermissions.memoReturn,
          [`memo_memoReturn_${type}`]: newCheckboxState,
        },
        memoOut: {
          ...prevmainCompanyPermissions.memoOut,
          [`memo_memoOut_${type}`]: newCheckboxState,
        },
        memoOutReturn: {
          ...prevmainCompanyPermissions.memoOutReturn,
          [`memo_memoOutReturn_${type}`]: newCheckboxState,
        },
      }));
      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handleInventorySelectAllChange = (type) => {
    setInventorySelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainInventoryPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        all: {
          ...prevmainCompanyPermissions.all,
          [`inventory_all_${type}`]: newCheckboxState,
        },
        primary: {
          ...prevmainCompanyPermissions.primary,
          [`inventory_primary_${type}`]: newCheckboxState,
        },
        consignment: {
          ...prevmainCompanyPermissions.consignment,
          [`inventory_consignment_${type}`]: newCheckboxState,
        },
        load: {
          ...prevmainCompanyPermissions.load,
          [`inventory_load_${type}`]: newCheckboxState,
        },
      }));

      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handleOtherSelectAllChange = (type) => {
    setOtherSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setMainOtherPermissions((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        mainLocation: {
          ...prevmainCompanyPermissions.mainLocation,
          [`other_mainLocation_${type}`]: newCheckboxState,
        },
        subLocation: {
          ...prevmainCompanyPermissions.subLocation,
          [`other_subLocation_${type}`]: newCheckboxState,
        },
        currency: {
          ...prevmainCompanyPermissions.currency,
          [`other_currency_${type}`]: newCheckboxState,
        },
      }));
      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const handleFinanceSelectAllChange = (type) => {
    setFinanceSelectAll((prevState) => {
      const newCheckboxState = !prevState[type];
      setFinancePermission((prevmainCompanyPermissions) => ({
        ...prevmainCompanyPermissions,
        outstandingReceiptPayable: {
          ...prevmainCompanyPermissions.outstandingReceiptPayable,
          [`finance_outstandingReceiptPayable_${type}`]: newCheckboxState,
        },
        outstandingReceiptReceivable: {
          ...prevmainCompanyPermissions.outstandingReceiptReceivable,
          [`finance_outstandingReceiptReceivable_${type}`]: newCheckboxState,
        },
        transaction: {
          ...prevmainCompanyPermissions.transaction,
          [`finance_transaction_${type}`]: newCheckboxState,
        },
      }));
      return { ...prevState, [type]: newCheckboxState };
    });
  };

  const toggleSection = (setStateFunction) => {
    setStateFunction((prev) => !prev);
  };

  const toggleCompanySections = () => toggleSection(setShowCompanySections);
  const toggleAccountSections = () => toggleSection(setShowAccountSections);
  const toggleStoneMasterSections = () =>
    toggleSection(setShowStoneMasterSections);
  const togglePurchaseOrderSection = () =>
    toggleSection(setShowPurchaseOrderSections);
  const toggleInventorySection = () => toggleSection(setShowInventorySections);
  const toggleMemoSection = () => toggleSection(setShowMemoSections);
  const toggleOtherSection = () => toggleSection(setShowOtherSections);
  const toggleFinanceSection = () => toggleSection(setShowFinanceSections);

  // Button Function

  // const handleSubmit = () => {
  //   const dataToSubmit = {
  //     Company: maincompanyPermissions,
  //     UserAndPermission: userPermissions,
  //     Account: mainaccountPermissions,
  //     StoneMaster: mainstonemasterPermissions,
  //     Quotation: quotationPermissions,
  //     Reserve: reservePermissions,
  //     PurchaseOrder: mainpurchaseOrderPermissions,
  //     Memo: mainmemoPermissions,
  //     Inventory: maininventoryPermissions,
  //     Sale: salePermissions,
  //     Report: reportPermissions,
  //     Other: mainOtherPermissions,
  //     Setup: setupPermissions,
  //   };
  //   setNewDataList((prevDataList) => [...prevDataList, dataToSubmit]);
  //   setIsSubmitted(true);
  //   setMainCompanyPermissions(initialList[0].company);
  //   setUserPermissions(initialList[1].userPermission);
  //   setMainAccountPermissions(initialList[2].account);
  //   setMainStoneMasterPermissions(initialList[3].stoneMaster);
  //   setQuotationPermissions(initialList[4].quotation);
  //   setReservePermissions(initialList[5].reserve);
  //   setMainPurchaseOrderPermissions(initialList[6].purchaseOrder);
  //   setMainMemoPermissions(initialList[7].memo);
  //   setMainInventoryPermissions(initialList[8].inventory);
  //   setSalePermissions(initialList[9].sale);
  //   setReportPermissions(initialList[11].report);
  //   setMainOtherPermissions(initialList[12].other);
  //   setSetupPermissions(initialList[13].setup);
  //   setNewDataIndex((prevIndex) => prevIndex + 1);
  // };

  // const handleNewDataClick = (index) => {
  //   console.log(`NewData${index + 1}`, newDataList[index]);
  // };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ width: "1000px", backgroundColor: "#FFFFFF" }}>
        {renderHeader()}

        {/* Select All */}
        <Grid
          container
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid item sx={GridSubMainTitle}>
            <Typography sx={FontMainStyle}>SelectAll</Typography>
          </Grid>
          {["view", "add", "edit", "delete", "price"].map((type) => (
            <Grid key={type}>
              <CheckboxComponent
                checked={selectAll[type]}
                onChange={() => handleSelectAllChange(type)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Company */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleCompanySections}
            >
              <Typography sx={FontMainStyle}>Company</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={companySelectAll[type]}
                  onChange={() => handleCompanySelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showCompanySections &&
            Object.entries(initialList[0].company).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {category === "profile"
                          ? "• Company Profile"
                          : "• Bank"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={maincompanyPermissions[category][permission]}
                        onChange={() =>
                          handleCheckboxChange("company", category, permission)
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* User And Permission */}
        {initialList.map((item, index) => (
          <Box
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>
                      User & Permission
                    </Typography>
                  </Grid>
                  {Object.keys(item.userPermission).map(
                    (permission, permIndex) => (
                      <Grid item key={permIndex}>
                        <CheckboxComponent
                          checked={userPermissions[permission]}
                          onChange={() =>
                            handleCheckboxChange(
                              "userPermission",
                              null,
                              permission
                            )
                          }
                          color="primary"
                          sx={{ padding: 0 }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Account */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleAccountSections}
            >
              <Typography sx={FontMainStyle}>Account</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={accountSelectAll[type]}
                  onChange={() => handleAccountSelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showAccountSections &&
            Object.entries(initialList[2].account).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {category === "vendor" ? "• Vendor" : "• Customer"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={mainaccountPermissions[category][permission]}
                        onChange={() =>
                          handleCheckboxChange("account", category, permission)
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* Stone Master */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleStoneMasterSections}
            >
              <Typography sx={FontMainStyle}>Stone Master</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={stonemasterSelectAll[type]}
                  onChange={() => handleStoneMasterSelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showStoneMasterSections &&
            Object.entries(initialList[3].stoneMaster).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {showStoneMasterSections &&
                          category === "stoneGroup" &&
                          "• Stone Group"}
                        {showStoneMasterSections &&
                          category === "stone" &&
                          "• Stone"}
                        {showStoneMasterSections &&
                          category === "shape" &&
                          "• Shape"}
                        {showStoneMasterSections &&
                          category === "size" &&
                          "• Size"}
                        {showStoneMasterSections &&
                          category === "color" &&
                          "• Color"}
                        {showStoneMasterSections &&
                          category === "cutting" &&
                          "• Cutting"}
                        {showStoneMasterSections &&
                          category === "quality" &&
                          "• Quality"}
                        {showStoneMasterSections &&
                          category === "clarity" &&
                          "• Clarity"}
                        {showStoneMasterSections &&
                          category === "certificateType" &&
                          "• Certificate Type"}
                        {showStoneMasterSections &&
                          category === "labourType" &&
                          "• Labour Type"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={
                          mainstonemasterPermissions[category][permission]
                        }
                        onChange={() =>
                          handleCheckboxChange(
                            "stonemaster",
                            category,
                            permission
                          )
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* Quotation */}
        {initialList.map((item, index) => (
          <Box
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Quotation</Typography>
                  </Grid>
                  {Object.keys(quotationPermissions).map(
                    (permission, index) => (
                      <CheckboxComponent
                        key={index}
                        checked={quotationPermissions[permission]}
                        onChange={() =>
                          handleCheckboxChange("quotation", null, permission)
                        }
                        color="primary"
                      />
                    )
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Reserve */}
        {initialList.map((item, index) => (
          <Box
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Reserve</Typography>
                  </Grid>
                  {Object.keys(reservePermissions).map((permission, index) => (
                    <CheckboxComponent
                      key={index}
                      checked={reservePermissions[permission]}
                      onChange={() =>
                        handleCheckboxChange("reserve", null, permission)
                      }
                      color="primary"
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Purchase Order */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={togglePurchaseOrderSection}
            >
              <Typography sx={FontMainStyle}>Purchase Order</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={purchaseOrderSelectAll[type]}
                  onChange={() => handlePurchaseOrderSelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showPurchaseOrderSections &&
            Object.entries(initialList[6].purchaseOrder).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {showPurchaseOrderSections &&
                          category === "po" &&
                          "• Purchase Order"}
                        {showPurchaseOrderSections &&
                          category === "pu" &&
                          "• Purchase"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={
                          mainpurchaseOrderPermissions[category][permission]
                        }
                        onChange={() =>
                          handleCheckboxChange(
                            "purchaseOrder",
                            category,
                            permission
                          )
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* Memo */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleMemoSection}
            >
              <Typography sx={FontMainStyle}>Memo</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={memoSelectAll[type]}
                  onChange={() => handleMemoSelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showMemoSections &&
            Object.entries(initialList[7].memo).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {showMemoSections &&
                          category === "memoIn" &&
                          "• Memo In"}
                        {showMemoSections &&
                          category === "memoReturn" &&
                          "• Memo Return"}
                        {showMemoSections &&
                          category === "memoOut" &&
                          "• Memo Out"}
                        {showMemoSections &&
                          category === "memoOutReturn" &&
                          "• Memo Out Return"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={mainmemoPermissions[category][permission]}
                        onChange={() =>
                          handleCheckboxChange("memo", category, permission)
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* Inventory */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleInventorySection}
            >
              <Typography sx={FontMainStyle}>Inventory</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={inventorySelectAll[type]}
                  onChange={() => handleInventorySelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showInventorySections &&
            Object.entries(initialList[8].inventory).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {showInventorySections && category === "all" && "• All"}
                        {showInventorySections &&
                          category === "primary" &&
                          "• Primary"}
                        {showInventorySections &&
                          category === "consignment" &&
                          "• Consignment"}
                        {showInventorySections &&
                          category === "load" &&
                          "• Load"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={maininventoryPermissions[category][permission]}
                        onChange={() =>
                          handleCheckboxChange(
                            "inventory",
                            category,
                            permission
                          )
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* Sale */}
        {initialList.map((item, index) => (
          <Box
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Sale</Typography>
                  </Grid>
                  {Object.keys(salePermissions).map((permission, index) => (
                    <CheckboxComponent
                      key={index}
                      checked={salePermissions[permission]}
                      onChange={() =>
                        handleCheckboxChange("sale", null, permission)
                      }
                      color="primary"
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Finance */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleFinanceSection}
            >
              <Typography sx={FontMainStyle}>Finance</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={financeSelectAll[type]}
                  onChange={() => handleFinanceSelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showFinanceSections &&
            Object.entries(initialList[10].finance).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {showFinanceSections &&
                          category === "outstandingReceiptPayable" &&
                          "• Payable"}
                        {showFinanceSections &&
                          category === "outstandingReceiptReceivable" &&
                          "• Outstanding Receipt Receivable"}
                        {showFinanceSections &&
                          category === "transaction" &&
                          "• Transaction"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={financePermission[category][permission]}
                        onChange={() =>
                          handleCheckboxChange("finance", category, permission)
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/* Report */}
        {initialList.map((item, index) => (
          <Box
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Report</Typography>
                  </Grid>
                  {Object.keys(reportPermissions).map((permission, index) => (
                    <CheckboxComponent
                      key={index}
                      checked={reportPermissions[permission]}
                      onChange={() =>
                        handleCheckboxChange("report", null, permission)
                      }
                      color="primary"
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ))}

        {/* Setup */}
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
        >
          <Grid container>
            <Grid
              item
              sx={{ ...GridSubMainTitle, cursor: "pointer" }}
              onClick={toggleOtherSection}
            >
              <Typography sx={FontMainStyle}>Other</Typography>
              <Box sx={{ marginLeft: "16px", marginTop: "1px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1.42 0.589843L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L-6.16331e-08 1.99984L1.42 0.589843Z"
                    fill="#666666"
                  />
                </svg>
              </Box>
            </Grid>
            {["view", "add", "edit", "delete", "price"].map((type) => (
              <Grid key={type}>
                <CheckboxComponent
                  checked={otherSelectAll[type]}
                  onChange={() => handleOtherSelectAllChange(type)}
                />
              </Grid>
            ))}
          </Grid>
          {showOtherSections &&
            Object.entries(initialList[12].other).map(
              ([category, permissions], catIndex) => (
                <Box key={catIndex}>
                  <Grid container>
                    <Grid item sx={GridSubMainTitle}>
                      <Typography sx={FontSubStyle}>
                        {showOtherSections &&
                          category === "mainLocation" &&
                          "• Main Location"}
                        {showOtherSections &&
                          category === "subLocation" &&
                          "• Sub Location"}
                        {showOtherSections &&
                          category === "currency" &&
                          "• Currency"}
                      </Typography>
                    </Grid>
                    {Object.keys(permissions).map((permission, permIndex) => (
                      <CheckboxComponent
                        key={permIndex}
                        checked={mainOtherPermissions[category][permission]}
                        onChange={() =>
                          handleCheckboxChange("other", category, permission)
                        }
                      />
                    ))}
                  </Grid>
                </Box>
              )
            )}
        </Box>

        {/*  */}
        {/* {initialList.map((item, index) => (
          <Box
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            {item.userPermission && (
              <Box>
                <Grid container>
                  <Grid item sx={GridSubMainTitle}>
                    <Typography sx={FontMainStyle}>Setup</Typography>
                  </Grid>
                  {Object.keys(setupPermissions).map((permission, index) => (
                    <CheckboxComponent
                      key={index}
                      checked={setupPermissions[permission]}
                      onChange={() =>
                        handleCheckboxChange("setup", null, permission)
                      }
                      color="primary"
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ))} */}

        {/* Submit Button */}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button> */}
        {/* {newDataList.map((data, index) => (
          <Button
            key={index}
            variant="contained"
            color="secondary"
            onClick={() => handleNewDataClick(index)}
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            NewData{index + 1}
          </Button>
        ))} */}
      </Box>
    </Box>
  );
};

export default PermissionsList;
