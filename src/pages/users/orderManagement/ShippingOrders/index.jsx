import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../middleware/UserContext";
import "../style.scss";
import { AiOutlineDownCircle } from "react-icons/ai";

import { apiLink } from "../../../../config/api";
import SuccessAnimation from "../../../../components/Success";

const ShippingOrders = () => {
  const [orders, setOrders] = useState([]);
  const { dataUser } = useContext(UserContext) || {};

  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [visibleOrders, setVisibleOrders] = useState({});
  useEffect(() => {
    const fetchPendingOrders = async () => {
      const userId = dataUser?.dataUser?.id;

      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        const response = await fetch(
          apiLink + `/api/order/getAllByOrder/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log(data);
        setOrders(data?.data.filter((order) => order.status === "Shipped"));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchPendingOrders();
  }, [dataUser]);

  const toggleOrderVisibility = (orderId) => {
    setVisibleOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  const handleConfirmOrder = async (id) => {
    try {
      const response = await fetch(apiLink + `/api/order/deliver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderId: id, shopId: 1 })
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }
      setMessage("Huỷ đơn hàng thành công");
      setTrigger(true);
      await response.json();
      setTimeout(() => {
        setTrigger(false);
      }, 1000);
      const userId = dataUser?.dataUser?.id;
      const updatedOrdersResponse = await fetch(
        apiLink + `/api/order/getAll/${userId}`
      );

      if (!updatedOrdersResponse.ok) {
        throw new Error("Failed to fetch updated orders");
      }

      const updatedOrders = await updatedOrdersResponse.json();
      setOrders(
        updatedOrders?.data.filter((order) => order.status === "Shipped")
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };
  return (
    <div className="order-list-container">
      {orders.length > 0 ? (
        orders.map((order) => {
          const grandTotal =
            order.totalPrice + parseInt(order.VAT) + order.shippingFee;
          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Đơn hàng #{order._id}</h3>
                  <p>Người nhận: {order?.name}</p>
                  <p>Địa chỉ: {order?.shippingAddress}</p>
                  <p>SĐT: {order?.phone}</p>
                  <p>
                    Trạng thái:{" "}
                    <span className={`status ${order.status}`}>
                      {order?.status}
                    </span>
                  </p>
                  <p>
                    Tình trạng:{" "}
                    {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </p>
                </div>

                <button
                  className="btn-accept"
                  onClick={() => handleConfirmOrder(order._id)}
                >
                  Nhận đơn hàng
                </button>
              </div>

              <div className="order-details-user">
                <h4>Chi tiết đơn hàng ({order?.products?.length} sản phẩm)</h4>
                <AiOutlineDownCircle
                  className="icon-toggle"
                  onClick={() => toggleOrderVisibility(order._id)}
                />
                {visibleOrders[order._id] && (
                  <div className="product-list">
                    {order?.products?.map((item, index) => {
                      console.log(item?.productId);
                      return (
                        <div
                          key={item?.productId?._id}
                          className="product-item"
                        >
                          <img
                            src={
                              item?.productId?.imageUrls[0] || "/fallback.jpg"
                            }
                            alt={item?.productId?.name}
                          />
                          <div className="product-info">
                            <p className="product-name">
                              {item?.productId?.name}
                            </p>
                            <p>Số lượng: {item?.quantity}</p>
                            <p className="price-container">
                              <span className="original-price">
                                {parseInt(
                                  item?.productId?.prices
                                ).toLocaleString("vi-VN")}{" "}
                                ₫
                              </span>
                              <span className="discount-badge">
                                -{item?.productId?.discount}%
                              </span>
                              <span className="promotion-price">
                                {parseInt(
                                  item?.productId?.promotionPrice
                                ).toLocaleString("vi-VN")}{" "}
                                ₫
                              </span>
                            </p>

                            <p className="total">
                              Tổng:{" "}
                              {(
                                item?.productId?.promotionPrice * item.quantity
                              ).toLocaleString("vi-VN")}{" "}
                              ₫
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="order-summary">
                <h4>Chi tiết thanh toán</h4>
                <p>
                  Tổng tiền hàng:{" "}
                  <span>{order.totalPrice.toLocaleString("vi-VN")} ₫</span>
                </p>
                <p>
                  VAT:{" "}
                  <span>{parseInt(order.VAT).toLocaleString("vi-VN")} ₫</span>
                </p>
                <p>
                  Chi phí vận chuyển:{" "}
                  <span>{order.shippingFee.toLocaleString("vi-VN")} ₫</span>
                </p>
                <p>
                  Tổng cộng: <span>{grandTotal.toLocaleString("vi-VN")} ₫</span>
                </p>
                <p>
                  Voucher người dùng:{" "}
                  <span>
                    {((1 - order?.orderTotal / grandTotal) * 100).toFixed(2)}% (
                    {parseInt(grandTotal - order?.orderTotal).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫)
                  </span>
                </p>
                <p className="final-price">
                  Thành tiền:{" "}
                  <span>
                    {parseInt(order?.orderTotal).toLocaleString("vi-VN")} ₫
                  </span>
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-orders">Không có đơn hàng nào đang xử lý.</p>
      )}
      <SuccessAnimation message={message} trigger={trigger} />
    </div>
  );
};

export default ShippingOrders;
