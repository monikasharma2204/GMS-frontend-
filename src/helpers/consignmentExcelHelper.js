import XLSX from "xlsx-js-style";
import moment from "moment";

export const exportConsignmentToExcel = ({
  filename,
  sheetName,
  summaryHeaders,
  summaryValues,
  itemHeaders,
  itemRows,
  merges = []
}) => {
  try {
    const isMultiHeader = Array.isArray(itemHeaders[0]);
    const headerRows = isMultiHeader ? itemHeaders : [itemHeaders];
    const wsData = [summaryHeaders, summaryValues, ...headerRows, ...itemRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    if (merges.length > 0) {
      ws["!merges"] = merges;
    }

    const summaryHeaderStyle = {
      font: { bold: true, sz: 11.5, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "B3B3B3" } },
    };

    const centerStyle = {
      font: { color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const rightStyle = {
      font: { color: { rgb: "000000" } },
      alignment: { horizontal: "right", vertical: "center" },
    };

    const itemHeaderStyle = {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "D9D9D9" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "C6C6C8" } },
        bottom: { style: "thin", color: { rgb: "C6C6C8" } },
        left: { style: "thin", color: { rgb: "C6C6C8" } },
        right: { style: "thin", color: { rgb: "C6C6C8" } },
      }
    };

    const itemCenterStyle = {
      font: { color: { rgb: "343434" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const itemRightStyle = {
      font: { color: { rgb: "343434" } },
      alignment: { horizontal: "right", vertical: "center" },
    };


    const colorMap = {
      in_h: "9BBDBD", // rgba(5, 89, 91, 0.4)
      in_s: "CDDEDE", // rgba(5, 89, 91, 0.2)
      out_h: "F29A9F", // rgba(224, 4, 16, 0.4)
      out_s: "F8CCCF", // rgba(224, 4, 16, 0.2)
      bal_h: "D0E1FF", // rgba(139, 180, 255, 0.4)
      bal_s: "E8F0FF", // rgba(139, 180, 255, 0.2)
    };

    ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 18 };
    ws["!rows"][1] = { hpt: 17 };
    for (let i = 0; i < headerRows.length; i++) {
        ws["!rows"][2 + i] = { hpt: 22 };
    }
    for (let i = 2 + headerRows.length; i < wsData.length; i++) {
        ws["!rows"][i] = { hpt: 17 };
    }

    const columnWidthMap = {
      "Lot": 9, "Lot No": 9,
      "Stone": 10,
      "Shape": 10,
      "Size": 8,
      "Color": 8,
      "Cutting": 8,
      "Quality": 10,
      "Clarity": 12,
      "Pcs": 8,
      "Weight": 14, "Cts": 14,
      "Price / Unit": 12, "Cost Price": 12,
      "Amount": 20, "Cost Amount": 22,
      "Ref": 15, "Account": 25, "Memo No.": 18, "Doc Date": 12
    };

    const lastHeaderRow = headerRows[headerRows.length - 1];
    ws["!cols"] = lastHeaderRow.map(header => ({
      wch: columnWidthMap[header] || 15
    }));


    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

   
        if (R === 0) {
          ws[cellRef].s = summaryHeaderStyle;
        }
       
        else if (R === 1) {
          const header = summaryHeaders[C] || "";

          if (header.includes("Pcs")) {
            ws[cellRef].z = "#,##0";
            ws[cellRef].s = rightStyle;
          } else if (header.includes("Weight") || header.includes("Total Items")) {
            ws[cellRef].z = "#,##0.000";
            ws[cellRef].s = rightStyle;
          } else if (
            header.includes("Price") || header.includes("Amount")
          ) {
            ws[cellRef].z = "#,##0.00";
            ws[cellRef].s = rightStyle;
          } else {
            ws[cellRef].s = centerStyle;
          }
        }
 
        else if (R >= 2 && R < 2 + headerRows.length) {
          const cellValue = String(ws[cellRef].v || "");
          let customStyle = { ...itemHeaderStyle };
      
          if (R === 2) {
              if (cellValue === "In") customStyle.fill = { fgColor: { rgb: colorMap.in_h } };
              else if (cellValue === "Out") customStyle.fill = { fgColor: { rgb: colorMap.out_h } };
              else if (cellValue === "Balance") customStyle.fill = { fgColor: { rgb: colorMap.bal_h } };
          } 
          // Second row of headers
          else if (R === 3) {
         
              const topCell = ws[XLSX.utils.encode_cell({ r: 2, c: C })];
              const topVal = String(topCell ? topCell.v : "");
              if (topVal === "In") customStyle.fill = { fgColor: { rgb: colorMap.in_s } };
              else if (topVal === "Out") customStyle.fill = { fgColor: { rgb: colorMap.out_s } };
              else if (topVal === "Balance") customStyle.fill = { fgColor: { rgb: colorMap.bal_s } };
          }

          ws[cellRef].s = customStyle;
        }
        // Data Rows
        else {
          const header = lastHeaderRow[C] || "";

          if (header.includes("Pcs") || header === "#") {
            ws[cellRef].z = "#,##0";
            ws[cellRef].s = itemRightStyle;
          } else if (header.includes("Weight") || header.includes("Cts")) {
            ws[cellRef].z = "#,##0.000";
            ws[cellRef].s = itemRightStyle;
          } else if (
            header.includes("Price") ||
            header.includes("Amount")
          ) {
            ws[cellRef].z = "#,##0.00";
            ws[cellRef].s = itemRightStyle;
          } else {
            ws[cellRef].s = itemCenterStyle;
          }
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const timestamp = moment().format("YYYYMMDD_HHmmss");
    XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

  } catch (err) {
    console.error("Consignment Excel Helper Error:", err);
    throw err;
  }
};
