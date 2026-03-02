import XLSX from "xlsx-js-style";
import moment from "moment";


export const exportTransactionToExcel = ({
  filename,
  sheetName,
  summaryHeaders,
  summaryValues,
  itemHeaders,
  itemRows,
}) => {
  try {
    const wsData = [summaryHeaders, summaryValues, itemHeaders, ...itemRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);


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
      font: { bold: true, color: { rgb: "707070" } },
      fill: { fgColor: { rgb: "D9D9D9" } },
      alignment: { horizontal: "left", vertical: "center" },
    };

    const itemCenterStyle = {
      font: { color: { rgb: "9A9A9A" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const itemRightStyle = {
      font: { color: { rgb: "9A9A9A" } },
      alignment: { horizontal: "right", vertical: "center" },
    };

    // --- ROW HEIGHTS 
    ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 18 };
    ws["!rows"][1] = { hpt: 17 };
    ws["!rows"][2] = { hpt: 19 };
    for (let i = 3; i < wsData.length; i++) ws["!rows"][i] = { hpt: 17 };
    const columnWidthMap = {
      "Location": 12, "location": 12,
      "Type": 12, "type": 12,
      "Lot": 9, "lot": 9, "Lot No": 9, "lot_no": 9,
      "Stone Code": 15, "stone_code": 15,
      "Stone": 10, "stone": 10,
      "Shape": 10, "shape": 10,
      "Size": 8, "size": 8,
      "Color": 8, "color": 8,
      "Cutting": 8, "cutting": 8,
      "Quality": 10, "quality": 10,
      "Clarity": 12, "clarity": 12,
      "Cer Type": 10, "cer_type": 10,
      "Cer No.": 10, "cer_no": 10,
      "Pcs": 8, "pcs": 8,
      "Weight": 14, "weight": 14,
      "Price": 12, "Sale Price": 12, "unit_price": 12,
      "Unit": 15, "unit": 15,
      "Amount": 20, "Total Amount": 20,
      "Labour": 10, "labour": 10,
      "Labour Price": 12, "labour_price": 12,
      "Remark": 25, "remark": 25,
      "Stock ID": 12, "stock_id": 12,
      "Ref No.": 15, "ref_no": 15,
      "Weight/Pc": 12, "weight_per_piece": 12
    };

    ws["!cols"] = itemHeaders.map(header => ({
      wch: columnWidthMap[header] || 15
    }));


    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        // Row 1: Summary Headers
        if (R === 0) {
          ws[cellRef].s = summaryHeaderStyle;
        }
        // Row 2: Summary Values
        else if (R === 1) {
          const header = summaryHeaders[C] || "";

          if (header.includes("Pcs")) {
            ws[cellRef].z = "#,##0";
            ws[cellRef].s = rightStyle;
          } else if (header.includes("Weight")) {
            ws[cellRef].z = "#,##0.000";
            ws[cellRef].s = rightStyle;
          } else if (
            header.includes("Amt") ||
            header.includes("Total") ||
            header.includes("Discount") ||
            header.includes("VAT") ||
            header.includes("Charges") ||
            header.includes("Rate") ||
            header.includes("Price")
          ) {
            ws[cellRef].z = "#,##0.00";
            ws[cellRef].s = rightStyle;
          } else {
            ws[cellRef].s = centerStyle;
          }
        }
        // Row 3: Item Headers
        else if (R === 2) {
          ws[cellRef].s = itemHeaderStyle;
        }
        // Row 4+: Item Values
        else {
          const header = itemHeaders[C] || "";

          if (header === "Pcs") {
            ws[cellRef].z = "#,##0";
            ws[cellRef].s = itemRightStyle;
          } else if (header === "Weight") {
            ws[cellRef].z = "#,##0.000";
            ws[cellRef].s = itemRightStyle;
          } else if (
            header.includes("Price") ||
            header.includes("Amount") ||
            header.includes("Discount") ||
            header === "Weight/Pc"
          ) {
            ws[cellRef].z = "#,##0.00";
            ws[cellRef].s = itemRightStyle;
          } else {
            ws[cellRef].s = itemCenterStyle;
          }
        }
      }
    }

    // --- WRITE FILE ---
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const timestamp = moment().format("YYYYMMDD_HHmmss");
    XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

  } catch (err) {
    console.error("Excel Helper Error:", err);
    throw err;
  }
};
