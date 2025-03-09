import React, { createContext, useState, useEffect, useCallback } from "react";
import { memo } from "react";

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

  const [countCart, setCountCart] = useState(0);

  useEffect(() => {
    if (dataUser) {
      sessionStorage.setItem("dataUser", JSON.stringify(dataUser));
    } else {
      sessionStorage.removeItem("dataUser");
    }
  }, [dataUser]);

  const updateCartCount = useCallback((newCount) => {
    setCountCart(newCount);
  }, []);

  const updateUser = useCallback((newDataUser) => {
    setDataUser(newDataUser);
  }, []);

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
