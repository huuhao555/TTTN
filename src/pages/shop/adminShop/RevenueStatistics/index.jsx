// import React, { useEffect, useState } from "react";

// import { Bar } from "react-chartjs-2";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { vi } from "date-fns/locale";
// import "./style.scss";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";
// import { apiLink } from "../../../../../config/api";

// import { memo } from "react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const RevenueStatistics = () => {
//   const [timePeriod, setTimePeriod] = useState("day");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [chartData, setChartData] = useState(null);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [orders, setOrders] = useState([]);
//   // const toVietnamTime = (date) => {
//   //   const offset = 7 * 60 * 60 * 1000;
//   //   return new Date(date.getTime() + offset);
//   // };

//   const formatDate = (date, formatType) => {
//     const vietnamDate = date;
//     if (formatType === "month") return vietnamDate.toISOString().slice(0, 7);
//     return vietnamDate.toISOString().slice(0, 10);
//   };

//   const getWeekRange = (date) => {
//     const vietnamDate = date;
//     const dayOfWeek = vietnamDate.getDay();
//     const startDate = new Date(
//       vietnamDate.getTime() -
//         (dayOfWeek === 0 ? 6 : dayOfWeek - 1) * 24 * 60 * 60 * 1000
//     );
//     const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
//     return { startDate, endDate };
//   };

//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const days = new Date(year, month + 1, 0).getDate();
//     return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
//   };
//   const [totalRevenue, setTotalRevenue] = useState(null);

//   useEffect(() => {
//     const fetchTotalRevenue = async () => {
//       try {
//         const response = await fetch(apiLink + "/api/order/total-revenue");
//         if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu");

//         const data = await response.json();
//         setTotalRevenue(data.totalRevenue);
//       } catch (error) {
//         console.error("Lỗi khi lấy tổng doanh thu:", error);
//       }
//     };

//     fetchTotalRevenue();
//   }, []);
//   const fetchChartData = async () => {
//     try {
//       let body = { status: "Delivered", timePeriod };

//       if (timePeriod === "week") {
//         const { startDate } = getWeekRange(selectedDate);
//         if (!startDate) {
//           console.error("Ngày bắt đầu của tuần không hợp lệ.");
//           return;
//         }
//         body.date = formatDate(startDate, "day");
//       } else if (timePeriod === "month") {
//         body.date = formatDate(selectedDate, "month");
//       } else {
//         body.date = formatDate(selectedDate, "day");
//       }

//       const response = await fetch(apiLink + "/api/order/orders/by-shop", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body)
//       });

//       const data = await response.json();
//       setOrders(data.orders);
//       setTotalOrders(data.totalOrders);
//       setTotalProducts(data.totalProducts);

//       let chartDataset = [];
//       let labels = [];

//       if (timePeriod === "day") {
//         chartDataset = [data.totalAmount, data.totalProducts];
//         labels = ["Doanh thu"];
//       } else if (timePeriod === "week") {
//         const daysInWeek = [
//           "Chủ Nhật",
//           "Thứ Hai",
//           "Thứ Ba",
//           "Thứ Tư",
//           "Thứ Năm",
//           "Thứ Sáu",
//           "Thứ Bảy"
//         ];
//         chartDataset = Array(7).fill(0);

//         data.orders.forEach((order) => {
//           const orderDate = new Date(order.createdAt);
//           const dayOfWeek = orderDate.getDay();
//           chartDataset[dayOfWeek] += order.orderTotal;
//         });

//         labels = daysInWeek;
//       } else if (timePeriod === "month") {
//         const daysInMonth = getDaysInMonth(selectedDate);
//         chartDataset = Array(daysInMonth.length).fill(0);

//         data.orders.forEach((order) => {
//           const orderDate = new Date(order.createdAt);
//           const dayOfMonth = orderDate.getDate() - 1;
//           chartDataset[dayOfMonth] += order.orderTotal;
//         });

//         labels = daysInMonth.map((d) => `Ngày ${d.getDate()}`);
//       }

//       // setChartData({
//       //   labels,
//       //   datasets: [
//       //     {
//       //       label: "Doanh thu",
//       //       data: chartDataset,
//       //       backgroundColor: ["#FF6384"],
//       //       borderWidth: 1
//       //     }
//       //   ]
//       // });
//     } catch (error) {
//       console.error("Lỗi khi fetch dữ liệu:", error);
//     }
//   };

//   useEffect(() => {
//     fetchChartData();
//   }, [timePeriod, selectedDate]);

//   return (
//     <div>
//       <div className="chart-container">
//         <h1 className="total-revenue">{`Tổng Doanh Thu: ${parseInt(
//           totalRevenue
//         )?.toLocaleString("vi-VN")} VNĐ`}</h1>

//         <div className="chart-header">
//           <h2>Thống kê doanh thu</h2>
//           <div className="filters">
//             <select
//               value={timePeriod}
//               onChange={(e) => setTimePeriod(e.target.value)}
//               className="select-timePeriod"
//             >
//               <option value="day">Theo ngày</option>
//               <option value="week">Theo tuần</option>
//               <option value="month">Theo tháng</option>
//             </select>

//             <DatePicker
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               dateFormat={timePeriod === "month" ? "MM/yyyy" : "dd/MM/yyyy"}
//               showMonthYearPicker={timePeriod === "month"}
//               locale={vi}
//               calendarStartDay={1}
//             />
//           </div>
//         </div>

//         <div className="statistics-info">
//           <div className="stat-item">
//             <span>Tổng số đơn hàng</span>
//             <div className="value">{totalOrders}</div>
//           </div>
//           <div className="stat-item">
//             <span>Tổng số sản phẩm</span>
//             <div className="value">{totalProducts}</div>
//           </div>
//         </div>

//         <div className="chart">
//           {chartData ? (
//             <Bar
//               data={chartData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: "top" },
//                   title: { display: true, text: "Biểu đồ thống kê doanh thu" }
//                 }
//               }}
//             />
//           ) : (
//             <p>Đang tải dữ liệu...</p>
//           )}
//         </div>
//       </div>
//       <div className="purchase-table-container">
//         <h2>Danh sách đơn hàng đã mua</h2>
//         <table className="purchase-table">
//           <thead>
//             <tr>
//               <th>Tên khách hàng</th>
//               <th>Sản phẩm</th>
//               <th>Giá</th>
//               <th>Số lượng</th>
//               <th>Tổng cộng</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, index) => {
//               console.log(order);
//               return (
//                 <tr key={index}>
//                   <td>{order?.name}</td>
//                   <td>
//                     {order?.products?.map((product, productIndex) => {
//                       console.log(product);
//                       return (
//                         <div key={productIndex} className="product-info">
//                           <span className="product-name">
//                             {product?.productId?.name}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </td>
//                   <td>
//                     {order?.products?.map((product, productIndex) => {
//                       return (
//                         <div key={productIndex} className="product-info">
//                           <span>
//                             {product?.productId?.promotionPrice?.toLocaleString()}
//                             ₫
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </td>
//                   <td>
//                     {order.products.map((product, productIndex) => (
//                       <div key={productIndex} className="product-info">
//                         <span>{product.quantity}</span>
//                       </div>
//                     ))}
//                   </td>
//                   <td>{order?.orderTotal?.toLocaleString()}₫</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default memo(RevenueStatistics);
