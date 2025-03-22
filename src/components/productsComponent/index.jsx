import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { apiLink } from "../../config/api";
import { UserContext } from "../../middleware/UserContext";
import { ROUTERS } from "../../utils";

const ProductList = () => {
  const { dataUser } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

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
    if (visibleCount + 15 >= products.length) {
      navigate(ROUTERS.USERS.PRODUCT_ALL);
    } else {
      setVisibleCount((prev) => prev + 15);
    }
  };

  const handleBuyProduct = async (product) => {
    if (!dataUser) {
      alert("Bạn cần đăng nhập để mua hàng!");
      return;
    }

    try {
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

      const result = await response.json();
      if (result.status === "OK") {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        alert("Lỗi khi thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi mua sản phẩm:", error);
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="product-list-page">
          <h1 className="product-title">Tất cả sản phẩm</h1>
          <div className="product-grid">
            {products.slice(0, visibleCount).map((product) => (
              <div key={product?._id} className="product-card">
                <Link
                  to={`${ROUTERS.USERS.PRODUCT_DETAIL}/${product?._id}`}
                  className="product-link"
                >
                  <div className="product-shop">{product?.shopId?.name}</div>
                  <img
                    src={product?.imageUrls[0]}
                    alt={product?.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h2 className="product-name">{product?.name}</h2>
                    <p className="product-price">
                      {product?.prices?.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                </Link>
                <button
                  className="product-buy-button"
                  onClick={() => handleBuyProduct(product)}
                >
                  Mua ngay
                </button>
              </div>
            ))}
          </div>
          {visibleCount < products.length && (
            <button className="product-load-more" onClick={handleLoadMore}>
              Xem thêm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
