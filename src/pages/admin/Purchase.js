import { useEffect, useState } from "react"
import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"
import {
  fetchPurchaseAPI,
  uploadPurchaseAPI,
  fetchProductsAdminAPI,
  fetchSuppliersAPI,
  fetchDetailPurchaseAPI
} from "../../api/backendAPI"
import { API_URL } from "../../constant"
import { toast } from "react-toastify"
import { exportPurchasePDF } from "../../helper/exportPurchasePDF"

const Purchase = () => {
  const [purchaseDetails, setPurchaseDetails] = useState([])
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])

  const [loading, setLoading] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // form create purchase
  const [supplierId, setSupplierId] = useState("")
  const [details, setDetails] = useState([
    {
      productId: "",
      quantity: 1,
      importPrice: 0
    }
  ])

  // fetch data
  const fetchData = async () => {
    try {
      setLoading(true)

      const [purchaseRes, productRes, supplierRes] = await Promise.all([
        fetchPurchaseAPI(),
        fetchProductsAdminAPI(),
        fetchSuppliersAPI()
      ])
      setPurchases(purchaseRes)
      setProducts(productRes)
      setSuppliers(supplierRes)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = async (purchase) => {
    try {
      setLoadingDetail(true)

      const res = await fetchDetailPurchaseAPI(purchase.id)

      setPurchaseDetails(res)
      setSelectedPurchase(purchase)

      // open bootstrap modal
      const modal = new window.bootstrap.Modal(
        document.getElementById("purchaseDetailModal")
      )

      modal.show()
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingDetail(false)
    }
  }

  // export purchase pdf
  const handleExportPurchasePDF = async () => {

    try {

      if (!selectedPurchase) {

        toast.error("Không có dữ liệu phiếu nhập")

        return
      }

      await exportPurchasePDF(
        selectedPurchase,
        purchaseDetails
      )

      toast.success("Xuất hóa đơn thành công")

    } catch (error) {

      console.log(error)

      toast.error("Xuất hóa đơn thất bại")

    }

  }

  useEffect(() => {
    fetchData()
  }, [])

  // add row detail
  const handleAddDetail = () => {
    setDetails([
      ...details,
      {
        productId: "",
        quantity: 1,
        importPrice: 0
      }
    ])
  }

  // remove row detail
  const handleRemoveDetail = (index) => {
    const newDetails = [...details]
    newDetails.splice(index, 1)
    setDetails(newDetails)
  }

  // change detail
  const handleChangeDetail = (index, field, value) => {
    const newDetails = [...details]
    newDetails[index][field] = value
    setDetails(newDetails)
  }

  // submit create purchase
  const handleCreatePurchase = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        purchaseOrder: {
          supplier: {
            id: Number(supplierId)
          }
        },
        details: details.map((item) => ({
          product: {
            id: Number(item.productId)
          },
          quantity: Number(item.quantity),
          importPrice: Number(item.importPrice)
        }))
      }

      await uploadPurchaseAPI(payload)

      toast.success("Tạo phiếu nhập thành công")

      // reset form
      setSupplierId("")
      setDetails([
        {
          productId: "",
          quantity: 1,
          importPrice: 0
        }
      ])

      fetchData()
    } catch (error) {
      console.log(error)
      toast.error("Tạo phiếu nhập thất bại")
    }
  }

  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const currentPurchases = purchases.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const totalPages = Math.ceil(purchases.length / itemsPerPage)

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
              {/* FORM CREATE */}
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Tạo phiếu nhập
                  </h6>
                </div>

                <div className="card-body">
                  <form onSubmit={handleCreatePurchase}>
                    {/* supplier */}
                    <div className="mb-3">
                      <label className="form-label">
                        Nhà cung cấp
                      </label>

                      <select
                        className="form-control"
                        value={supplierId}
                        onChange={(e) =>
                          setSupplierId(e.target.value)
                        }
                        required
                      >
                        <option value="">
                          -- Chọn nhà cung cấp --
                        </option>

                        {suppliers.map((supplier) => (
                          <option
                            key={supplier.id}
                            value={supplier.id}
                          >
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* details */}
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>Sản phẩm</th>
                            <th width="120">Số lượng</th>
                            <th width="180">Giá nhập</th>
                            <th width="100">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {details.map((detail, index) => (
                            <tr key={index}>
                              <td>
                                <select
                                  className="form-control"
                                  value={detail.productId}
                                  onChange={(e) =>
                                    handleChangeDetail(
                                      index,
                                      "productId",
                                      e.target.value
                                    )
                                  }
                                  required
                                >
                                  <option value="">
                                    -- Chọn sản phẩm --
                                  </option>

                                  {products.map((product) => (
                                    <option
                                      key={product.id}
                                      value={product.id}
                                    >
                                      {product.name}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="1"
                                  value={detail.quantity}
                                  onChange={(e) =>
                                    handleChangeDetail(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  value={detail.importPrice}
                                  onChange={(e) =>
                                    handleChangeDetail(
                                      index,
                                      "importPrice",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleRemoveDetail(index)
                                  }
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleAddDetail}
                        >
                          + Thêm sản phẩm
                        </button>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Tạo phiếu nhập
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* TABLE PURCHASE */}
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Danh sách phiếu nhập
                  </h6>
                </div>

                <div className="card-body">
                  {loading ? (
                    <p>Đang tải dữ liệu...</p>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="thead-dark">
                            <tr>
                              <th>ID</th>
                              <th>Nhà cung cấp</th>
                              <th>Số điện thoại</th>
                              <th>Tổng tiền</th>
                              <th>Ngày tạo</th>
                              <th width="120">Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentPurchases.length > 0 ? (
                              currentPurchases.map((purchase) => (
                                <tr key={purchase.id}>
                                  <td>{purchase.id}</td>

                                  <td>
                                    {purchase.supplier?.name}
                                  </td>

                                  <td>
                                    {purchase.supplier?.phone}
                                  </td>

                                  <td>
                                    {purchase.totalAmount?.toLocaleString(
                                      "vi-VN"
                                    )} đ
                                  </td>

                                  <td>
                                    {new Date(
                                      purchase.createdAt
                                    ).toLocaleString("vi-VN")}
                                  </td>

                                  <td>
                                    <button
                                      className="btn btn-info btn-sm"
                                      onClick={() =>
                                        handleViewDetail(purchase)
                                      }
                                    >
                                      Xem
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="text-center"
                                >
                                  Không có dữ liệu
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* PAGINATION */}
                      <nav>
                        <ul className="pagination justify-content-center">
                          <li
                            className={`page-item ${currentPage === 1
                              ? "disabled"
                              : ""
                              }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                setCurrentPage(currentPage - 1)
                              }
                            >
                              Trước
                            </button>
                          </li>

                          {[...Array(totalPages)].map(
                            (_, index) => (
                              <li
                                key={index}
                                className={`page-item ${currentPage === index + 1
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
                          )}

                          <li
                            className={`page-item ${currentPage === totalPages
                              ? "disabled"
                              : ""
                              }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                setCurrentPage(currentPage + 1)
                              }
                            >
                              Sau
                            </button>
                          </li>
                        </ul>
                      </nav>

                      {/* MODAL DETAIL */}
                      <div
                        className="modal fade"
                        id="purchaseDetailModal"
                        tabIndex="-1"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-xl">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                Chi tiết phiếu nhập #
                                {selectedPurchase?.id}
                              </h5>

                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">
                                  &times;
                                </span>
                              </button>
                            </div>

                            <div className="modal-body">
                              {loadingDetail ? (
                                <p>Đang tải dữ liệu...</p>
                              ) : (
                                <>
                                  {/* INFO */}
                                  <div className="row mb-4">
                                    <div className="col-md-4">
                                      <strong>Nhà cung cấp:</strong>
                                      <br />
                                      {
                                        selectedPurchase?.supplier
                                          ?.name
                                      }
                                    </div>

                                    <div className="col-md-4">
                                      <strong>Số điện thoại:</strong>
                                      <br />
                                      {
                                        selectedPurchase?.supplier
                                          ?.phone
                                      }
                                    </div>

                                    <div className="col-md-4">
                                      <strong>Tổng tiền:</strong>
                                      <br />
                                      {selectedPurchase?.totalAmount?.toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      đ
                                    </div>
                                  </div>

                                  {/* TABLE DETAIL */}
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <thead className="thead-light">
                                        <tr>
                                          <th>ID</th>
                                          <th>Hình ảnh</th>
                                          <th>Sản phẩm</th>
                                          <th>Danh mục</th>
                                          <th>Số lượng</th>
                                          <th>Giá nhập</th>
                                          <th>Thành tiền</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {purchaseDetails.length > 0 ? (
                                          purchaseDetails.map(
                                            (detail) => (
                                              <tr key={detail.id}>
                                                <td>{detail.id}</td>

                                                <td>
                                                  <img
                                                    src={
                                                      `${API_URL}${detail.product?.imageUrl}`
                                                    }
                                                    alt=""
                                                    width="60"
                                                    height="80"
                                                    style={{
                                                      objectFit:
                                                        "cover"
                                                    }}
                                                  />
                                                </td>

                                                <td>
                                                  {
                                                    detail.product
                                                      ?.name
                                                  }
                                                </td>

                                                <td>
                                                  {
                                                    detail.product
                                                      ?.category?.name
                                                  }
                                                </td>

                                                <td>
                                                  {detail.quantity}
                                                </td>

                                                <td>
                                                  {detail.importPrice?.toLocaleString(
                                                    "vi-VN"
                                                  )}{" "}
                                                  đ
                                                </td>

                                                <td>
                                                  {(
                                                    detail.quantity *
                                                    detail.importPrice
                                                  ).toLocaleString(
                                                    "vi-VN"
                                                  )}{" "}
                                                  đ
                                                </td>
                                              </tr>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="7"
                                              className="text-center"
                                            >
                                              Không có dữ liệu
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="modal-footer">

                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleExportPurchasePDF}
                                disabled={
                                  loadingDetail ||
                                  purchaseDetails.length === 0
                                }
                              >
                                <i className="fas fa-file-pdf mr-2"></i>
                                Xuất hóa đơn
                              </button>

                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                              >
                                Đóng
                              </button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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

export default Purchase