import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import "./style.scss";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNameMap = {
    "thong-tin-ca-nhan": "Thông tin cá nhân",
    "quan-ly-don-hang-ca-nhan": "Quản lý đơn hàng",
    "so-dia-chi": "Sổ địa chỉ",
    "lich-su-san-pham-da-xem": "Lịch sử sản phẩm đã xem",
    "san-pham": "Sản phẩm",
    "gio-hang": "Giỏ hàng",
    "tra-cuu": "Tra cứu",
    "dang-nhap": "Đăng nhập",
    "dang-ky": "Đăng ký",
    "quen-mat-khau": "Quên mật khẩu",
    "chi-tiet-san-pham": "Chi tiết sản phẩm"
  };

  const breadcrumbItems = [
    { title: <Link to="/">Trang chủ</Link>, key: "home" },
    ...pathnames.map((path, index) => {
      const url = `/${pathnames.slice(0, index + 1).join("/")}`;
      const name = breadcrumbNameMap[path] || path;
      return { title: <Link to={url}>{name}</Link>, key: url };
    })
  ];

  return (
    <div className="breadcrumbs-container">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumbs;
