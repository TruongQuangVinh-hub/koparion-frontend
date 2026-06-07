import { useEffect, useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { toast } from "react-toastify"
import { checkoutByCustomerAPI } from "../../api/backendAPI"
import { useNavigate } from "react-router-dom"

const Checkout = () => {

  const navigate = useNavigate()

  const [cartItems, setCartItems] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [paymentMethod, setPaymentMethod] =
    useState("VNPAY")

  // CUSTOMER INFO
  const [customerName, setCustomerName] =
    useState("")

  const [customerPhone, setCustomerPhone] =
    useState("")

  const [address, setAddress] =
    useState("")

  const [ward, setWard] =
    useState("")

  const [province, setProvince] =
    useState("")

  // LOAD CART
  useEffect(() => {

    const cart =
      JSON.parse(localStorage.getItem("cart")) || []

    setCartItems(cart)

  }, [])

  // TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  // VALIDATE STOCK
  const validateStockBeforeCheckout = () => {

    for (const item of cartItems) {

      if (item.quantity > item.stock) {

        toast.error(
          `${item.name} chỉ còn ${item.stock} sản phẩm!`
        )

        return false
      }

      if (item.stock <= 0) {

        toast.error(
          `${item.name} đã hết hàng!`
        )

        return false
      }
    }

    return true
  }

  // SUBMIT ORDER
  const handleSubmitOrder = async (e) => {

    e.preventDefault()

    if (loading) return

    if (cartItems.length === 0) {

      toast.error("Giỏ hàng đang trống!")

      return
    }

    // CHECK STOCK
    const isValidStock =
      validateStockBeforeCheckout()

    if (!isValidStock) return

    setLoading(true)

    // MERGE ADDRESS
    const customerAddress =
      `${address}, ${ward}, ${province}`

    // CREATE JSON
    const payload = {

      order: {
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod
      },

      details: cartItems.map((item) => ({

        product: {
          id: item.id
        },

        quantity: item.quantity,

        price: item.price

      }))
    }

    try {

      const res =
        await checkoutByCustomerAPI(payload)

      // VNPAY
      if (
        paymentMethod === "VNPAY" &&
        res.paymentUrl
      ) {

        localStorage.removeItem("cart")

        window.dispatchEvent(
          new Event("storage")
        )

        window.location.href =
          res.paymentUrl

        return
      }

      // COD SUCCESS
      if (paymentMethod === "COD") {

        toast.success(
          "Đặt hàng thành công!"
        )

        // CLEAR CART
        localStorage.removeItem("cart")

        setCartItems([])

        // UPDATE HEADER
        window.dispatchEvent(
          new Event("storage")
        )

        // NAVIGATE
        navigate("/complete-order")
      }

    } catch (error) {

      console.log(error)

      toast.error("Đặt hàng thất bại!")

    } finally {

      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <div className="checkout-area mt-30 mb-70">

        <div className="container">

          <div className="row">

            <div className="col-12">

              <form onSubmit={handleSubmitOrder}>

                <div className="row">

                  {/* CUSTOMER INFO */}
                  <div className="col-lg-6 col-md-12 col-12">

                    <div className="checkbox-form">

                      <h3>Thông tin khách hàng</h3>

                      <div className="row">

                        {/* FULL NAME */}
                        <div className="col-lg-12">

                          <div className="checkout-form-list">

                            <label>
                              Họ và tên
                              <span className="required">
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                              placeholder="Nhập họ và tên"
                              value={customerName}
                              onChange={(e) =>
                                setCustomerName(
                                  e.target.value
                                )
                              }
                              required
                            />

                          </div>

                        </div>

                        {/* PHONE */}
                        <div className="col-lg-12">

                          <div className="checkout-form-list">

                            <label>
                              Số điện thoại
                              <span className="required">
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                              placeholder="Nhập số điện thoại"
                              value={customerPhone}
                              onChange={(e) =>
                                setCustomerPhone(
                                  e.target.value
                                )
                              }
                              required
                            />

                          </div>

                        </div>

                        {/* ADDRESS */}
                        <div className="col-lg-12">

                          <div className="checkout-form-list">

                            <label>
                              Địa chỉ nhận hàng
                              <span className="required">
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                              placeholder="Số nhà, tên đường..."
                              value={address}
                              onChange={(e) =>
                                setAddress(
                                  e.target.value
                                )
                              }
                              required
                            />

                          </div>

                        </div>

                        {/* WARD */}
                        <div className="col-lg-6">

                          <div className="checkout-form-list">

                            <label>
                              Phường/Xã
                              <span className="required">
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                              placeholder="Nhập phường/xã"
                              value={ward}
                              onChange={(e) =>
                                setWard(
                                  e.target.value
                                )
                              }
                              required
                            />

                          </div>

                        </div>

                        {/* PROVINCE */}
                        <div className="col-lg-6">

                          <div className="checkout-form-list">

                            <label>
                              Tỉnh/Thành phố
                              <span className="required">
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                              placeholder="Nhập tỉnh/thành phố"
                              value={province}
                              onChange={(e) =>
                                setProvince(
                                  e.target.value
                                )
                              }
                              required
                            />

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ORDER */}
                  <div className="col-lg-6 col-md-12 col-12">

                    <div className="your-order">

                      <h3>Đơn hàng của bạn</h3>

                      {/* PRODUCT TABLE */}
                      <div className="your-order-table table-responsive">

                        <table>

                          <thead>

                            <tr>

                              <th className="product-name">
                                Sản phẩm
                              </th>

                              <th className="product-total">
                                Tổng
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {
                              cartItems.length > 0 ? (

                                cartItems.map((item) => (

                                  <tr
                                    className="cart_item"
                                    key={item.id}
                                  >

                                    <td className="product-name">

                                      <div className="fw-semibold">

                                        {item.name}

                                      </div>

                                      <strong className="product-quantity">

                                        × {item.quantity}

                                      </strong>
                                    </td>

                                    <td className="product-total">

                                      <span className="amount">

                                        {
                                          (
                                            item.price *
                                            item.quantity
                                          ).toLocaleString("vi-VN")
                                        } VNĐ

                                      </span>

                                    </td>

                                  </tr>

                                ))

                              ) : (

                                <tr>

                                  <td
                                    colSpan="2"
                                    className="text-center"
                                  >

                                    Chưa có sản phẩm nào

                                  </td>

                                </tr>

                              )
                            }

                          </tbody>

                          <tfoot>

                            <tr className="order-total">

                              <th>Tổng đơn hàng</th>

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

                          </tfoot>

                        </table>

                      </div>

                      {/* PAYMENT */}
                      <div className="payment-method mt-4">

                        <h5 className="mb-3">
                          Phương thức thanh toán
                        </h5>

                        {/* VNPAY */}
                        <div className="form-check mb-4">

                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="vnpay"
                            checked={
                              paymentMethod === "VNPAY"
                            }
                            onChange={() =>
                              setPaymentMethod("VNPAY")
                            }
                          />

                          <label
                            className="form-check-label"
                            htmlFor="vnpay"
                          >

                            Thanh toán trực tuyến VNPAY

                          </label>

                        </div>

                        {/* COD */}
                        <div className="form-check mb-3">

                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="cod"
                            checked={
                              paymentMethod === "COD"
                            }
                            onChange={() =>
                              setPaymentMethod("COD")
                            }
                          />

                          <label
                            className="form-check-label"
                            htmlFor="cod"
                          >

                            Thanh toán trực tiếp khi nhận hàng

                          </label>

                        </div>

                        {/* BUTTON */}
                        <div className="order-button-payment">

                          <input
                            type="submit"
                            value={
                              loading
                                ? "Đang xử lý..."
                                : "Đặt hàng"
                            }
                            disabled={
                              loading ||
                              cartItems.length === 0
                            }
                            style={{
                              opacity:
                                loading ? 0.7 : 1
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  )
}

export default Checkout