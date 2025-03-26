import React, { useState, useEffect } from "react";
import "./css/signed_vehicle.css";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";

function SignedVehicle() {
  const [filteredData, setFilteredData] = useState([]);
  const [filterActive, setFilterActive] = useState(1);
  const [filterTransaction, setFilterTransactions] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Test data for demonstration
  const testData = [
    { vehicle_type: "Xe hợp đồng", license_plate: "51A-12345", last_come: "2023-10-01 08:30:00" },
    { vehicle_type: "Xe vãng lai", license_plate: "30B-67890", last_come: "2023-10-02 09:15:00" },
    { vehicle_type: "Xe vãng lai", license_plate: "59C1-23456", last_come: "2023-10-03 10:45:00" },
    { vehicle_type: "Xe hợp đồng", license_plate: "51C-98765", last_come: "2023-10-04 11:20:00" },
    { vehicle_type: "Xe vãng lai", license_plate: "29A-54321", last_come: "2023-10-05 12:10:00" },
  ];

  useEffect(() => {
    let filtered = testData;
    if (filterTransaction === "in") {
      filtered = testData.filter((transaction) => transaction.vehicle_type === "Xe hợp đồng");
    } else if (filterTransaction === "out") {
      filtered = testData.filter((transaction) => transaction.vehicle_type !== "Xe vãng lai");
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filterTransaction]);

  const totalAds = filteredData.length;
  const computedTransaction = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bodyWrap">
      <div className="contentOrderWrap">
        <div className="leftSide">
          <h1>Xe đã đăng ký</h1>
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
                  Xe hợp đồng
                </li>
                <li
                  className={`${filterActive === 3 ? "active" : ""}`}
                  onClick={() => {
                    setFilterTransactions("out");
                    setFilterActive(3);
                  }}
                >
                  Xe vãng lai
                </li>
              </ul>
            </div>
            <div className="addOrderWrap">
              <SearchBar
                data={testData}
                handleSearchChange={(newFilteredData) => setFilteredData(newFilteredData)}
                dataType="Motor"
                status={filterTransaction}
              />
            </div>
          </div>
          <div className="orderWrap">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Loại xe</th>
                  <th>Biển số xe</th>
                  <th>Lần gần nhất xe vào</th>
                </tr>
              </thead>
              <tbody>
                {computedTransaction.map((ad, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{ad.vehicle_type}</td>
                    <td>{ad.license_plate}</td>
                    <td>{ad.last_come}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignedVehicle;
