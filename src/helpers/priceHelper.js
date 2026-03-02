  
  export const calculateTotalAmountAfterDiscount = (listItem) => {
    
    let total = parseFloat(Number(0.00))

    listItem.map((v,k)=>{
      total += parseFloat(calculateAmountAfterDiscount(v))
      console.log(parseFloat( parseFloat( calculateAmountAfterDiscount(v)) ),'listItem')

    })
    console.log(total.toFixed(2),'total.toFixed(2)')
    return total.toFixed(2);

  };


export const calculateAmount = (item) => {
    const totalAmount =
      item.unit_price === "pcs"
        ? item.pcs * item.price
        : item.weight * item.price;
    return parseFloat(totalAmount).toFixed(2);
  };

export const getSubTotal = (listItem)=>{
  
  let total = parseFloat(0)

  listItem.map((v,k)=>{
      const totalAmount =
    v.unit_price === "pcs"
      ? v.pcs * v.price
      : v.weight * v.price;
    const afterDiscount = parseFloat(totalAmount) - parseFloat(v.discount_amount) + parseFloat(v.labour_price)

    total += afterDiscount
    console.log(v,'send_data'+k)
    console.log(calculateAmountAfterDiscount(v),"getSubTotal")
  })
  return total;
  // console.log(listItem,'getSubTotal')
}


export const getAmount = (listItemArray)=>{
  let total = parseFloat(0)
  listItemArray.map((v,k)=>{
    total += calculateAmountAfterDiscount(v)
    console.log(v,'send_data'+k)
    console.log(calculateAmountAfterDiscount(v),"getSubTotal")
  })
  return total;
}

export const getItemAmount = (price,unit_price,pcs,weight,discount_amount,labour_price)=>{
  let total = parseFloat(0)
  console.log(price,'getItemAmount price')
  console.log(unit_price,'getItemAmount unit_price')
  console.log(pcs,'getItemAmount pcs')
  console.log(weight,'getItemAmount weight')
  console.log(discount_amount,'getItemAmount discount_amount')
  console.log(labour_price,'getItemAmount labour_price')
  const totalAmount =
 unit_price === "pcs"
    ? pcs * price
    : weight * price;

  const afterDiscount = parseFloat(totalAmount) - parseFloat(discount_amount) + parseFloat(labour_price)
  console.log(totalAmount,'getItemAmount totalAmount')
  console.log(afterDiscount,'getItemAmount afterDiscount')

  return parseFloat(parseFloat(afterDiscount).toFixed(2))
        
}


  // คำนวน ราย item
  export const calculateAmountAfterDiscount = (item) => {
 
    const afterDiscount = parseFloat(calculateAmount(item)) - parseFloat(item.discount_amount) + parseFloat(item.labour_price)

    return afterDiscount.toFixed(2);
  };

  export const calculateTotalAfterDiscount = (listItem=[]) => {
    if(listItem.length>0){

       let total = listItem.reduce((sum, item) => {
      return sum + calculateAmountAfterDiscount(item);
    }, 0);

    if (listItem.use_discount_percent) {
      total -= (total * listItem.discount_percent) / 100;
    }
    if (listItem.use_discount_amouunt) {
      total -= listItem.discount_percent;
    }

    return parseFloat(total).toFixed(2);
    
    }else{
      return 0;
    }

  };

  export  const calculateTotalAfterVAT = (listItem,useVat,vatPercent) => {
    if (useVat) {
      return (calculateTotalAfterDiscount(listItem) * vatPercent) / 100;
    }
    return 0;
  };

  export  const getVatValue = (total,vatPercent) => {
    console.log(vatPercent,'getVatValue vatPercent')
    console.log(total,'getVatValue total')
    let result = (total * vatPercent) / 100;
  
    console.log(result,'getVatValue')
    return (total * vatPercent) / 100;

  };


  export const calculateOtherPrice = (item) => {
    if (item.unit_price === "cts") {
      return (calculateAmount(item) / item.pcs).toFixed(2);
    } else if (item.unit_price === "pcs") {
      return (calculateAmount(item) / item.weight).toFixed(2);
    }
  };

  export const calculateTotalAfterDiscountPercent = (listItem,useDiscountPercent,discountPercent) => {
    if(listItem){
 
            if (useDiscountPercent) {
              console.log(discountPercent,"discountPercent true")
              // console.log(calculateTotalAmountAfterDiscount(listItem),"useDiscountPercent true")
            return (
              calculateTotalAmountAfterDiscount(listItem) -  ( (calculateTotalAmountAfterDiscount(listItem) * discountPercent) / 100 )
            );

          }else{
            return 0;
          }

          
    }
    
  };
export const getPricePercentageFromValue = (value,discount_amount)=>{
  return  (discount_amount / value) * 100;
}
  export const getPriceValueFromPercent = (value,percent)=>{
    return ( parseFloat(value) * parseFloat(percent)) / 100 ;
    
  }

  export const calculateGrandTotal = (listItem,useVAT,vatPercent,other_charge,discount_amount_total=0) => {
    console.log(discount_amount_total,'discount_amount_total')
    const subTotal = getSubTotal(listItem)

    const discount_amount  = parseFloat(discount_amount_total)
    const vat_amount  = subTotal*parseFloat(vatPercent)/100


    const otherCharge = parseFloat(other_charge);

    if (
      isNaN(subTotal) ||
      isNaN(otherCharge)
    ) {
      return false;
      console.error("One of the values is not a number");
    }



    let grandTotal = 0;
    console.log(vatPercent,'calculateGrandTotal vatPercent')
    console.log(useVAT,'calculateGrandTotal useVAT vatAmount')

    if(useVAT){
      grandTotal =   subTotal - discount_amount  ;
      grandTotal += vat_amount;
      grandTotal += otherCharge;

    }else{
      grandTotal =   subTotal - discount_amount   ;
      grandTotal +=   otherCharge   ;
    }
  
console.log(grandTotal,'grandTotal')
    return parseFloat(grandTotal).toFixed(2);
  };




