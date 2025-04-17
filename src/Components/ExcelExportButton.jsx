import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

const ExportButton = ({ filename, data, startTime, endTime, buttonTitle, buttonVariant, buttonColor , disabled = false}) => {
  const handleExport = () => {
    // Transform the data
    console.log('Start time:', startTime);
    console.log('End time:', endTime);
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      data = data.filter((item) => {
        const entryTime = new Date(item.entryTime);
        const exitTime = new Date(item.exitTime);
        const checkTime = entryTime > exitTime ? entryTime : exitTime; 
        return checkTime >= startDate && checkTime <= endDate;
      });
      console.log('Filtered data:', data);
    }
    const transformedData = data.map((item) => {
      const entryTime = item.entryTime
        ? new Date(item.entryTime).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';
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
      const vehicaleType = item.camera_name.includes('TRUCK')? 'Xe tải/ Container' : item.camera_name.includes('MOTO') ? 'Xe máy' : 'Chưa xác định';
      return {
        'Bảng số xe': item.license_plate,
        'Tên camera': vehicaleType,
        'Ảnh xe vào đầy đủ': item.enter_fullUrl
          ? `${item.enter_fullUrl}`
          : '',
        'Ảnh xe vào cắt nhỏ': item.enter_cropUrl
          ? `${item.enter_cropUrl}`
          : '',
        'Ảnh xe ra đầy đủ': item.exit_fullUrl
          ? `${item.exit_fullUrl}`
          : '',
        'Ảnh xe ra cắt nhỏ': item.exit_cropUrl
          ? `${item.exit_cropUrl}`
          : '',
        'Thời gian xe vào': entryTime ? entryTime : '',
        'Thời gian xe ra': exitTime ? exitTime : '',
        'Thời gian xe đỗ': parkingTime,
        'Ghi chú': item.note,
      };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Set column widths based on header length
    const colWidths = [
      { wch: 15 }, // bảng số xe
      { wch: 15 }, // tên camera
      { wch: 45 }, // ảnh xe vào đầy đủ
      { wch: 45 }, // ảnh xe vào cắt nhỏ
      { wch: 45 }, // ảnh xe ra đầy đủ
      { wch: 45 }, // ảnh xe ra cắt nhỏ
      { wch: 20 }, // thời gian xe vào
      { wch: 20 }, // thời gian xe ra
      { wch: 20 }, // thời gian xe đỗ
      { wch: 60 }, // ghi chú
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
    <Button fullWidth sx={{  mb: 2, height: 56 }} variant={buttonVariant} color= {buttonColor} disabled = {disabled} onClick={handleExport}>
      {buttonTitle?buttonTitle:'Xuất Excel'}
    ️
    </Button>
  );
};

export default ExportButton;