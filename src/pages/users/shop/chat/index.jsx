import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { UserContext } from "../../../../middleware/UserContext";
import "./style.scss";
const socket = io("http://localhost:5050");

const ShopChat = () => {
  const { dataUser } = useContext(UserContext);
  const shopId = dataUser?.dataUser?.shopId;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  console.log(selectedCustomer);
  const [customers, setCustomers] = useState([]);
  console.log(customers);
  useEffect(() => {
    if (!shopId) return;

    socket.emit("joinShop", shopId);
    console.log(`Tham gia phòng chat shop ${shopId}`);

    const handleReceiveMessage = (data) => {
      console.log("Nhận tin nhắn:", data);
      if (data.shopId === shopId) {
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) =>
              msg.text === data.text && msg.sender.email === data.sender.email
          );
          return isDuplicate ? prev : [...prev, data];
        });

        // Chỉ thêm vào danh sách nếu sender không phải shop
        if (data.sender.email !== dataUser?.dataUser?.email) {
          setCustomers((prev) => {
            const exists = prev.some(
              (customer) => customer.email === data.sender.email
            );
            return exists ? prev : [...prev, data.sender];
          });
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [shopId]);

  const sendMessage = () => {
    if (!message.trim() || !selectedCustomer) return;

    const data = {
      shopId,
      text: message,
      sender: {
        name: dataUser?.dataUser?.name,
        email: dataUser?.dataUser?.email
      },
      receiver: selectedCustomer.email
    };

    console.log("Gửi tin nhắn:", data);
    socket.emit("sendMessage", data);

    setMessage(""); // Xóa nội dung input sau khi gửi
  };

  return (
    <div className="chat-container">
      <h2>Tin nhắn từ khách hàng</h2>

      <div className="customer-list">
        <h3>Khách hàng đang chat</h3>
        {customers.length === 0 ? (
          <p>Chưa có khách hàng nào chat</p>
        ) : (
          customers.map((customer, index) => (
            <div
              key={index}
              className={`customer ${
                selectedCustomer?.email === customer?.email ? "active" : ""
              }`}
              onClick={() => setSelectedCustomer(customer)}
            >
              {customer.name} ({customer.email})
            </div>
          ))
        )}
      </div>

      {selectedCustomer && (
        <>
          <h3>Chat với {selectedCustomer.name}</h3>
          <div className="messages">
            {messages
              .filter((msg) => {
                const isSentByCustomer =
                  msg.sender.email === selectedCustomer?.email;

                const isSentByShop =
                  msg.sender.email === dataUser?.dataUser?.email;
                return isSentByCustomer || isSentByShop;
              })
              .map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender.email === dataUser?.dataUser?.email
                      ? "shop"
                      : "customer"
                  }`}
                >
                  <strong>{msg.sender.name}:</strong> {msg.text}
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

export default ShopChat;
