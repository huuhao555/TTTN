import { memo } from "react";
import SlideHomePage from "../../../components/slideHome/index";
import GetAllShopsPage from "../getAllShop/index";
import ProductAllComponent from "../../../components/products";
import ProductByShopComponent from "../../../components/productShop";
import CategoriesComponent from "../../../components/categoriesComponent";
import HistoriesProductSlide from "../../../components/historiesComponent";
import ChatRealtimeComponent from "../../../components/chatRealtime";
const HomePage = () => {
  return (
    <div>
      <SlideHomePage />
      <CategoriesComponent />
      <GetAllShopsPage />
      <ProductAllComponent />
      <HistoriesProductSlide />
      <ChatRealtimeComponent />

      {/* <ProductByShopComponent /> */}
    </div>
  );
};
export default memo(HomePage);
