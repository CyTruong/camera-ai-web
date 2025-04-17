import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

const ExportButton = ({ filename, data, buttonTitle }) => {
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
      const parkingTime = item.parkingTime ? `${item.parkingTime / 1000} s` : '';

      return {
        'Bảng số xe': item.license_plate,
        'Tên camera': item.camera_name,
        'Ảnh xe vào đầy đủ': item.licensePlateInFull
          ? `http://171.244.16.229:8070/${item.licensePlateInFull}`
          : '',
        'Ảnh xe vào cắt nhỏ': item.licensePlateInSmall
          ? `http://171.244.16.229:8070/${item.licensePlateInSmall}`
          : '',
        'Ảnh xe ra đầy đủ': item.licensePlateOutFull
          ? `http://171.244.16.229:8070/${item.licensePlateOutFull}`
          : '',
        'Ảnh xe ra cắt nhỏ': item.licensePlateOutSmall
          ? `http://171.244.16.229:8070/${item.licensePlateOutSmall}`
          : '',
        'Thời gian xe vào': entryTime ? entryTime : '',
        'Thời gian xe ra': exitTime ? exitTime : '',
        'Thời gian xe đỗ': parkingTime,
      };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Set column widths based on header length
    const colWidths = [
      { wch: 15 }, // bảng số xe
      { wch: 15 }, // tên camera
      { wch: 30 }, // ảnh xe vào đầy đủ
      { wch: 30 }, // ảnh xe vào cắt nhỏ
      { wch: 30 }, // ảnh xe ra đầy đủ
      { wch: 30 }, // ảnh xe ra cắt nhỏ
      { wch: 20 }, // thời gian xe vào
      { wch: 20 }, // thời gian xe ra
      { wch: 20 }, // thời gian xe đỗ
    ];
    worksheet['!cols'] = colWidths;

    // Add hyperlinks to the image columns
    transformedData.forEach((item, index) => {
      const rowIndex = index + 2; // +2 because the header is in the first row
      if (item['Ảnh xe vào đầy đủ']) {
        worksheet[`C${rowIndex}`] = {
          t: 's',
          v: item['Ảnh xe vào đầy đủ'],
          l: { Target: item['Ảnh xe vào đầy đủ'] },
        };
      }
      if (item['Ảnh xe vào cắt nhỏ']) {
        worksheet[`D${rowIndex}`] = {
          t: 's',
          v: item['Ảnh xe vào cắt nhỏ'],
          l: { Target: item['Ảnh xe vào cắt nhỏ'] },
        };
      }
      if (item['Ảnh xe ra đầy đủ']) {
        worksheet[`E${rowIndex}`] = {
          t: 's',
          v: item['Ảnh xe ra đầy đủ'],
          l: { Target: item['Ảnh xe ra đầy đủ'] },
        };
      }
      if (item['Ảnh xe ra cắt nhỏ']) {
        worksheet[`F${rowIndex}`] = {
          t: 's',
          v: item['Ảnh xe ra cắt nhỏ'],
          l: { Target: item['Ảnh xe ra cắt nhỏ'] },
        };
      }
    });

    // Add borders to cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        };
      }
    }

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Export the file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExport} style={{ margin: '10px' }}>
      {buttonTitle?buttonTitle:'Xuất Excel'}
    ️
    </Button>
  );
};

export default ExportButton;