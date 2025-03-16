import React, { useState, useEffect } from "react";
import "./style.scss";
import { apiLink } from "../../config/api";

const ProductAllComponent = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Hiển thị 4 hàng (5 sp/hàng)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        const data = await response.json();
        setProducts(data?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10); // Tải thêm 2 hàng
  };

  return (
    <div className="productsPage">
      <h1 className="title">Tất cả sản phẩm</h1>
      <div className="productsGrid">
        {products.slice(0, visibleCount).map((product) => (
          <div key={product?.id} className="productCard">
            <img
              src={product?.imageUrls[0]}
              alt={product?.name}
              className="productImage"
            />
            <div className="productInfo">
              <h2 className="productName">{product?.name}</h2>
              <p className="productPrice">
                {product?.prices?.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < products.length && (
        <button className="loadMoreButton" onClick={handleLoadMore}>
          Xem thêm
        </button>
      )}
    </div>
  );
};

export default ProductAllComponent;
