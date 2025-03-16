import React, { useState, useEffect, memo, useContext } from "react";
import "./style.scss";
import { apiLink } from "../../config/api";
import { UserContext } from "../../middleware/UserContext";

const ProductByShopComponent = () => {
  const [shops, setShops] = useState([]);
  const { dataUser } = useContext(UserContext);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          apiLink + `/api/product/getAllByShop/${dataUser?.dataUser?.shopId}`
        );
        const data = await response.json();
        console.log(data);
        // setShops(data?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách shop:", error);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="shopsPage">
      <h1 className="title">Sản phẩm theo cửa hàng</h1>
      {shops.map((shop) => (
        <div key={shop.id} className="shopSection">
          <h2 className="shopTitle">{shop.name}</h2>
          <div className="productsGrid">
            {shop.products.slice(0, 5).map((product) => (
              <div key={product.id} className="productCard">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="productImage"
                />
                <div className="productInfo">
                  <h2 className="productName">{product.name}</h2>
                  <p className="productPrice">{product.price} VND</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(ProductByShopComponent);
