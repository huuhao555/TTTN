import { useEffect, useState } from "react";
import "./style.scss";

import { useNavigate } from "react-router-dom";
import { apiLink } from "../../config/api";
import { ROUTERS } from "../../utils";

const getRandomShopImage = () =>
  `https://picsum.photos/200?random=${Math.random()}`;

const GetAllShopsComponents = () => {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(apiLink + "/api/shop/getall");
        const data = await response.json();
        setShops(data?.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách shop:", error);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="shopsPageUnique">
      <h1 className="titleUnique">Danh sách cửa hàng</h1>
      <div className="shopsGridUnique">
        {shops.slice(0, 6).map((shop) => (
          <div key={shop._id} className="shopCardUnique">
            <img
              src={getRandomShopImage()}
              alt={shop.name}
              className="shopLogoUnique"
            />
            <div className="shopInfoUnique">
              <h2 className="shopNameUnique">{shop.name}</h2>
              <p className="shopDescriptionUnique">{shop.description}</p>
              <button
                className="visitButtonUnique"
                onClick={() =>
                  navigate(ROUTERS.USERS.DETAIL_SHOP, {
                    state: { shopId: shop?._id }
                  })
                }
              >
                Xem cửa hàng
              </button>
            </div>
          </div>
        ))}
      </div>

      {shops.length > 6 && (
        <button
          className="viewMoreButtonUnique"
          onClick={() => navigate(ROUTERS.USERS.GET_SHOP)}
        >
          Xem thêm
        </button>
      )}
    </div>
  );
};

export default GetAllShopsComponents;
