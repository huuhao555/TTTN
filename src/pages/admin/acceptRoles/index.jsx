import { useState, useEffect, useContext } from "react";
import "./style.scss";
import { apiLink } from "../../../config/api";
import { UserContext } from "../../../middleware/UserContext";
import SuccessAnimation from "../../../components/Success";
import { ROUTERS } from "../../../utils";
import { useNavigate } from "react-router-dom";

const UpgradeRequests = () => {
  const [users, setUsers] = useState([]);
  const { dataUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const navigator = useNavigate();
  useEffect(() => {
    const fetchUpgradeRequests = async () => {
      try {
        const response = await fetch(`${apiLink}/api/user/get-pending-sellers`);
        const result = await response.json();

        if (result.status === "OK") {
          setUsers(result.users);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchUpgradeRequests();
  }, []);

  const handleVerify = async (userId) => {
    try {
      const response = await fetch(`${apiLink}/api/user/upgrade-role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      setMessage("Xác minh shop thành công");
      setTrigger(true);
      await response.json();
      setTimeout(() => {
        navigator(ROUTERS.ADMIN.DASHBOARD);
        setTrigger(false);
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi xác minh:", error);
    }
  };

  return (
    <div className="upgrade-requests">
      <h1>Danh sách yêu cầu nâng cấp</h1>
      {users.length === 0 ? (
        <p>Không có yêu cầu nào.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id} className="request-card">
              <h2>{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p>
                <strong>Lý do nâng cấp:</strong> {user.upgradeReason}
              </p>
              <p>
                <strong>Kế hoạch kinh doanh:</strong> {user.businessPlan}
              </p>
              <div className="docs">
                {user.verificationDocs.map((doc, index) => (
                  <img key={index} src={doc} alt="Verification Document" />
                ))}
              </div>
              <button
                className="verify-btn"
                onClick={() => handleVerify(user._id)}
              >
                Xác Minh
              </button>
            </li>
          ))}
        </ul>
      )}
      <SuccessAnimation message={message} trigger={trigger} />
    </div>
  );
};

export default UpgradeRequests;
