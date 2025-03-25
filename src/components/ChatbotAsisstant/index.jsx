import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import { AiFillWechat } from "react-icons/ai";

const ChatSocket = () => {
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const toggleChatbot = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "Tôi có thể giúp gì cho bạn?" }
    ]);
  }, []);

  const sendMessage = async (message) => {
    if (!message) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message }
    ]);

    try {
      const response = await fetch(" http://127.0.0.1:5000/api/get_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.response }
      ]);
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi yêu cầu:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Xin lỗi, đã có lỗi xảy ra." }
      ]);
    }
  };

  const handleSend = () => {
    sendMessage(userInput);
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setUserInput(textarea.value);
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <div className="chatbot-icon blink-animation" onClick={toggleChatbot}>
          <AiFillWechat />
        </div>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span> Air có thể giúp gì cho bạn?</span>
            <button className="close-btn" onClick={toggleChatbot}>
              ✖
            </button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập nội dung..."
                rows="1"
              />
              <button onClick={handleSend}>Gửi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSocket;
