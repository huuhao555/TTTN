import { memo, useContext, useState } from "react";
import "./style.scss";
import { UserContext } from "../../../../../middleware/UserContext";
import { apiLink } from "../../../../../config/api";

const CreateShop = () => {
  const { dataUser } = useContext(UserContext);

  const [verificationData, setVerificationData] = useState({
    reason: "",
    businessPlan: ""
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]); // Thêm ảnh mới vào danh sách
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!dataUser?.dataUser?.id) {
      console.error("Không tìm thấy userId");
      return;
    }

    const formData = new FormData();
    formData.append("userId", dataUser.dataUser.id);
    formData.append("reason", verificationData.reason);
    formData.append("businessPlan", verificationData.businessPlan);

    imageFiles.forEach((file) => formData.append("images", file)); // Đúng field "images"

    try {
      const response = await fetch(apiLink + "/api/user/request-upgrade", {
        method: "POST",
        body: formData
      });

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
                  value={verificationData.reason}
                  onChange={(e) =>
                    setVerificationData({
                      ...verificationData,
                      reason: e.target.value
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
          ) : (
            <>
              <h2>Đăng Ký Shop</h2>
              <p>Vui lòng xác minh trước khi tạo shop.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CreateShop);
