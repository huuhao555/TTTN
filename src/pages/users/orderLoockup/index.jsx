import React, { useState } from "react";
import "./style.scss";
import { apiLink } from "../../../config/api";
const OrderLookup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);

  const handlePriceRange = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`${apiLink}/api/order/get/${id}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data);
      const orderData = data.data;

      // Nhóm sản phẩm theo shopId
      const groupedProducts = orderData.products.reduce((acc, product) => {
        console.log(product);
        const shopId = product?.productId?.shop?._id || "unknown";
        if (!acc[shopId]) {
          acc[shopId] = {
            shopName: product?.productId?.shopId || "Shop không xác định",
            products: []
          };
        }
        acc[shopId].products.push(product);
        return acc;
      }, {});

      setSearchTerm(orderData?._id);
      setOrderInfo({
        buyerName: orderData.name,
        address: orderData.shippingAddress,
        orderNumber: orderData._id,
        products: groupedProducts, // Lưu danh sách nhóm sản phẩm vào state
        totalAmount: orderData.totalPrice,
        orderDate: orderData.createdAt,
        status: orderData.status
      });
    } catch (error) {
      alert("Tra cứu đơn hàng thất bại");
    }
  };

  return (
    <div className="order-lookup">
      <h2>Tra cứu đơn hàng</h2>
      <input
        type="text"
        placeholder="Nhập mã đơn hàng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => handlePriceRange(searchTerm)}>Tra cứu</button>

      {orderInfo && (
        <div className="order-details">
          <h3>Thông tin đơn hàng</h3>
          <p>
            <strong>Người nhận:</strong> {orderInfo.buyerName}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {orderInfo.address}
          </p>
          <p>
            <strong>Mã đơn hàng:</strong> {orderInfo.orderNumber}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {orderInfo.totalAmount.toLocaleString("vi-VN")} ₫
          </p>
          <p>
            <strong>Ngày đặt hàng:</strong>{" "}
            {new Date(orderInfo.orderDate).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Trạng thái:</strong> {orderInfo.status}
          </p>

          <div className="order-products">
            <h3>Chi tiết sản phẩm</h3>
            {Object.keys(orderInfo.products).length > 0 ? (
              Object.entries(orderInfo.products).map(([shopId, shopData]) => (
                <div key={shopId} className="shop-group">
                  <h4>{shopData.shopName}</h4>
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Hình sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Tổng giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shopData.products.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              style={{
                                width: "100px",
                                height: "auto",
                                objectFit: "contain"
                              }}
                              src={product?.productId?.imageUrls[0]}
                              alt={product?.productId?.name}
                            />
                          </td>
                          <td>{product?.productId?.name}</td>
                          <td>{product?.quantity}</td>
                          <td>
                            {parseInt(product?.productId?.prices) ===
                            product?.productId?.promotionPrice ? (
                              <div className="grp-price">
                                <p className="prices">
                                  {`${parseInt(
                                    product?.productId?.prices
                                  ).toLocaleString("vi-VN")} ₫`}
                                </p>
                              </div>
                            ) : (
                              <div className="grp-price">
                                <p className="price-old">
                                  {`${parseInt(
                                    product?.productId?.prices
                                  ).toLocaleString("vi-VN")} ₫`}
                                </p>
                                <div className="grp-price-new">
                                  <p className="price-new">
                                    {`${parseInt(
                                      product?.productId?.promotionPrice
                                    ).toLocaleString("vi-VN")} ₫`}
                                  </p>
                                  <p className="discount">
                                    {`-${product?.productId?.discount}%`}
                                  </p>
                                </div>
                              </div>
                            )}
                          </td>
                          <td
                            style={{
                              fontWeight: "bold",
                              color: "#ffd500",
                              fontSize: "18px"
                            }}
                          >
                            {(
                              product?.quantity *
                              product?.productId?.promotionPrice
                            ).toLocaleString("vi-VN")}{" "}
                            ₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLookup;
