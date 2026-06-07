import { useEffect, useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { API_URL } from "../../constant"

const Cart = () => {

  const [cartItems, setCartItems] = useState([])

  // LOAD CART
  useEffect(() => {

    const cart =
      JSON.parse(localStorage.getItem("cart")) || []

    setCartItems(cart)

  }, [])

  // UPDATE QUANTITY
  const handleQuantityChange = (id, quantity) => {

    const parsedQuantity = Number(quantity)

    // PREVENT INVALID VALUE
    if (parsedQuantity < 1) return

    const updatedCart = cartItems.map((item) => {

      if (item.id === id) {

        // CHECK STOCK
        if (parsedQuantity > item.stock) {

          toast.error(
            `Chỉ còn ${item.stock} sản phẩm trong kho!`
          )

          return {
            ...item,
            quantity: item.stock
          }
        }

        return {
          ...item,
          quantity: parsedQuantity
        }
      }

      return item
    })

    setCartItems(updatedCart)

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    )

    window.dispatchEvent(new Event("storage"))
  }

  // REMOVE PRODUCT
  const handleRemove = (id) => {

    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    )

    setCartItems(updatedCart)

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    )

    window.dispatchEvent(new Event("storage"))

    toast.success("Đã xóa sản phẩm khỏi giỏ hàng!")
  }

  // TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  return (
    <>
      <Header />

      <div className="cart-main-area mt-20 mb-70">

        <div className="container">

          <div className="row">

            <div className="col-lg-12">

              <div className="table-content table-responsive mb-15 border-1">

                <table className="table align-middle">

                  <thead>

                    <tr>

                      <th className="product-thumbnail">
                        Hình ảnh
                      </th>

                      <th className="product-name">
                        Sản phẩm
                      </th>

                      <th className="product-price">
                        Giá
                      </th>

                      <th className="product-quantity">
                        Số lượng
                      </th>

                      <th className="product-subtotal">
                        Tổng
                      </th>

                      <th className="product-remove">
                        Xóa
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      cartItems.length > 0 ? (

                        cartItems.map((item) => (

                          <tr key={item.id}>

                            {/* IMAGE */}
                            <td className="product-thumbnail">

                              <img
                                src={`${API_URL}${item.imageUrl}`}
                                alt={item.name}
                                style={{
                                  width: "80px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "6px"
                                }}
                              />

                            </td>

                            {/* PRODUCT */}
                            <td className="product-name">

                              <div>

                                <div className="fw-bold mb-1">
                                  {item.name}
                                </div>

                                <small className="text-muted">
                                  {item.category}
                                </small>

                              </div>

                            </td>

                            {/* PRICE */}
                            <td className="product-price">

                              <span className="amount text-danger fw-bold">

                                {item.price.toLocaleString("vi-VN")} VNĐ

                              </span>

                            </td>

                            {/* QUANTITY */}
                            <td className="product-quantity">

                              <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                className="form-control"
                                style={{
                                  width: "100%"
                                }}
                              />

                              <small className="text-muted d-block mt-1">
                                Tồn kho: {item.stock}
                              </small>

                            </td>

                            {/* SUBTOTAL */}
                            <td className="product-subtotal fw-bold">

                              {
                                (
                                  item.price *
                                  item.quantity
                                ).toLocaleString("vi-VN")
                              } VNĐ

                            </td>

                            {/* REMOVE */}
                            <td className="product-remove">

                              <button
                                className="border-0 bg-transparent"
                                onClick={() =>
                                  handleRemove(item.id)
                                }
                              >

                                <i className="fa fa-times text-danger"></i>

                              </button>

                            </td>

                          </tr>

                        ))

                      ) : (

                        <tr>

                          <td
                            colSpan="6"
                            className="text-center py-5"
                          >

                            <h5 className="mb-3">
                              Giỏ hàng đang trống
                            </h5>

                            <Link
                              to="/category"
                              className="btn btn-dark"
                            >
                              Mua sắm ngay
                            </Link>

                          </td>

                        </tr>

                      )
                    }

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* TOTAL */}
          {
            cartItems.length > 0 && (

              <div className="row">

                <div className="col-lg-8 col-md-6 col-12">

                  <div className="buttons-cart mb-30">

                    <ul className="list-unstyled">

                      <li>

                        <Link to="/category">
                          Tiếp tục mua sắm
                        </Link>

                      </li>

                    </ul>

                  </div>

                </div>

                <div className="col-lg-4 col-md-6 col-12">

                  <div className="cart_totals">

                    <table>

                      <tbody>

                        <tr className="order-total">

                          <th>Tổng cộng</th>

                          <td>

                            <strong>

                              <span className="amount text-danger">

                                {
                                  totalPrice.toLocaleString("vi-VN")
                                } VNĐ

                              </span>

                            </strong>

                          </td>

                        </tr>

                      </tbody>

                    </table>

                    <div className="wc-proceed-to-checkout">

                      <Link
                        to="/checkout"
                        className="text-decoration-none text-white"
                      >
                        Tiến hành thanh toán
                      </Link>

                    </div>

                  </div>

                </div>

              </div>
            )
          }

        </div>

      </div>

      <Footer />
    </>
  )
}

export default Cart