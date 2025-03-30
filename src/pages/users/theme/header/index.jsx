import { memo, useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineFileSearch,
  AiOutlineLaptop,
  AiOutlineBorderlessTable
} from "react-icons/ai";
import { FaChessKing } from "react-icons/fa";
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
import { apiLink } from "../../../../config/api";
import { UserContext } from "../../../../middleware/UserContext";

const Header = () => {
  const { dataUser, countCart } = useContext(UserContext);
  const [nameUser, setNameUser] = useState("");

  const [valueSearch, setValueSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  console.log(suggestions);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiLink + "/api/product/getAllProduct");
        const data = await response.json();

        setProducts(data?.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    if (valueSearch.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredProducts = products?.filter(
        (product) =>
          product?.name?.toLowerCase().includes(valueSearch?.toLowerCase()) ||
          product?.company?.toLowerCase().includes(valueSearch?.toLowerCase())
      );
      setSuggestions(filteredProducts);
    }
  }, [products, valueSearch]);

  const navigate = useNavigate();
  const handleCategoryClick = (idCategory) => {
    navigate(`${ROUTERS.USERS.PRODUCT}/${idCategory}`, {
      state: { idCategory }
    });
  };

  useEffect(() => {
    if (dataUser?.dataUser?.name) {
      setNameUser(dataUser.dataUser.name);
    }
  }, [dataUser]);

  const menuCategories = [
    { name: "Điện Thoại", icon: <BsPhone /> },
    { name: "Laptop", icon: <AiOutlineLaptop /> },
    { name: "Chuột", icon: <BsMouse2 /> },
    { name: "Bàn Phím", icon: <BsKeyboard /> },
    { name: "Smartwatch", icon: <BsSmartwatch /> },
    { name: "PC, Màn hình", icon: <BsPcDisplay /> },
    { name: "Loa,micro", icon: <BsSpeaker /> },
    { name: "Phụ kiện", icon: <BsPlug /> }
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiLink}/api/category/get-parents`);
        if (!response.ok) {
          console.error("Error fetching categories");
          return;
        }
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const mergedCategories = categories.map((category) => {
    const matchedCategory = menuCategories.find(
      (item) => item.name === category.name
    );
    return {
      id: category._id,
      name: category.name,
      icon: matchedCategory ? matchedCategory.icon : <FaChessKing />
    };
  });
  const searchRef = useRef(null);
  const handleBlur = () => {
    setTimeout(() => {
      setValueSearch("");
    }, 200);
  };
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

          <div className="col-lg-3 input-search" ref={searchRef}>
            <AiOutlineSearch />
            <div className="search-container">
              <input
                type="text"
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="search-input"
                onBlur={handleBlur}
              />
              {suggestions.length > 0 && (
                <ul className="suggestions show">
                  {suggestions.map((product) => (
                    <Link
                      to={`${ROUTERS.USERS.PRODUCT_DETAIL}/${product._id}`}
                      key={product._id}
                      onClick={() => setValueSearch("")}
                    >
                      <li className="suggestion-item">
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="product-img"
                        />
                        <div className="product-info">
                          <span className="product-name">{product.name}</span>
                          <span className="product-price">
                            {product?.prices?.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
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

            <Link to={ROUTERS.USERS.CART} className="user-option user-cart">
              <AiOutlineShoppingCart />
              <span>Giỏ hàng</span>
              <span className="count-cart">{countCart}</span>
            </Link>

            <Link to={ROUTERS.USERS.ORDER_LOOKUP} className="user-option">
              <AiOutlineFileSearch />
              <span>Tra cứu</span>
            </Link>
            <Link to={ROUTERS.USERS.GET_SHOP} className="user-option">
              <AiOutlineBorderlessTable />
              <span>Cửa hàng</span>
            </Link>
          </div>
        </div>

        <div className="header__main">
          <ul className="menu-categories">
            {mergedCategories.map((item) => (
              <li key={item.id} onClick={() => handleCategoryClick(item.id)}>
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
