import React, { useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../../../config/api";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });
  const [iconUrl, setIconUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconUrl(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name); // Gửi name dưới dạng text
      if (iconUrl) {
        data.append("icon", iconUrl); // Gửi file ảnh
      }

      const response = await fetch(`${apiLink}/api/category/create`, {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        alert("Thêm loại sản phẩm không thành công! Vui lòng kiểm tra lại.");
        return;
      }

      setTrigger(true);
      setMessage("Thêm loại sản phẩm thành công");

      setTimeout(() => {
        setTrigger(false);
        // navigate("/admin/quan-ly-san-pham");
      }, 1000);

      setFormData({ name: "" });
      setIconUrl(null);
      setPreview(null);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };

  return (
    <div className="simple-create-product">
      <h1>Tạo Loại Sản Phẩm</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          {preview && (
            <img
              src={preview}
              alt="Product Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <button type="submit">Thêm loại sản phẩm</button>
      </form>
    </div>
  );
};

export default CreateCategory;
