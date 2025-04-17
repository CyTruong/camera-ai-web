import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/motor_page.css";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";
import ExcelExportButton from './../Components/ExcelExportButton';
import ReadMoreRoundedIcon from "@mui/icons-material/ReadMoreRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale"; // Vietnamese locale
import {
  Divider,
  Grid,
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Stack,
  Button,
  IconButton,
} from "@mui/material"; // Import Modal, Box, Typography, Tabs, Tab, and MUI table components

function Motor() {
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterActive, setFilterActive] = useState(1);
  const [filterTransaction, setFilterTransactions] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAd, setSelectedAd] = useState(null); // Lưu thông tin dòng được chọn
  const [openDetailModal, setOpenDetailModal] = useState(false); // State để điều khiển modal
  const [openNoteModal, setOpenNoteModal] = useState(false); // State để điều khiển modal ghi chú
  const [openExportModal, setOpenExportModal] = useState(false); // State để điều khiển modal xuất dữ liệu
  const [selectedTab, setSelectedTab] = useState(0); // State to manage the selected tab
  const [fileName, setFileName] = useState(
    `Danh_sach_moto_${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}`
  );
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const itemsPerPage = 10;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartEpoch = Math.floor(todayStart.getTime());

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayEndEpoch = Math.floor(todayEnd.getTime());
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
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  }
  function convertToUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
      // Return a default URL or empty string if the input is invalid
      return "";
    }
    const baseUrl = "http://171.244.16.229:8070";
    const filename = imagePath.split("/")[0];
    return `${baseUrl}/${filename}`; // Construct the new URL
  }

  // Hàm mở modal ghi chú
  const handleEditNot = (ad) => {
    setSelectedAd(ad);
    setOpenNoteModal(true);
  };

  // Hàm mở modal và hiển thị thông tin chi tiết
  const handleOpenModal = (ad) => {
    setSelectedAd(ad);
    if (ad.enter_cropUrl != "") {
      setSelectedTab(0);
    } else {
      setSelectedTab(1);
    }
    setOpenDetailModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenDetailModal(false);
  };

  // Hàm tìm kiếm
  const handleSearchChange = (newFilteredData) => {
    console.log("newFilteredData", newFilteredData);
    setFilteredData(newFilteredData);
  };

  // Hàm lọc dữ liệu
  useEffect(() => {
    let filtered = transactionData;
    if (filterTransaction === "in") {
      filtered = transactionData.filter((transaction) => !transaction.exitTime);
    } else if (filterTransaction === "out") {
      filtered = transactionData.filter((transaction) => transaction.exitTime);
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filterTransaction, transactionData]);

  // Hàm fetch dữ liệu từ API
  const loadTransactionData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://171.244.16.229:8092/api/transaction/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        const allTransaction = response.data.data;
        const formattedTransactions = allTransaction
          .filter(
            (transaction) =>
              transaction.licensePlate.length < 15 &&
              transaction.vehicleType === "MOTO"
          )
          .map((transaction) => {
            const exit_cropUrl = convertToUrl(transaction.licensePlateOutSmall);
            const exit_fullUrl = convertToUrl(transaction.licensePlateOutFull);
            const enter_cropUrl = convertToUrl(transaction.licensePlateInSmall);
            const enter_fullUrl = convertToUrl(transaction.licensePlateInFull);
            const licensePlate = String(transaction.licensePlate).replace(
              /[^a-zA-Z0-9]/g,
              ""
            );

            return {
              tracker_index: transaction._id,
              license_plate: licensePlate,
              camera_name: "MOTO",
              enter_cropUrl: enter_cropUrl,
              enter_fullUrl: enter_fullUrl,
              exit_cropUrl: exit_cropUrl,
              exit_fullUrl: exit_fullUrl,
              entryTime: transaction.entryTime,
              exitTime: transaction.exitTime,
              parkingTime: transaction.parkingTime,
              note: "Test ghi chú",
            };
          });
        setTransactionData(formattedTransactions);
        setFilteredData(formattedTransactions);
      })
      .catch(function (err) {
        console.error("Error loading transaction data:", err);
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const isValidImage = (url) => url && url.trim() !== "";

  return (
    <div className="bodyWrap">
      <div className="contentOrderWrap">
        <div className="leftSide">
          <h1>Xe 2 bánh</h1>
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
                dataType="Motor"
                status={filterTransaction}
              />
              <button
                className="exportOrder"
                onClick={() => {
                  setOpenExportModal(true);
                }}
              >
                <span className="exportOrderText">Xuất Excel</span>
                <BackupTableIcon />
              </button>
            </div>
          </div>
          <div className="orderWrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Biển số xe</th>
                  <th style={{ width: "20%" }}>Ảnh biển số</th>
                  <th style={{ width: "12%" }}>Thời gian vào</th>
                  <th style={{ width: "12%" }}>Thời gian ra</th>
                  <th style={{ width: "10%" }}>Thời gian đỗ</th>
                  <th style={{ width: "21%" }}>Ghi chú</th>
                  <th style={{ width: "15%" }}> </th>
                </tr>
              </thead>
              <tbody>
                {computedTransaction.map((ad) => (
                  <tr key={ad.tracker_index}>
                    <td>{ad.license_plate}</td>
                    <td>
                      <img
                        src={
                          ad.enter_cropUrl != ""
                            ? ad.enter_cropUrl
                            : ad.exit_cropUrl
                        }
                        alt={ad.license_plate}
                        style={{ maxHeight: "100px" }}
                        className="crop-image"
                      />
                    </td>
                    <td>
                      {ad.entryTime
                        ? convertEpochMsToDateTime(ad.entryTime)
                        : "    "}
                    </td>
                    <td>
                      {ad.exitTime
                        ? convertEpochMsToDateTime(ad.exitTime)
                        : "    "}
                    </td>
                    <td>
                      {ad.parkingTime
                        ? convertMiliSecondsToDistanceTime(ad.parkingTime)
                        : "    "}
                    </td>
                    <td>{ad.note ? ad.note : "  "}</td>
                    <td>
                      <EditNoteIcon
                        style={{ color: "gray" }}
                        className="clickable"
                        onClick={() => {
                          handleEditNot(ad);
                        }}
                      />
                      <ReadMoreRoundedIcon
                        style={{ marginLeft: "20px" }}
                        className="read-more-icon clickable"
                        onClick={() => handleOpenModal(ad)} // Mở modal khi nhấp vào icon
                      />
                      <DeleteForeverRoundedIcon
                        style={{ color: "red", marginLeft: "20px" }}
                        className="clickable"
                        onClick={() => {
                          handleDeleteVehicle(ad.licensePlate);
                        }}
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
        open={openDetailModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-box">
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            style={{ color: "#ff0000", marginBottom: "1rem" }}
          >
            Chi tiết thông tin
          </Typography>
          {selectedAd && (
            <div className="modal-content">
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Biển số xe
                      </TableCell>
                      <TableCell>{selectedAd.license_plate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Thời gian vào
                      </TableCell>
                      <TableCell>
                        {convertEpochMsToDateTime(selectedAd.entryTime)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Thời gian ra
                      </TableCell>
                      <TableCell>
                        {selectedAd.exitTime
                          ? convertEpochMsToDateTime(selectedAd.exitTime)
                          : "    "}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Thời gian đỗ
                      </TableCell>
                      <TableCell>
                        {selectedAd.entryTime && selectedAd.exitTime
                          ? convertMiliSecondsToDistanceTime(
                              selectedAd.parkingTime
                            )
                          : "    "}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab
                  label="VÀO"
                  disabled={
                    !isValidImage(selectedAd.enter_cropUrl) &&
                    !isValidImage(selectedAd.enter_fullUrl)
                  }
                />
                <Tab
                  label="RA"
                  disabled={
                    !isValidImage(selectedAd.exit_cropUrl) &&
                    !isValidImage(selectedAd.exit_fullUrl)
                  }
                />
              </Tabs>
              {selectedTab === 0 && (
                <div className="modal-images-column">
                  <img
                    src={selectedAd.enter_cropUrl}
                    alt="Enter Crop"
                    className="crop-image"
                  />
                  <img
                    src={selectedAd.enter_fullUrl}
                    alt="Enter Full"
                    className="full-image"
                  />
                </div>
              )}
              {selectedTab === 1 && (
                <div className="modal-images-column">
                  <img
                    src={selectedAd.exit_cropUrl}
                    alt="Exit Crop"
                    className="crop-image"
                  />
                  <img
                    src={selectedAd.exit_fullUrl}
                    alt="Exit Full"
                    className="full-image"
                  />
                </div>
              )}
            </div>
          )}
        </Box>
      </Modal>

      <Modal
        id="note-modal"
        open={openNoteModal}
        onClose={() => setOpenNoteModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className="modal-box"
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            gap: 3,
          }}
        >
          <Typography variant="h6" component="h2">
            Ghi chú
          </Typography>
          {selectedAd && (
            <div className="modal-content">
              <TextField
                multiline
                fullWidth
                minRows={10}
                maxRows={20}
                value={selectedAd.note}
                onChange={(e) =>
                  setSelectedAd({ ...selectedAd, note: e.target.value })
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1rem",
                    lineHeight: 1.5,
                  },
                }}
              />

              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                style={{ marginTop: "20px" }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setOpenNoteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log("Ghi chú đã được cập nhật:", selectedAd.note);
                    // Gửi yêu cầu cập nhật ghi chú
                  }}
                  disabled={!selectedAd.note.trim()}
                >
                  Lưu thay đổi
                </Button>
              </Stack>
            </div>
          )}
        </Box>
      </Modal>

      <Modal
        id="export-modal"
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className="modal-box"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 1,
          }}
        >
          <Typography
            id="export-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 3 }}
            style={{ color: "#ff0000", marginBottom: "1rem" }}
          >
            Xuất Excel 
          </Typography>
          <TextField
            fullWidth
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Nhập tên file"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={6}>
              <div style={{ width: "100%" , marginBottom : '20px'}}>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  locale={vi}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn khoảng thời gian"
                  isClearable
                  customInput={
                    <TextField fullWidth size="small" sx={{ mb: 1 , width : 270 , height : 37 , marginTop : 1 }} />
                  }
                />
              </div>

              <ExcelExportButton
                data={transactionData}
                startTime={startDate}
                endTime={endDate}
                filename={fileName}
                buttonTitle={"Xuất trong thời gian trên"}
                buttonVariant="contained"
                buttonColor="primary"
                disabled={!startDate || !endDate}
                />
           
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              <ExcelExportButton
                data={transactionData}
                filename={fileName}
                startTime={null}
                endTime={null}
                buttonTitle={"Xuất toàn bộ"}
                buttonVariant="outlined"
                buttonColor="secondary"
                disabled={false}
                />
             
             <ExcelExportButton
                data={transactionData}
                filename={fileName}
                // currentDateTime  
                startTime={todayStartEpoch}
                endTime={todayEndEpoch}
                buttonTitle={"Xuất dữ liệu hôm nay"}
                buttonVariant="outlined"
                buttonColor="success"
                disabled={false}
                />

             
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={() => setOpenExportModal(false)}>Hủy</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Motor;
