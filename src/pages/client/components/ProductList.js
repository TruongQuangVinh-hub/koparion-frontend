import { useState, useEffect } from "react"
import Detail from "./Detail"
import { Modal } from "bootstrap"
import { fetchProductsAPI } from "../../../api/backendAPI"
import { API_URL } from "../../../constant"

const ProductList = ({
  selectedCategory,
  selectedPrice,
  random = false,
  pagination = false
}) => {

  const [selectedProduct, setSelectedProduct] =
    useState(null)

  const [products, setProducts] =
    useState([])

  const [currentPage, setCurrentPage] =
    useState(1)

  const productsPerPage = 8

  // FILTER
  const filteredProducts = products.filter((item) => {

    const product = item.product

    const matchCategory =
      selectedCategory === "all" ||
      product.category?.name === selectedCategory

    let matchPrice = true

    if (selectedPrice === "0-100") {

      matchPrice =
        product.price <= 100000
    }

    else if (selectedPrice === "100-200") {

      matchPrice =
        product.price > 100000 &&
        product.price <= 200000
    }

    else if (selectedPrice === "200-300") {

      matchPrice =
        product.price > 200000 &&
        product.price <= 300000
    }

    else if (selectedPrice === "300+") {

      matchPrice =
        product.price > 300000
    }

    return matchCategory && matchPrice
  })

  // RANDOM
  const randomProducts = random
    ? [...filteredProducts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)
    : filteredProducts

  // PAGINATION
  const totalPages = Math.ceil(
    randomProducts.length / productsPerPage
  )

  const indexOfLastProduct =
    currentPage * productsPerPage

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage

  const displayProducts = pagination
    ? randomProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    )
    : randomProducts

  // RESET PAGE
  useEffect(() => {

    setCurrentPage(1)

  }, [selectedCategory, selectedPrice])

  // QUICK VIEW
  const handleQuickView = (item) => {

    // GỘP DATA inventory + product
    const fullProduct = {
      ...item.product,
      quantity: item.quantity,
      minimumStock: item.minimumStock
    }

    setSelectedProduct(fullProduct)

    setTimeout(() => {

      const modalElement =
        document.getElementById("productModal")

      const modal =
        new Modal(modalElement)

      modal.show()

    }, 0)
  }

  // FETCH API
  useEffect(() => {

    fetchProductsAPI()
      .then((res) => {

        setProducts(res)

      })
      .catch((error) => {

        console.log(error)

      })

  }, [])

  return (
    <>
      {/* PRODUCT LIST */}
      <div className="row">

        {
          displayProducts.map((item) => {

            const product = item.product

            return (

              <div
                className="col-6 col-md-4 col-lg-3"
                key={item.id}
              >

                <div className="product-wrapper mb-40">

                  <div className="product-img position-relative">

                    {/* OUT OF STOCK */}
                    {
                      item.quantity <= 0 && (

                        <span
                          className="badge bg-dark position-absolute"
                          style={{
                            top: "10px",
                            left: "10px",
                            zIndex: 2
                          }}
                        >

                          Hết hàng

                        </span>

                      )
                    }

                    {/* LOW STOCK */}
                    {
                      item.quantity > 0 &&
                      item.quantity <= item.minimumStock && (

                        <span
                          className="badge bg-danger position-absolute"
                          style={{
                            top: "10px",
                            left: "10px",
                            zIndex: 2
                          }}
                        >

                          Sắp hết

                        </span>

                      )
                    }

                    <button
                      onClick={() =>
                        handleQuickView(item)
                      }
                      type="button"
                      className="border-0 bg-transparent w-100 p-0"
                    >

                      <img
                        src={`${API_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="primary"
                        style={{
                          width: "100%",
                          height: "320px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                    </button>

                    <div className="product-details text-center mt-3">

                      {/* CATEGORY */}
                      <div
                        className="text-muted mb-1"
                        style={{
                          fontSize: "13px"
                        }}
                      >
                        {product.category?.name}
                      </div>

                      {/* NAME */}
                      <h4>

                        <span className="fs-6 fw-bold">

                          {product.name}

                        </span>

                      </h4>

                      {/* PRICE */}
                      <div className="text-danger fw-bold fst-italic mb-1">

                        {
                          product.price.toLocaleString("vi-VN")
                        } VNĐ

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )
          })
        }

      </div>

      {/* PAGINATION */}
      {
        pagination && totalPages > 1 && (

          <div className="d-flex justify-content-center mt-4">

            <ul className="pagination">

              {
                Array.from(
                  { length: totalPages },
                  (_, index) => (

                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1
                          ? "active"
                          : ""
                      }`}
                    >

                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(index + 1)
                        }
                      >

                        {index + 1}

                      </button>

                    </li>

                  )
                )
              }

            </ul>

          </div>

        )
      }

      {/* DETAIL MODAL */}
      <Detail product={selectedProduct} />
    </>
  )
}

export default ProductList