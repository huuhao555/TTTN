import React, { useContext, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
// import { NotificationContext } from "../../../middleware/NotificationContext";
import { apiLink } from "../../../config/api";
// import SuccessAnimation from "../../general/Success";

const CreateCategory = () => {
  // const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });
  const [iconUrl, setIconUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setIconUrl(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);

      if (iconUrl) {
        data.append("icon", iconUrl);
      }

      const response = await fetch(apiLink + "/api/category/create", {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        alert(
          "Thêm sản phẩm không thành công! Vui lòng kiểm tra lại thông tin."
        );
        return;
      }
      setTrigger(true);

      setMessage("Thêm loại sản phẩm thành công");
      // addNotification(`${formData.name} được thêm vào danh sách sản phẩm.`);
      setTimeout(() => {
        setTrigger(false);

        navigate("/admin/quan-ly-san-pham");
      }, 1000);
      setFormData({ name: "" });
      setIconUrl(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="simple-create-product">
      <h1>Tạo Loại Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên loại sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Icon loại sản phẩm:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {iconUrl && (
            <img
              src={URL.createObjectURL(iconUrl)}
              alt="Product Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <button type="submit">Thêm loại sản phẩm</button>
      </form>
      {/* <SuccessAnimation message={message} trigger={trigger} /> */}
    </div>
  );
};

export default CreateCategory;
