exports.omitFields = (obj, fieldsToOmit)=>{
    const result = { ...obj };
    fieldsToOmit.forEach(field => delete result[field]);
    return result;
  }


  exports.replaceArrayItemAtIndex = (arr, index, newValue) => {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }
  
  exports.removeArrayItemAtIndex = (arr, index) => {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }

