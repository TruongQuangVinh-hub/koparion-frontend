import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Modal } from "bootstrap"
import { API_URL } from "../../../constant"

const Detail = ({ product }) => {

  const [quantity, setQuantity] = useState(1)

  useEffect(() => {

    setQuantity(1)

  }, [product])

  if (!product) return null

  const stockQuantity = product.quantity || 0

  const handleAddToCart = () => {

    if (stockQuantity <= 0) {

      toast.error("Sản phẩm đã hết hàng!")

      return
    }

    if (Number(quantity) > stockQuantity) {

      toast.error(
        `Chỉ còn ${stockQuantity} sản phẩm trong kho!`
      )

      return
    }

    const cart =
      JSON.parse(localStorage.getItem("cart")) || []

    const existingProduct = cart.find(
      (item) => item.id === product.id
    )

    // CART ITEM FORMAT
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category?.name,
      quantity: Number(quantity),
      stock: stockQuantity
    }

    // IF PRODUCT EXISTS
    if (existingProduct) {

      const newQuantity =
        existingProduct.quantity + Number(quantity)

      if (newQuantity > stockQuantity) {

        toast.error(
          `Giỏ hàng đã vượt quá tồn kho (${stockQuantity})`
        )

        return
      }

      existingProduct.quantity = newQuantity
    }

    // ADD NEW PRODUCT
    else {

      cart.push(cartItem)
    }

    // SAVE LOCAL STORAGE
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    )

    // TOAST
    toast.success("Đã thêm vào giỏ hàng!")

    // CLOSE MODAL
    const modalElement =
      document.getElementById("productModal")

    const modal =
      Modal.getInstance(modalElement)

    modal.hide()

    // RESET QUANTITY
    setQuantity(1)

    // UPDATE HEADER CART
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">

        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

          <div className="modal-body p-0">

            <div className="row g-0">

              {/* IMAGE */}
              <div className="col-md-5 bg-light d-flex align-items-center justify-content-center p-4">

                <img
                  src={`${API_URL}${product.imageUrl}`}
                  alt={product.name}
                  className="img-fluid rounded-3"
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain"
                  }}
                />

              </div>

              {/* CONTENT */}
              <div className="col-md-7">

                <div className="p-4 p-lg-5">

                  {/* CLOSE BUTTON */}
                  <div className="d-flex justify-content-end">

                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    ></button>

                  </div>

                  {/* CATEGORY */}
                  <div className="mb-2">

                    <span className="badge bg-dark px-3 py-2">
                      {product.category?.name}
                    </span>

                  </div>

                  {/* TITLE */}
                  <h2 className="fw-bold mb-3">
                    {product.name}
                  </h2>

                  {/* PRODUCT ID */}
                  <div className="mb-2 text-muted">

                    <small>
                      Mã sách: #{product.id}
                    </small>

                  </div>

                  {/* PRICE */}
                  <div className="mb-2">

                    <span
                      className="fw-bold text-danger"
                      style={{
                        fontSize: "28px"
                      }}
                    >
                      {product.price.toLocaleString("vi-VN")} VNĐ
                    </span>

                  </div>

                  {/* STOCK */}
                  <div className="mb-3">

                    <div className="fw-semibold">

                      Tồn kho:{" "}

                      <span
                        className={
                          stockQuantity > 0
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {stockQuantity}
                      </span>

                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  <p
                    className="text-muted mb-4"
                    style={{
                      lineHeight: "1.8"
                    }}
                  >
                    {product.description}
                  </p>

                  {/* QUANTITY */}
                  {
                    stockQuantity > 0 && (

                      <div className="mb-4">

                        <label className="form-label fw-semibold">
                          Số lượng
                        </label>

                        <input
                          type="number"
                          min="1"
                          max={stockQuantity}
                          value={quantity}
                          onChange={(e) => {

                            let value = Number(e.target.value)

                            if (value < 1) value = 1

                            if (value > stockQuantity) {
                              value = stockQuantity
                            }

                            setQuantity(value)
                          }}
                          className="form-control w-25"
                        />

                      </div>
                    )
                  }

                  {/* BUTTONS */}
                  <div className="d-flex gap-3">

                    <button
                      className="btn btn-dark px-4 py-2"
                      onClick={handleAddToCart}
                      disabled={stockQuantity <= 0}
                    >

                      <i className="fa fa-shopping-cart me-2"></i>

                      {
                        stockQuantity > 0
                          ? "Thêm vào giỏ hàng"
                          : "Sản phẩm đã hết"
                      }

                    </button>

                    <button
                      className="btn btn-outline-secondary px-4 py-2"
                      data-bs-dismiss="modal"
                    >
                      Đóng
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Detail