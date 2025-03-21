import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./css/truck_page.css";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";
import ReadMoreRoundedIcon from "@mui/icons-material/ReadMoreRounded";
import { Modal, Box, Typography } from "@mui/material"; // Import Modal và Box từ MUI

function Truck() {
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterActive, setFilterActive] = useState(1);
  const [filterTransaction, setFilterTransactions] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAd, setSelectedAd] = useState(null); // Lưu thông tin dòng được chọn
  const [openModal, setOpenModal] = useState(false); // State để điều khiển modal

  const itemsPerPage = 10;

  function convertMiliSecondsToDistanceTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  function convertEpochMsToDateTime(epochTimeMs) {
    const date = new Date(epochTimeMs); // Convert milliseconds to Date object
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }
  function convertToUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
      // Return a default URL or empty string if the input is invalid
      return "http://115.73.209.76:8092/placeholder.png";
    }
    const baseUrl = "http://171.244.16.229:8070";
    const filename = imagePath.split('/')[0];
    return `${baseUrl}/${filename}`; // Construct the new URL
  }
  // Hàm mở modal và hiển thị thông tin chi tiết
  const handleOpenModal = (ad) => {
    setSelectedAd(ad);
    setOpenModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Hàm tìm kiếm
  const handleSearchChange = (newFilteredData) => {
    console.log('newFilteredData', newFilteredData);
    setFilteredData(newFilteredData);
  };

  // Hàm lọc dữ liệu
  useEffect(() => {
    let filtered = transactionData;
    if (filterTransaction === "in") {
      filtered = transactionData.filter(transaction => !transaction.exitTime);
    } else if (filterTransaction === "out") {
      filtered = transactionData.filter(transaction => transaction.exitTime);
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filterTransaction, transactionData]);

  // Hàm fetch dữ liệu từ API
  const loadTransactionData = () => {
    const token = localStorage.getItem('token');
    axios.get("http://171.244.16.229:8092/api/transaction/", {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(function(response) {
      const allTransaction = response.data.data;
      const formattedTransactions = allTransaction
        .filter(transaction => transaction.licensePlate.length < 15)
        .map(transaction => {
          const smallLicensePlate = transaction.licensePlateOutSmall ? transaction.licensePlateOutSmall : transaction.licensePlateInSmall;
          const fullLicensePlate = transaction.licensePlateOutFull ? transaction.licensePlateOutFull : transaction.licensePlateInFull;
          const crop_url = convertToUrl(smallLicensePlate);
          const full_url = convertToUrl(fullLicensePlate);
          const licensePlate = String(transaction.licensePlate).replace(/[^a-zA-Z0-9]/g, '');
          
          return {
            tracker_index: transaction._id,
            license_plate: licensePlate,
            camera_name: 'TRUCK',
            cropUrl: crop_url,
            fullUrl: full_url,
            entryTime: transaction.entryTime,
            exitTime: transaction.exitTime,
            parkingTime: transaction.parkingTime
          };
        });
      setTransactionData(formattedTransactions);
      setFilteredData(formattedTransactions);
    })
    .catch(function(err) {
      console.error('Error loading transaction data:', err);
    });
  };

  useEffect(() => {
    loadTransactionData();
  }, []);

  const totalAds = filteredData.length;
  const computedTransaction = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bodyWrap">
      <div className="contentOrderWrap">
        <div className="leftSide">
          <h1>Xe tải</h1>
          <Pagination
            total={totalAds}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="orderNavWrap">
            <div className="orderNav">
              <ul>
                <li
                  className={`${filterActive === 1 ? "active" : ""}`}
                  onClick={() => {
                    setFilterTransactions("");
                    setFilterActive(1);
                  }}
                >
                  Tất cả
                </li>
                <li
                  className={`${filterActive === 2 ? "active" : ""}`}
                  onClick={() => {
                    setFilterTransactions("in");
                    setFilterActive(2);
                  }}
                >
                  Xe trong bãi
                </li>
                <li
                  className={`${filterActive === 3 ? "active" : ""}`}
                  onClick={() => {
                    setFilterTransactions("out");
                    setFilterActive(3);
                  }}
                >
                  Xe đã ra khỏi bãi
                </li>
              </ul>
            </div>
            <div className="addOrderWrap">
              <SearchBar
                data={transactionData}
                handleSearchChange={handleSearchChange}
                dataType="truck"
                status={filterTransaction}
              />            
            </div>
          </div>
          <div className="orderWrap">
            <table>
              <thead>
                <tr>
                  <th>Biển số xe</th>
                  <th>Ảnh biển số</th>
                  <th>Thời gian vào</th>
                  <th>Thời gian ra</th>
                  <th>Thời gian đỗ</th>
                  <th>  </th>  
                </tr>
              </thead>
              <tbody>
                {computedTransaction.map((ad) => (
                  <tr key={ad.tracker_index}>
                    <td>{ad.license_plate}</td>
                    <td>
                      <img src={ad.cropUrl} alt={ad.license_plate} className="crop-image" />
                    </td>
                    <td>{ad.entryTime ? convertEpochMsToDateTime(ad.entryTime) : "    "}</td>
                    <td>{ad.exitTime ? convertEpochMsToDateTime(ad.exitTime) : "    "}</td>
                    <td>{ad.parkingTime ? convertMiliSecondsToDistanceTime(ad.parkingTime) : "    "}</td>
                    <td>
                      <ReadMoreRoundedIcon
                        className="read-more-icon"
                        onClick={() => handleOpenModal(ad)} // Mở modal khi nhấp vào icon
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal hiển thị thông tin chi tiết */}
      <Modal
        id="detail-modal"
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-box">
          <Typography id="modal-title" variant="h6" component="h2" style={{ color: '#ff0000', marginBottom: '1rem' }}>
            Chi tiết thông tin
          </Typography>
          {selectedAd && (
            <div className="modal-content">
              <Typography>Biển số xe: {selectedAd.license_plate}</Typography>
              <Typography>Thời gian vào: {convertEpochMsToDateTime(selectedAd.entryTime)}</Typography>
              <Typography>Thời gian ra: {selectedAd.exitTime?convertEpochMsToDateTime(selectedAd.exitTime):"    "}</Typography>
              <Typography>Thời gian đỗ: {selectedAd.entryTime&&selectedAd.exitTime ?convertMiliSecondsToDistanceTime(selectedAd.parkingTime):"    "}</Typography>
              <div className="modal-images">
                <img src={selectedAd.cropUrl} alt="Crop" className="crop-image" />
              </div>
              <div className="modal-images">
                <img src={selectedAd.fullUrl} alt="Full" className="full-image" />
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Truck;
