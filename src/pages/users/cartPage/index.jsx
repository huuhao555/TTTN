import { memo } from "react";
import "./style.scss";
import { ROUTERS } from "../../../utils";
import { useNavigate } from "react-router-dom";
const CartPage = () => {
  const navigator = useNavigate();
  return (
    <div className="container">
      <div className="no-emty">
        <img
          src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          alt="not-found-product-cart"
        />
        <p>Không có sản phẩm trong giỏ hàng.</p>
        <button onClick={() => navigator(ROUTERS.USERS.HOME)}>
          Mua Sắm Ngay
        </button>
      </div>
    </div>
  );
};
export default memo(CartPage);
