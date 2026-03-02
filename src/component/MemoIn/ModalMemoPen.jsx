import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Account from "../Memo/Account.jsx";

import apiRequest from "helpers/apiHelper.js";
import {calculateOtherPrice,getPriceValueFromPercent,getPricePercentageFromValue,calculateTotalAmountAfterDiscount,calculateGrandTotal,calculateTotalAfterDiscount,getSubTotal,getItemAmount} from "helpers/priceHelper";

import { memoItemState, selectedCurrencyState, useDiscountPercentState,useDiscountAmountState,useVATState,vatAmountState,otherChargeState,discountPercentState,memoInfoState,discountAmountState ,discountAmountTotalState,subTotalState,keyEditState,vatPercentState,grandTotalState,editMemoStatusState,openModalMemoPendingOrderState,memoPendingListState ,memoPendingListSelectedItemState,memoPendingIdListSelectedItemState,currentPendingListSelectedItemState,currentDiscountValueState} from "recoil/MemoIn/MemoState.js";

import { useRecoilState } from "recoil";
import { omitFields } from "helpers/objHelper.js";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
};

const ModalMemoPen = (props) => {
  const [inventoryData, setInventoryData] = useState(false)
  let accNum;
  const [checkAll, setCheckAll] = useState(false);
  const [openModalMemoPendingOrder,setOpenModalMemoPendingOrder] = useRecoilState(openModalMemoPendingOrderState)
  const [memoPendingList,setMemoPendingList] = useRecoilState(memoPendingListState)
  const [memoPendingSelectedList,setMemoPendingSelectedList] = useRecoilState(memoPendingListSelectedItemState)
  const [memoPendingIdListSelectedItem,setMemoPendingIdListSelectedItem] = useRecoilState(memoPendingIdListSelectedItemState)
  const [currentPendingListSelectedItem,setCurrentPendingListSelectedItem] = useRecoilState(currentPendingListSelectedItemState)
  const [memoItem,setMemoItem] = useRecoilState(memoItemState)
const [vatPercent,setVatPercent]  = useRecoilState(vatPercentState)
const [useDiscountPercent,setUseDiscountPercent]  = useRecoilState(useDiscountPercentState)
const [discountPercent,setDiscountPercent]  = useRecoilState(discountPercentState)
const [useDiscountAmount,setUseDiscountAmount]  = useRecoilState(useDiscountAmountState)
const [useVAT,setUseVAT]  = useRecoilState(useVATState)
const [vatAmount,setVatAmount]  = useRecoilState(vatAmountState)
const [otherCharge,setOtherCharge]  = useRecoilState(otherChargeState)
const [discountAmount,setDiscountAmount]  = useRecoilState(discountAmountState)
const [discountAmountTotal,setDiscountAmountTotal]  = useRecoilState(discountAmountTotalState)
const [subtotal,setSubTotal]  = useRecoilState(subTotalState)
const [keyEdit,setKeyEdit]  = useRecoilState(keyEditState)
const [grandTotal,setGrandTotal]  = useRecoilState(grandTotalState)
const [currentDiscountValue,setCurrentDiscountValue] = useRecoilState(currentDiscountValueState)
// const [totalAfterDiscount,setTotalAfterDiscount] = useRecoilState(totalAfterDiscountState)

  const getInventoryData = async () => {

    try {
      const {data} = await apiRequest("GET", "/inventory-in/list/memo-pending", {}, { params: { inventory_type: "memo_in" } })
      let item = []
      
      const inventoryData = data.map(el => {
        return {
          ...el,
          inventory_item: el.inventory_item.map(inventory => {
            const doc_date = el.doc_date.split('T')[0];

            return {
              doc_date : doc_date,
              memo_ref : el.invoice_no,
              account : el.invoice_no,
          
              ...inventory,
              weight: parseFloat(inventory.weight).toFixed(2) || 0,
              total_amount:  parseFloat(inventory.total_amount).toFixed(2) || 0,
              price: parseFloat(inventory.price).toFixed(2)|| 0,
              discount_percent: parseFloat(inventory.discount_percent).toFixed(2) || 0,
              discount_amount:  parseFloat(inventory.discount_amount).toFixed(2)|| 0,
              amount: parseFloat(inventory.amount).toFixed(2) || 0,
              labour_price: parseFloat(inventory.labour_price).toFixed(2) || 0
            }
          })
        }
      })
      console.log(inventoryData)
      setInventoryData(inventoryData)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if(!inventoryData){
      getInventoryData()
    }
    
    console.log(currentPendingListSelectedItem,'currentPendingListSelectedItem')
    }, [inventoryData,memoPendingIdListSelectedItem]);

  const handleCheckboxChange = (e,key,itemData) => {
if(e.target.checked){

    setMemoPendingIdListSelectedItem((prev)=>{
    
      if(prev.length>0){
       return  [...prev,key]
      }else{
        return  [key]
      }
    })
    setCurrentPendingListSelectedItem((prev)=>{


      let dataList = omitFields(itemData,["doc_date","memo_ref","account"])
      dataList.key = key
      if(prev.length>0){
       return  [...prev,dataList]
      }else{
        return  [dataList]
      }
    })


}else{
  setMemoPendingIdListSelectedItem((prev) => {
    return prev.filter(existingItem => existingItem !== key); // Remove the item from the array
  });
  setCurrentPendingListSelectedItem((prev) => {
    return prev.filter(existingItem => existingItem.key !== key); // Remove the item from the array
  });
}



  };

  const handleMasterCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setCheckAll(isChecked);
  };

  const handleModalSave = () => {
    setOpenModalMemoPendingOrder(false)
    let dataUpdate;
    let prevDataList ; 
    

    setMemoItem((prev)=>{
      prevDataList = prev;
      let discount_amount_value;
      if(memoItem[0].stone===""){
        dataUpdate = [...currentPendingListSelectedItem]

      return dataUpdate

      }else{
        dataUpdate = [...prev,...currentPendingListSelectedItem]
        return dataUpdate

      }

    })


    setSubTotal((prev)=>{
      return  getSubTotal(dataUpdate);
    })
    const vat_total = getPriceValueFromPercent(getSubTotal(dataUpdate),vatPercent)

    let  grand_total = 0;

    grand_total = (  getSubTotal(dataUpdate) + otherCharge )  - currentDiscountValue
    grand_total += vat_total;

    setGrandTotal((prev)=>{
      return grand_total;
    })
   
   
    

  };

  const [row, setRow] = React.useState('');

  const handleChange = (event) => {
    setRow(event.target.value);
  };

  return (
    <>
      <Button
        onClick={()=>{
          setOpenModalMemoPendingOrder(true)
        }}
        sx={{
          textTransform: "none",
          height: "35px",
          width: "136px",
          padding: "12px",
          borderRadius: "4px",
          gap: "8px",
          marginRight: "24px",
          backgroundColor: "#C6A969",
          "&:hover": {
            backgroundColor: "#C6A969",
          },
        }}
      >
        <Typography
          sx={{
            color: "var(--jw-background-white-textwhite, #FFF)",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            letterSpacing: "1px",
          }}
        >
          Memo Pending
        </Typography>
      </Button>
      <Modal
        open={openModalMemoPendingOrder}
        onClose={()=>{
          setOpenModalMemoPendingOrder(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              width: "100%",
              height: "56px",
              backgroundColor: "var(--HeadPage, #05595B)",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Calibri",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                marginLeft: "32px",
                marginTop: "10px",
              }}
            >
              Memo Pending
            </Typography>
            <Box
              sx={{
                marginTop: "16px",
                marginRight: "16px",
                cursor: "pointer",
                "&:hover svg path": {
                  fill: "#E00410",
                },
              }}
              onClick={()=>{
                setOpenModalMemoPendingOrder(false)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
                  fill="white"
                />
                <path
                  d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
                  fill="white"
                />
              </svg>
            </Box>
          </Box>

          {/* Body */}
          <Box
            sx={{
              backgroundColor: "#F8F8F8",
              width: "95.2%",
              height: "638px",
              marginLeft: "33px",
              marginTop: "33px",
              paddingTop: "32px",
            }}
          >
            {/* Title */}
            <Box
              sx={{
                width: "1232px",
                height: "40px",
                marginLeft: "32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Account />
              </Box>
              <Box sx={{ display: "flex", gap: "12px" }}>
                <Box
                  sx={{
                    width: "113px",
                    height: "38px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#343434",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                  >
                    Rows per page
                  </Typography>
                </Box>

                <FormControl
                  value={10}
                  sx={{
                    height: "40px",
                    width: "69px",
                    marginRight: "10px",
                  }}
                >
                  <Select
                    sx={{
                      height: "40px",
                      width: "69px",
                      backgroundColor: "#FFF",
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                    value={row}
                    onChange={handleChange}
                  >
                    <MenuItem
                      value={10}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      10
                    </MenuItem>
                    <MenuItem
                      value={20}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      20
                    </MenuItem>
                    <MenuItem
                      value={30}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      30
                    </MenuItem>
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    "&:hover svg path": {
                      fill: "#E9B238",
                    },
                    marginTop: "6px",
                    "& svg path": {
                      fill: "#666666",
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M8.16671 2.33398C7.85729 2.33398 7.56054 2.4569 7.34175 2.67569C7.12296 2.89449 7.00004 3.19123 7.00004 3.50065V8.16732H4.66671C4.04787 8.16732 3.45438 8.41315 3.01679 8.85074C2.57921 9.28832 2.33337 9.88181 2.33337 10.5007V19.834C2.33337 20.4528 2.57921 21.0463 3.01679 21.4839C3.45438 21.9215 4.04787 22.1673 4.66671 22.1673H7.00004V24.5007C7.00004 24.8101 7.12296 25.1068 7.34175 25.3256C7.56054 25.5444 7.85729 25.6673 8.16671 25.6673H19.8334C20.1428 25.6673 20.4395 25.5444 20.6583 25.3256C20.8771 25.1068 21 24.8101 21 24.5007V22.1673H23.3334C23.9522 22.1673 24.5457 21.9215 24.9833 21.4839C25.4209 21.0463 25.6667 20.4528 25.6667 19.834V10.5007C25.6667 9.88181 25.4209 9.28832 24.9833 8.85074C24.5457 8.41315 23.9522 8.16732 23.3334 8.16732H21V3.50065C21 3.19123 20.8771 2.89449 20.6583 2.67569C20.4395 2.4569 20.1428 2.33398 19.8334 2.33398H8.16671ZM19.8334 16.334H8.16671C7.85729 16.334 7.56054 16.4569 7.34175 16.6757C7.12296 16.8945 7.00004 17.1912 7.00004 17.5007V19.834H4.66671V10.5007H23.3334V19.834H21V17.5007C21 17.1912 20.8771 16.8945 20.6583 16.6757C20.4395 16.4569 20.1428 16.334 19.8334 16.334ZM18.6667 8.16732H9.33337V4.66732H18.6667V8.16732ZM5.83337 11.6673V14.0007H9.33337V11.6673H5.83337ZM18.6667 18.6673V23.334H9.33337V18.6673H18.6667Z"
                      fill="white"
                    />
                  </svg>
                </Box>

                <Box
                  sx={{
                    "&:hover svg path": {
                      fill: "#00AA3A",
                    },
                    marginTop: "6px",
                    "& svg path": {
                      fill: "#666666",
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M19.4175 1.7L17.8862 0H5.8275C4.9575 0 4.62125 0.645 4.62125 1.14875V5.68625H6.3125V2.06625C6.3125 1.87375 6.475 1.71125 6.6625 1.71125H15.2913C15.4812 1.71125 15.5763 1.745 15.5763 1.90125V7.92625H21.7175C21.9587 7.92625 22.0525 8.05125 22.0525 8.23375V22.9463C22.0525 23.2537 21.9275 23.3 21.74 23.3H6.6625C6.56952 23.2977 6.48106 23.2595 6.41576 23.1932C6.35047 23.127 6.31345 23.038 6.3125 22.945V21.6H4.6325V23.7188C4.61 24.4688 5.01 25 5.8275 25H22.575C23.45 25 23.7488 24.3663 23.7488 23.7887V6.48375L23.3113 6.00875L19.4175 1.7ZM17.295 1.9L17.7787 2.4425L21.0238 6.00875L21.2025 6.225H17.8862C17.6362 6.225 17.4775 6.18375 17.4112 6.1C17.345 6.01875 17.3062 5.8875 17.295 5.70875V1.9ZM15.9325 13.3337H21.6537V15.0013H15.9312L15.9325 13.3337ZM15.9325 10.0013H21.6537V11.6675H15.9312L15.9325 10.0013ZM15.9325 16.6675H21.6537V18.335H15.9312L15.9325 16.6675ZM1.25 7.0325V20.3662H14.3313V7.0325H1.25ZM7.79125 14.7875L6.99125 16.01H7.79125V17.5H3.77L6.6875 13.1125L4.1025 9.1675H6.2625L7.7925 11.4625L9.32125 9.1675H11.48L8.89 13.1125L11.8113 17.5H9.57L7.79125 14.7875Z"
                      fill="white"
                    />
                  </svg>
                </Box>
              </Box>
            </Box>
            {/* Table */}
            <Box
              sx={{
                width: "1232px",
                marginTop: "24px",
                marginLeft: "32px",
                borderRadius: "5px 5px 5px 5px",
                borderTop: "1px solid var(--Line-Table, #C6C6C8)",
                borderLeft: "1px solid var(--Line-Table, #C6C6C8)",
                borderRight: "1px solid var(--Line-Table, #C6C6C8)",
              }}
            >
              <Box
                sx={{
                  width: "fit-content",
                  height: "42px",
                  bgcolor: "#EDEDED",
                  display: "flex",
                  borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                  borderRadius: "5px 5px 0px 0px",
                }}
              >
                <Box
                  sx={{
                    width: "62.4px",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "8px",
                  }}
                >
                  <Checkbox
                    checked={checkAll}
                    onChange={handleMasterCheckboxChange}
                  />
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    #
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Doc Date
                  </Typography>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                  >
                    <path
                      d="M6.5 12H3.5L8 16.5V1.5H6.5V12ZM11 3.75V16.5H12.5V6H15.5L11 1.5V3.75Z"
                      fill="#343434"
                    />
                  </svg>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Memo Ref
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Account
                  </Typography>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                  >
                    <path
                      d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                      stroke="#666666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Stone
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Shape
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Size
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "142.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Cer No.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "62.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Pcs
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "102.4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    Weight
                  </Typography>
                </Box>
              </Box>
              
              {inventoryData?inventoryData.map((item, index) =>  
              {
                if(index>0){
                  accNum = accNum
                }else{
                  accNum = 0
                }
                
                
                

                return (
                  item.inventory_item.map((inven_item,idx)=>{
                    accNum++
                    const idx_checkbox = idx+"_"+accNum;
                    return (
                    
                    <Box
                 key={idx}
                 sx={{
                   width: "ftit-conten",
                   height: "42px",
                   bgcolor: "#FFF",
                   display: "flex",
                   borderBottom: "1px solid var(--Line-Table, #C6C6C8)",
                 }}
               >
                 <Box
                   sx={{
                     width: "62.4px",
                     display: "flex",
                     alignItems: "center",
                     marginLeft: "8px",
                   }}
                 >
                   <Checkbox
                     checked={memoPendingIdListSelectedItem.some(
                       (selected) => selected === idx_checkbox
                     )}
                     onChange={(e) => handleCheckboxChange(e,idx_checkbox,inven_item)}
                   />
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {accNum}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     textAlign: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.doc_date}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {item.invoice_no}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {item.account_name}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.stone_code}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.stone_shape_code}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.stone_size_code}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "142.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.cer_no}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "62.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.pcs}
                   </Typography>
                 </Box>

                 <Box
                   sx={{
                     width: "102.4px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                   }}
                 >
                   <Typography
                     sx={{
                       color: "var(--Main-Text, #343434)",
                       fontFamily: "Calibri",
                       fontSize: "16px",
                       fontStyle: "normal",
                       fontWeight: 400,
                     }}
                   >
                     {inven_item.weight}
                   </Typography>
                 </Box>
               </Box>
                  ) }
                
                )

               
             )
             }
            ):""
              
              }
            </Box>
          </Box>

          {/* Save&Cancel */}
          <Box
            sx={{
              display: "flex",
              padding: "24px 32px",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              borderRadius: "0px 0px 4px 4px",
            }}
          >
            <Button
              onClick={()=>{
                setOpenModalMemoPendingOrder(false)
              }}
              sx={{
                width: "79px",
                height: "35px",
                padding: "12px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
                borderRadius: "4px",
                border: "1px solid #BFBFBF",
                bgcolor: "var(--Fill, #FFF)",
                textTransform: "none",
              }}
            >
              <Typography
                sx={{
                  color: "#343434",
                  fontSize: "16px",
                  fontFamily: "Calibri",
                  fontStyle: "normal",
                  fontWeight: 700,
                }}
              >
                Cancel
              </Typography>
            </Button>
            <Button
              onClick={handleModalSave}
              sx={{
                width: "79px",
                height: "35px",
                padding: "12px 24px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
                borderRadius: "4px",
                border: "1px solid #BFBFBF",
                bgcolor: "#17C653",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#17C653",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: "16px",
                  fontFamily: "Calibri",
                  fontStyle: "normal",
                  fontWeight: 700,
                }}
              >
                OK 
              </Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalMemoPen;
