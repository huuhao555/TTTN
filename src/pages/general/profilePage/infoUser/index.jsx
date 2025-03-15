import React, { useContext, useState, useEffect } from "react";
import "./style.scss";
import { UserContext } from "../../../../middleware/UserContext";
import { apiLink } from "../../../../config/api";

const InfoUserPage = () => {
  const { dataUser } = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState("");

  const handleFocus = () => {
    setErrorMessage("Email không thể thay đổi!");
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    if (dataUser?.dataUser) {
      setFormData({
        name: dataUser?.dataUser?.name || "",
        phone: dataUser?.dataUser?.phone || "",
        email: dataUser?.dataUser?.email || ""
      });
    }
  }, [dataUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeInfo = async (e) => {
    e.preventDefault();
    // const id = dataUser?.dataUser?.id;
    const id = 123;
    try {
      const response = await fetch(apiLink + `/api/user/update-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        alert(
          "Chỉnh sửa tài khoản không thành công! Vui lòng kiểm tra lại thông tin."
        );
        return;
      }

      alert("Chỉnh sửa tài khoản thành công");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="account-info-container">
      <div className="content-heading">
        <span>Thông tin người dùng</span>
      </div>
      <div className="box-info-account">
        <form className="form-update">
          <div className="form-line-wrapper">
            <label>Họ Tên</label>
            <input
              required
              type="text"
              name="name"
              className="form-control"
              placeholder="Nhập họ tên"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-line-wrapper">
            <label>Số điện thoại</label>
            <input
              required
              type="text"
              name="phone"
              className="form-control"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-line-wrapper">
            <label>Email</label>{" "}
            <input
              type="email"
              name="email"
              className="form-control locked-input"
              placeholder="Email"
              value={formData.email}
              onFocus={handleFocus}
              readOnly
            />
            {errorMessage && (
              <p style={{ color: "red", marginTop: "5px" }}>{errorMessage}</p>
            )}
          </div>
          <div className="form-line-wrapper">
            <button
              type="submit"
              className="btn-update"
              onClick={handleChangeInfo}
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfoUserPage;
