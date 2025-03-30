import React, { useContext, useState, useEffect, useRef } from "react";
import "./style.scss";
import { UserContext } from "../../middleware/UserContext";
import io from "socket.io-client";

const socket = io("http://localhost:5050", {
  autoConnect: false,
  transports: ["websocket"]
});

const ChatBoxComponent = ({ shopId, onClose }) => {
  const { dataUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  const userName = dataUser?.dataUser?.name || "Khách hàng ẩn danh";
  const userEmail = dataUser?.dataUser?.email || "Không có email";

  useEffect(() => {
    if (shopId) {
      socket.emit("joinShop", shopId);
    }

    socket.connect();

    const handleReceiveMessage = (data) => {
      console.log(123);
      console.log("Tin nhắn nhận được:", data);
      if (data.shopId === shopId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, [shopId]);

  const sendMessage = () => {
    if (message.trim() && shopId) {
      const data = {
        shopId,
        text: message,
        sender: {
          name: userName,
          email: userEmail
        }
      };
      console.log("Gửi tin nhắn:", data);
      socket.emit("sendMessage", data);

      setMessage("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-header">
        <span>Chat với Shop</span>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="chat-content">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender.email === userEmail ? "sent" : "received"
            }`}
          >
            <strong>{msg.sender.name}</strong>: {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBoxComponent;
