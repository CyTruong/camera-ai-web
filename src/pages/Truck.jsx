import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./css/truck_page.css";
import Popup from "../Components/Popup";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";

function Truck() {
  const [transactionData, setTransactionData] = useState([]);
  const [buttonShowPopup, setButtonShowPopup] = useState(false);
  const [selectedAd, setSelectedAd] = useState(0);
  const [updatedStatus, setUpdatedStatus] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const [filterActive, setFilterActive] = useState(1);
  const [filterTransaction, setFilterTransactions] = useState("");

  const handleSearchChange = (newFilteredData) => {
    console.log('newFilteredData', newFilteredData);
    setFilteredData(newFilteredData);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalAds = filteredData.length;
  const computedTransaction = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

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
  function convertMiliSecondsToDistanceTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  function convertToUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
      // Return a default URL or empty string if the input is invalid
      return "http://115.73.209.76:8092/placeholder.png";
    }
    const baseUrl = "http://171.244.16.229:8070/";
    const filename = imagePath.split('/')[0];
    return `${baseUrl}/${filename}`; // Construct the new URL
  }

  const loadTransactionData = () => {
    const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
    
    axios.get("http://171.244.16.229:8092/api/transaction/", {
      headers: {
        'Authorization': `Bearer ${token}`,  // Dynamically using the token
      }
    })
    .then(function(response) {
      console.log('Load all trans response', response.data.data);
      const allTransaction = response.data.data;
      const formattedTransactions = allTransaction
        .filter(transaction => transaction.licensePlate.length < 15)
        .map(transaction => {
          const smallLicensePlate = transaction.licensePlateOutSmall ? transaction.licensePlateOutSmall : transaction.licensePlateInSmall;
          const fullLicensePlate = transaction.licensePlateOutFull ? transaction.licensePlateOutFull : transaction.licensePlateOutFull;
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
      console.log('Login failed');
    });
  };

  useEffect(() => {
    loadTransactionData();
  }, []);

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
                </tr>
              </thead>
              <tbody>
                {computedTransaction.map((ad) => {
                  return (
                    <tr key={ad.tracker_index}>
                      <td>{ad.license_plate}</td>
                      <td>
                        <img src={ad.cropUrl} alt={ad.license_plate} style={{ width: "100px", height: "auto" }} />
                      </td>
                      <td>{ad.entryTime ? convertEpochMsToDateTime(ad.entryTime) : ""}</td>
                      <td>{ad.exitTime ? convertEpochMsToDateTime(ad.exitTime) : ""}</td>
                      <td>{ad.parkingTime ? convertMiliSecondsToDistanceTime(ad.parkingTime) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Popup trigger={buttonShowPopup} setTrigger={setButtonShowPopup}>
        <div className="popupWrap">
          <div className="productSummary">
            <h3 className="productSummaryLeft">Edit Ads</h3>
          </div>
          <div className="addNewOrderWrap">
            <div className="addNewOrderForm">
              <div className="orderDetails">
                {transactionData[selectedAd] && (
                  <div className="input-group">
                    <img src={transactionData[selectedAd].cropUrl} alt={transactionData[selectedAd].license_plate} style={{ width: "300px", height: "auto" }} />
                  </div>    
                )}   
              </div>
              <div className="productSummaryRight newUserSwitch" style={{ width: "100%" }}> 
                <h3>Is Active </h3>
                <input
                  type="radio"
                  name="rdo"
                  id="yes"
                  onChange={() => setUpdatedStatus(true)}
                  defaultChecked="defaultChecked"
                />
                <input
                  type="radio"
                  name="rdo"
                  id="no"
                  onChange={() => setUpdatedStatus(false)}
                />
                <div className="switch">
                  <label className="switchLabel" htmlFor="yes">
                    Yes
                  </label>
                  <label className="switchLabel" htmlFor="no">
                    No
                  </label>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default Truck;
