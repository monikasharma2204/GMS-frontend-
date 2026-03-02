/**
 * Utility functions for row data manipulation
 */
import { API_URL } from "config/config.js";

export const createCompositeStoneCode = (sourceRow) => {
  const stoneCode = sourceRow.stone_master?.code || "";
  const shapeCode = sourceRow.shape_master?.code || "";
  const colorCode = sourceRow.color_master?.code || "";
  const qualityCode = sourceRow.quality_master?.code || "";
  const clarityCode = sourceRow.clarity_master?.code || "";
  
  return `${stoneCode}${shapeCode}${colorCode}${qualityCode}${clarityCode}`;
};

/**
 * Maps PU modal data to row format
 *  selectedStockRows - Selected rows from PU modal
 *  Mapped row data
 */
export const mapPUModalData = (selectedStockRows) => {
  return selectedStockRows.map((item, index) => ({
    stone_code: item.stone, 
    stock_id: item.stock_id || "",
    account: item.account,
    _id: item._id || `pu-${item.pu_item_id || index}`,
    pu_id: item.pu_id, 
    pu_item_id: item.pu_item_id, 
    stone: item.stone,
    shape: item.shape,
    size: item.size,
    color: item.color,
    cutting: item.cutting,
    quality: item.quality,
    clarity: item.clarity,
    cer_type: item.cer_type,
    cer_no: item.cer_no,
    location: "", // Not in API response
    type: "approved", // Status from API
    lot_no: item.lot_no,
    // For new Load creation: Use current PU data (190 PCS)
    // For daybook display: Use original PU data (200 PCS) - handled in Load.jsx
    pcs: item.pcs, // Use current PCS (190) for new Load creation
    weight: item.weight, // Use current weight
    price: item.price, // Use current price
    unit: item.unit, // Unit doesn't change
    amount: item.amount, // Use current amount
    
    // IMPORTANT: Preserve original data for daybook display
    original_pcs: item.original_pcs, // Store original PCS (200) for daybook
    remark: item.remark || "",
    ref_no: item.ref_no,
    pu_no: item.invoice_no, // Map invoice_no to pu_no
    discount_percent: item.discount_percent,
    discount_amount: item.discount_amount,
    totalAmount: item.total_amount,
    labour: "",
    labour_price: item.labour_price || 0,
    isFromPU: true,
    doc_date: item.doc_date,
    vendor_code_id: item.vendor_code_id,
    currency: item.currency,
    // Image path from PU (may be relative); keep as absolute URL for preview
    image: item.image ? (/^https?:\/\//.test(item.image) ? item.image : `${API_URL}${item.image}`) : null,
    image_preview: item.image ? (/^https?:\/\//.test(item.image) ? item.image : `${API_URL}${item.image}`) : null,
    // Preserve master objects for  stone code generation
    stone_master: item.stone_master,
    shape_master: item.shape_master,
    size_master: item.size_master,
    color_master: item.color_master,
    quality_master: item.quality_master,
    clarity_master: item.clarity_master,
  }));
};

/**
 * Creates a mapped row data object for second section
 * sourceRow - Source row from first section
 * Mapped row data
 */
export const createMappedRowData = (sourceRow) => {
  const compositeStoneCode = createCompositeStoneCode(sourceRow);
  
  return {
    _id: sourceRow._id || `mapped-${sourceRow.pu_item_id || sourceRow._id}`,
    pu_id: sourceRow.pu_id || "", 
    pu_item_id: sourceRow.pu_item_id || "", 
    pu_no: sourceRow.pu_no || "", 
    stone_code: compositeStoneCode,
    location: "", // Manual field - keep empty
    stone: sourceRow.stone || "",
    shape: sourceRow.shape || "",
    size: sourceRow.size || "",
    color: sourceRow.color || "",
    cutting: sourceRow.cutting || "",
    quality: sourceRow.quality || "",
    clarity: sourceRow.clarity || "",
    cer_type: sourceRow.cer_type || "",
    cer_no: sourceRow.cer_no || "",
    lot_no: "", 
    pcs: sourceRow.pcs || "", 
    weight_per_piece: sourceRow.pcs && sourceRow.weight ? (sourceRow.weight / sourceRow.pcs).toFixed(3) : "",
    weight: sourceRow.weight || "", 
    price: sourceRow.price || "",
    unit: sourceRow.unit || "",
    amount: sourceRow.amount || "", 
    remark: "", 
    discount_percent: sourceRow.discount_percent || 0,
    // Store original PU data for daybook display
    original_pcs: sourceRow.pcs || 0,
    original_stone: sourceRow.stone || "",
    original_shape: sourceRow.shape || "",
    original_size: sourceRow.size || "",
    original_color: sourceRow.color || "",
    original_cutting: sourceRow.cutting || "",
    original_quality: sourceRow.quality || "",
    original_clarity: sourceRow.clarity || "",
    original_unit: sourceRow.unit || "",
    discount_amount: sourceRow.discount_amount || 0,
    totalAmount: sourceRow.totalAmount || sourceRow.amount || "",
    labour: sourceRow.labour || "",
    labour_price: sourceRow.labour_price || 0,
  
    stock_price: "", 
  
    stock_unit: "cts",
    stock_amount: 0, 
    sale_price: "", 
    sale_unit: "cts",
    sale_amount: 0, 
    // Carry over image to second section for preview
    image: sourceRow.image ? (/^https?:\/\//.test(sourceRow.image) ? sourceRow.image : `${API_URL}${sourceRow.image}`) : null,
    image_preview: sourceRow.image ? (/^https?:\/\//.test(sourceRow.image) ? sourceRow.image : `${API_URL}${sourceRow.image}`) : null,
  };
};

/**
 * Creates a combined row for merge mode
 *  firstSectionRows - All rows from first section
 *  {Object} Combined row data
 */
export const createCombinedRow = (firstSectionRows) => {
  if (firstSectionRows.length === 0) return null;

  // Calculate combined totals from all rows
  const totalPcs = firstSectionRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0);
  const totalWeight = firstSectionRows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  const totalAmount = firstSectionRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  
  // Check if all rows have the same unit
  const firstUnit = firstSectionRows[0]?.unit || "";
  const allSameUnit = firstSectionRows.every(row => row.unit === firstUnit);
  
  // Get the first row's data for reference fields
  const firstRow = firstSectionRows[0];
  const compositeStoneCode = createCompositeStoneCode(firstRow);
  
  // Calculate average price based on unit consistency
  let avgPrice = "";
  let unit = "";
  
  if (allSameUnit && firstUnit) {
    // All rows have same unit - calculate average price
    if (firstUnit.toLowerCase() === "pcs") {
      avgPrice = totalPcs > 0 ? (totalAmount / totalPcs).toFixed(2) : "";
    } else if (firstUnit.toLowerCase() === "cts") {
      avgPrice = totalWeight > 0 ? (totalAmount / totalWeight).toFixed(2) : "";
    }
    unit = firstUnit;
  }
  // If mixed units, avgPrice and unit will remain empty strings
  
  // Create single combined row
  return {
    _id: `combined-${Date.now()}`,
    pu_id: firstRow.pu_id || "", // Add pu_id from first row
    pu_item_id: firstRow.pu_item_id || "", // Add pu_item_id from first row
    pu_no: firstRow.pu_no || "", // Add pu_no from first row
    stone_code: compositeStoneCode,
    location: "", 
    stone: "", 
    shape: "", 
    size: "", 
    color: "", 
    cutting: "", 
    quality: "", 
    clarity: "", 
    cer_type: "", 
    cer_no: "", 
    lot_no: "", 
    pcs: totalPcs, // Combined total
    weight: totalWeight, // Combined total
    price: avgPrice, // Average price (empty if mixed units)
    unit: unit, // Unit (empty if mixed units)
    amount: totalAmount, // Combined total amount
    remark: "", // Manual field - keep empty
    discount_percent: firstRow.discount_percent || 0,
    discount_amount: firstRow.discount_amount || 0,
    totalAmount: totalAmount, // Combined total
    labour: firstRow.labour || "",
    labour_price: firstRow.labour_price || 0,
    // Manual fields for stock and sale prices
    stock_price: "", // Manual field - keep empty
    stock_unit: "cts", // default in merge mode
    stock_amount: 0, // Will be calculated automatically
    sale_price: "", // Manual field - keep empty
    sale_unit: "cts", // default in merge mode
    sale_amount: 0, // Will be calculated automatically
    // Store original PU data for daybook display
    original_pcs: totalPcs,
    original_stone: firstRow.stone || "",
    original_shape: firstRow.shape || "",
    original_size: firstRow.size || "",
    original_color: firstRow.color || "",
    original_cutting: firstRow.cutting || "",
    original_quality: firstRow.quality || "",
    original_clarity: firstRow.clarity || "",
    original_unit: unit,
  };
};
