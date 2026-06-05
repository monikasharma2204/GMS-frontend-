import React from 'react';

const SortIcon = ({ sortConfig, columnKey }) => {
  const isSorted = sortConfig.key === columnKey;

  let leftFill = "#343434";
  let rightFill = "#343434";

  if (isSorted) {
    if (sortConfig.direction === 'asc') {
      leftFill = "#C6C6C8";
      rightFill = "#17C653";
    } else if (sortConfig.direction === 'desc') {
      leftFill = "#17C653";
      rightFill = "#C6C6C8";
    }
  }

  return (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px', flexShrink: 0 }}>

      <path d="M6.5 12H3.5L8 16.5V1.5H6.5V12" fill={leftFill} />

      <path d="M11 3.75V16.5H12.5V6H15.5L11 1.5V3.75Z" fill={rightFill} />
    </svg>
  );
};

export default SortIcon;
