import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";

import "./style.scss";
import { apiLink } from "../../config/api";
import { UserContext } from "../../middleware/UserContext";

const socket = io("http://localhost:5050");

const CustomerChat = () => {
  const { dataUser } = useContext(UserContext);
  const userName = dataUser?.dataUser?.name || "Khách hàng ẩn danh";
  const userEmail = dataUser?.dataUser?.email || "Không có email";

  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`${apiLink}/api/shop/getall`);
        const data = await response.json();
        setShops(data?.data || []);
      } catch (error) {
        console.error("Lỗi fetch:", error);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      socket.emit("joinShop", selectedShop);
    }

    const handleReceiveMessage = (data) => {
      if (data.shopId === selectedShop) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedShop]);

  const sendMessage = () => {
    if (message.trim() && selectedShop) {
      const data = {
        shopId: selectedShop,
        text: message,
        sender: {
          name: userName,
          email: userEmail
        }
      };
      socket.emit("sendMessage", data);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat với cửa hàng</h2>
      <select onChange={(e) => setSelectedShop(e.target.value)}>
        <option value="">Chọn cửa hàng</option>
        {shops.map((shop) => (
          <option key={shop._id} value={shop._id}>
            {shop.name}
          </option>
        ))}
      </select>

      {selectedShop && (
        <>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.sender.name}</strong> ({msg.sender.email}):{" "}
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerChat;
