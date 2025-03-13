import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

const ExcelExportButton = ({ data, header, fileName, sheetOptions }) => {
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data, { header: Object.keys(header), ...sheetOptions });

    // Set column widths
    const colWidths = Object.keys(header).map(key => ({ wch: header[key].width || 10 }));
    ws['!cols'] = colWidths;

    // Format columns
    Object.keys(header).forEach((key, index) => {
      const col = XLSX.utils.encode_col(index);
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = `${col}${R + 1}`;
        if (!ws[cellAddress]) continue;
        ws[cellAddress].z = header[key].format || '@';
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExport}>
      Xuất Excel
    </Button>
  );
};

export default ExcelExportButton;
