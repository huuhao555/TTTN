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
import OrderManagement from "./pages/general/profilePage/orderManagement";
import ViewHistories from "./pages/general/profilePage/viewHistories";
import AddressBook from "./pages/general/profilePage/adressBook";
import CreateCategory from "./pages/admin/createCategoris";
import ProductPage from "./pages/users/productPage";
import ProductDetails from "./pages/users/productDetailsPage";
import ProfileLayout from "./pages/general/profilePage/theme/profileLayout";
import InfoUserPage from "./pages/general/profilePage/infoUser";
import VerifyShop from "./pages/users/shop/registerShop/verifyShop";
import CreateShop from "./pages/users/shop/registerShop/createShop";
import AcceptRoles from "./pages/admin/acceptRoles";
import AcceptShop from "./pages/admin/acceptShop";
import GetAllShopsPage from "./pages/users/getAllShop";
import ShopLayout from "./pages/users/shop/adminShop/theme/shopLayout";
import InfoShop from "./pages/users/shop/adminShop/infoShop";
import CreateProductShop from "./pages/users/shop/adminShop/createProduct";
// import ProductTable from "./pages/users/shop/adminShop/showProduct/showProduct";
// import OrderManager from "./pages/users/shop/adminShop/orderManager";
import DetailShop from "./pages/users/shop/detailShop";
import OrderPage from "./pages/users/paymentPage";
import PaymentDetailPage from "./pages/users/PaymentDetailPage";
import OrderStorage from "./pages/users/shop/orderManagement";
import ProductTable from "./pages/users/shop/adminShop/showProduct";
import ChatPage from "./pages/users/chat";
import OrderStorageUser from "./pages/users/orderManagement";
import ProductAll from "./pages/users/getAllproducts";

const RouterCustom = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route
          path={`${ROUTERS.USERS.CHAT}/:receiverId?`}
          element={<ChatPage />}
        />
        <Route path={ROUTERS.USERS.HOME} element={<HomePage />} />
        <Route path={ROUTERS.USERS.LOGIN} element={<AuthPage />} />
        <Route path={ROUTERS.USERS.FORGET_PASSWORD} element={<ForgetPass />} />
        <Route path={ROUTERS.USERS.CART} element={<CartPage />} />
        <Route path={ROUTERS.USERS.LOOKUP} element={<LookupPage />} />
        <Route path={ROUTERS.USERS.VERIFY} element={<VerifyOTP />} />
        <Route
          path={`${ROUTERS.USERS.PRODUCT}/:id`}
          element={<ProductPage />}
        />
        <Route path={ROUTERS.USERS.GET_SHOP} element={<GetAllShopsPage />} />
        <Route path={ROUTERS.USERS.ORDER_DETAIL} element={<OrderPage />} />
        <Route path={ROUTERS.USERS.DETAIL_SHOP} element={<DetailShop />} />
        <Route
          path={ROUTERS.USERS.ORDER_MANAGER}
          element={<OrderStorageUser />}
        />
        <Route
          path={ROUTERS.USERS.PAYMENT_DETAIL}
          element={<PaymentDetailPage />}
        />
        <Route path={ROUTERS.USERS.PRODUCT_ALL} element={<ProductAll />} />
        <Route
          path={`${ROUTERS.USERS.PRODUCT_DETAIL}/:id`}
          element={<ProductDetails />}
        />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path={ROUTERS.ADMIN.DASHBOARD} element={<Dashboard />} />
        <Route
          path={ROUTERS.ADMIN.CREATE_PRODUCT}
          element={<CreateProduct />}
        />
        <Route
          path={ROUTERS.ADMIN.CREATE_CATEGORY}
          element={<CreateCategory />}
        />
        <Route path={ROUTERS.ADMIN.ACCEPT_ROLES} element={<AcceptRoles />} />
        <Route path={ROUTERS.ADMIN.ACCEPT_SHOPS} element={<AcceptShop />} />
      </Route>

      <Route element={<ShopLayout />}>
        <Route path={ROUTERS.SHOP.DASHBOARD} element={<InfoShop />} />
        <Route path={ROUTERS.SHOP.ORDER_MANAGER} element={<OrderStorage />} />

        <Route
          path={ROUTERS.SHOP.CREATE_PRODUCT_SHOP}
          element={<CreateProductShop />}
        />
        <Route
          path={ROUTERS.SHOP.ALL_PRODUCT_SHOP}
          element={<ProductTable />}
        />
        {/*<Route path={ROUTERS.SHOP.ORDER_MANAGER} element={<OrderManager />} /> */}
      </Route>
      <Route element={<ProfileLayout />}>
        <Route path={ROUTERS.SHOP.VERIFY_SHOP} element={<VerifyShop />} />
        <Route path={ROUTERS.SHOP.CREATE_SHOP} element={<CreateShop />} />
        <Route
          path={ROUTERS.USERPROFILE.ACCOUNT_INFO}
          element={<InfoUserPage />}
        />
        <Route
          path={ROUTERS.USERPROFILE.ORDER_MANAGERMENT}
          element={<OrderManagement />}
        />
        <Route path={ROUTERS.USERS.VIEW_PRODUCT} element={<ViewHistories />} />
        <Route path={ROUTERS.USERS.ADRESS_BOOK} element={<AddressBook />} />
      </Route>
    </Routes>
  );
};

export default memo(RouterCustom);
