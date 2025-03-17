import { memo, useContext, useEffect, useState, useCallback } from "react";
import "./style.scss";
import { ROUTERS } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../middleware/UserContext";
import { apiLink } from "../../../config/api";

const CartPage = () => {
  const navigate = useNavigate();
  const { dataUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataUser?.dataUser?.id) fetchCart();
  }, [dataUser?.dataUser?.id]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiLink}/api/cart/get-cart/${dataUser?.dataUser?.id}`
      );
      if (!res.ok) throw new Error("Không thể lấy giỏ hàng!");
      const data = await res.json();
      setCartItems(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = useCallback(
    async (productId) => {
      try {
        await fetch(`${apiLink}/api/cart/delete-item`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: dataUser?.dataUser?.id, productId })
        });
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId._id !== productId)
        );
      } catch (err) {
        console.error("Lỗi khi xoá sản phẩm:", err);
      }
    },
    [dataUser]
  );

  const groupedProducts = cartItems.reduce((acc, item) => {
    const shopId = item.productId.shopId._id;
    if (!acc[shopId]) {
      acc[shopId] = {
        shopName: item.productId.shopId.name,
        products: []
      };
    }
    acc[shopId].products.push(item);
    return acc;
  }, {});
  const ShopSection = ({ shop, onDelete }) => (
    <div className="shop-section">
      <h3>{shop.shopName}</h3>
      <div className="cart-items">
        {shop.products.map((item) => (
          <CartItem key={item._id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );

  const CartItem = ({ item, onDelete }) => (
    <div className="cart-item">
      <img src={item?.productId?.imageUrls?.[0]} alt={item?.productId?.name} />
      <div className="cart-details">
        <h3>{item?.productId?.name}</h3>
        <p>Giá: {item?.productId?.prices.toLocaleString()} đ</p>
        <p>Số lượng: {item.quantity}</p>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(item.productId._id)}
      >
        ❌
      </button>
    </div>
  );

  const CartActions = ({ onClear, onCheckout }) => (
    <div className="cart-actions">
      <button className="clear-cart" onClick={onClear}>
        Xoá toàn bộ giỏ hàng
      </button>
      <button className="checkout" onClick={onCheckout}>
        Thanh toán
      </button>
    </div>
  );

  const EmptyCart = ({ onShopNow }) => (
    <div className="empty-cart">
      <img
        src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        alt="not-found-product-cart"
      />
      <p>Không có sản phẩm trong giỏ hàng.</p>
      <button onClick={onShopNow}>Mua Sắm Ngay</button>
    </div>
  );
  return (
    <div className="cart-container">
      {loading ? (
        <p className="loading">Đang tải giỏ hàng...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : cartItems.length > 0 ? (
        <div className="cart-content">
          <h2>Giỏ hàng của bạn</h2>
          {Object.entries(groupedProducts).map(([shopId, shop]) => (
            <ShopSection key={shopId} shop={shop} onDelete={handleDeleteItem} />
          ))}
          <CartActions
            onClear={() => setCartItems([])}
            onCheckout={() => navigate(ROUTERS.USERS.CHECKOUT)}
          />
        </div>
      ) : (
        <EmptyCart onShopNow={() => navigate(ROUTERS.USERS.HOME)} />
      )}
    </div>
  );
};

export default memo(CartPage);
