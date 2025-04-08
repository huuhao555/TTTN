import { memo } from "react";
import ProductListAdmin from "../productList";
import AdminTurnOver from "../turnOverChart";

const DashBoard = () => {
  return (
    <div>
      {/* <AdminTurnOver /> */}
      <ProductListAdmin />
    </div>
  );
};

export default memo(DashBoard);
