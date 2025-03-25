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
  const [visibleOrders, setVisibleOrders] = useState({});

  // Lấy tham số từ URL
  const searchParams = new URLSearchParams(location.search);
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const orderInfo = searchParams.get("vnp_OrderInfo");
  const totalOrderPrice = orderDetails?.reduce(
    (acc, order) => acc + order.orderTotal,
    0
  );
  const totalOrderPriceProduct = orderDetails?.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );
  const totalOrderVAT = orderDetails?.reduce(
    (acc, order) => acc + order.VAT,
    0
  );
  const totalOrderShip = orderDetails?.reduce(
    (acc, order) => acc + order.shippingFee,
    0
  );
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
      setOrderDetails(data.data);
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
            <div className="payment-card-detail">
              <div className="payment-status-icon-detail">
                {transactionStatus === "00" ? (
                  <div className="checkmark-detail">
                    <BsFillCheckCircleFill />
                  </div>
                ) : (
                  <i className="error-icon-detail">❌</i>
                )}
              </div>
              <h2>
                {transactionStatus === "00"
                  ? "Thanh toán thành công!"
                  : "Thanh toán thất bại!"}
              </h2>

              {/* Thông tin đơn hàng */}
              <div className="order-summary">
                <h3>Thông tin đơn hàng</h3>
                <div className="order-detail">
                  <p>
                    <strong>Tên khách hàng:</strong> {name}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Mã đơn hàng:</strong> {orderInfo}
                  </p>
                  <p>
                    <strong>Địa chỉ giao hàng:</strong> {shippingAddress}
                  </p>
                  <p>
                    <strong>Trạng thái đơn hàng:</strong> {status}
                  </p>
                  <p>
                    <strong>Tình trạng đơn hàng:</strong>{" "}
                    {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </p>
                </div>

                {/* Danh sách sản phẩm */}
                <h3>Sản phẩm đã đặt</h3>
                <span style={{ fontSize: "16px", fontStyle: "italic" }}>
                  {` (${orderDetails.length} đơn hàng)`}
                </span>
                {orderDetails.map((order) => (
                  <div key={order._id} className="order-container">
                    <h3>Đơn hàng: {order._id}</h3>
                    <p>
                      <strong>Người nhận:</strong> {order.name} |{" "}
                      <strong>SDT:</strong> {order.phone}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {order.shippingAddress}
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong>{" "}
                      {order.orderTotal.toLocaleString("vi-VN")} VND
                    </p>

                    <div className="products-list">
                      {order.products.map((product) => {
                        console.log(product.productId.imageUrls[0]);
                        return (
                          <div
                            key={product.productId._id}
                            className="product-item"
                          >
                            <img
                              src={product.productId.imageUrls[0]}
                              alt={product.productId.name}
                            />
                            <div className="product-info">
                              <p>
                                <strong>{product.productId.name}</strong>
                              </p>
                              <p>Số lượng: {product.quantity}</p>
                              <p>
                                Giá: {product.price.toLocaleString("vi-VN")} VND
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Chi tiết thanh toán */}
                <h3>Chi tiết thanh toán</h3>
                <div className="payment-details">
                  <p>
                    <strong>Tổng tiền sản phẩm:</strong>{" "}
                    {parseInt(totalOrderPriceProduct)?.toLocaleString("vi-VN")}{" "}
                    VND
                  </p>
                  <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {parseInt(totalOrderShip)?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>VAT:</strong>{" "}
                    {parseInt(totalOrderVAT)?.toLocaleString("vi-VN")} VND
                  </p>
                  <p className="order-total">
                    <strong>Tổng thanh toán:</strong>{" "}
                    {parseInt(totalOrderPrice)?.toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>

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
    </div>
  );
};

export default PaymentDetailPage;
