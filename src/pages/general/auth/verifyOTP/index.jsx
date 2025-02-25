import { memo, useState } from "react";
import "./style.scss";
import { apiLink } from "../../../../config/api";
import { ROUTERS } from "../../../../utils";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");
  const navigator = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiLink + "/api/otp/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otpToken })
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại.");
      }
      navigator(ROUTERS.USERS.HOME);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-pass">
        <div className="cover">
          <img
            src={require("../../../../assets/users/login.png")}
            alt="login"
          />
        </div>
        <div className="forget-side">
          <div className="content">
            <h2>Xác thực OTP</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Mã xác nhận"
                name="otp"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                required
              />
              <button type="submit">Gửi</button>
            </form>
            <p onClick={() => navigator(ROUTERS.USERS.LOGIN)}>Quay lại</p>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VerifyOTP);
