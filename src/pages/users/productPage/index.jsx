import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import productImage from "../../../assets/users/product/image.png";
import { apiLink } from "../../../config/api";
import "./style.scss";
import { UserContext } from "../../../middleware/UserContext";

const ProductPage = () => {
  const location = useLocation();
  const { idCategory } = location.state || {};
  const { pathname } = location;

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null); // Thêm state brand đang chọn
  const [selectedOption, setSelectedOption] = useState("");
  const [activeFilter, setActiveFilter] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(20);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = ["Thấp đến Cao", "Cao đến Thấp"];
  const { dataUser } = useContext(UserContext);
  console.log(dataUser);
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

      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${apiLink}/api/category/get-subcategories/${idCategory}`
        );
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách hãng!");
        const data = await response.json();
        setBrands(data.data || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (idCategory) {
      fetchBrands();
    }
  }, [idCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = selectedBrandId
          ? `${apiLink}/api/product/getallproductsub/${selectedBrandId}`
          : `${apiLink}/api/product/getallproducttype/${idCategory}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách sản phẩm!");
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (idCategory) {
      fetchProducts();
    }
  }, [idCategory, selectedBrandId]);

  useEffect(() => {
    let sortedProducts = [...products];

    if (selectedOption === "Thấp đến Cao") {
      sortedProducts.sort((a, b) => (a.prices || 0) - (b.prices || 0));
    } else if (selectedOption === "Cao đến Thấp") {
      sortedProducts.sort((a, b) => (b.prices || 0) - (a.prices || 0));
    }

    if (activeFilter === "newest") {
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (activeFilter === "bestseller") {
      sortedProducts.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    setProducts(sortedProducts);
  }, [selectedOption, activeFilter]);

  return (
    <section className="product-container">
      <div className="filter-section">
        <div className="brands">
          <h4>Hãng sản xuất</h4>
          <div className="brand-list">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <button
                  key={brand._id}
                  className={`brand-item ${
                    selectedBrandId === brand._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedBrandId(brand._id)}
                >
                  {brand.name}
                </button>
              ))
            ) : (
              <p>Không có hãng nào</p>
            )}
          </div>
        </div>
        <div className="sort-section">
          <h4>Sắp xếp theo</h4>
          <div className="sort-buttons">
            {["popular", "newest", "bestseller"].map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "popular"
                  ? "Phổ biến"
                  : filter === "newest"
                  ? "Mới nhất"
                  : "Bán chạy"}
              </button>
            ))}
          </div>
          <div className="dropdown">
            <button
              className="dropdown-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              Giá: {selectedOption || "Chọn"} ▼
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Đang tải sản phẩm...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="product-list">
          {products.length > 0 ? (
            products.slice(0, visibleCount).map((item) => (
              <div key={item._id} className="product-item">
                <Link to={`/chi-tiet-san-pham/${item._id}`}>
                  <img
                    src={item.imageUrls?.[0] || productImage}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                  <p>Giá: {item?.prices?.toLocaleString()} đ</p>
                </Link>
                <button
                  className="buy-button"
                  onClick={() => handleAddToCart(item)}
                >
                  Mua hàng
                </button>
              </div>
            ))
          ) : (
            <div className="no-products">Không tìm thấy sản phẩm nào</div>
          )}
        </div>
      )}

      {!isLoading && !error && visibleCount < products.length && (
        <button
          className="load-more"
          onClick={() => setVisibleCount((prev) => prev + 20)}
        >
          Xem thêm ({products.length - visibleCount} sản phẩm)
        </button>
      )}
    </section>
  );
};

export default ProductPage;
