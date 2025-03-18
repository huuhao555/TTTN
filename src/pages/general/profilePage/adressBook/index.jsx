import React, { useState, useEffect, useContext } from "react";
import { apiLink } from "../../../../config/api";
import { UserContext } from "../../../../middleware/UserContext";
import "./style.scss";
// import SuccessAnimation from "../../../../component/general/Success";

const AddressBook = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Add error state to handle userId not found
  const [trigger, setTrigger] = useState(false);
  const { dataUser } = useContext(UserContext) || {};
  const userId = dataUser?.dataUser?.id;
  console.log(dataUser);
  const fetchAddresses = async () => {
    try {
      const response = await fetch(apiLink + `/api/address/list/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiLink + "/api/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          userId,
        }),
      });
      if (!response.ok) throw new Error("Failed to create address");
      await response.json();
      setMessage("Thêm địa chỉ thành công!");
      setTrigger(true);
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      await fetchAddresses();
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const response = await fetch(
        apiLink + `/api/address/delete/${userId}/${addressId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete address");
      await response.json();
      await fetchAddresses();
      setMessage("Xoá địa chỉ thành công!");
      setTrigger(true);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  useEffect(() => {
    if (trigger) {
      const timeout = setTimeout(() => {
        setTrigger(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="address-book">
      <h1 className="address-book__title">Địa chỉ khách hàng</h1>

      <form className="address-book__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-textarea"
          ></textarea>
        </div>
        <div className="grp-form-button">
          <button type="submit" className="form-button">
            Thêm địa chỉ
          </button>
        </div>
      </form>

      <h2 className="address-book__subtitle">Danh sách địa chỉ</h2>
      {addresses.length === 0 ? (
        <p className="no-address">Không tìm thấy địa chỉ.</p>
      ) : (
        <table className="address-list">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((addr, index) => (
              <tr key={index}>
                <td>{addr.name}</td>
                <td>{addr.phone}</td>
                <td>{addr.email}</td>
                <td>{addr.address}</td>
                <td
                  style={{ alignItems: "center" }}
                  onClick={() => {
                    handleDelete(addr?._id);
                  }}
                  className="delete-icon"
                >
                  🗑️
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* <SuccessAnimation message={message} trigger={trigger} /> */}
    </div>
  );
};

export default AddressBook;
