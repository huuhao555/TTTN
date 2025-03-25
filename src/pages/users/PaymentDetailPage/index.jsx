import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.scss";

import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineDownCircle } from "react-icons/ai";
import { apiLink } from "../../../config/api";
import { ROUTERS } from "../../../utils";

const PaymentDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [, setVisibleOrders] = useState({});

  // Lấy tham số từ URL
  const searchParams = new URLSearchParams(location.search);
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const orderInfo = searchParams.get("vnp_OrderInfo");
  const totalOrderPrice = Array.isArray(orderDetails)
    ? orderDetails.reduce((acc, order) => acc + order.orderTotal, 0)
    : 0;

  const totalOrderPriceProduct = Array.isArray(orderDetails)
    ? orderDetails.reduce((acc, order) => acc + order.totalPrice, 0)
    : 0;

  const totalOrderVAT = Array.isArray(orderDetails)
    ? orderDetails.reduce((acc, order) => acc + order.VAT, 0)
    : 0;

  const totalOrderShip = Array.isArray(orderDetails)
    ? orderDetails.reduce((acc, order) => acc + order.shippingFee, 0)
    : 0;

  // Cập nhật trạng thái đơn hàng dựa vào kết quả thanh toán
  const updateOrderStatus = async (isSuccess) => {
    try {
      const orderIds = orderInfo
        ? decodeURIComponent(orderInfo).split(",").filter(Boolean)
        : [];

      const response = await fetch(`${apiLink}/api/payments/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderIds, isSuccess })
      });

      if (!response.ok) throw new Error(response.statusText);
    } catch (error) {
      alert("Cập nhật trạng thái thanh toán thất bại");
    }
  };

  // Lấy chi tiết đơn hàng
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${apiLink}/api/order/get/${orderInfo}`);
      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      console.log(data);
      setOrderDetails(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (error) {
      alert("Tra cứu đơn hàng thất bại");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (orderInfo && transactionStatus) {
        const isSuccess = transactionStatus === "00";
        await updateOrderStatus(isSuccess);
        await fetchOrderDetails();
      }
    };

    fetchData();
  }, [orderInfo, transactionStatus]);

  useEffect(() => {
    console.log("Dữ liệu đơn hàng:", orderDetails);
  }, [orderDetails]);

  if (!orderDetails) {
    return <div className="loading">Đang tải thông tin đơn hàng...</div>;
  }

  const {
    _id,
    products,
    shippingAddress,
    name,
    phone,
    email,
    isPaid,
    orderTotal,
    totalPrice,
    status,
    shippingFee,
    VAT
  } = orderDetails;
  console.log(orderDetails);
  // Hiển thị / Ẩn danh sách sản phẩm của đơn hàng
  const toggleOrderVisibility = (orderId) => {
    setVisibleOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="payment-page-detail">
            <h2>
              {transactionStatus === "00"
                ? "Thanh toán thành công!"
                : "Thanh toán thất bại!"}
            </h2>

            {/* Duyệt từng đơn hàng */}
            {orderDetails.map((order) => (
              <div key={order._id} className="order-box">
                {/* Thông tin đơn hàng */}
                <div className="order-info">
                  <h3>Đơn hàng: {order._id}</h3>
                  <p>
                    <strong>Người nhận:</strong> {order.name} |{" "}
                    <strong>SDT:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
                  </p>
                  <p>
                    <strong>Trạng thái đơn hàng:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Tình trạng thanh toán:</strong>{" "}
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </p>
                </div>

                {/* Danh sách sản phẩm trong đơn */}
                <div className="products-list">
                  <h4>Sản phẩm đã đặt:</h4>
                  {order.products.map((product) => (
                    <div key={product?.productId._id} className="product-item">
                      <img
                        src={product?.productId.imageUrls[0]}
                        alt={product?.productId.name}
                      />
                      <div className="product-info">
                        <p>
                          <strong>{product?.productId.name}</strong>
                        </p>
                        <p>Số lượng: {product?.quantity}</p>
                        <p>
                          Giá: {product?.price?.toLocaleString("vi-VN")} VND
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chi tiết thanh toán */}
                <div className="payment-details">
                  <h4>Chi tiết thanh toán</h4>
                  <p>
                    <strong>Tổng tiền sản phẩm:</strong>{" "}
                    {order.totalPrice?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {order.shippingFee?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>VAT:</strong> {order.VAT?.toLocaleString("vi-VN")}{" "}
                    VND
                  </p>
                  <p className="order-total">
                    <strong>Tổng thanh toán:</strong>{" "}
                    {order.orderTotal?.toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>
            ))}

            {/* Nút quay về trang chủ */}
            <button
              className="done-button-detail"
              onClick={() => navigate(ROUTERS.USERS.HOME)}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
