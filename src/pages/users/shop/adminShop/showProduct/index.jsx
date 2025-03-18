import React, { useState, useEffect, useContext } from "react";
import "./style.scss";
import {
  FaInfoCircle,
  FaCaretRight,
  FaCaretLeft,
  FaEdit,
} from "react-icons/fa";
import { apiLink } from "../../../../../config/api";
import { UserContext } from "../../../../../middleware/UserContext";
import Swal from "sweetalert2";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const { dataUser } = useContext(UserContext);
  const shopId = dataUser?.dataUser?.shopId;
  console.log(dataUser);
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Thay URL API thực tế của bạn vào đây
      const response = await fetch(
        apiLink + `/api/product/getAllByShop/${shopId}`
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu sản phẩm");
      }

      const data = await response.json();
      console.log(data);
      setProducts(data?.data || []);
      setTotalProducts(data.total || 0);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${apiLink}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tải ảnh lên");
      }

      const data = await response.json();
      return data.imageUrl; // Giả sử API trả về URL của ảnh đã upload
    } catch (error) {
      throw new Error("Không thể tải ảnh lên: " + error.message);
    }
  };

  // Hàm xử lý cập nhật sản phẩm
  const handleUpdate = async (product) => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Cập nhật sản phẩm",
        html: `
          <div class="update-form">
            <div class="image-preview">
              <img src="${product.imageUrls[1]}" id="preview-image" style="max-width: 200px; margin-bottom: 10px;">
            </div>
            <input type="file" id="swal-input1" class="swal2-file" accept="image/*" style="margin-bottom: 10px;">
            <input id="swal-input2" class="swal2-input" placeholder="Tên sản phẩm" value="${product.name}">
            <input id="swal-input3" class="swal2-input" placeholder="Giá" value="${product.prices}">
            <input id="swal-input4" class="swal2-input" placeholder="Số lượng" value="${product.quantityInStock}">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",
        didOpen: () => {
          // Xử lý preview ảnh khi chọn file mới
          const fileInput = document.getElementById("swal-input1");
          const previewImage = document.getElementById("preview-image");

          fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                previewImage.src = e.target.result;
              };
              reader.readAsDataURL(file);
            }
          });
        },
        preConfirm: async () => {
          const fileInput = document.getElementById("swal-input1");
          const file = fileInput.files[0];
          let imageUrl = product.imageUrls[1];

          try {
            if (file) {
              imageUrl = await handleImageUpload(file);
            }

            return {
              imageUrls: [imageUrl, imageUrl], // Cập nhật cả hai URL ảnh giống nhau
              name: document.getElementById("swal-input2").value,
              prices: document.getElementById("swal-input3").value,
              quantityInStock: document.getElementById("swal-input4").value,
            };
          } catch (error) {
            Swal.showValidationMessage(`Lỗi: ${error.message}`);
          }
        },
      });

      if (formValues) {
        const response = await fetch(
          `${apiLink}/api/product/update/${product._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
          }
        );

        if (response.ok) {
          Swal.fire("Thành công!", "Sản phẩm đã được cập nhật.", "success");
          fetchProducts(); // Tải lại danh sách sản phẩm
        } else {
          throw new Error("Lỗi khi cập nhật sản phẩm");
        }
      }
    } catch (error) {
      Swal.fire("Lỗi!", error.message, "error");
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (_id) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Bạn không thể hoàn tác sau khi xóa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `${apiLink}/api/product/delete-product/${_id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
          fetchProducts(currentPage); // Tải lại danh sách sản phẩm
        } else {
          throw new Error("Lỗi khi xóa sản phẩm");
        }
      }
    } catch (error) {
      Swal.fire("Lỗi!", error.message, "error");
    }
  };

  return (
    <div className="container">
      <div className="product-table-container">
        <div className="table-header">
          <h2>{totalProducts} Sản Phẩm</h2>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="error">Lỗi: {error}</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th className="product-name-col">Tên sản phẩm</th>

                  <th className="price-col">
                    Giá <span className="sort-icon">▼</span>
                  </th>
                  <th className="inventory-col">
                    Kho hàng <FaInfoCircle className="info-icon" />
                    <span className="sort-icon">▼</span>
                  </th>
                  <th>
                    Chỉnh sửa
                    <FaEdit className="info-icon" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="product-info">
                        <div className="product-image-container">
                          <img
                            src={product.imageUrls[1]}
                            alt={product.name}
                            className="product-image"
                          />
                        </div>
                        <div className="product-details">
                          <div className="product-name">{product.name}</div>
                        </div>
                      </td>

                      <td className="price">{product.prices}</td>
                      <td className="inventory">{product.quantityInStock}</td>

                      <td className="actions">
                        <button
                          className="action-btn update"
                          onClick={() => handleUpdate(product)}
                        >
                          Cập nhật
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
