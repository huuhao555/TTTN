import { memo, useState } from "react";
import "./style.scss";
import { apiLink } from "../../../../config/api";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiLink + "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json(); // Phải parse response thành JSON

      if (data.success) {
        setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-pass">
        {/* Phần form quên mật khẩu */}
        <div className="forget-side">
          <div className="content">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Vui lòng điền email..."
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Gửi</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>

        {/* Phần hình ảnh */}
        <div className="cover">
          <img
            src={require("../../../../assets/users/login.png")}
            alt="login"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ForgetPass);
