import { memo, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../middleware/UserContext";
import { apiLink } from "../../../../../config/api";
import "./style.scss";
import { ROUTERS } from "../../../../../utils";

const CreateShop = () => {
  const navigate = useNavigate();
  const { dataUser } = useContext(UserContext);

  const [verificationData, setVerificationData] = useState({
    upgradeReason: "",
    businessPlan: ""
  });

  const [shopData, setShopData] = useState({
    name: "",
    description: ""
  });

  const [imageFiles, setImageFiles] = useState([]);

  // ✅ Đưa useEffect ra ngoài JSX
  useEffect(() => {
    if (dataUser?.dataUser?.roles === 1 && dataUser?.dataUser?.shopId) {
      navigate(ROUTERS.SHOP.DASHBOARD);
    }
  }, [dataUser, navigate]);

  const handleShopSubmit = async (e) => {
    e.preventDefault();
    if (!dataUser?.dataUser?.id || !dataUser?.access_token) {
      console.error("Không tìm thấy userId hoặc token");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", shopData.name);
      formData.append("description", shopData.description);

      const response = await fetch(
        `${apiLink}/api/shop/create/${dataUser.dataUser.id}`,
        {
          method: "POST",
          headers: { token: `Bearer ${dataUser.access_token}` },
          body: formData
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Phản hồi từ server:", data);
    } catch (error) {
      console.error("Lỗi khi tạo shop:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!dataUser?.dataUser?.id) {
      console.error("Không tìm thấy userId");
      return;
    }

    const formData = new FormData();
    formData.append("upgradeReason", verificationData.upgradeReason);
    formData.append("businessPlan", verificationData.businessPlan);
    formData.append("userId", dataUser?.dataUser?.id);
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(apiLink + "/api/user/request-upgrade", {
        method: "POST",
        body: formData
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Phản hồi từ server:", data);
    } catch (error) {
      console.error("Lỗi khi gửi xác minh:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-side">
          {dataUser?.dataUser?.roles === 2 ? (
            <>
              <h2>Xác Minh Kênh Người Bán</h2>
              <form onSubmit={handleVerificationSubmit}>
                <input
                  type="text"
                  placeholder="Kế hoạch shop..."
                  value={verificationData.businessPlan}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      businessPlan: e.target.value
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Lý do muốn trở thành người bán..."
                  value={verificationData.upgradeReason}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      upgradeReason: e.target.value
                    })
                  }
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required
                />
                <button type="submit">Gửi xác minh</button>
              </form>
            </>
          ) : dataUser?.dataUser?.roles === 1 && !dataUser?.dataUser?.shopId ? (
            <>
              <h2>Đăng Ký Shop</h2>
              <form onSubmit={handleShopSubmit}>
                <input
                  type="text"
                  placeholder="Tên Shop..."
                  value={shopData.name}
                  onChange={(e) =>
                    setShopData({ ...shopData, name: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Mô tả Shop..."
                  value={shopData.description}
                  onChange={(e) =>
                    setShopData({ ...shopData, description: e.target.value })
                  }
                  required
                />
                <button type="submit">Gửi đăng ký</button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(CreateShop);
