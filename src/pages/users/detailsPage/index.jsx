import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./style.scss";
import { apiLink } from "../../../config/api";
import img from "../../../assets/users/product/image.png";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(img);
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();
  console.log(id);
  const getDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiLink + `/api/product/get-details/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data.data);
      setProduct(data?.data);
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

  return (
    <div className="product-details">
      <div className="product-container">
        <div className="product-image-section">
          <img className="main-image" src={selectedImage} alt={product?.name} />
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
            <button className="add-to-cart">Thêm vào giỏ hàng</button>
            <button className="buy-now">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
