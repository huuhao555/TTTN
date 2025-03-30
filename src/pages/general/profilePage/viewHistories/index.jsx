import React, { useEffect, useState } from "react";
import "./style.scss";

const getViewedProducts = () => {
  return JSON.parse(sessionStorage.getItem("viewedProducts")) || [];
};

const ViewHistories = () => {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    setViewedProducts(getViewedProducts());
  }, []);

  return (
    <div className="view-histories-container">
      <h2>Sản phẩm đã xem</h2>
      {viewedProducts.length === 0 ? (
        <p className="empty-message">Chưa có sản phẩm nào được xem.</p>
      ) : (
        <div className="product-list">
          {viewedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.imageUrl[0]}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  {product.prices?.toLocaleString()}đ
                </p>
              </div>
              <button className="buy-now">Mua ngay</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewHistories;
