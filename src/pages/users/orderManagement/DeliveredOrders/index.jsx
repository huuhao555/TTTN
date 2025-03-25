import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../middleware/UserContext";
import "../style.scss";
import { AiOutlineDownCircle } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { apiLink } from "../../../../config/api";
import { ROUTERS } from "../../../../utils";

const CancelledOrders = () => {
  const navigator = useNavigate();
  const [orders, setOrders] = useState([]);
  const { dataUser } = useContext(UserContext) || {};

  const [visibleOrders, setVisibleOrders] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleReview = () => {
    if (!selectedProduct) {
      alert("Vui lòng chọn sản phẩm để đánh giá!");
      return;
    }

    navigator(ROUTERS.USERS.ADD_REVIEW, {
      state: { productId: selectedProduct }
    });
  };
  const toggleOrderVisibility = (orderId) => {
    setVisibleOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
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
        setOrders(data?.data.filter((order) => order.status === "Delivered"));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchPendingOrders();
  }, [dataUser]);

  return (
    <div className="orders-list">
      {orders.length > 0 ? (
        <div>
          {orders?.map((order) => {
            const grandTotal =
              order.totalPrice + parseInt(order.VAT) + order.shippingFee;
            return (
              <div key={order.id} className="order">
                <h2>Thông tin người nhận hàng</h2>
                <p>Tên người nhận: {order?.name}</p>
                <p>Địa chỉ: {order?.shippingAddress}</p>
                <p>Số điện thoại: {order?.phone}</p>
                <p>Trạng thái: {order?.status}</p>
                <p>
                  Tình trạng:{" "}
                  {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </p>
                <p>Mã đơn hàng: {order?._id} </p>
                <h3 className="text-order">
                  Chi tiết đơn hàng
                  <AiOutlineDownCircle
                    className="icon-down"
                    onClick={() => toggleOrderVisibility(order._id)}
                  />
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ffd500",
                      fontStyle: "italic"
                    }}
                  >
                    {` (${order?.products?.length} sản phẩm)`}
                  </span>
                </h3>

                {visibleOrders[order._id] && (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Hình sản phẩm</th>
                          <th>Tên sản phẩm</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Tổng tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.products?.map((item, itemIndex) => (
                          <tr key={item?.productId?._id}>
                            <td>{itemIndex + 1}</td>
                            <td>
                              <img
                                src={item?.productId?.imageUrl}
                                alt={item?.productId?.productName}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "contain"
                                }}
                              />
                            </td>
                            <td>{item?.productId?.name}</td>
                            <td>
                              {" "}
                              {parseInt(item?.productId?.prices) ==
                              item?.productId?.promotionPrice ? (
                                <div className="grp-price">
                                  <p className="prices">
                                    {`${parseInt(
                                      item?.productId?.prices
                                    ).toLocaleString("vi-VN")} ₫`}
                                  </p>
                                </div>
                              ) : (
                                <div className="grp-price">
                                  <p className="price-old">
                                    {`${parseInt(
                                      item?.productId?.prices
                                    ).toLocaleString("vi-VN")} ₫`}
                                  </p>
                                  <div className="grp-price-new">
                                    <p className="price-new">
                                      {`${parseInt(
                                        item?.productId?.promotionPrice
                                      ).toLocaleString("vi-VN")}
                               ₫`}
                                    </p>
                                    <p className="discount">
                                      {`-${item?.productId?.discount}%`}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td>{item?.quantity}</td>
                            <td
                              style={{
                                fontWeight: "bold",
                                color: "#ffd500",
                                fontSize: "16px"
                              }}
                            >
                              {parseInt(
                                item?.productId?.promotionPrice * item.quantity
                              ).toLocaleString("vi-VN")}{" "}
                              ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="product-review-buttons">
                      <select
                        value={selectedProduct || ""}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                      >
                        <option value="" disabled>
                          Chọn sản phẩm
                        </option>
                        {order?.products?.map((item) => {
                          return (
                            <option
                              key={item?._id}
                              value={item?.productId?._id}
                            >
                              {item?.productId?.name}
                            </option>
                          );
                        })}
                      </select>
                      <button className="review-button" onClick={handleReview}>
                        Đánh giá
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-bottom">
                  <h3>Chi tiết thanh toán</h3>
                  <p>
                    Tổng tiền hàng:
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#ffd500",
                        fontSize: "16px"
                      }}
                    >
                      {order.totalPrice?.toLocaleString("vi-VN")} ₫
                    </span>
                  </p>
                  <p>
                    VAT:
                    <span>
                      {parseInt(order.VAT)?.toLocaleString("vi-VN")} ₫
                    </span>
                  </p>
                  <p>
                    Chi phí vận chuyển:
                    <span>{order.shippingFee?.toLocaleString("vi-VN")} ₫</span>
                  </p>
                  <p>
                    Tổng cộng:
                    <span>{`${parseInt(grandTotal).toLocaleString(
                      "vi-VN"
                    )}  ₫`}</span>
                  </p>
                  <div style={{ borderTop: "solid 2px #ccc" }}>
                    <p>
                      Voucher người dùng:
                      <span>
                        {` (-${(
                          (1 - order?.orderTotal / grandTotal) *
                          100
                        )?.toLocaleString("vi-VN")}%) -${parseInt(
                          grandTotal - order?.orderTotal
                        )?.toLocaleString("vi-VN")}`}
                      </span>
                    </p>

                    <p>
                      Thành tiền:
                      <span
                        style={{
                          marginLeft: "10px",
                          fontWeight: "bold",
                          color: "#ffd500",
                          fontSize: "18px",
                          textAlign: "left"
                        }}
                      >
                        {parseInt(order?.orderTotal).toLocaleString("vi-VN")} ₫
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Không có đơn hàng nào đang xử lý.</p>
      )}
    </div>
  );
};

export default CancelledOrders;
