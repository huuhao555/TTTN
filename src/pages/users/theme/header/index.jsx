import { memo, useContext, useEffect, useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineFileSearch,
  AiOutlineLaptop,
  AiOutlineBorderlessTable
} from "react-icons/ai";
import {
  BsSmartwatch,
  BsMouse2,
  BsKeyboard,
  BsSpeaker,
  BsPhone,
  BsPcDisplay,
  BsPlug
} from "react-icons/bs";
import { ROUTERS } from "../../../../utils";
import { FaChessKing } from "react-icons/fa";
import { apiLink } from "../../../../config/api";
import { UserContext } from "../../../../middleware/UserContext";

const Header = () => {
  const { dataUser } = useContext(UserContext);
  const [nameUser, setNameUser] = useState("");

  useEffect(() => {
    if (dataUser?.dataUser?.name) {
      setNameUser(dataUser.dataUser.name);
    }
  }, [dataUser]);

  const menuCategories = [
    { id: 1, name: "Điện thoại", icon: <BsPhone /> },
    { id: 2, name: "Laptop", icon: <AiOutlineLaptop /> },
    { id: 3, name: "Chuột", icon: <BsMouse2 /> },
    { id: 4, name: "Bàn phím", icon: <BsKeyboard /> },
    { id: 5, name: "Smartwatch", icon: <BsSmartwatch /> },
    { id: 6, name: "PC, Màn hình", icon: <BsPcDisplay /> },
    { id: 7, name: "Loa, Micro", icon: <BsSpeaker /> },
    { id: 8, name: "Phụ kiện", icon: <BsPlug /> }
  ];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiLink + "/api/category/getAll");
        if (!response.ok) {
          console.error("Error fetching categories");
          return;
        }
        const data = await response.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="header">
      <div className="container">
        <div className="header__top row">
          <div className="col-lg-3">
            <Link to="/">
              <img
                src={require("../../../../assets/users/no-bg.png")}
                alt="Logo Header"
              />
            </Link>
          </div>

          <div className="col-lg-3 input-search">
            <AiOutlineSearch />
            <input
              type="text"
              className="input"
              placeholder="Bạn cần tìm gì..."
            />
          </div>

          <div className="col-lg-6 header__top__user">
            {dataUser ? (
              <Link
                to={ROUTERS.USERPROFILE.ACCOUNT_INFO}
                className="user-option"
              >
                <AiOutlineUser />
                <span>{nameUser}</span>
              </Link>
            ) : (
              <Link to={ROUTERS.USERS.LOGIN} className="user-option">
                <AiOutlineUser />
                <span>Đăng nhập</span>
              </Link>
            )}

            <Link to={ROUTERS.USERS.CART} className="user-option">
              <AiOutlineShoppingCart />
              <span>Giỏ hàng</span>
            </Link>

            <Link to={ROUTERS.USERS.LOOKUP} className="user-option">
              <AiOutlineFileSearch />
              <span>Tra cứu</span>
            </Link>
            <Link to={ROUTERS.ADMIN.DASHBOARD} className="user-option">
              <AiOutlineBorderlessTable />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        <div className="header__main">
          <ul className="menu-categories">
            {menuCategories.map((item) => (
              <li key={item.id}>
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
