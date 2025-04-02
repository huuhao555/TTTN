import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { apiLink } from "../../../../../config/api";
import { UserContext } from "../../../../../middleware/UserContext";
import { ROUTERS } from "../../../../../utils";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { dataUser } = useContext(UserContext);
  const shopId = dataUser?.dataUser?.shopId;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          apiLink + `/api/product/getAllByShop/${shopId}`
        );
        const data = await response.json();
        setProducts(data?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shopId]);

  const handleEdit = (product) => {
    navigate(ROUTERS.SHOP.EDIT_PRODUCT_SHOP, { state: product });
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        apiLink + `/api/product/delete-product/${productId}`,
        {
          method: "DELETE"
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.error("Error deleting product:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-management">
      <table className="product-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="product-image"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.prices.toLocaleString("vi-VN")} VND</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
