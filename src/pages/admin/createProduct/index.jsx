import React, { useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../../../config/api";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantityStock: "",
    prices: "",
    discount: ""
  });
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      imageFiles.forEach((file) => data.append("images", file));

      const response = await fetch(apiLink + "/api/product/create", {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        alert(
          "Thêm sản phẩm không thành công! Vui lòng kiểm tra lại thông tin."
        );
        return;
      }
      setMessage("Thêm sản phẩm thành công");
      setTrigger(true);
      setTimeout(() => {
        navigate("/admin/quan-ly-san-pham");
        setTrigger(false);
      }, 1000);
      setFormData({
        name: "",
        quantityStock: "",
        prices: "",
        discount: ""
      });
      setImageFiles([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-product-admin">
      <h1>Thêm Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Số lượng trong kho:</label>
          <input
            type="number"
            name="quantityStock"
            value={formData.quantityStock}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div>
          <label>Giá:</label>
          <input
            type="number"
            name="prices"
            value={formData.prices}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div>
          <label>Giảm giá (%):</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div className="image">
          <label>Ảnh sản phẩm:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {imageFiles.map((file, index) => (
              <div key={index} className="image-container">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="preview-img"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeImage(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default CreateProduct;
