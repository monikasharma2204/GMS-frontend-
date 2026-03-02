import axios from "axios";
import { API_URL } from "config/config";

export const downloadQuotationPdf = async (id, invoiceNo = "quotation") => {
  if (!id) {
    alert("Invalid quotation ID.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/quotations/${id}/pdf`, {
      responseType: 'blob', 
    });


    const blob = new Blob([response.data], { type: "application/pdf" });
const url = window.URL.createObjectURL(blob);

    // const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.target = "_self"; 
    link.style.display = 'none';
    link.setAttribute('download', `quotation-${invoiceNo}.pdf`);


    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Error downloading PDF. Please try again.");
  }
};

export const downloadPurchaseOrderPdf = async (id, invoiceNo = "purchase-order") => {
  if (!id) {
    alert("Invalid purchase order ID.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/po/${id}/pdf`, {
      responseType: 'blob', 
    });


    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.target = "_self"; 
    link.style.display = 'none';
    link.setAttribute('download', `purchase-order-${invoiceNo}.pdf`);


    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Error downloading PDF. Please try again.");
  }
};

export const downloadPurchasePdf = async (id, invoiceNo = "purchase") => {
  if (!id) {
    alert("Invalid purchase ID.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/pu/${id}/pdf`, {
      responseType: 'blob', 
    });


    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.target = "_self"; 
    link.style.display = 'none';
    link.setAttribute('download', `purchase-${invoiceNo}.pdf`);


    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Error downloading PDF. Please try again.");
  }
};

export const downloadSalePdf = async (id, invoiceNo = "sale") => {
  if (!id) {
    alert("Invalid sale ID.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/sales/${id}/pdf`, {
      responseType: 'blob', 
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.target = "_self"; 
    link.style.display = 'none';
    link.setAttribute('download', `sale-${invoiceNo}.pdf`);

    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Error downloading PDF. Please try again.");
  }
};
