import { useEffect, useState } from "react"

import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"

import {
  fetchSuppliersAPI,
  uploadSuppliersAPI,
  updateSuppliersAPI,
  deleteSuppliersAPI
} from "../../api/backendAPI"

import { toast } from "react-toastify"

const Supplier = () => {

  const ITEMS_PER_PAGE = 8

  const initialForm = {
    name: "",
    phone: ""
  }

  const [suppliers, setSuppliers] =
    useState([])

  const [currentPage, setCurrentPage] =
    useState(1)

  const [showModal, setShowModal] =
    useState(false)

  const [showAddModal, setShowAddModal] =
    useState(false)

  const [supplierDetail, setSupplierDetail] =
    useState(null)

  const [formData, setFormData] =
    useState(initialForm)

  // =========================
  // LOAD SUPPLIERS
  // =========================

  const loadSuppliers = async () => {

    try {

      const data =
        await fetchSuppliersAPI()

      console.log("SUPPLIERS:", data)

      if (Array.isArray(data)) {

        setSuppliers(data)

      } else {

        setSuppliers([])
      }

    } catch (error) {

      console.log(error)

      setSuppliers([])
    }
  }

  useEffect(() => {

    loadSuppliers()

  }, [])

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    suppliers.length / ITEMS_PER_PAGE
  )

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE

  const currentSuppliers =
    suppliers.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {

    setShowModal(false)

    setSupplierDetail(null)

    setFormData(initialForm)
  }

  const closeAddModal = () => {

    setShowAddModal(false)

    setFormData(initialForm)
  }

  // =========================
  // VIEW DETAIL
  // =========================

  const viewDetail = (supplier) => {

    setSupplierDetail(supplier)

    setFormData({
      name: supplier.name,
      phone: supplier.phone
    })

    setShowModal(true)
  }

  // =========================
  // ADD SUPPLIER
  // =========================

  const handleAddSupplier = async () => {

    if (
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {

      toast.error(
        "Vui lòng nhập đầy đủ thông tin!"
      )

      return
    }

    try {

      await uploadSuppliersAPI(
        formData.name,
        formData.phone
      )

      toast.success(
        "Thêm nhà cung cấp thành công!"
      )

      closeAddModal()

      loadSuppliers()

    } catch (error) {

      console.log(error)

      toast.error(
        "Thêm nhà cung cấp thất bại!"
      )
    }
  }

  // =========================
  // UPDATE SUPPLIER
  // =========================

  const handleUpdate = async () => {

    try {

      await updateSuppliersAPI(
        supplierDetail.id,
        formData.name,
        formData.phone
      )

      toast.success(
        "Cập nhật nhà cung cấp thành công!"
      )

      closeModal()

      loadSuppliers()

    } catch (error) {

      console.log(error)

      toast.error(
        "Cập nhật nhà cung cấp thất bại!"
      )
    }
  }

  // =========================
  // DELETE SUPPLIER
  // =========================

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa nhà cung cấp này?"
      )

    if (!confirmDelete) return

    try {

      await deleteSuppliersAPI(
        supplierDetail.id
      )

      toast.success(
        "Xóa nhà cung cấp thành công!"
      )

      closeModal()

      loadSuppliers()

    } catch (error) {

      console.log(error)

      toast.error(
        "Xóa nhà cung cấp thất bại!"
      )
    }
  }

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

                  <h6 className="m-0 font-weight-bold text-primary">
                    Danh sách nhà cung cấp
                  </h6>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setShowAddModal(true)
                    }
                  >

                    <i className="fas fa-plus mr-2"></i>

                    Thêm nhà cung cấp

                  </button>

                </div>

                <div className="card-body">

                  <div className="table-responsive">

                    <table className="table table-bordered">

                      <thead className="thead-dark">

                        <tr>

                          <th>ID</th>

                          <th>Tên nhà cung cấp</th>

                          <th>Số điện thoại</th>

                          <th>Ngày tạo</th>

                          <th>Chi tiết</th>

                        </tr>

                      </thead>

                      <tbody>

                        {
                          currentSuppliers.length > 0 ? (

                            currentSuppliers.map((item) => (

                              <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.name}</td>

                                <td>{item.phone}</td>

                                <td>
                                  {
                                    new Date(
                                      item.createdAt
                                    ).toLocaleString("vi-VN")
                                  }
                                </td>

                                <td>

                                  <button
                                    className="btn btn-info"
                                    onClick={() =>
                                      viewDetail(item)
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
                                colSpan="5"
                                className="text-center py-4"
                              >

                                Không có dữ liệu

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
                            [...Array(totalPages)].map(
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

      {/* DETAIL MODAL */}

      {
        showModal && (

          <div
            className="modal fade show d-block"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Chi tiết nhà cung cấp
                  </h5>

                  <button
                    className="btn-close"
                    onClick={closeModal}
                  ></button>

                </div>

                <div className="modal-body">

                  <div className="mb-3">

                    <label>
                      Tên nhà cung cấp
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>
                      Số điện thoại
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="modal-footer d-flex justify-content-between">

                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Xóa
                  </button>

                  <div>

                    <button
                      className="btn btn-secondary mr-2"
                      onClick={closeModal}
                    >
                      Đóng
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={handleUpdate}
                    >
                      Cập nhật
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )
      }

      {/* ADD MODAL */}

      {
        showAddModal && (

          <div
            className="modal fade show d-block"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Thêm nhà cung cấp
                  </h5>

                  <button
                    className="btn-close"
                    onClick={closeAddModal}
                  ></button>

                </div>

                <div className="modal-body">

                  <div className="mb-3">

                    <label>
                      Tên nhà cung cấp
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>
                      Số điện thoại
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary mr-2"
                    onClick={closeAddModal}
                  >
                    Đóng
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={handleAddSupplier}
                  >
                    Thêm nhà cung cấp
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

export default Supplier