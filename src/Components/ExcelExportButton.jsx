import React from 'react';
import {Button} from '@mui/material';
import * as XLSX from 'xlsx';

const ExportButton = ({ filename, data }) => {
  const handleExport = () => {
    // Transform the data
    const transformedData = data.map((item) => {
      const entryTime = new Date(item.entryTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const exitTime = item.exitTime
        ? new Date(item.exitTime).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';
      const parkingTime = item.parkingTime ? `${item.parkingTime/1000} s` : '';

      return {
        'Bảng số xe': item.license_plate,
        'Tên camera': item.camera_name,
        'Ảnh cắt nhỏ': item.cropUrl ? `http://171.244.16.229:8070/${item.cropUrl}` : '',
        'Ảnh đầy đủ': item.fullUrl ? `http://171.244.16.229:8070/${item.fullUrl}` : '',
        'Thời gian xe vào': entryTime,
        'Thời gian xe ra': exitTime,
        'Thời gian xe đỗ': parkingTime,
      };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Set column widths based on header length
    const colWidths = [
      { wch: 15 }, // bảng số xe
      { wch: 15 }, // tên camera
      { wch: 30 }, // ảnh cắt nhỏ
      { wch: 30 }, // ảnh đầy đủ
      { wch: 20 }, // thời gian xe vào
      { wch: 20 }, // thời gian xe ra
      { wch: 20 }, // thời gian xe đỗ
    ];
    worksheet['!cols'] = colWidths;

    // Add hyperlinks to the image columns
    transformedData.forEach((item, index) => {
      const rowIndex = index + 2; // +2 because the header is in the first row
      if (item['Ảnh cắt nhỏ']) {
        worksheet[`C${rowIndex}`] = { t: 's', v: item['Ảnh cắt nhỏ'], l: { Target: item['Ảnh cắt nhỏ'] } };
      }
      if (item['Ảnh đầy đủ']) {
        worksheet[`D${rowIndex}`] = { t: 's', v: item['Ảnh đầy đủ'], l: { Target: item['Ảnh đầy đủ'] } };
      }
    });

    // Add borders to cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = { border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } };
      }
    }

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Export the file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExport}>
      Xuất Excel
    </Button>
  );
};

export default ExportButton;