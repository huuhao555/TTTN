import "./style.scss";
import { RiDeleteBin5Line } from "react-icons/ri";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../../../middleware/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

// import LoadingSpinner from "../../../component/general/LoadingSpinner";
// import SuccessAnimation from "../../../component/general/Success";
// import look from "../../../../src/assets/empty_cart.png";
import { apiLink } from "../../../config/api";
import { ROUTERS } from "../../../utils";

const CartPage = () => {
  const [cart, setCart] = useState(null);

  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState(false);

  const { dataUser, updateCartCount } = useContext(UserContext);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigator = useNavigate();
  const { pathname } = useLocation();
  useEffect(
    () => {
      if (cart && cart.products) {
        const allProductIds = cart?.products.map((item) => item?.productId._id);
        setSelectedProducts(allProductIds);
      }
      window.scrollTo(0, 0);
    },

    [cart],
    [pathname]
  );

  const getAllCart = useCallback(async () => {
    if (!dataUser || !dataUser.dataUser) return;

    try {
      const response = await fetch(
        apiLink + `/api/cart/get-cart/${dataUser?.dataUser?.id}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const dataCart = await response.json();

      setCart(dataCart?.groupedByShop);
      console.log(dataCart);
    } catch (error) {
      console.error("Failed to fetch count for users:", error);
    }
  }, [dataUser]);

  useEffect(() => {
    getAllCart();
  }, [getAllCart]);
  const paymentCart = async (selectedProducts) => {
    navigator(ROUTERS.USERS.ORDER_DETAIL, {
      state: { selectedProducts }
    });
  };

  const removeFromCart = async (productId, userID) => {
    try {
      const response = await fetch(
        apiLink +
          `/api/cart/delete-product-cart/${userID}/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setMessage("Xoá sản phẩm thành công");
      setTrigger(true);
      await getAllCart();
      const dataProduct = await response.json();

      // updateCartCount(dataProduct.data.products.length);
      setTimeout(() => {
        setTrigger(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to delete product from cart:", error);
    }
  };

  const clearCart = async (userID) => {
    if (!window.confirm("Bạn có chắc chắn muốn giỏ hàng?")) {
      return;
    }
    try {
      const response = await fetch(
        apiLink + `/api/cart/delete-cart/${userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      await response.json();
      setMessage("Xoá giỏ hành thành công");
      setTrigger(true);
      setCart("");
      updateCartCount(0);
    } catch (error) {
      console.error("Failed to delete product from cart:", error);
    }
  };

  const handleIncrease = async ({ id }) => {
    if (!dataUser) {
      alert("Vui lòng đăng nhập");
      return;
    }

    try {
      const response = await fetch(apiLink + "/api/cart/add-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: dataUser.dataUser.id,
          productId: id,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const dataCart = await response.json();

      // const updatedCount = dataCart.data.products.length;
      // updateCartCount(updatedCount);
      setCart(dataCart?.data);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleDecrease = async (id) => {
    try {
      const response = await fetch(apiLink + "/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: dataUser?.dataUser.id,
          productId: id,
          quantity: 1
        })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const dataCart = await response.json();

      // const updatedCount = dataCart.data.products.length;
      // updateCartCount(updatedCount);
      setCart(dataCart?.data);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  // if (!user) {
  //   return <LoadingSpinner />;
  // }

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products
      .filter((item) => selectedProducts.includes(item?.productId._id))
      .reduce(
        (total, item) =>
          total + item?.productId.promotionPrice * item?.quantity,
        0
      );
  };
  return (
    <div>
      {Object.entries(cart || {})?.map(([shopId, products]) => {
        console.log(shopId, products);
        return (
          <div key={shopId} className="shop-section">
            <h2 className="shop-title">Cửa hàng: {shopId}</h2>
            <table>
              <thead>
                <tr>
                  <th>Chọn</th>
                  <th>#</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item, key) => (
                  <tr key={item?._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(item?.productId._id)}
                        onChange={() =>
                          handleCheckboxChange(item?.productId._id)
                        }
                      />
                    </td>
                    <td>{key + 1}</td>
                    <td>{item?.productId.name}</td>
                    <td>
                      {parseInt(item?.productId?.prices) ===
                      item?.productId?.promotionPrice ? (
                        <p className="prices">
                          {parseInt(item?.productId?.prices).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          ₫
                        </p>
                      ) : (
                        <div className="grp-price">
                          <p className="price-old">
                            {parseInt(item?.productId?.prices).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            ₫
                          </p>
                          <div className="grp-price-new">
                            <p className="price-new">
                              {parseInt(
                                item?.productId?.promotionPrice
                              ).toLocaleString("vi-VN")}{" "}
                              ₫
                            </p>
                            <p className="discount">
                              -{item?.productId?.discount}%
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="handle-quantity">
                        <span
                          onClick={() => handleDecrease(item?.productId._id)}
                          className="button-decrease"
                        >
                          –
                        </span>
                        <div>{item?.quantity}</div>
                        <span
                          onClick={() =>
                            handleIncrease({ id: item?.productId._id })
                          }
                          className="button-increase"
                        >
                          +
                        </span>
                      </div>
                    </td>
                    <td className="total-price">
                      {parseInt(
                        item?.productId?.promotionPrice * item?.quantity
                      ).toLocaleString("vi-VN")}{" "}
                      ₫
                    </td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() =>
                          removeFromCart(
                            item?.productId._id,
                            dataUser?.dataUser.id
                          )
                        }
                      >
                        <RiDeleteBin5Line /> Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <div className="cart-summary">
        <button
          className="clear-cart"
          onClick={() => clearCart(dataUser?.dataUser.id)}
        >
          Xoá giỏ hàng
        </button>
        <button
          className="payment-cart"
          onClick={() => paymentCart(selectedProducts)}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default CartPage;
