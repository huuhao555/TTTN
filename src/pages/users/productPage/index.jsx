import React from "react";
import productImage from "../../../assets/users/product/image.png";
import "./style.scss";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const data = [
    {
      id: 1,
      name: "Product 1",
      price: 100,
      image: productImage,
    },
    {
      id: 2,
      name: "Product 2",
      price: 200,
      image: productImage,
    },
    {
      id: 3,
      name: "Product 3",
      price: 300,
      image: productImage,
    },
    {
      id: 4,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
    {
      id: 5,
      name: "Product 4",
      price: 400,
      image: productImage,
    },
  ];

  return (
    <section className="container">
      <div className="product-page ">
        <div className="product-list">
          {data.map((item) => (
            <Link to={"/chi-tiet-san-pham"}>
              <div key={item.id} className="product-item">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
