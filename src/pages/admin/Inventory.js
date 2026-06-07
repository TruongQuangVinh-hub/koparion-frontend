import { useEffect, useState } from "react"
import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"
import { fetchLowStockAPI } from "../../api/backendAPI"
import { API_URL } from "../../constant"

const Inventory = () => {

  const [products, setProducts] =
    useState([])

  const [currentPage, setCurrentPage] =
    useState(1)

  const itemsPerPage = 8

  // FETCH LOW STOCK
  useEffect(() => {

    fetchLowStockAPI()
      .then((res) => {

        setProducts(res)

      })
      .catch((error) => {

        console.log(error)

      })

  }, [])

  // PAGINATION
  const totalPages = Math.ceil(
    products.length / itemsPerPage
  )

  const indexOfLastItem =
    currentPage * itemsPerPage

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage

  const currentProducts =
    products.slice(
      indexOfFirstItem,
      indexOfLastItem
    )

  return (
    <>
      <div className="d-flex">

        <MenuDashboard />

        <div
          id="content-wrapper"
          className="d-flex flex-column w-100"
        >

          <div id="content">

            <NavbarDashboard />

            <div className="container-fluid">

              <div className="card shadow mb-4">

                {/* HEADER */}
                <div className="card-header py-3">

                  <h6 className="m-0 font-weight-bold text-danger">

                    Danh sách sản phẩm sắp hết hàng

                  </h6>

                </div>

                {/* BODY */}
                <div className="card-body">

                  <div className="table-responsive">

                    <table
                      className="table table-bordered align-middle"
                      width="100%"
                    >

                      <thead className="thead-dark">

                        <tr>

                          <th>ID Kho</th>

                          <th>Ảnh</th>

                          <th>Tên sách</th>

                          <th>Thể loại</th>

                          <th>Giá</th>

                          <th>Tồn kho</th>

                          <th>Mức tối thiểu</th>

                          <th>Cập nhật</th>

                        </tr>

                      </thead>

                      <tbody>

                        {
                          currentProducts.length > 0 ? (

                            currentProducts.map((item) => {

                              const product =
                                item.product

                              return (

                                <tr key={item.id}>

                                  {/* ID */}
                                  <td>
                                    #{item.id}
                                  </td>

                                  {/* IMAGE */}
                                  <td className="text-center">

                                    <img
                                      src={`${API_URL}${product.imageUrl}`}
                                      alt={product.name}
                                      width="70"
                                      height="90"
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "6px"
                                      }}
                                    />

                                  </td>

                                  {/* NAME */}
                                  <td
                                    className="fw-bold"
                                    style={{
                                      minWidth: "220px"
                                    }}
                                  >

                                    {product.name}

                                  </td>

                                  {/* CATEGORY */}
                                  <td>

                                    {
                                      product.category?.name
                                    }

                                  </td>

                                  {/* PRICE */}
                                  <td className="text-danger fw-bold">

                                    {
                                      product.price.toLocaleString("vi-VN")
                                    }đ

                                  </td>

                                  {/* STOCK */}
                                  <td>

                                    <span className="badge badge-danger p-2">

                                      {item.quantity}

                                    </span>

                                  </td>

                                  {/* MINIMUM */}
                                  <td>

                                    <span className="badge badge-warning p-2">

                                      {item.minimumStock}

                                    </span>

                                  </td>

                                  {/* UPDATED */}
                                  <td>

                                    {
                                      new Date(
                                        item.updatedAt
                                      ).toLocaleString("vi-VN")
                                    }

                                  </td>

                                </tr>

                              )
                            })

                          ) : (

                            <tr>

                              <td
                                colSpan="8"
                                className="text-center py-5"
                              >

                                <div className="text-muted">

                                  Không có sản phẩm nào sắp hết hàng

                                </div>

                              </td>

                            </tr>

                          )
                        }

                      </tbody>

                    </table>

                  </div>

                  {/* PAGINATION */}
                  {
                    totalPages > 1 && (

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

                </div>

              </div>

            </div>

          </div>

          <FooterDashboard />

        </div>

      </div>
    </>
  )
}

export default Inventory