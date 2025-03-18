import "./style.scss";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../utils";
import img from "../../assets/users/product/image.png";
import Slider from "react-slick";
import slugify from "slugify";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiLink } from "../../config/api";

const CategoriesComponent = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiLink}/api/category/get-parents`);
        if (!response.ok) {
          console.error("Error fetching categories");
          return;
        }
        const data = await response.json();
        console.log(data.data);
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (product) => {
    const productNameSlug = slugify(product.name, { lower: true });
    navigate(`${ROUTERS.USERS.PRODUCT}/${productNameSlug}`, {
      state: { idCategory: product._id },
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  return (
    <div className="container">
      <div className="cate-main">
        <h4 className="title">Danh mục sản phẩm</h4>
        <div className="cate-list">
          <Slider {...settings}>
            {categories.map((item) => (
              <div
                key={item._id}
                className="cate-item"
                onClick={() => handleCategoryClick(item)}
              >
                <img
                  src={item.imageUrls || img}
                  alt={item.name}
                  className="cate-image"
                />
                <div className="cate-name">{item.name}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CategoriesComponent;
