import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Modal } from "bootstrap"

import {
  fetchProductsAPI
} from "../../../api/backendAPI"

import { API_URL } from "../../../constant"

import Detail from "./Detail"

const Header = () => {

  const [products, setProducts] =
    useState([])

  const [cartCount, setCartCount] =
    useState(0)

  const [search, setSearch] =
    useState("")

  const [searchResults, setSearchResults] =
    useState([])

  const [selectedProduct, setSelectedProduct] =
    useState(null)

  // LOAD PRODUCTS
  useEffect(() => {

    fetchProductsAPI()
      .then((res) => {

        setProducts(res)

      })
      .catch((error) => {

        console.log(error)

      })

  }, [])

  // CART COUNT
  useEffect(() => {

    const updateCartCount = () => {

      const cart =
        JSON.parse(localStorage.getItem("cart")) || []

      const totalQuantity = cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      )

      setCartCount(totalQuantity)
    }

    updateCartCount()

    window.addEventListener(
      "storage",
      updateCartCount
    )

    return () => {

      window.removeEventListener(
        "storage",
        updateCartCount
      )

    }

  }, [])

  // SEARCH
  useEffect(() => {

    if (search.trim() === "") {

      setSearchResults([])

      return
    }

    const filtered = products.filter((item) => {

      const product = item.product

      return product.name
        .toLowerCase()
        .includes(search.toLowerCase())

    })

    setSearchResults(filtered)

  }, [search, products])

  // OPEN DETAIL MODAL
  const openDetailModal = (item) => {

    // item ở đây là inventory object:
    // {
    //   id,
    //   quantity,
    //   minimumStock,
    //   product: {...}
    // }

    const productData = {
      ...item.product,
      quantity: item.quantity,
      minimumStock: item.minimumStock
    }

    setSelectedProduct(productData)

    setSearch("")
    setSearchResults([])

    setTimeout(() => {

      const modalElement =
        document.getElementById("productModal")

      if (modalElement) {

        const modal =
          new Modal(modalElement)

        modal.show()
      }

    }, 100)
  }

  return (
    <>
      <header>

        {/* TOP HEADER */}
        <div className="header-mid-area ptb-40">

          <div className="container">

            <div className="row align-items-center">

              {/* SEARCH */}
              <div className="col-lg-3 col-md-5 col-12">

                <div
                  className="header-search position-relative"
                >

                  <form
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{
                        border: "1px solid #ced4da",
                        borderRadius: "10px",
                        overflow: "hidden",
                        width: "300px",
                        background: "#fff"
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Tìm kiếm sách..."
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        className="form-control border-0 shadow-none"
                        style={{
                          height: "42px",
                          fontSize: "14px"
                        }}
                      />

                      <button
                        type="submit"
                        className="btn border-0"
                        style={{
                          height: "42px",
                          width: "50px",
                          background: "#F07C29",
                          color: "#fff",
                          borderRadius: "0"
                        }}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </form>

                  {/* SEARCH RESULT */}
                  {
                    searchResults.length > 0 && (

                      <div
                        className="position-absolute bg-white shadow rounded w-100 mt-2"
                        style={{
                          zIndex: 9999,
                          maxHeight: "400px",
                          overflowY: "auto"
                        }}
                      >

                        {
                          searchResults.map((item) => {

                            const product =
                              item.product

                            return (

                              <div
                                key={item.id}
                                className="
                                  d-flex
                                  align-items-center
                                  p-2
                                  border-bottom
                                  cursor-pointer
                                "
                                style={{
                                  cursor: "pointer",
                                  transition: "0.2s"
                                }}
                                onClick={() =>
                                  openDetailModal(item)
                                }
                              >

                                {/* IMAGE */}
                                <img
                                  src={`${API_URL}${product.imageUrl}`}
                                  alt={product.name}
                                  style={{
                                    width: "55px",
                                    height: "75px",
                                    objectFit: "cover",
                                    borderRadius: "6px"
                                  }}
                                />

                                {/* INFO */}
                                <div className="ml-3">

                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "14px"
                                    }}
                                  >
                                    {product.name}
                                  </div>

                                  <div
                                    className="text-muted small"
                                  >
                                    {
                                      product.category?.name
                                    }
                                  </div>

                                  <div
                                    className="text-danger fw-bold mt-1"
                                  >
                                    {
                                      product.price.toLocaleString("vi-VN")
                                    } VNĐ
                                  </div>

                                  {/* STOCK */}
                                  <div
                                    className={
                                      item.quantity > 0
                                        ? "text-success small"
                                        : "text-danger small"
                                    }
                                  >

                                    {
                                      item.quantity > 0
                                        ? `Tồn kho: ${item.quantity}`
                                        : "Hết hàng"
                                    }

                                  </div>

                                </div>

                              </div>

                            )
                          })
                        }

                      </div>

                    )
                  }

                </div>

              </div>

              {/* LOGO */}
              <div className="col-lg-6 col-md-4 col-12">

                <div className="logo-area text-center logo-xs-mrg">

                  <Link to='/'>

                    <img
                      src="/img/logo/logo.png"
                      alt="logo"
                    />

                  </Link>

                </div>

              </div>

              {/* CART */}
              <div className="col-lg-3 col-md-3 col-12">

                <div className="my-cart">

                  <ul>

                    <li>

                      <Link to='/cart'>

                        <i className="fa fa-shopping-cart"></i>

                        Giỏ hàng

                      </Link>

                      <span>
                        {cartCount}
                      </span>

                    </li>

                  </ul>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* MENU */}
        <div
          className="sticky-top shadow-sm"
          style={{
            background:
              "linear-gradient(90deg, #111827, #1f2937)",
            zIndex: 999
          }}
        >

          <div className="container">

            <div
              className="
                d-flex
                justify-content-center
                justify-content-lg-start
                align-items-center
                gap-3
                py-3
                flex-wrap
              "
            >

              {/* HOME */}
              <Link
                to='/'
                className="
                  text-decoration-none
                  px-4
                  py-2
                  rounded-pill
                  text-white
                  fw-semibold
                "
                style={{
                  transition: "0.3s",
                  backgroundColor:
                    "rgba(255,255,255,0.08)"
                }}
                onMouseEnter={(e) => {

                  e.target.style.backgroundColor =
                    "#ffffff"

                  e.target.style.color =
                    "#111827"
                }}
                onMouseLeave={(e) => {

                  e.target.style.backgroundColor =
                    "rgba(255,255,255,0.08)"

                  e.target.style.color =
                    "#ffffff"
                }}
              >

                <i className="fa fa-home me-2"></i>

                Trang chủ

              </Link>

              {/* PRODUCT */}
              <Link
                to='/category'
                className="
                  text-decoration-none
                  px-4
                  py-2
                  rounded-pill
                  text-white
                  fw-semibold
                "
                style={{
                  transition: "0.3s",
                  backgroundColor:
                    "rgba(255,255,255,0.08)"
                }}
                onMouseEnter={(e) => {

                  e.target.style.backgroundColor =
                    "#ffffff"

                  e.target.style.color =
                    "#111827"
                }}
                onMouseLeave={(e) => {

                  e.target.style.backgroundColor =
                    "rgba(255,255,255,0.08)"

                  e.target.style.color =
                    "#ffffff"
                }}
              >

                <i className="fa fa-book me-2"></i>

                Sản phẩm

              </Link>

            </div>

          </div>

        </div>

      </header>

      {/* DETAIL MODAL */}
      <Detail product={selectedProduct} />
    </>
  )
}

export default Header