import React, { useState, useEffect } from "react";
import "./style.scss";

const SuccessAnimation = ({ message, trigger }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className={`success-animation ${isVisible ? "show" : ""}`}>
      <div className="success-content">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
