import { Link } from "react-router-dom";
import {
  FaLaptop,
  FaMobileAlt,
  FaTv,
  FaApple,
  FaUsers,
  FaShoppingCart,
  FaChartBar,
  FaCogs,
  FaPlusCircle
} from "react-icons/fa";
import { ROUTERS } from "../../../../../../utils";

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
  }
];

const AdminSidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Admin AirTech</h2>
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
