export const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


export const convertToDate = (dateValue) => {
  if (!dateValue) return new Date();
  

  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    return dateValue;
  }
  

  if (dateValue && typeof dateValue === 'object') {
    if (dateValue.isValid && typeof dateValue.isValid === 'function' && dateValue.isValid()) {
      return dateValue.toDate();
    }
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate();
    }
  }
  

  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
};

export const createDateChangeHandler = (setDateState) => {
  return (newValue) => {
    const date = convertToDate(newValue);
    setDateState(date);
  };
};

export const parseBackendDate = (dateValue) => {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) return dateValue;
  
  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};


export const formatDateForFormData = (dateValue) => {
  const date = convertToDate(dateValue);
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString();
  }
  return null;
};


export const validateBodyDates = (body, dateFields = ['doc_date', 'due_date']) => {
  const validatedBody = { ...body };
  
  dateFields.forEach(field => {
    if (validatedBody[field] !== undefined && validatedBody[field] !== null) {
      validatedBody[field] = convertToDate(validatedBody[field]);
    }
  });
  
  return validatedBody;
};


export const appendDatesToFormData = (body, formData, dateFields = ['doc_date', 'due_date']) => {
  Object.entries(body).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
   
    if (dateFields.includes(k)) {
      const isoString = formatDateForFormData(v);
      if (isoString) {
        formData.append(k, isoString);
      }
    } else if (v instanceof Date) {
      formData.append(k, v.toISOString());
    } else if (typeof v === "object") {
      formData.append(k, JSON.stringify(v));
    } else {
      formData.append(k, String(v));
    }
  });
};
