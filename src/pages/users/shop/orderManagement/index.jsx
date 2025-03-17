import React, { useState } from "react";
import PendingOrders from "./PendingOrders";
import ShippingOrders from "./ShippingOrders";
import DeliveredOrders from "./DeliveredOrders";
import CancelledOrders from "./CancelledOrders";
import "./style.scss";

const OrderStorage = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const renderTabContent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingOrders />;
      case "shipping":
        return <ShippingOrders />;
      case "delivered":
        return <DeliveredOrders />;
      case "cancelled":
        return <CancelledOrders />;
      default:
        return null;
    }
  };

  const getFilledClass = (step) => {
    const steps = ["pending", "shipping", "delivered", "cancelled"];
    return steps.indexOf(activeTab) >= step ? "filled" : "";
  };
  const getCircleClass = (step) => {
    const steps = ["pending", "shipping", "delivered", "cancelled"];
    return steps.indexOf(activeTab) >= step ? "filled" : "";
  };

  return (
    <div className="order-status-page">
      <div className="tabs">
        <div className="status-indicator">
          <div
            className="status-circle-container"
            onClick={() => setActiveTab("pending")}
          >
            <div className={`status-circle ${getCircleClass(0)}`}>1</div>
            <div>Đang xử lý</div>
          </div>
          <div className={`status-line ${getFilledClass(1)}`}></div>
          <div
            className="status-circle-container"
            onClick={() => setActiveTab("shipping")}
          >
            <div className={`status-circle ${getCircleClass(1)}`}>2</div>
            <div>Đang giao</div>
          </div>
          <div className={`status-line ${getFilledClass(2)}`}></div>
          <div
            className="status-circle-container"
            onClick={() => setActiveTab("delivered")}
          >
            <div className={`status-circle ${getCircleClass(2)}`}>3</div>
            <div>Đã giao</div>
          </div>
          <div className={`status-line ${getFilledClass(3)}`}></div>
          <div
            className="status-circle-container"
            onClick={() => setActiveTab("cancelled")}
          >
            <div className={`status-circle ${getCircleClass(3)}`}>4</div>
            <div>Đã huỷ</div>
          </div>
        </div>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default OrderStorage;
