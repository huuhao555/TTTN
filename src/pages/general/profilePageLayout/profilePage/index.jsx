import React, { useContext } from "react";
import "./style.scss";
import { apiLink } from "../../../../config/api";
import { UserContext } from "../../../../middleware/UserContext";

const ProfilePage = () => {
  const { user } = useContext(UserContext);

  const getUserData = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("dataUser"));
      if (user && user.dataUser) {
        return {
          name: user.dataUser.name || "N/A",
          email: user.dataUser.email || "N/A",
          phone: user.dataUser.phone || "N/A"
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const menuChange = [
    {
      key: "name",
      text: "Họ Tên",
      value: getUserData()?.name
    },
    {
      key: "phone",
      text: "Số điện thoại",
      value: getUserData()?.phone
    },
    {
      key: "email",
      text: "Email",
      value: getUserData()?.email
    }
  ];
  const handleUpdate = async () => {
    // e.preventDefault();
    const id = user.dataUser.id;
    try {
      const res = await fetch(apiLink + `/api/user/update-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {}
  };

  return (
    <div className="container">
      <h2>Thông tin người dùng</h2>
      <div style={{ padding: "20px", textAlign: "center", maxWidth: "580px" }}>
        <form method="post" onSubmit={handleUpdate}>
          {menuChange.map((item) => (
            <div key={item.key} className="form__line-wrapper">
              <label>{item.text}</label>
              <div className="form__input-wrapper">
                <input type="text" value={item.value} />
              </div>
            </div>
          ))}
          <button className="btn" type="submit">
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
