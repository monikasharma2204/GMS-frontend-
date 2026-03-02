export const formatNumberWithCommas = (number) => {
    const numberString = number.toString();
    const [integerPart, decimalPart] = numberString.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    if (decimalPart !== undefined) {
      return `${formattedIntegerPart}.${decimalPart}`;
    }

    return formattedIntegerPart;
  };

  export const formatNumberStringWithCommas = (number) => {
    const [integerPart, decimalPart] = number.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    if (decimalPart !== undefined) {
      return `${formattedIntegerPart}.${decimalPart}`;
    }

    return formattedIntegerPart;
  };

 export const isNumeric = (str) => {
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }
  

  export const formatNumber = (value) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const unformatNumber = (value) => {
  return value.replace(/,/g, "");
};


export const checkTaxId = (value) => {
  if (/^\d*$/.test(value) && value.length <= 18) {
    return true
  }
};  
