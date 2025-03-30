import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import {
  FaBox,
  FaUsers,
  FaStar,
  FaUserCheck,
  FaCommentDots
} from "react-icons/fa";
import { apiLink } from "../../../config/api";
import img from "../../../assets/users/product/image.png";
import { UserContext } from "../../../middleware/UserContext";
import { ROUTERS } from "../../../utils";
import ChatBoxComponent from "../../../components/chatShop";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(img);
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();

  const { dataUser, updateCartCount } = useContext(UserContext);
  const [shop, setShop] = useState(null);
  const addToHistory = (product) => {
    console.log(product);
    if (!product) return;

    try {
      let history = JSON.parse(sessionStorage.getItem("viewedProducts")) || [];

      const exists = history.some((item) => item.id === product._id);
      if (exists) return;

      history.unshift({
        id: product._id,
        name: product.name,
        imageUrl: product.imageUrls,
        prices: product.prices
      });

      history = history.slice(0, 10);

      sessionStorage.setItem("viewedProducts", JSON.stringify(history));
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };
  const getRandomShopImage = () =>
    `https://picsum.photos/200?random=${Math.random()}`;

  const getDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiLink + `/api/product/get-details/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("Product data:", data.data);
      setProduct(data?.data);
      addToHistory(data?.data);
      setSelectedImage(data?.data?.imageUrls?.[0] || img);
      setError(null);
    } catch (e) {
      setError("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
    window.scrollTo(0, 0);
  }, [id, pathname]);

  if (loading)
    return <div className="loading">Đang tải thông tin sản phẩm...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const handleAddToCart = async (product) => {
    try {
      if (!product || !dataUser) {
        throw new Error("Thông tin sản phẩm hoặc người dùng không hợp lệ!");
      }

      const response = await fetch(`${apiLink}/api/cart/add-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${dataUser.access_token}`
        },
        body: JSON.stringify({
          userId: dataUser?.dataUser?.id,
          productId: product?._id,
          quantity: 1
        })
      });
      const dataCart = await response.json();
      const totalProducts = Object.values(dataCart?.data?.groupedByShop).reduce(
        (total, shop) => total + shop.length,
        0
      );
      updateCartCount(totalProducts);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng!F");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  console.log(shop);
  return (
    <div className="product-detail">
      <div className="product-detail__image">
        <img src={selectedImage} alt={product?.name} className="main-image" />
        {product?.imageUrls?.length > 1 && (
          <div className="thumbnail-list">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={product.name}
                className={`thumbnail ${
                  selectedImage === url ? "selected" : ""
                }`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-detail__info">
        <h1 className="product-title">{product?.name}</h1>
        <p className="product-price">{product?.prices?.toLocaleString()} đ</p>
        <p className="product-description">
          {product?.description || "Không có mô tả"}
        </p>

        <div className="product-actions">
          <button
            onClick={() => handleAddToCart(product)}
            className="add-to-cart"
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="shop-card">
        <div className="shop-card__header">
          <img
            src={getRandomShopImage()}
            alt="Shop Avatar"
            className="shop-avatar"
          />
          <div>
            <h3 className="shop-name">{product?.shopId?.name}</h3>
            <p className="shop-status">🟢 Online 5 giờ trước</p>
          </div>
        </div>

        <div className="shop-card__stats">
          <div className="stat-item">
            <FaBox /> Sản phẩm: <b>{shop?.products || 0}</b>
          </div>
          <div className="stat-item">
            <FaUsers /> Người theo dõi: <b>{shop?.followers || 0}</b>
          </div>
          <div className="stat-item">
            <FaUserCheck /> Đang theo: <b>{shop?.following || 0}</b>
          </div>
          <div className="stat-item">
            <FaStar /> Đánh giá:{" "}
            <b>
              {shop?.rating || 0} ({shop?.reviews || 0} đánh giá)
            </b>
          </div>
          <div className="stat-item">
            <FaCommentDots /> Tỉ lệ phản hồi chat:{" "}
            <b>{shop?.chatResponse || "0%"}</b>
          </div>
        </div>

        <div className="shop-card__actions">
          <button onClick={() => setIsChatOpen(true)} className="chat-button">
            💬 Chat ngay
          </button>
          <button
            className="view-shop-button"
            onClick={() =>
              navigate(ROUTERS.USERS.DETAIL_SHOP, {
                state: { shopId: product?.shopId?._id }
              })
            }
          >
            🏪 Xem Shop
          </button>
        </div>
      </div>
      {isChatOpen && (
        <ChatBoxComponent
          shopId={product?.shopId?._id}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetails;
