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

  const searchParams = new URLSearchParams(location.search);
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const orderInfo = searchParams.get("vnp_OrderInfo");

  const fetchOrderStatus = async (isSuccess) => {
    try {
      const response = await fetch(apiLink + `/api/payments/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: orderInfo,
          isSuccess
        })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      alert("Cập nhật trạng thái thanh toán thất bại");
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(apiLink + `/api/order/get/${orderInfo}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setOrderDetails(data.data);
    } catch (error) {
      alert("Tra cứu đơn hàng thất bại");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (orderInfo && transactionStatus) {
        const isSuccess = transactionStatus === "00";
        await fetchOrderStatus(isSuccess);
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
  const toggleOrderVisibility = (orderId) => {
    setVisibleOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  console.log(isPaid);
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

                <h3>Sản phẩm đã đặt</h3>
                <span
                  style={{
                    fontSize: "16px",
                    fontStyle: "italic"
                  }}
                >
                  {` (${orderDetails?.products?.length} sản phẩm)`}
                </span>
                <AiOutlineDownCircle
                  className="icon-down"
                  onClick={() => toggleOrderVisibility(_id)}
                />
                {visibleOrders[_id] && (
                  <div className="products-list">
                    {products.map((product) => (
                      <div className="product-item" key={product?._id}>
                        <img
                          src={product?.productId.imageUrl}
                          alt={product?.productId.name}
                        />
                        <div className="product-info">
                          <p>
                            <strong>{product?.productId?.name}</strong>
                          </p>
                          <p>Số lượng: {product?.quantity}</p>
                          <p>
                            Giá:{" "}
                            {parseInt(
                              product?.productId?.promotionPrice
                            )?.toLocaleString("vi-VN")}{" "}
                            VND
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3>Chi tiết thanh toán</h3>
                <div className="payment-details">
                  <p>
                    <strong>Tổng tiền sản phẩm:</strong>{" "}
                    {parseInt(totalPrice)?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {parseInt(shippingFee)?.toLocaleString("vi-VN")} VND
                  </p>
                  <p>
                    <strong>VAT:</strong>{" "}
                    {parseInt(VAT)?.toLocaleString("vi-VN")} VND
                  </p>
                  <p className="order-total">
                    <strong>Tổng thanh toán:</strong>{" "}
                    {parseInt(orderTotal)?.toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>

              <button
                className="done-button-detail"
                onClick={() => navigate(ROUTERS.USER.HOME)}
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
