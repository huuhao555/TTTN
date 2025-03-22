import React, { useState, useEffect, useContext } from "react";
import "./style.scss";
import { apiLink } from "../../../config/api";
import { UserContext } from "../../../middleware/UserContext";

const ProductAll = () => {
  const { dataUser } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20); // Hiển thị 20 sản phẩm ban đầu

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
    setVisibleCount((prev) => prev + 10); // Tải thêm 10 sản phẩm
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
      console.log(result);
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
        <div className="productsPage">
          <h1 className="title">Tất cả sản phẩm</h1>
          <div className="productsGrid">
            {products.slice(0, visibleCount).map((product) => (
              <div key={product?._id} className="productCard">
                <div className="shopName">{product?.shopId?.name}</div>
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
                  <button
                    className="buyButton"
                    onClick={() => handleBuyProduct(product)}
                  >
                    Mua ngay
                  </button>
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
      </div>
    </div>
  );
};

export default ProductAll;
