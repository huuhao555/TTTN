import React from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";

const ProductDetail = () => {
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className="product-detail">
      <div className="product-detail__image">
        <img
          src={product?.imageUrls?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
        />
      </div>
      <div className="product-detail__info">
        <h2 className="product-detail__title">{product.name}</h2>
        <p className="product-detail__price">
          Giá: <span>{product?.prices?.toLocaleString("vi-VN")} đ</span>
        </p>
        {product.discount > 0 && (
          <p className="product-detail__discount">
            Giảm giá: <span>{product.discount}%</span>
          </p>
        )}
        <p className="product-detail__description">
          {product.description || "Không có mô tả sản phẩm."}
        </p>
        <p className="product-detail__stock">
          Số lượng còn lại: {product.quantityInStock}
        </p>
        <div className="product-detail__actions">
          <button>Mua ngay</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
