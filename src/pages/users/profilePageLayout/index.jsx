import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Modal } from "antd";
import Footer from "../theme/footer";
import "./style.scss";
// import header from "../theme/header";
import {
  UserOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Header from "../theme/header";
import { UserProvider } from "../../../middleware/UserContext";

const { Sider, Content } = Layout;

const ProfilePageLayout = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("1");

  const getNameUser = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("dataUser"));
      if (user && user.dataUser) {
        return user.dataUser.name;
      }
      return "User";
    } catch (error) {
      return "User";
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      className: "custom-modal",
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      okButtonProps: {
        style: {
          backgroundColor: "#ffd500",
          color: "black",
        },
      },
      onOk: () => {
        sessionStorage.clear();
        navigate("/");
      },
    });
  };

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Thông tin người dùng",
      onClick: () => navigate("/thong-tin-ca-nhan"),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: "Quản lí đơn hàng",
      onClick: () => navigate("/quan-ly-don-hang-ca-nhan"),
    },
    {
      key: "3",
      icon: <EnvironmentOutlined />,
      label: "Sổ địa chỉ",
      onClick: () => navigate("/so-dia-chi"),
    },
    {
      key: "4",
      icon: <ShoppingCartOutlined />,
      label: "Lịch sử sản phẩm đã xem",
      onClick: () => navigate("/lich-su-san-pham-da-xem"),
    },
  ];

  return (
    <UserProvider>
      <Header />
      <div style={{ marginTop: "50px" }} className="container">
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider width={250} theme="light">
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>{getNameUser()}</h2>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={(e) => setSelectedKey(e.key)}
              items={menuItems}
            />
            <div className="logoutBtn" style={{ textAlign: "center" }}>
              <div className="layoutBox">
                <button className="btn" onClick={handleLogout}>
                  <LogoutOutlined />
                  Đăng xuất
                </button>
              </div>
            </div>
          </Sider>
          <Content
            style={{ padding: "24px", minHeight: 280, backgroundColor: "#fff" }}
          >
            <Outlet />
          </Content>
        </Layout>
      </div>
      <Footer />
    </UserProvider>
  );
};

export default ProfilePageLayout;
