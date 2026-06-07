import { useState, useEffect } from "react"

import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"

import {
  fetchOrdersAPI,
  fetchDetailOrderAPI,
  updateOrderDetailAPI
} from "../../api/backendAPI"

import { API_URL } from "../../constant"

import { toast } from "react-toastify"

import {
  exportOrdersPDF,
  exportInvoicePDF
} from "../../helper/exportOrderPDF"

const Order = () => {

  const [orders, setOrders] =
    useState([])

  const [filteredOrders, setFilteredOrders] =
    useState([])

  const [selectedMonths, setSelectedMonths] =
    useState([])

  const [showExportModal, setShowExportModal] =
    useState(false)

  const [showModal, setShowModal] =
    useState(false)

  const [orderDetail, setOrderDetail] =
    useState(null)

  const [orderItems, setOrderItems] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [loadingDetail, setLoadingDetail] =
    useState(false)

  const [updating, setUpdating] =
    useState(false)

  const [currentPage, setCurrentPage] =
    useState(1)

  const [status, setStatus] =
    useState("")

  const ordersPerPage = 8

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {

    try {

      setLoading(true)

      const res =
        await fetchOrdersAPI()

      const data =
        Array.isArray(res)
          ? res
          : []

      setOrders(data)

      setFilteredOrders(data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchOrders()

  }, [])

  // =========================
  // AVAILABLE MONTHS
  // =========================

  const availableMonths = [

    ...new Set(

      orders
        .filter(
          (item) => item.createdAt
        )
        .map((item) => {

          const date = new Date(
            item.createdAt
          )

          const month = String(
            date.getMonth() + 1
          ).padStart(2, "0")

          const year =
            date.getFullYear()

          return `${year}-${month}`

        })

    )

  ].sort((a, b) =>
    b.localeCompare(a)
  )

  // =========================
  // FILTER ORDERS
  // =========================

  const filterOrdersByMonths = (
    selected
  ) => {

    if (
      !selected ||
      selected.length === 0
    ) {

      setFilteredOrders(orders)

      return
    }

    const filtered =
      orders.filter((order) => {

        if (!order.createdAt)
          return false

        const date = new Date(
          order.createdAt
        )

        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0")

        const year =
          date.getFullYear()

        const value =
          `${year}-${month}`

        return selected.includes(
          value
        )

      })

    setFilteredOrders(filtered)

    setCurrentPage(1)

  }

  // =========================
  // HANDLE MONTH CHANGE
  // =========================

  const handleMonthChange = (
    month
  ) => {

    let updatedMonths = []

    if (
      selectedMonths.includes(
        month
      )
    ) {

      updatedMonths =
        selectedMonths.filter(
          (item) =>
            item !== month
        )

    } else {

      updatedMonths = [
        ...selectedMonths,
        month
      ]

    }

    setSelectedMonths(
      updatedMonths
    )

    filterOrdersByMonths(
      updatedMonths
    )

  }

  // =========================
  // REMOVE MONTH
  // =========================

  const removeSelectedMonth = (
    month
  ) => {

    const updatedMonths =
      selectedMonths.filter(
        (item) =>
          item !== month
      )

    setSelectedMonths(
      updatedMonths
    )

    filterOrdersByMonths(
      updatedMonths
    )

  }

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredOrders.length /
    ordersPerPage
  )

  const indexOfLastOrder =
    currentPage * ordersPerPage

  const indexOfFirstOrder =
    indexOfLastOrder -
    ordersPerPage

  const currentOrders =
    Array.isArray(filteredOrders)
      ? filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
      )
      : []

  // =========================
  // VIEW DETAIL
  // =========================

  const viewDetail = async (
    order
  ) => {

    try {

      setShowModal(true)

      setLoadingDetail(true)

      setOrderItems([])

      const detailRes =
        await fetchDetailOrderAPI(
          order.id
        )

      const items =
        Array.isArray(detailRes)
          ? detailRes
          : []

      setOrderItems(items)

      const orderData =
        items?.[0]?.order || order

      setOrderDetail(orderData)

      setStatus(
        orderData.orderStatus || ""
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoadingDetail(false)

    }

  }

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {

    setShowModal(false)

    setOrderDetail(null)

    setOrderItems([])

    setStatus("")

  }

  // =========================
  // UPDATE STATUS
  // =========================

  const handleUpdateStatus =
    async () => {

      try {

        if (!orderDetail)
          return

        if (
          status ===
          orderDetail.orderStatus
        ) {

          toast.warning(
            "Trạng thái không thay đổi"
          )

          return

        }

        setUpdating(true)

        await updateOrderDetailAPI(
          orderDetail.id,
          status
        )

        const updatedOrders =
          orders.map((item) =>

            item.id ===
              orderDetail.id
              ? {
                ...item,
                orderStatus:
                  status
              }
              : item

          )

        setOrders(updatedOrders)

        filterOrdersByMonths(
          selectedMonths
        )

        setOrderDetail({
          ...orderDetail,
          orderStatus: status
        })

        toast.success(
          "Cập nhật trạng thái thành công!"
        )

      } catch (error) {

        console.log(error)

        toast.error(
          error?.response?.data
            ?.message ||
          "Cập nhật trạng thái thất bại"
        )

      } finally {

        setUpdating(false)

      }

    }

  // =========================
  // EXPORT PDF
  // =========================

  const handleExportOrders =
    async () => {

      if (
        filteredOrders.length === 0
      ) {

        toast.warning(
          "Không có đơn hàng để xuất PDF"
        )

        return

      }

      await exportOrdersPDF(
        filteredOrders,
        selectedMonths
      )

    }

  // =========================
  // STATUS UI
  // =========================

  const renderStatus = (
    status
  ) => {

    switch (status) {

      case "PENDING":
        return (
          <span className="badge badge-warning p-2">
            Đang xử lý
          </span>
        )

      case "PAID":
        return (
          <span className="badge badge-info p-2">
            Đã thanh toán
          </span>
        )

      case "DELIVERED":
        return (
          <span className="badge badge-success p-2">
            Đã giao
          </span>
        )

      case "CANCELLED":
        return (
          <span className="badge badge-danger p-2">
            Đã hủy
          </span>
        )

      default:
        return (
          <span className="badge badge-secondary p-2">
            {status}
          </span>
        )

    }

  }

  const isLockedStatus =
    orderDetail?.orderStatus ===
    "DELIVERED" ||
    orderDetail?.orderStatus ===
    "CANCELLED"

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

                <div className="card-header py-3 d-flex justify-content-between align-items-center">

                  <div className="d-flex justify-content-between align-items-center w-100">

                    <h6 className="m-0 font-weight-bold text-primary">
                      Danh sách đơn hàng
                    </h6>

                    <div className="d-flex">

                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          setShowExportModal(
                            true
                          )
                        }
                      >

                        <i className="fas fa-filter mr-2"></i>

                        Lọc theo tháng

                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={
                          handleExportOrders
                        }
                      >

                        <i className="fas fa-file-pdf mr-2"></i>

                        Xuất PDF

                      </button>

                    </div>

                  </div>

                </div>

                <div className="card-body">

                  {
                    selectedMonths.length >
                    0 && (

                      <div className="mb-3">

                        {
                          selectedMonths.map(
                            (item) => {

                              const [
                                year,
                                month
                              ] =
                                item.split(
                                  "-"
                                )

                              return (

                                <span
                                  key={
                                    item
                                  }
                                  className="badge badge-primary p-2 mr-2 mb-2"
                                >

                                  {
                                    month
                                  }
                                  /
                                  {
                                    year
                                  }

                                  <button
                                    className="btn btn-sm text-white ml-2 p-0"
                                    onClick={() =>
                                      removeSelectedMonth(
                                        item
                                      )
                                    }
                                  >

                                    ×

                                  </button>

                                </span>

                              )

                            }
                          )
                        }

                      </div>

                    )
                  }

                  {
                    loading ? (

                      <div className="text-center py-5">

                        Đang tải dữ liệu...

                      </div>

                    ) : (

                      <>

                        <div className="table-responsive">

                          <table
                            className="table table-bordered"
                            width="100%"
                          >

                            <thead className="thead-dark">

                              <tr>

                                <th>ID</th>

                                <th>
                                  Khách hàng
                                </th>

                                <th>
                                  SĐT
                                </th>

                                <th>
                                  Địa chỉ
                                </th>

                                <th>
                                  Tổng tiền
                                </th>

                                <th>
                                  Thanh toán
                                </th>

                                <th>
                                  Trạng thái
                                </th>

                                <th>
                                  Ngày tạo
                                </th>

                                <th width="100">
                                  Chi tiết
                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {
                                currentOrders.length >
                                  0 ? (

                                  currentOrders.map(
                                    (
                                      item
                                    ) => (

                                      <tr
                                        key={
                                          item.id
                                        }
                                      >

                                        <td>
                                          #
                                          {
                                            item.id
                                          }
                                        </td>

                                        <td>
                                          {
                                            item.customerName
                                          }
                                        </td>

                                        <td>
                                          {
                                            item.customerPhone
                                          }
                                        </td>

                                        <td>
                                          {
                                            item.customerAddress
                                          }
                                        </td>

                                        <td className="text-danger font-weight-bold">

                                          {
                                            item.totalPrice?.toLocaleString(
                                              "vi-VN"
                                            )
                                          }đ

                                        </td>

                                        <td>

                                          <span
                                            className={`badge p-2 ${item.paymentMethod ===
                                              "VNPAY"
                                              ? "badge-success"
                                              : "badge-dark"
                                              }`}
                                          >

                                            {
                                              item.paymentMethod
                                            }

                                          </span>

                                        </td>

                                        <td>

                                          {
                                            renderStatus(
                                              item.orderStatus
                                            )
                                          }

                                        </td>

                                        <td>

                                          {
                                            item.createdAt
                                              ? new Date(
                                                item.createdAt
                                              ).toLocaleString(
                                                "vi-VN"
                                              )
                                              : ""
                                          }

                                        </td>

                                        <td>

                                          <button
                                            onClick={() =>
                                              viewDetail(
                                                item
                                              )
                                            }
                                            className="btn btn-info"
                                          >

                                            Xem

                                          </button>

                                        </td>

                                      </tr>

                                    )
                                  )

                                ) : (

                                  <tr>

                                    <td
                                      colSpan="9"
                                      className="text-center py-4"
                                    >

                                      Không có đơn hàng nào

                                    </td>

                                  </tr>

                                )
                              }

                            </tbody>

                          </table>

                        </div>

                        {
                          totalPages > 1 && (

                            <div className="d-flex justify-content-center mt-4">

                              <ul className="pagination">

                                {
                                  Array.from(
                                    {
                                      length:
                                        totalPages
                                    },
                                    (
                                      _,
                                      index
                                    ) => (

                                      <li
                                        key={
                                          index
                                        }
                                        className={`page-item ${currentPage ===
                                          index + 1
                                          ? "active"
                                          : ""
                                          }`}
                                      >

                                        <button
                                          className="page-link"
                                          onClick={() =>
                                            setCurrentPage(
                                              index + 1
                                            )
                                          }
                                        >

                                          {
                                            index + 1
                                          }

                                        </button>

                                      </li>

                                    )
                                  )
                                }

                              </ul>

                            </div>

                          )
                        }

                      </>

                    )
                  }

                </div>

              </div>

            </div>

          </div>

          <FooterDashboard />

        </div>

      </div>

      {/* MODAL DETAIL */}

      {
        showModal && (

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-xl modal-dialog-scrollable">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Chi tiết đơn hàng
                  </h5>

                  <button
                    type="button"
                    className="close"
                    onClick={
                      closeModal
                    }
                  >

                    <span>
                      &times;
                    </span>

                  </button>

                </div>

                <div
                  className="modal-body"
                  style={{
                    maxHeight:
                      "75vh",
                    overflowY:
                      "auto"
                  }}
                >

                  {
                    loadingDetail ? (

                      <div className="text-center py-5">
                        Đang tải dữ liệu...
                      </div>

                    ) : (

                      <>

                        {/* THÔNG TIN ĐƠN HÀNG */}
                        <div className="row">

                          <div className="col-md-4 mb-3">

                            <label className="font-weight-bold">
                              Mã đơn hàng
                            </label>

                            <input
                              type="text"
                              className="form-control bg-light"
                              value={orderDetail?.id || ""}
                              disabled
                            />

                          </div>

                          <div className="col-md-4 mb-3">

                            <label className="font-weight-bold">
                              Tổng tiền
                            </label>

                            <input
                              type="text"
                              className="form-control bg-light text-danger font-weight-bold"
                              value={
                                orderDetail?.totalPrice
                                  ? `${orderDetail.totalPrice.toLocaleString(
                                    "vi-VN"
                                  )}đ`
                                  : ""
                              }
                              disabled
                            />

                          </div>

                          <div className="col-md-4 mb-3">

                            <label className="font-weight-bold">
                              Thanh toán
                            </label>

                            <input
                              type="text"
                              className="form-control bg-light"
                              value={
                                orderDetail?.paymentMethod || ""
                              }
                              disabled
                            />

                          </div>

                          <div className="col-md-6 mb-3">

                            <label className="font-weight-bold">
                              Tên khách hàng
                            </label>

                            <input
                              type="text"
                              className="form-control bg-light"
                              value={
                                orderDetail?.customerName || ""
                              }
                              disabled
                            />

                          </div>

                          <div className="col-md-6 mb-3">

                            <label className="font-weight-bold">
                              Số điện thoại
                            </label>

                            <input
                              type="text"
                              className="form-control bg-light"
                              value={
                                orderDetail?.customerPhone || ""
                              }
                              disabled
                            />

                          </div>

                          <div className="col-12 mb-3">

                            <label className="font-weight-bold">
                              Địa chỉ
                            </label>

                            <textarea
                              className="form-control bg-light"
                              rows="3"
                              value={
                                orderDetail?.customerAddress || ""
                              }
                              disabled
                            ></textarea>

                          </div>

                          <div className="col-md-6 mb-3">

                            <label className="font-weight-bold">
                              Ngày tạo
                            </label>

                            <input
                              type="text"
                              className="form-control bg-light"
                              value={
                                orderDetail?.createdAt
                                  ? new Date(
                                    orderDetail.createdAt
                                  ).toLocaleString("vi-VN")
                                  : ""
                              }
                              disabled
                            />

                          </div>

                          <div className="col-md-6 mb-3">

                            <label className="font-weight-bold text-primary">
                              Trạng thái đơn hàng
                            </label>

                            <select
                              className="form-control"
                              value={status}
                              onChange={(e) =>
                                setStatus(e.target.value)
                              }
                            >

                              <option value="PENDING">
                                Đang xử lý
                              </option>

                              <option value="PAID">
                                Đã thanh toán
                              </option>

                              <option value="DELIVERED">
                                Đã giao
                              </option>

                              <option value="CANCELLED">
                                Đã hủy
                              </option>

                            </select>

                          </div>

                        </div>

                        <hr />

                        <h5 className="mb-3">
                          Danh sách sản phẩm
                        </h5>

                        <div className="table-responsive">

                          <table className="table table-bordered">

                            <thead className="thead-light">

                              <tr>

                                <th>ID</th>

                                <th>
                                  Hình ảnh
                                </th>

                                <th>
                                  Sản phẩm
                                </th>

                                <th>
                                  Danh mục
                                </th>

                                <th>
                                  Số lượng
                                </th>

                                <th>
                                  Đơn giá
                                </th>

                                <th>
                                  Thành tiền
                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {
                                orderItems.length > 0 ? (

                                  orderItems.map(
                                    (
                                      item
                                    ) => (

                                      <tr
                                        key={
                                          item.id
                                        }
                                      >

                                        <td>
                                          {
                                            item.id
                                          }
                                        </td>

                                        <td>

                                          <img
                                            src={`${API_URL}${item.product?.imageUrl}`}
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
                                            item.product
                                              ?.name
                                          }
                                        </td>

                                        <td>
                                          {
                                            item.product
                                              ?.category
                                              ?.name
                                          }
                                        </td>

                                        <td>
                                          {
                                            item.quantity
                                          }
                                        </td>

                                        <td>

                                          {
                                            item.price?.toLocaleString(
                                              "vi-VN"
                                            )
                                          }đ

                                        </td>

                                        <td className="text-danger font-weight-bold">

                                          {
                                            (
                                              item.quantity *
                                              item.price
                                            ).toLocaleString(
                                              "vi-VN"
                                            )
                                          }đ

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

                                )
                              }

                            </tbody>

                          </table>

                        </div>

                      </>

                    )
                  }

                </div>

                <div className="modal-footer d-flex justify-content-between">

                  <div>

                    <button
                      className="btn btn-danger"
                      onClick={async () => {

                        await exportInvoicePDF(
                          orderDetail,
                          orderItems
                        )

                      }}
                    >

                      <i className="fas fa-file-pdf mr-2"></i>

                      Xuất hóa đơn

                    </button>

                  </div>

                  <div>

                    <button
                      className="btn btn-secondary mr-2"
                      onClick={
                        closeModal
                      }
                    >

                      Đóng

                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={
                        handleUpdateStatus
                      }
                      disabled={
                        updating ||
                        isLockedStatus
                      }
                    >

                      {
                        updating
                          ? "Đang cập nhật..."
                          : "Cập nhật trạng thái"
                      }

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )
      }

      {/* EXPORT MODAL */}

      {
        showExportModal && (

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-dialog-centered modal-lg">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Lọc đơn hàng theo tháng
                  </h5>

                  <button
                    type="button"
                    className="close"
                    onClick={() =>
                      setShowExportModal(
                        false
                      )
                    }
                  >

                    <span>
                      &times;
                    </span>

                  </button>

                </div>

                <div className="modal-body">

                  <div className="row">

                    {
                      availableMonths.map(
                        (
                          month
                        ) => {

                          const [
                            year,
                            m
                          ] =
                            month.split(
                              "-"
                            )

                          const checked =
                            selectedMonths.includes(
                              month
                            )

                          return (

                            <div
                              className="col-md-4 mb-3"
                              key={
                                month
                              }
                            >

                              <div
                                className={`border rounded p-3 d-flex align-items-center justify-content-between ${checked
                                  ? "border-primary bg-light"
                                  : ""
                                  }`}
                                style={{
                                  cursor:
                                    "pointer"
                                }}
                                onClick={() =>
                                  handleMonthChange(
                                    month
                                  )
                                }
                              >

                                <span>
                                  Tháng{" "}
                                  {m}/
                                  {
                                    year
                                  }
                                </span>

                                <input
                                  type="checkbox"
                                  checked={
                                    checked
                                  }
                                  readOnly
                                />

                              </div>

                            </div>

                          )

                        }
                      )
                    }

                  </div>

                  <small className="text-muted">

                    Chỉ hiển thị những tháng có đơn hàng.

                  </small>

                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setShowExportModal(
                        false
                      )
                    }
                  >

                    Đóng

                  </button>

                </div>

              </div>

            </div>

          </div>

        )
      }

    </>
  )

}

export default Order