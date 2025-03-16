import { memo, useContext, useEffect, useState } from "react";
import "./style.scss";
import { ROUTERS } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../middleware/UserContext";
import { apiLink } from "../../../config/api";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dataUser } = useContext(UserContext);

  // Gọi API lấy giỏ hàng
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(
        apiLink + `/api/cart/get-cart/${dataUser?.dataUser?.id}`
      );
      if (!response.ok) throw new Error("Không thể lấy giỏ hàng!");
      const data = await response.json();
      setCartItems(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xoá sản phẩm khỏi giỏ hàng
  const handleDeleteItem = async (productId) => {
    try {
      await fetch(apiLink + `/api/cart/delete-item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: dataUser?.dataUser?.id, productId })
      });
      setCartItems(
        cartItems.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
    }
  };

  // Xoá toàn bộ giỏ hàng
  const handleClearCart = async () => {
    try {
      await fetch(apiLink + `/api/cart/clear-cart/${dataUser?.dataUser?.id}`, {
        method: "DELETE"
      });
      setCartItems([]);
    } catch (err) {
      console.error("Lỗi khi xoá giỏ hàng:", err);
    }
  };

  return (
    <div className="cart-container">
      {loading ? (
        <p className="loading">Đang tải giỏ hàng...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : cartItems.length > 0 ? (
        <div className="cart-content">
          <h2>Giỏ hàng của bạn</h2>
          <div className="cart-items">
            {cartItems.map((item) => {
              console.log(item);
              return (
                <div key={item._id} className="cart-item">
                  <img
                    src={item?.productId?.imageUrls?.[0]}
                    alt={item?.productId?.name}
                  />
                  <div className="cart-details">
                    <h3>{item?.productId?.name}</h3>
                    <p>Giá: {item?.productId?.prices.toLocaleString()} đ</p>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteItem(item.productId._id)}
                  >
                    ❌
                  </button>
                </div>
              );
            })}
          </div>
          <div className="cart-actions">
            <button className="clear-cart" onClick={handleClearCart}>
              Xoá toàn bộ giỏ hàng
            </button>
            <button
              className="checkout"
              onClick={() => navigate(ROUTERS.USERS.CHECKOUT)}
            >
              Thanh toán
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            alt="not-found-product-cart"
          />
          <p>Không có sản phẩm trong giỏ hàng.</p>
          <button onClick={() => navigate(ROUTERS.USERS.HOME)}>
            Mua Sắm Ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(CartPage);
