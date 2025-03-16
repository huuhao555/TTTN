import { useEffect, useState } from "react";
import "./style.scss";
import { apiLink } from "../../../config/api";

const getRandomShopImage = () =>
  `https://picsum.photos/200?random=${Math.random()}`;

const GetAllShopsPage = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(apiLink + "/api/shop/getall");
        const data = await response.json();
        setShops(data?.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách shop:", error);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="shopsPage">
      <h1 className="title">Danh sách cửa hàng</h1>
      <div className="shopsGrid">
        {shops.map((shop) => (
          <div key={shop.id} className="shopCard">
            <img
              src={getRandomShopImage()}
              alt={shop.name}
              className="shopLogo"
            />
            <div className="shopInfo">
              <h2 className="shopName">{shop.name}</h2>
              <p className="shopDescription">{shop.description}</p>
              <button className="visitButton">Xem cửa hàng</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllShopsPage;
