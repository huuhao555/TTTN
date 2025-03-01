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
import VerifyOTP from "./pages/general/auth/verifyOTP";
import CreateProduct from "./pages/admin/createProduct";
import ProfilePageLayout from "./pages/users/profilePageLayout/index";
import ProfilePage from "./pages/users/profilePageLayout/profilePage";
import OrderManagement from "./pages/users/profilePageLayout/orderManagement";
import ViewHistories from "./pages/users/profilePageLayout/viewHistories";
import AddressBook from "./pages/users/profilePageLayout/adressBook";

const RouterCustom = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path={ROUTERS.USERS.HOME} element={<HomePage />} />
        <Route path={ROUTERS.USERS.LOGIN} element={<AuthPage />} />
        <Route path={ROUTERS.USERS.FORGET_PASSWORD} element={<ForgetPass />} />
        <Route path={ROUTERS.USERS.CART} element={<CartPage />} />
        <Route path={ROUTERS.USERS.LOOKUP} element={<LookupPage />} />
        <Route path={ROUTERS.USERS.VERIFY} element={<VerifyOTP />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path={ROUTERS.ADMIN.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTERS.ADMIN.CREATE_PRODUCT} element={<CreateProduct />} />
      </Route>
      <Route element={<ProfilePageLayout />}>
        <Route path={ROUTERS.USERS.PROFILE_PAGE} element={<ProfilePage />} />
        <Route path={ROUTERS.USERS.ORDER_MANAGEMENT} element={<OrderManagement />} />
        <Route path={ROUTERS.USERS.VIEW_PRODUCT} element={<ViewHistories />} />
        <Route path={ROUTERS.USERS.ADRESS_BOOK} element={<AddressBook />} />
      </Route>
    </Routes>
  );
};

export default memo(RouterCustom);
