import React, { createContext, useState, useEffect, useCallback } from "react";
import { memo } from "react";
import { apiLink } from "../config/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [dataUser, setDataUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("dataUser")) || null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  const [countCart, setCountCart] = useState(() => {
    return Number(sessionStorage.getItem("countCart")) || 0;
  });

  useEffect(() => {
    if (dataUser) {
      sessionStorage.setItem("dataUser", JSON.stringify(dataUser));
    } else {
      sessionStorage.removeItem("dataUser");
    }
  }, [dataUser]);

  useEffect(() => {
    sessionStorage.setItem("countCart", countCart);
  }, [countCart]);

  const updateCartCount = useCallback((newCount) => {
    setCountCart(newCount);
  }, []);

  const updateUser = useCallback(async (newDataUser) => {
    setDataUser(newDataUser);

    if (newDataUser) {
      try {
        const response = await fetch(
          `${apiLink}/api/cart/get-cart/${newDataUser?.dataUser?.id}`
        );
        const data = await response.json();
        const totalProducts = Object.values(data?.data?.groupedByShop).reduce(
          (total, shop) => total + shop.length,
          0
        );

        console.log("Tổng số sản phẩm trong shop:", totalProducts);
        setCountCart(totalProducts);
        // setCountCart(data.count || 0);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:", error);
      }
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setDataUser(null);
    setCountCart(0);
    window.location.href = "/";
  }, []);
  console.log(countCart);
  return (
    <UserContext.Provider
      value={{ dataUser, countCart, updateUser, logout, updateCartCount }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default memo(UserProvider);
