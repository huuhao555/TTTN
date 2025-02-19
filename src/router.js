import { memo } from "react";
import { Route, Routes } from "react-router-dom";

import { ROUTERS } from "./utils/index";
import HomePage from "./pages/users/homePage";
import UserLayout from "./pages/users/theme/userLayout";
import AuthPage from "./pages/general/auth/authPage";
import ForgetPass from "./pages/general/auth/forgetPass";
import CartPage from "./pages/users/cartPage";
import LookupPage from "./pages/users/lookupPage";
import Dashboard from "./pages/admin/dashboard";
import AdminLayout from "./pages/admin/theme/adminLayout";

const RouterCustom = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path={ROUTERS.USERS.HOME} element={<HomePage />} />
        <Route path={ROUTERS.USERS.LOGIN} element={<AuthPage />} />
        <Route path={ROUTERS.USERS.FORGET_PASSWORD} element={<ForgetPass />} />
        <Route path={ROUTERS.USERS.CART} element={<CartPage />} />
        <Route path={ROUTERS.USERS.LOOKUP} element={<LookupPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path={ROUTERS.ADMIN.DASHBOARD} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
export default memo(RouterCustom);
