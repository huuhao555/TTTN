import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaChartBar,
  FaPlusCircle,
  FaAlignJustify,
  FaFacebookMessenger,
  FaRegChartBar,
  FaChair
} from "react-icons/fa";
import { ROUTERS } from "../../../../../utils";

const menuItems = [
  { path: ROUTERS.SHOP.DASHBOARD, icon: <FaChartBar />, label: "Dashboard" },
  {
    path: ROUTERS.SHOP.CREATE_PRODUCT_SHOP,
    icon: <FaPlusCircle />,
    label: "Thêm sản phẩm"
  },
  {
    path: ROUTERS.SHOP.ORDER_MANAGER,
    icon: <FaShoppingCart />,
    label: "Quản lý đơn hàng"
  },
  {
    path: ROUTERS.SHOP.ALL_PRODUCT_SHOP,
    icon: <FaAlignJustify />,
    label: "Tất cả sản phẩm"
  },
  {
    path: ROUTERS.SHOP.CHAT,
    icon: <FaFacebookMessenger />,
    label: "Quản lý tin nhắn"
  },
  {
    path: ROUTERS.SHOP.TURNOVER,
    icon: <FaRegChartBar />,
    label: "Quản lý doanh thu"
  }
];

const AdminSidebar = () => {
  const navigator = useNavigate();

  return (
    <aside className="sidebar">
      <h2
        className="sidebar__title"
        onClick={() => {
          navigator(ROUTERS.USERS.HOME);
        }}
      >
        Admin Shop
      </h2>
      <nav className="sidebar__menu">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} className="sidebar__menu-item">
            {item.icon} <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
