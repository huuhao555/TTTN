import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { apiLink } from "../../../../config/api";
import { UserContext } from "../../../../middleware/UserContext";
import SuccessAnimation from "../../../../components/Success";

const EditProductShop = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesChild, setCategoriesChild] = useState([]);
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  console.log(product);
  const { dataUser } = useContext(UserContext);
  const [oldImages, setOldImages] = useState(product.imageUrls || []);

  const [formData, setFormData] = useState({
    name: product.name || "",
    quantityInStock: product.quantityInStock || "",
    prices: product.prices || "",
    discount: product.discount || 0,
    categoryId: product.categoryId || "",
    categoryIdParent: product.categoryIdParent || "",
    description: product.description || "",
    shopId: dataUser?.dataUser?.shopId
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiLink + `/api/category/get-parents/`);
        if (!response.ok) {
          console.error("Error fetching categories");
          return;
        }
        const data = await response.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData.categoryIdParent) {
      setCategoriesChild([]);
      return;
    }

    const fetchCategoriesChild = async () => {
      try {
        const response = await fetch(
          `${apiLink}/api/category/get-subcategories/${formData.categoryIdParent}`
        );
        if (!response.ok) {
          console.error("Error fetching subcategories");
          return;
        }
        const data = await response.json();
        setCategoriesChild(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategoriesChild();
  }, [formData.categoryIdParent]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryIdParent") {
      setFormData({ ...formData, categoryIdParent: value, categoryId: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]); // Thêm ảnh mới vào danh sách
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

      const response = await fetch(
        apiLink + `/api/product/update/${product?._id}`,
        {
          method: "PUT",
          body: data
        }
      );
      console.log(response);

      if (!response.ok) {
        alert(
          "Sửa sản phẩm không thành công! Vui lòng kiểm tra lại thông tin."
        );
        return;
      }
      setTrigger(true);
      setMessage("Sửa sản phẩm thành công");
      setFormData({
        name: "",
        quantityInStock: "",
        prices: "",
        discount: 0,
        categoryId: "",
        categoryIdParent: "",
        description: ""
      });
      setTimeout(() => {
        setTrigger(false);
      }, 1000);

      setImageFiles([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-product-admin">
      <h1>Sửa Sản Phẩm</h1>
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
          <label>Loại sản phẩm:</label>
          <select
            name="categoryIdParent"
            value={formData.categoryIdParent}
            onChange={handleChange}
          >
            <option value="">Chọn loại sản phẩm</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Loại sản phẩm con:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Chọn loại sản phẩm con</option>
            {categoriesChild.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Số lượng trong kho:</label>
          <input
            type="number"
            name="quantityInStock"
            value={formData.quantityInStock}
            onChange={handleChange}
            required
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
        <div>
          <label>Mô tả sản phẩm:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Hình ảnh sản phẩm:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {/* Ảnh cũ từ server */}
            {oldImages.map((url, index) => (
              <div key={`old-${index}`} className="image-item">
                <img src={url} alt={`Ảnh ${index + 1}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    setOldImages((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  X
                </button>
              </div>
            ))}

            {/* Ảnh mới được chọn từ máy */}
            {imageFiles.map((file, index) => (
              <div key={`new-${index}`} className="image-item">
                <img src={URL.createObjectURL(file)} alt="Ảnh mới" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeImage(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Sửa sản phẩm</button>
      </form>
      <SuccessAnimation message={message} trigger={trigger} />
    </div>
  );
};

export default EditProductShop;
