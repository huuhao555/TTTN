import { useContext, useState } from "react";
import "./style.scss";
import { FaFacebook, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { apiLink } from "../../../../config/api";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../utils";
import { UserContext } from "../../../../middleware/UserContext";
const AuthPage = () => {
  const { updateUser } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(false);
  const navigator = useNavigate();
  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    password: ""
  });
  const [formDataSignup, setFormDataSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormDataLogin({
      ...formDataLogin,
      [name]: value
    });
  };
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setFormDataSignup({
      ...formDataSignup,
      [name]: value
    });
  };

  const onHandSignup = async () => {
    try {
      const response = await fetch(apiLink + "/api/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formDataSignup.name,
          email: formDataSignup.email,
          phone: formDataSignup.phone,
          password: formDataSignup.password,
          confirmPassword: formDataSignup.confirmPassword
        })
      });
      if (!response.ok) {
        alert("Đăng ký không thành công! Vui lòng kiểm tra lại thông tin.");
        return;
      }
      navigator(ROUTERS.USERS.VERIFY, {
        state: { email: formDataSignup.email }
      });
    } catch (error) {
      alert("Đã xảy ra lỗi khi đăng ký!");
    }
  };
  const onHandLogin = async () => {
    try {
      const response = await fetch(apiLink + "/api/user/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formDataLogin.email,
          password: formDataLogin.password
        })
      });
      if (!response.ok) {
        alert("Đăng nhập không thành công! Vui lòng kiểm tra lại thông tin.");
        return;
      }
      const dataUser = await response.json();
      sessionStorage.setItem("dataUser", JSON.stringify(dataUser));
      updateUser(dataUser);
      navigator(ROUTERS.USERS.HOME);
    } catch (error) {
      alert("Đã xảy ra lỗi khi đăng nhập!");
    }
  };

  return (
    <div className="auth-container">
      <div
        className={`auth-wrapper ${
          isLogin ? "login-active" : "register-active"
        }`}
      >
        <div className="auth-side login-side">
          <div className="content">
            <h2>Đăng nhập</h2>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formDataLogin.email}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={formDataLogin.password}
              onChange={handleLoginChange}
            />
            <button onClick={onHandLogin}>Đăng nhập</button>
            <div className="login__bottom">
              <p onClick={() => navigator(ROUTERS.USERS.FORGET_PASSWORD)}>
                Quên mật khẩu
              </p>
              <p onClick={() => setIsLogin(true)}>Chưa có tài khoản?</p>
            </div>
          </div>
          <div className="other-login">
            <div
              className="login-icon google"
              onClick={() =>
                window.open("https://accounts.google.com", "_blank")
              }
            >
              <FcGoogle />
            </div>
            <div
              className="login-icon facebook"
              onClick={() =>
                window.open("https://www.facebook.com/login.php", "_blank")
              }
            >
              <FaFacebook />
            </div>
            <div
              className="login-icon apple"
              onClick={() =>
                window.open(
                  "https://appleid.apple.com/auth/authorize",
                  "_blank"
                )
              }
            >
              <FaApple />
            </div>
          </div>
        </div>

        <div className="auth-side register-side">
          <div className="content">
            <h2>Đăng ký</h2>
            <input
              type="text"
              placeholder="Họ và tên"
              name="name"
              value={formDataSignup.name}
              required
              onChange={handleSignupChange}
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              name="phone"
              value={formDataSignup.phone}
              onChange={handleSignupChange}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/\D/g, ""))
              }
              maxLength={10}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formDataSignup.email}
              required
              onChange={handleSignupChange}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={formDataSignup.password}
              required
              onChange={handleSignupChange}
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              name="confirmPassword"
              value={formDataSignup.confirmPassword}
              required
              onChange={handleSignupChange}
            />
            <button onClick={onHandSignup}>Đăng ký</button>
            <p onClick={() => setIsLogin(false)}>Đã có tài khoản? Đăng nhập</p>
          </div>
        </div>

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

export default AuthPage;
