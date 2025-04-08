import { Link, useNavigate } from "react-router-dom";
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
  { path: ROUTERS.ADMIN.DASHBOARD, icon: <FaChartBar />, label: "Dashboard" },

  {
    path: ROUTERS.ADMIN.ACCEPT_ROLES,
    icon: <FaUsers />,
    label: "Xác thực người bán hàng"
  },

  { path: ROUTERS.ADMIN.MANAGER_USER, icon: <FaUsers />, label: "Người dùng" }
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
        Admin AirTech
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
