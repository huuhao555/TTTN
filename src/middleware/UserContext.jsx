import React, { createContext, useState, useEffect, useCallback } from "react";
import { memo } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [dataUser, setDataUser] = useState(null);
  const [countCart, setCountCart] = useState(0);

  // Kiểm tra user khi load trang
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setDataUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartCount = useCallback((newCount) => {
    setCountCart(newCount);
  }, []);

  // Cập nhật thông tin user
  const updateUser = useCallback((dataUser) => {
    setDataUser(dataUser);
    sessionStorage.setItem("user", JSON.stringify(dataUser));
  }, []);

  // Xử lý đăng xuất
  const logout = useCallback(() => {
    sessionStorage.clear();
    setDataUser(null);
    window.location.href = "/";
  }, []);

  return (
    <UserContext.Provider
      value={{ dataUser, countCart, updateUser, logout, updateCartCount }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default memo(UserProvider);
