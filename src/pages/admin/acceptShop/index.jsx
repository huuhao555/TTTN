import { useEffect, useState } from "react";
import "./style.scss";
import { apiLink } from "../../../config/api";

const AcceptShop = () => {
  const [shops, setShops] = useState([]);

  // Lấy danh sách shop
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch(apiLink + "/api/shop/unapproved");
        const data = await res.json();
        console.log(data);
        setShops(data?.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách shop:", error);
      }
    };
    fetchShops();
  }, []);

  // Xử lý duyệt shop
  const handleApprove = async (id) => {
    try {
      await fetch(apiLink + `/api/shop/approve/${id}`, {
        method: "PUT"
      });
      setShops((prev) =>
        prev.map((shop) =>
          shop._id === id ? { ...shop, status: "approved" } : shop
        )
      );
    } catch (error) {
      console.error("Lỗi khi duyệt shop:", error);
    }
  };

  // Xử lý hủy duyệt shop
  const handleReject = async (id) => {
    try {
      await fetch(apiLink`/api/shops/reject/${id}`, {
        method: "POST"
      });
      setShops((prev) =>
        prev.map((shop) =>
          shop._id === id ? { ...shop, status: "rejected" } : shop
        )
      );
    } catch (error) {
      console.error("Lỗi khi hủy duyệt shop:", error);
    }
  };

  return (
    <div className="accept-shop">
      <h2>Quản lý duyệt Shop</h2>
      <table>
        <thead>
          <tr>
            <th>Tên Shop</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {shops?.map((shop) => (
            <tr key={shop._id}>
              <td>{shop.name}</td>
              <td>{shop.description}</td>
              <td>
                <span className={`status ${shop.status}`}>{shop.status}</span>
              </td>
              <td>
                <button
                  className="btn approve"
                  onClick={() => handleApprove(shop._id)}
                  disabled={shop.status === "approved"}
                >
                  Duyệt
                </button>
                <button
                  className="btn reject"
                  onClick={() => handleReject(shop._id)}
                  disabled={shop.status === "rejected"}
                >
                  Hủy duyệt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcceptShop;
