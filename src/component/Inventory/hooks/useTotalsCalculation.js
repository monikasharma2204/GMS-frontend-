import { useMemo } from 'react';


export const useTotalsCalculation = (rows) => {
  return useMemo(() => {
    const calculatedTotals = rows.reduce((totals, row) => {
      const pcs = Number(row.pcs) || 0;
      const weight = Number(row.weight) || 0;
      const price = Number(row.price) || 0;
      const amount = Number(row.amount) || 0;
      
      return {
        totalPcs: totals.totalPcs + pcs,
        totalWeight: totals.totalWeight + weight,
        totalPrice: totals.totalPrice + price,
        totalAmount: totals.totalAmount + amount,
      };
    }, {
      totalPcs: 0,
      totalWeight: 0,
      totalPrice: 0,
      totalAmount: 0,
    });
    
    return {
      ...calculatedTotals,
      totalAmount: calculatedTotals.totalAmount
    };
  }, [rows]);
};


export const useAveragePrice = (rows, totals) => {
  return useMemo(() => {
    if (rows.length === 0) return 0;
    
    // Check if all rows have the same unit
    const firstUnit = rows[0]?.unit || "";
    const allSameUnit = rows.every(row => row.unit === firstUnit);
    
    if (allSameUnit && firstUnit) {
      // All rows have same unit - calculate average price
      if (firstUnit.toLowerCase() === "pcs") {
        return totals.totalPcs > 0 ? parseFloat((totals.totalAmount / totals.totalPcs).toFixed(2)) : 0;
      } else if (firstUnit.toLowerCase() === "cts") {
        return totals.totalWeight > 0 ? parseFloat((totals.totalAmount / totals.totalWeight).toFixed(2)) : 0;
      }
    }
    
    // If mixed units, show total of all individual prices
    return parseFloat(totals.totalPrice.toFixed(2));
  }, [totals.totalAmount, totals.totalPcs, totals.totalWeight, totals.totalPrice, rows]);
};
