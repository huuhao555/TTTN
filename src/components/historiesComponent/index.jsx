import { useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const HistoriesProductSlide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getViewedProducts = () => {
    return JSON.parse(localStorage.getItem("viewedProducts")) || [];
  };

  const viewedProducts = getViewedProducts();
  const itemsPerPage = 4; // Số sản phẩm hiển thị mỗi lần
  const maxIndex = Math.max(0, viewedProducts.length - itemsPerPage);

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="history-slider">
      <h2 className="title">Sản phẩm đã xem</h2>
      <div className="slider-container">
        <button
          className="slider-control prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ❮
        </button>
        <div className="product-list">
          <div
            className="product-track"
            style={{ transform: `translateX(-${currentIndex * 220}px)` }}
          >
            {viewedProducts.map((product) => (
              <div className="product-item" key={product._id}>
                <Link to={`/chi-tiet-san-pham/${product._id}`}>
                  <img src={product.imageUrl} alt={product.name} />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.prices?.toLocaleString("vi-VN")} ₫</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button
          className="slider-control next"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default HistoriesProductSlide;
