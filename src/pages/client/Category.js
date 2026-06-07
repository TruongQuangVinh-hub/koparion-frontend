import { useState, useEffect } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProductList from "./components/ProductList"
import { fetchCategoriesAPI } from "../../api/backendAPI"

const Category = () => {

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrice, setSelectedPrice] = useState("all")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategoriesAPI()
      .then((res) => setCategories(res))
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      <Header />

      <div className="shop-main-area mb-70 mt-40">

        <div className="container">

          <div className="row">

            {/* SIDEBAR */}
            <div className="col-lg-3 col-md-12 col-12 order-lg-1 order-2">

              <div className="shop-left">

                {/* CATEGORY */}
                <div className="left-title mb-20">
                  <h4>Loại Sách</h4>
                </div>

                <div className="left-menu mb-30">

                  <ul className="list-unstyled">

                    {/* ALL */}
                    <li className="mb-2">

                      <button
                        className={`border-0 bg-transparent p-0 ${selectedCategory === "all"
                            ? "text-danger fw-bold"
                            : ""
                          }`}
                        onClick={() => setSelectedCategory("all")}
                      >
                        Tất cả
                      </button>

                    </li>

                    {/* CATEGORY LIST */}
                    {
                      categories.map((item) => (

                        <li
                          className="mb-2"
                          key={item.id}
                        >

                          <button
                            className={`border-0 bg-transparent p-0 ${selectedCategory === item.name
                                ? "text-danger fw-bold text-start"
                                : ""
                              }`}
                            onClick={() =>
                              setSelectedCategory(item.name)
                            }
                          >
                            {item.name}
                          </button>

                        </li>
                      ))
                    }

                  </ul>

                </div>

                {/* PRICE */}
                <div className="left-title mb-20">
                  <h4>Giá</h4>
                </div>

                <div className="left-menu mb-20">

                  <ul className="list-unstyled">

                    {/* ALL */}
                    <li className="mb-2">

                      <button
                        className={`border-0 bg-transparent p-0 ${selectedPrice === "all"
                            ? "text-danger fw-bold"
                            : ""
                          }`}
                        onClick={() => setSelectedPrice("all")}
                      >
                        Tất cả
                      </button>

                    </li>

                    {/* 0-100 */}
                    <li className="mb-2">

                      <button
                        className={`border-0 bg-transparent p-0 ${selectedPrice === "0-100"
                            ? "text-danger fw-bold"
                            : ""
                          }`}
                        onClick={() =>
                          setSelectedPrice("0-100")
                        }
                      >
                        0 - 100.000 VNĐ
                      </button>

                    </li>

                    {/* 100-200 */}
                    <li className="mb-2">

                      <button
                        className={`border-0 bg-transparent p-0 ${selectedPrice === "100-200"
                            ? "text-danger fw-bold"
                            : ""
                          }`}
                        onClick={() =>
                          setSelectedPrice("100-200")
                        }
                      >
                        100.000 - 200.000 VNĐ
                      </button>

                    </li>

                    {/* 200-300 */}
                    <li className="mb-2">

                      <button
                        className={`border-0 bg-transparent p-0 ${selectedPrice === "200-300"
                            ? "text-danger fw-bold"
                            : ""
                          }`}
                        onClick={() =>
                          setSelectedPrice("200-300")
                        }
                      >
                        200.000 - 300.000 VNĐ
                      </button>

                    </li>

                    {/* 300+ */}
                    <li className="mb-2">

                      <button
                        className={`border-0 bg-transparent p-0 ${selectedPrice === "300+"
                            ? "text-danger fw-bold"
                            : ""
                          }`}
                        onClick={() =>
                          setSelectedPrice("300+")
                        }
                      >
                        Trên 300.000 VNĐ
                      </button>

                    </li>

                  </ul>

                </div>

                {/* BANNER */}
                <div className="banner-area mb-30">

                  <div className="banner-img-2">

                    <img
                      src="img/banner/31.jpg"
                      alt="banner"
                      className="img-fluid"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* PRODUCT */}
            <div className="col-lg-9 col-md-12 col-12 order-lg-2 order-1">

              <div className="tab-content">

                <div
                  className="tab-pane fade show active"
                  id="th"
                >

                  <ProductList
                    selectedCategory={selectedCategory}
                    selectedPrice={selectedPrice}
                    pagination={true}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  )
}

export default Category