import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { BsStarFill } from "react-icons/bs";
import { apiLink } from "../../../config/api";
import { UserContext } from "../../../middleware/UserContext";
import { ROUTERS } from "../../../utils";

const ProductListAdmin = () => {
  const { dataUser, updateCartCount } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        const data = await response.json();

        console.log(data);
        setProducts(data?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    if (visibleCount + 9 >= products.length) {
      navigate(ROUTERS.USERS.PRODUCT_ALL);
    } else {
      setVisibleCount((prev) => prev + 9);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="admin-product-list-page">
          <div className="admin-product-grid">
            {products.slice(0, visibleCount).map((product) => (
              <div key={product?._id} className="admin-product-card">
                <Link
                  to={`${ROUTERS.USERS.PRODUCT_DETAIL}/${product?._id}`}
                  className="admin-product-link"
                >
                  <div className="admin-product-shop">
                    {product?.shopId?.name}
                  </div>
                  <img
                    src={product?.imageUrls[0]}
                    alt={product?.name}
                    className="admin-product-image"
                  />
                  <div className="admin-product-info">
                    <h2 className="admin-product-name">{product?.name}</h2>
                    <div className="admin-product-pricing">
                      <span className="admin-new-price">
                        {product?.promotionPrice?.toLocaleString("vi-VN")} VND
                      </span>
                      {product?.promotionPrice &&
                        product?.promotionPrice < product?.prices && (
                          <>
                            <span className="admin-old-price">
                              {product?.prices?.toLocaleString("vi-VN")} VND
                            </span>
                            <span className="admin-discount">
                              -
                              {Math.round(
                                ((product.prices - product.promotionPrice) /
                                  product.prices) *
                                  100
                              )}
                              %
                            </span>
                          </>
                        )}
                    </div>
                  </div>
                </Link>
                <div className="admin-icon-star">
                  <span>{(product?.averageRating).toFixed(1)}</span>
                  <BsStarFill />
                </div>
              </div>
            ))}
          </div>
          {visibleCount < products.length && (
            <button
              className="admin-product-load-more"
              onClick={handleLoadMore}
            >
              Xem thêm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListAdmin;
