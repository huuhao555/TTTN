import { useEffect, useState, useContext } from "react";
import {
  FaBox,
  FaUsers,
  FaUserCheck,
  FaStar,
  FaCommentDots
} from "react-icons/fa";
import "./style.scss";
import { apiLink } from "../../../../../config/api";
import { UserContext } from "../../../../../middleware/UserContext";

const InfoShopPage = () => {
  const { dataUser } = useContext(UserContext);
  const [shop, setShop] = useState({});
  const [products, setProducts] = useState([]);
  const shopId = dataUser?.dataUser?.shopId;

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const res = await fetch(apiLink + `/api/shop/get-shop/${shopId}`);
        const data = await res.json();
        setShop(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu shop:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          apiLink + `/api/product/getAllByShop/${shopId}`
        );
        const data = await res.json();
        console.log(data);
        setProducts(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    if (shopId) {
      fetchShopInfo();
      fetchProducts();
    }
  }, [shopId]);

  return (
    <div className="shop-container">
      <div className="shop-banner">
        <div className="overlay"></div>
        <div className="shop-info">
          <img
            className="shop-logo"
            src={shop?.logo || "https://picsum.photos/200"}
            alt="Shop Logo"
          />
          <div className="shop-details">
            <h2>{shop?.name}</h2>
            <p>{shop?.description || "Chưa có mô tả"}</p>
          </div>
        </div>
      </div>

      <div className="shop-stats">
        <div className="stat-item">
          <FaBox />{" "}
          <span>
            Sản phẩm: <b>{products.length || 0}</b>
          </span>
        </div>
        <div className="stat-item">
          <FaUsers />{" "}
          <span>
            Người theo dõi: <b>{shop?.followers || 0}</b>
          </span>
        </div>
        <div className="stat-item">
          <FaUserCheck />{" "}
          <span>
            Đang theo: <b>{shop?.following || 0}</b>
          </span>
        </div>
        <div className="stat-item">
          <FaStar />{" "}
          <span>
            Đánh giá:{" "}
            <b>
              {shop?.rating || "0"} ({shop?.reviews || 0} đánh giá)
            </b>
          </span>
        </div>
        <div className="stat-item">
          <FaCommentDots />{" "}
          <span>
            Tỉ lệ phản hồi chat: <b>{shop?.chatResponse || "0%"}</b>
          </span>
        </div>
      </div>

      <div className="shop-products">
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product?._id} className="product-card">
                <img
                  src={
                    product?.imageUrls[0] || "https://via.placeholder.com/200"
                  }
                  alt={product?.name}
                />
                <h4>{product?.name}</h4>
                <p className="price">
                  {product?.prices?.toLocaleString("VN-vi")} đ
                </p>
                <button className="buy-btn">Mua ngay</button>
              </div>
            ))
          ) : (
            <p className="no-products">Chưa có sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoShopPage;
