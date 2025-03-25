// ChatComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./style.scss";
import { apiLink } from "../../config/api";

const ChatRealtimeComponent = ({ currentUser, currentShop, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Kết nối socket khi component được mount
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      withCredentials: true
    });

    setSocket(newSocket);

    // Đăng ký ID người dùng hoặc shop với socket server
    if (currentUser) {
      newSocket.emit("registerUser", currentUser._id);
    } else if (currentShop) {
      newSocket.emit("registerShop", currentShop._id);
    }

    // Dọn dẹp khi component unmounted
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, currentShop]);

  // Thiết lập các listeners khi socket thay đổi
  useEffect(() => {
    if (!socket) return;

    // Nhận tin nhắn mới
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Nhận trạng thái đang nhập từ người khác
    socket.on("userTyping", (data) => {
      if (data.userId === receiverId) {
        setIsTyping(true);
      }
    });

    // Nhận trạng thái dừng nhập từ người khác
    socket.on("userStopTyping", (data) => {
      if (data.userId === receiverId) {
        setIsTyping(false);
      }
    });

    // Xác nhận tin nhắn đã được gửi
    socket.on("messageSent", (response) => {
      console.log("Tin nhắn đã được gửi:", response);
    });

    // Thông báo lỗi
    socket.on("messageError", (error) => {
      console.error("Lỗi gửi tin nhắn:", error);
      setError("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
      setTimeout(() => setError(null), 3000);
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("messageSent");
      socket.off("messageError");
    };
  }, [socket, receiverId]);

  // Lấy lịch sử tin nhắn khi component được mount
  useEffect(() => {
    const fetchMessageHistory = async () => {
      setIsLoading(true);
      try {
        const senderId = currentUser ? currentUser._id : currentShop._id;
        const response = await fetch(
          `${apiLink}/api/messages/history/${senderId}/${receiverId}`
        );

        if (!response.ok) {
          throw new Error("Không thể tải lịch sử tin nhắn");
        }

        const data = await response.json();
        if (data.status === "OK") {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching message history:", error);
        setError("Không thể tải lịch sử tin nhắn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (receiverId) {
      fetchMessageHistory();
    }
  }, [currentUser, currentShop, receiverId]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket) return;

    const senderId = currentUser ? currentUser._id : currentShop._id;

    socket.emit("sendMessage", {
      senderId,
      receiverId,
      message: messageInput
    });

    // Thêm tin nhắn vào state ngay lập tức để UI phản hồi nhanh
    setMessages((prev) => [
      ...prev,
      { senderId, receiverId, message: messageInput, timestamp: new Date() }
    ]);

    setMessageInput("");

    // Dừng trạng thái đang nhập
    socket.emit("stopTyping", { senderId, receiverId });
    clearTimeout(typingTimeoutRef.current);
  };

  // Xử lý đang nhập
  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    const senderId = currentUser ? currentUser._id : currentShop._id;

    // Nếu đang nhập, gửi sự kiện đang nhập
    if (!isTyping) {
      socket.emit("typing", { senderId, receiverId });
      setIsTyping(true);
    }

    // Thiết lập timeout để dừng trạng thái đang nhập sau 2 giây
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { senderId, receiverId });
      setIsTyping(false);
    }, 2000);
  };

  // Xử lý khi nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-container">
      {error && <div className="error-message">{error}</div>}

      <div className="messages-container">
        {isLoading ? (
          <div className="loading-indicator">Đang tải tin nhắn...</div>
        ) : messages.length === 0 ? (
          <div className="empty-chat">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.senderId === (currentUser?._id || currentShop?._id)
                  ? "sent"
                  : "received"
              }`}
            >
              <div className="message-content">{msg.message}</div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          ))
        )}
        {isTyping && <div className="typing-indicator">Đang nhập...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <input
          type="text"
          value={messageInput}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSendMessage} disabled={!messageInput.trim()}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatRealtimeComponent;
