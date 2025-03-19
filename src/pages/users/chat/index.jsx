import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../middleware/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import ChatRealtimeComponent from "../../../components/chatRealtime";
import { apiLink } from "../../../config/api";
import "./style.scss";

const ChatPage = () => {
  const { dataUser } = useContext(UserContext);
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dataUser?.dataUser) {
      navigate("/dang-nhap");
      return;
    }

    fetchRecentChats();

    if (receiverId) {
      fetchReceiverInfo();
    }
  }, [dataUser, receiverId]);

  const fetchRecentChats = async () => {
    try {
      setLoading(true);
      const userId = dataUser?.dataUser?.id;
      const shopId = dataUser?.dataUser?.shopId;

      const senderId = shopId || userId;

      if (!senderId) return;

      const response = await fetch(
        `${apiLink}/api/messages/recent-chats/${senderId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recent chats");
      }

      const data = await response.json();
      if (data.status === "OK") {
        setRecentChats(data.chats);
      }
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiverInfo = async () => {
    try {
      // Determine if receiver is a user or shop
      const response = await fetch(`${apiLink}/api/user/get/${receiverId}`);
      if (response.ok) {
        const data = await response.json();
        setReceiver(data.data);
      } else {
        // Try as shop
        const shopResponse = await fetch(
          `${apiLink}/api/shop/get/${receiverId}`
        );
        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          setReceiver(shopData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching receiver info:", error);
    }
  };

  const handleChatSelect = (chatId) => {
    navigate(`/tin-nhan/${chatId}`);
  };

  return (
    <div className="chat-page">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="chat-sidebar">
              <h3>Cuộc trò chuyện gần đây</h3>
              <div className="new-chat-form">
                <input
                  type="text"
                  placeholder="Nhập ID người dùng hoặc shop..."
                  className="new-chat-input"
                  id="newChatInput"
                />
                <button 
                  className="new-chat-button"
                  onClick={() => {
                    const newReceiverId = document.getElementById('newChatInput').value.trim();
                    if (newReceiverId) {
                      handleChatSelect(newReceiverId);
                      document.getElementById('newChatInput').value = '';
                    }
                  }}
                >
                  Bắt đầu
                </button>
              </div>
              {loading ? (
                <div className="loading">Đang tải...</div>
              ) : recentChats.length === 0 ? (
                <div className="no-chats">Chưa có cuộc trò chuyện nào</div>
              ) : (
                <ul className="chat-list">
                  {recentChats.map((chat) => (
                    <li
                      key={chat.userId || chat.shopId}
                      className={`chat-item ${
                        (chat.userId || chat.shopId) === receiverId
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleChatSelect(chat.userId || chat.shopId)
                      }
                    >
                      <div className="chat-avatar">
                        {chat.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="chat-info">
                        <div className="chat-name">{chat.name}</div>
                        <div className="chat-last-message">
                          {chat.lastMessage || "Bắt đầu cuộc trò chuyện"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="col-lg-8">
            {receiverId ? (
              <div className="chat-main">
                <div className="chat-header">
                  <h2>{receiver ? receiver.name : "Đang tải..."}</h2>
                </div>
                <ChatRealtimeComponent
                  currentUser={dataUser?.dataUser}
                  currentShop={dataUser?.dataUser?.shopId}
                  receiverId={receiverId}
                />
              </div>
            ) : (
              <div className="no-chat-selected">
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
