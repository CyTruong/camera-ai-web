import React, { useState, useEffect } from "react";
import "./css/signed_vehicle.css";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";

function SignedVehicle() {
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterActive, setFilterActive] = useState(1);
  const [filterTransaction, setFilterTransactions] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: "",
    license_plate: "",
    last_come: "",
    start_date: "",
    end_date: null,
  });

  const itemsPerPage = 10;

  // Load phương tiện từ API
  useEffect(() => {
    fetch("http://171.244.16.229:8092/api/license-plate/")
      .then((res) => res.json())
      .then((data) => {
        // Ẩn các xe đã hết hạn
        const validVehicles = data.filter((v) => !v.end_date || new Date(v.end_date) > new Date());
        setAllVehicles(validVehicles);
      })
      .catch((err) => console.error("Lỗi lấy phương tiện:", err));
  }, []);

  // Lọc theo loại xe
  useEffect(() => {
    let filtered = allVehicles;
    if (filterTransaction === "in") {
      filtered = allVehicles.filter((t) => t.vehicle_type === "Xe hợp đồng");
    } else if (filterTransaction === "out") {
      filtered = allVehicles.filter((t) => t.vehicle_type === "Xe vãng lai");
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filterTransaction, allVehicles]);

  const totalAds = filteredData.length;
  const computedTransaction = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Thêm phương tiện mới
  const handleAddVehicle = () => {
    fetch("http://171.244.16.229:8092/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVehicle),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Đã thêm phương tiện!");
        setAllVehicles((prev) => [...prev, data]);
        setNewVehicle({
          vehicle_type: "",
          license_plate: "",
          last_come: "",
          start_date: "",
          end_date: null,
        });
      })
      .catch((err) => console.error("Lỗi thêm phương tiện:", err));
  };

  // Cập nhật ngày kết thúc để “xoá mềm” phương tiện
  const handleDeleteVehicle = (license_plate) => {
    const endDate = new Date().toISOString().split("T")[0];
    fetch(`http://171.244.16.229:8092/vehicles/${license_plate}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ end_date: endDate }),
    })
      .then((res) => res.json())
      .then(() => {
        setAllVehicles((prev) =>
          prev.filter((v) => v.license_plate !== license_plate)
        );
      })
      .catch((err) => console.error("Lỗi xoá mềm phương tiện:", err));
  };

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
                data={allVehicles}
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
                  <th>Biển số</th>
                  <th>Lần vào gần nhất</th>
                  <th>Hiệu lực từ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {computedTransaction.length > 0 ? (
                  computedTransaction.map((ad, index) => (
                    <tr key={ad.license_plate}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{ad.vehicle_type}</td>
                      <td>{ad.license_plate}</td>
                      <td>{ad.last_come}</td>
                      <td>{ad.start_date}</td>
                      <td>
                        <button onClick={() => handleDeleteVehicle(ad.license_plate)}>
                          Xoá (Chọn ngày kết thúc)
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="addForm">
            <h3>Thêm phương tiện mới</h3>
            <input
              type="text"
              placeholder="Loại xe"
              value={newVehicle.vehicle_type}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Biển số xe"
              value={newVehicle.license_plate}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, license_plate: e.target.value })
              }
            />
            <input
              type="datetime-local"
              value={newVehicle.last_come}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, last_come: e.target.value })
              }
            />
            <input
              type="date"
              value={newVehicle.start_date}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, start_date: e.target.value })
              }
            />
            <button onClick={handleAddVehicle}>Thêm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignedVehicle;
