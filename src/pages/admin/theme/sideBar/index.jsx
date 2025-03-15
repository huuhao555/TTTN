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
  FaPlusCircle,
  FaShoppingBag
} from "react-icons/fa";
import "./style.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ROUTERS } from "../../../../utils";
const menuItems = [
  { path: "/admin/dashboard", icon: <FaChartBar />, label: "Dashboard" },
  {
    path: ROUTERS.ADMIN.CREATE_PRODUCT,
    icon: <FaPlusCircle />,
    label: "Thêm sản phẩm"
  },
  {
    path: ROUTERS.ADMIN.CREATE_CATEGORY,
    icon: <FaPlusCircle />,
    label: "Thêm loại sản phẩm"
  },
  {
    path: ROUTERS.ADMIN.ACCEPT_ROLES,
    icon: <FaUsers />,
    label: "Xác thực người bán hàng"
  },
  {
    path: ROUTERS.ADMIN.ACCEPT_SHOPS,
    icon: <FaShoppingBag />,
    label: "Xác thực shop"
  },
  {
    path: "/admin/products/applewatch",
    icon: <FaApple />,
    label: "Apple Watch"
  },
  { path: "/admin/orders", icon: <FaShoppingCart />, label: "Đơn hàng" },
  { path: "/admin/users", icon: <FaUsers />, label: "Người dùng" },
  { path: "/admin/settings", icon: <FaCogs />, label: "Cài đặt" }
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
