import React, { useState, useEffect } from "react";
import "./css/signed_vehicle.css";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { Modal, Box, Typography } from "@mui/material";
import axios from "axios";

function SignedVehicle() {
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterActive, setFilterActive] = useState(1);
  const [buttonNewPopup, setButtonNewPopup] = useState(false);
  const [filterTransaction, setFilterTransactions] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [voucherDetails, setVoucherDetails] = useState({
    username: "",
    displayName: "",
    userType: "KHACH_VANG_LAI",
    vehiclePlates: [""],
    carType: "TRUCK",
  });

  const itemsPerPage = 10;

  // Load vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://171.244.16.229:8092/api/license-plate/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const validVehicles = response.data.data.filter(
          (v) => v.license_plate !== ""
        );
        setAllVehicles(validVehicles);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);

  // Filter by vehicle type
  useEffect(() => {
    let filtered = allVehicles;
    if (filterTransaction === "in") {
      filtered = allVehicles.filter((v) => v.carType === "TRUCK");
    } else if (filterTransaction === "out") {
      filtered = allVehicles.filter((v) => v.carType === "MOTO");
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filterTransaction, allVehicles]);

  const totalAds = filteredData.length;
  const computedTransaction = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteVehicle = async (licensePlate) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://171.244.16.229:8092/api/license-plate/${licensePlate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllVehicles((prev) =>
        prev.filter((v) => v.licensePlate !== licensePlate)
      );
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Vehicle added:", voucherDetails);
      const response = await axios.post(
        "http://171.244.16.229:8093/api/users/createUserWithPlates",
        voucherDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllVehicles([...allVehicles, response.data.data]);
      setButtonNewPopup(false);
      setVoucherDetails({
        username: "",
        displayName: "",
        userType: "KHACH_VANG_LAI",
        vehiclePlates: [""],
        carType: "TRUCK",
      });
      fetchVehicles();
    } catch (err) {
      console.error("Error adding vehicle:", err);
    }
  };

  const handleAddLicensePlate = () => {
    setVoucherDetails({
      ...voucherDetails,
      vehiclePlates: [...voucherDetails.vehiclePlates, ""],
    });
  };

  const handleRemoveLicensePlate = (index) => {
    const updatedPlates = voucherDetails.vehiclePlates.filter(
      (_, i) => i !== index
    );
    setVoucherDetails({
      ...voucherDetails,
      vehiclePlates: updatedPlates,
    });
  };

  const handleLicensePlateChange = (index, value) => {
    const updatedPlates = [...voucherDetails.vehiclePlates];
    updatedPlates[index] = value;
    setVoucherDetails({
      ...voucherDetails,
      vehiclePlates: updatedPlates,
    });
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
                  Xe tải/container
                </li>
                <li
                  className={`${filterActive === 3 ? "active" : ""}`}
                  onClick={() => {
                    setFilterTransactions("out");
                    setFilterActive(3);
                  }}
                >
                  Xe moto
                </li>
              </ul>
            </div>
            <div className="addOrderWrap">
              <SearchBar
                data={allVehicles}
                handleSearchChange={(newFilteredData) =>
                  setFilteredData(newFilteredData)
                }
                dataType="vehicle"
                status={filterTransaction}
              />
              <button
                className="addOrder"
                onClick={() => {
                  setButtonNewPopup(true);
                }}
              >
                <AddCircleOutlineRoundedIcon />
                <span className="addOrderText">Thêm</span>
              </button>
            </div>
          </div>

          <div className="orderWrap">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Loại xe</th>
                  <th>Biển số</th>
                  <th>Tên người dùng</th>
                  <th>Tên phương tiện</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {computedTransaction.length > 0 ? (
                  computedTransaction.map((ad, index) => (
                    <tr key={ad._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {ad.carType === "TRUCK" ? "Xe tải/Container" : "Xe máy"}
                      </td>
                      <td>{ad.licensePlate}</td>
                      <td>{ad.userName}</td>
                      <td>{ad.vehicleName}</td>
                      <td>
                        <DeleteForeverRoundedIcon
                          className="clickable"
                          onClick={() => {
                            handleDeleteVehicle(ad.licensePlate);
                          }}
                        />
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
        </div>
      </div>

      <Modal
        id="add-new-modal"
        open={buttonNewPopup}
        onClose={() => setButtonNewPopup(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-box">
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            style={{ color: "#ff0000", marginBottom: "1rem" }}
          >
            Đăng ký mới phương tiện
          </Typography>

          <div className="popupWrap">
            <div className="addNewOrderWrap">
              <div className="addNewOrderForm">
                <div className="orderDetails">
                  {/* Vehicle Type */}
                  <div className="input-group">
                    <select
                      className="orderDetailsSelect"
                      value={voucherDetails.carType}
                      onChange={(e) =>
                        setVoucherDetails({
                          ...voucherDetails,
                          carType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Loại phương tiện *</option>
                      <option value="TRUCK">Xe tải / Xe Container</option>
                      <option value="MOTO">Xe moto / Xe 2 bánh</option>
                    </select>
                  </div>

                  {/* Vehicle Name */}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Tên phương tiện *"
                      className="orderDetailsInput"
                      value={voucherDetails.displayName}
                      onChange={(e) =>
                        setVoucherDetails({
                          ...voucherDetails,
                          displayName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Tên người dùng *"
                      className="orderDetailsInput"
                      value={voucherDetails.username}
                      onChange={(e) =>
                        setVoucherDetails({
                          ...voucherDetails,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* User Type */}
                  <div className="input-group">
                    <select
                      className="orderDetailsSelect"
                      value={voucherDetails.userType}
                      onChange={(e) =>
                        setVoucherDetails({
                          ...voucherDetails,
                          userType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Loại người dùng *</option>
                      <option value="NHAN_VIEN">Nhân viên</option>
                      <option value="KHACH_VANG_LAI">Khách vãng lai</option>
                      <option value="DOI_TAC">Đối tác</option>
                      <option value="CONG_TY_THANH_VIEN">
                        Công ty thành viên
                      </option>
                      <option value="TONG_CONG_TY">Tổng công ty</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* License Plates Section */}
              <div className="productDetails">
                <div className="newOrderTable">
                  <table style={{ width: "100%", padding: "0 1rem" }}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Biển số xe *</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voucherDetails.vehiclePlates.map((plate, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              style={{ textAlign: "center" }}
                              type="text"
                              placeholder="Nhập biển số"
                              value={plate}
                              onChange={(e) =>
                                handleLicensePlateChange(index, e.target.value)
                              }
                              required
                            />
                          </td>
                          <td>
                            {voucherDetails.vehiclePlates.length > 1 && (
                              <DeleteForeverRoundedIcon
                                className="clickable"
                                onClick={() => handleRemoveLicensePlate(index)}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="input-group">
                  <span
                    type="button"
                    className="addNewLine clickable"
                    onClick={handleAddLicensePlate}
                  >
                    + Thêm biển số xe
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="submitWrap">
              <div className="submitNewVehicle">
                <button
                  className="submitNewOrderBtn"
                  onClick={() => {
                    // Validate all required fields
                    const isVehicleTypeValid = !!voucherDetails.carType;
                    const isVehicleNameValid = !!voucherDetails.displayName;
                    const isUsernameValid = !!voucherDetails.username;
                    const isUserTypeValid = !!voucherDetails.userType;
                    const isPlatesValid =
                      voucherDetails.vehiclePlates.every((plate) => !!plate) &&
                      voucherDetails.vehiclePlates.length > 0;

                    if (
                      isVehicleTypeValid &&
                      isVehicleNameValid &&
                      isUsernameValid &&
                      isUserTypeValid &&
                      isPlatesValid
                    ) {
                      handleAddVehicle();
                    } else {
                      // Show error messages by setting a state if you want to highlight errors
                      alert(
                        "Vui lòng điền đầy đủ các trường bắt buộc (có dấu *)"
                      );
                    }
                  }}
                >
                  <AddCircleOutlineRoundedIcon />
                  <span className="addOrderText">Thêm</span>
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default SignedVehicle;
