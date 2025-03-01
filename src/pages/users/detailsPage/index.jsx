import React from "react";
import "./style.scss";
import { Slider } from "antd";
import img from "../../../assets/users/product/image.png";

const ProductDetails = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  const data = [
    {
      id: 1,
      name: "Product 1",
      price: 100,
      description: "Product 1 description",
      image: img,
    },
  ];

  return (
    <div className="container">
      <div className="product-name">Tên sản phẩm</div>
      <div className="row box-main">
        <div className="col-lg-4 box-left">
          hello1
          <div className="product-image">
            <img src={data[0].image} alt="product" />
            <div></div>
          </div>
        </div>
        <div className="col-lg-7 box-right">hello2</div>
      </div>
      <div className="fix"></div>
    </div>
  );
};

export default ProductDetails;
