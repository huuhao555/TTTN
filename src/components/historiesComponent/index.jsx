import { useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../utils/index";

const HistoriesProductSlide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getViewedProducts = () => {
    return JSON.parse(sessionStorage.getItem("viewedProducts")) || [];
  };

  const viewedProducts = getViewedProducts();
  console.log(viewedProducts);
  const itemsPerPage = 4;
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

  return viewedProducts.length > 0 ? (
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
            {viewedProducts.map((product) => {
              console.log(product);
              return (
                <div className="product-item" key={product.id}>
                  <Link to={`${ROUTERS.USERS.PRODUCT_DETAIL}/${product.id}`}>
                    <img
                      src={product.imageUrl || "default-image.jpg"}
                      alt={product.name}
                    />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.prices?.toLocaleString("vi-VN")} ₫</p>
                    </div>
                  </Link>
                </div>
              );
            })}
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
  ) : null;
};

export default HistoriesProductSlide;
