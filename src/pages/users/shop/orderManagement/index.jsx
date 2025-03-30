import React, { useContext, useEffect, useState } from "react";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import PendingOrders from "./PendingOrders";
import ShippingOrders from "./ShippingOrders";
import DeliveredOrders from "./DeliveredOrders";
import CancelledOrders from "./CancelledOrders";
import { UserContext } from "../../../../middleware/UserContext";
import { apiLink } from "../../../../config/api";

const OrderStorage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { dataUser } = useContext(UserContext) || {};
  const [count, setCount] = useState(0);
  const tabs = [
    {
      id: "Pending",
      label: "Đang xử lý",
      icon: <FaBox />,
      count: 5,
      color: "#ff9800"
    },
    {
      id: "Shipped",
      label: "Đang giao",
      icon: <FaShippingFast />,
      count: 3,
      color: "#2196f3"
    },
    {
      id: "Delivered",
      label: "Đã giao",
      icon: <FaCheckCircle />,
      count: 12,
      color: "#4caf50"
    },
    {
      id: "Cancelled",
      label: "Đã huỷ",
      icon: <FaTimesCircle />,
      count: 2,
      color: "#f44336"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Pending":
        return <PendingOrders />;
      case "Shipped":
        return <ShippingOrders />;
      case "Delivered":
        return <DeliveredOrders />;
      case "Cancelled":
        return <CancelledOrders />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchPendingOrders = async () => {
      const shopId = dataUser?.dataUser?.shopId;

      if (!shopId) {
        console.error("User ID is not available");
        return;
      }

      try {
        const response = await fetch(
          apiLink + `/api/order/getAllByShop/${shopId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        const statusCount = data?.data.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});
        console.log(statusCount);
        setCount(statusCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchPendingOrders();
  }, [dataUser]);

  return (
    <div className="orders-container">
      {/* Tổng quan */}
      <div className="orders-summary">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="summary-card"
            style={{ borderColor: tab.color }}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="summary-icon" style={{ color: tab.color }}>
              {tab.icon}
            </div>
            <div className="summary-info">
              <span className="summary-label">{tab.label}</span>
              <span className="summary-count">{count[tab.id] || 0} đơn</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chi tiết */}
      <div className="orders-details">
        <h2>{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
        <div className="details-list">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default OrderStorage;
