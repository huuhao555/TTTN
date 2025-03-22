import { memo } from "react";
import SlideHomePage from "../../../components/slideHome/index";

import ProductAllComponent from "../../../components/productsComponent";
import ProductByShopComponent from "../../../components/productShop";
import CategoriesComponent from "../../../components/categoriesComponent";
import HistoriesProductSlide from "../../../components/historiesComponent";
import ChatRealtimeComponent from "../../../components/chatRealtime";
import GetAllShopsComponents from "../../../components/getShop";
const HomePage = () => {
  return (
    <div>
      <SlideHomePage />
      <HistoriesProductSlide />
      {/* <CategoriesComponent /> */}
      <GetAllShopsComponents />
      <ProductAllComponent />
      {/* <HistoriesProductSlide />
      <ChatRealtimeComponent /> */}

      {/* <ProductByShopComponent /> */}
    </div>
  );
};
export default memo(HomePage);
