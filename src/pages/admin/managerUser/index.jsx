import React, { useContext, useEffect, useState } from "react";
import "./style.scss";

import { apiLink } from "../../../config/api";
import { UserContext } from "../../../middleware/UserContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dataUser } = useContext(UserContext) || {};

  const fetchUsers = async () => {
    try {
      const response = await fetch(apiLink + "/api/user/getAllUser", {
        method: "GET",
        headers: { token: `Bearer ${dataUser.access_token}` }
      });

      if (!response.ok) throw new Error("Lỗi khi lấy danh sách người dùng");

      const data = await response.json();
      console.log(data);
      setUsers(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-management">
      <h1>Quản lý người dùng</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : users.length === 0 ? (
        <p>Không có người dùng nào.</p>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <h2>{user.name}</h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {user.phone}
              </p>
              <p>
                <strong>Vai trò:</strong>{" "}
                <span className={`roles${user.roles}`}>{user.roles}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
