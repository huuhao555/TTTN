import { useContext, useEffect, useState } from "react";
import "./style.scss";
import { apiLink } from "../../../../../config/api";
import { UserContext } from "../../../../../middleware/UserContext";

const InfoShopPage = () => {
  const { dataUser } = useContext(UserContext);

  const [shop, setShop] = useState({ name: "", description: "" });
  const shopId = dataUser?.dataUser?.shopId;
  // Fetch dữ liệu từ API khi trang load
  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const response = await fetch(apiLink + `/api/shop/get-shop/${shopId}`); // Thay URL API phù hợp
        const data = await response.json();
        console.log(data);
        setShop(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu shop:", error);
      }
    };

    fetchShopInfo();
  }, []);

  return (
    <div className="info-shop-container">
      <div className="info-shop-card">
        <h2 className="shop-name">{shop.name}</h2>
        <p className="shop-description">{shop.description}</p>
      </div>
    </div>
  );
};

export default InfoShopPage;
