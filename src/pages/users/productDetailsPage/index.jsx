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

const ProductDetails = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(img);
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();
  const { dataUser } = useContext(UserContext);
  const [shop, setShop] = useState(null);

  const addToHistory = (product) => {
    if (!product) return;

    try {
      let history = JSON.parse(sessionStorage.getItem("viewedProducts")) || [];
      history = history.filter((item) => item._id !== product._id);
      history.unshift({
        _id: product._id,
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

      // Log dữ liệu trước khi gửi đi để kiểm tra
      console.log("Sending data:", {
        userId: dataUser?.dataUser?.id,
        productId: product?._id,
        quantity: 1,
        prices: product?.prices
      });

      const response = await fetch(`${apiLink}/api/cart/add-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${dataUser.access_token}`
        },
        body: JSON.stringify({
          userId: dataUser?.dataUser?.id,
          productId: product?._id,
          quantity: 1 // Đảm bảo đây là số
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng!");
      }

      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  console.log(shop);
  return (
    <div className="container">
      <div className="product-details ">
        <div className="product-container">
          <div className="product-image-section">
            <img
              className="main-image"
              src={selectedImage}
              alt={product?.name}
            />
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
          <div className="product-info-section">
            <h1 className="product-title">{product?.name}</h1>
            <p className="product-price">
              {product?.prices?.toLocaleString() || 0} đ
            </p>
            <p className="product-description">
              {product?.description || "Không có mô tả"}
            </p>
            <div className="product-actions">
              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart"
              >
                Thêm vào giỏ hàng
              </button>
              <button className="buy-now">Mua ngay</button>
            </div>
          </div>
        </div>
      </div>
      <div className="shop-info-card">
        <div className="shop-avatar">
          <img src="https://via.placeholder.com/80" alt="Shop Avatar" />
        </div>
        <div className="shop-details">
          <h3 className="shop-name">{product?.shopId?.name}</h3>
          <p className="shop-status">Online 5 Giờ Trước</p>
          <div className="shop-actions">
            <button className="chat-button">💬 Chat Ngay</button>
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
        <div className="shop-stats">
          <div className="stat-item">
            <FaBox />{" "}
            <span>
              Sản Phẩm: <b>{product?.length || 0}</b>
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
      </div>
    </div>
  );
};

export default ProductDetails;
