import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { UserContext } from "../../../../middleware/UserContext";
import { useLocation } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaStar,
  FaUserCheck,
  FaCommentDots
} from "react-icons/fa";
import { apiLink } from "../../../../config/api";
import ChatBoxComponent from "../../../../components/chatShop/index";
const DetailShop = () => {
  const { dataUser, updateCartCount } = useContext(UserContext);
  const location = useLocation();
  const { shopId } = location.state || {};
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  console.log(dataUser?.dataUser);

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch(`${apiLink}/api/cart/add-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${dataUser?.access_token}}`
        },
        body: JSON.stringify({
          userId: dataUser?.dataUser?.id, // ID user (tuỳ chỉnh nếu cần)
          productId: product?._id,
          quantity: 1 // Mặc định 1 sản phẩm
        })
      });

      if (!response.ok) throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng!");

      const dataCart = await response.json();

      const totalProducts = Object.values(dataCart?.data?.groupedByShop).reduce(
        (total, shop) => total + shop.length,
        0
      );
      updateCartCount(totalProducts);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  useEffect(() => {
    if (!shopId) return;

    const fetchShopData = async () => {
      try {
        const shopRes = await fetch(
          `http://localhost:3001/api/shop/get-shop/${shopId}`
        );
        const shopData = await shopRes.json();
        setShop(shopData);
        console.log(shopData);

        const productsRes = await fetch(
          `http://localhost:3001/api/product/getAllByShop/${shopId}`
        );
        const productsData = await productsRes.json();
        console.log(productsData);
        setProducts(productsData?.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchShopData();
  }, [shopId]);

  if (!shop) return <div className="loading">Đang tải...</div>;

  return (
    <div className="detail-shop">
      <div className="banner">
        <div className="shop-info">
          <div className="shop-logo">
            <img
              src={shop?.logo || "https://picsum.photos/200"}
              alt="Shop Logo"
            />
          </div>
          <div className="shop-details">
            <h2>{shop?.data?.name}</h2>
            <p>{shop?.data?.description || "Chưa có mô tả"}</p>
          </div>
          <div className="shop-actions">
            <button className="follow-btn">+ Theo dõi</button>
            <button className="chat-btn" onClick={() => setIsChatOpen(true)}>
              <i className="fas fa-comment-dots"></i> Chat
            </button>
          </div>
        </div>
      </div>

      <div className="shop-stats">
        <div className="stat-item">
          <FaBox />{" "}
          <span>
            Sản Phẩm: <b>{products?.length || 0}</b>
          </span>
        </div>
        <div className="stat-item">
          <FaUsers />{" "}
          <span>
            Người Theo Dõi: <b>{shop?.followers || "0"}</b>
          </span>
        </div>
        <div className="stat-item">
          <FaUserCheck />{" "}
          <span>
            Đang Theo: <b>{shop?.following || 0}</b>
          </span>
        </div>
        <div className="stat-item">
          <FaStar />{" "}
          <span>
            Đánh Giá:{" "}
            <b>
              {shop?.rating || "0"} ({shop?.reviews || 0} đánh giá)
            </b>
          </span>
        </div>
        <div className="stat-item">
          <FaCommentDots />{" "}
          <span>
            Tỉ Lệ Phản Hồi Chat: <b>{shop?.chatResponse || "0%"}</b>
          </span>
        </div>
      </div>

      <div className="shop-products">
        <h3>Sản phẩm của cửa hàng</h3>
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product?._id} className="product-card">
                <img
                  src={
                    product?.imageUrls[0] || "https://via.placeholder.com/200"
                  }
                  alt={product?.name}
                />
                <h4>{product?.name}</h4>
                <p className="price">
                  {product?.prices?.toLocaleString("VN-vi")} đ
                </p>
                <button
                  className="buy-btn"
                  onClick={() => {
                    handleAddToCart(product);
                  }}
                >
                  Mua ngay
                </button>
              </div>
            ))
          ) : (
            <p className="no-products">Chưa có sản phẩm nào.</p>
          )}
        </div>
      </div>
      {isChatOpen && (
        <ChatBoxComponent
          shopId={shop?.data?._id}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default DetailShop;
