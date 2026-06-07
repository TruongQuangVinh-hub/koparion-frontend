import { useState, useEffect } from "react"
import MenuDashboard from "./components/MenuDashboard"
import NavbarDashboard from "./components/NavbarDashboard"
import FooterDashboard from "./components/FooterDashboard"
import {
  fetchCategoriesAPI,
  uploadProductAPI,
  fetchProductsAdminAPI,
  fetchProductsAPI,
  updateProductAPI,
  deleteProductAPI
} from "../../api/backendAPI"

import { API_URL } from "../../constant"
import { toast } from "react-toastify"
import { exportProductsPDF } from "../../helper/exportProductPDF"

const Product = () => {

  const ITEMS_PER_PAGE = 8

  const initialForm = {
    name: "",
    categoryId: "",
    price: "",
    image: null,
    description: ""
  }

  const [products, setProducts] = useState([])
  const [inventoryProducts, setInventoryProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const [productDetail, setProductDetail] = useState(null)

  const [formData, setFormData] =
    useState(initialForm)

  // =========================
  // LOAD DATA
  // =========================

  const loadProducts = async () => {

    try {

      const res = await fetchProductsAdminAPI()

      setProducts(res)

    } catch (error) {

      console.log(error)

    }
  }

  const loadCategories = async () => {

    try {

      const res = await fetchCategoriesAPI()

      setCategories(res)

    } catch (error) {

      console.log(error)

    }
  }

  useEffect(() => {

    loadProducts()
    loadCategories()

    fetchProductsAPI()
      .then((res) => {

        setInventoryProducts(res)

      })
      .catch((error) => {

        console.log(error)

      })

  }, [])

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    products.length / ITEMS_PER_PAGE
  )

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE

  const currentProducts =
    products.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
      files
    } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "image"
          ? files[0]
          : value
    }))
  }

  // =========================
  // MODAL
  // =========================

  const closeModal = () => {

    setShowModal(false)

    setProductDetail(null)

    setFormData(initialForm)
  }

  const closeAddModal = () => {

    setShowAddModal(false)

    setFormData(initialForm)
  }

  const viewDetail = (product) => {

    setProductDetail(product)

    setFormData({
      name: product.name,
      categoryId:
        product.category?.id || "",
      price: product.price,
      image: product.imageUrl,
      description:
        product.description
    })

    setShowModal(true)
  }

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async () => {

    try {

      await uploadProductAPI(
        formData.name,
        formData.price,
        formData.description,
        formData.categoryId,
        formData.image
      )

      await loadProducts()

      toast.success(
        "Thêm sản phẩm thành công!"
      )

      closeAddModal()

    } catch (error) {

      console.log(error)

      toast.error(
        "Thêm sản phẩm thất bại!"
      )
    }
  }

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdate = async () => {

    try {

      await updateProductAPI(
        productDetail.id,
        formData.name,
        formData.price,
        formData.description,
        formData.image
      )

      await loadProducts()

      toast.success(
        "Cập nhật sản phẩm thành công!"
      )

      closeModal()

    } catch (error) {

      console.log(error)

      toast.error(
        "Cập nhật sản phẩm thất bại!"
      )
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa sản phẩm này?"
      )

    if (!confirmDelete) return

    try {

      await deleteProductAPI(
        productDetail.id
      )

      const updatedProducts =
        products.filter(
          (item) =>
            item.id !== productDetail.id
        )

      setProducts(updatedProducts)

      // FIX PAGE
      const newTotalPages =
        Math.ceil(
          updatedProducts.length /
          ITEMS_PER_PAGE
        )

      if (
        currentPage > newTotalPages &&
        newTotalPages > 0
      ) {

        setCurrentPage(newTotalPages)
      }

      toast.success(
        "Xóa sản phẩm thành công!"
      )

      closeModal()

    } catch (error) {

      console.log(error)

      toast.error(
        "Xóa sản phẩm thất bại!"
      )
    }
  }

  const getProductQuantity = (productId) => {

    const inventoryItem =
      inventoryProducts.find(
        (item) =>
          item.product.id === productId
      )

    return inventoryItem
      ? inventoryItem.quantity
      : 0
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
                    Danh sách sản phẩm
                  </h6>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-danger mr-2"
                      onClick={async () => {
                        const pdfData = products.map(
                          (item) => ({

                            id: item.id,

                            name: item.name,

                            category:
                              item.category?.name || "",

                            price: item.price,

                            stock:
                              getProductQuantity(item.id),

                            description:
                              item.description || ""
                          })
                        )

                        await exportProductsPDF(
                          pdfData
                        )
                      }}
                    >

                      <i className="fas fa-file-pdf mr-2"></i>

                      Xuất PDF

                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => {

                        setFormData(initialForm)

                        setShowAddModal(true)
                      }}
                    >

                      <i className="fas fa-plus mr-2"></i>

                      Thêm sản phẩm

                    </button>

                  </div>

                </div>

                <div className="card-body">

                  <div className="table-responsive">

                    <table className="table table-bordered">

                      <thead className="thead-dark">

                        <tr>
                          <th>ID</th>
                          <th>Ảnh</th>
                          <th>Tên sách</th>
                          <th>Thể loại</th>
                          <th>Giá</th>
                          <th>Tồn kho</th>
                          <th>Mô tả</th>
                          <th>Chi tiết</th>
                        </tr>

                      </thead>

                      <tbody>

                        {
                          currentProducts.map(
                            (item) => (

                              <tr key={item.id}>

                                <td>{item.id}</td>

                                <td className="text-center">

                                  <img
                                    src={`${API_URL}${item.imageUrl}`}
                                    alt={item.name}
                                    width="70"
                                    height="90"
                                    style={{
                                      objectFit:
                                        "cover",
                                      borderRadius:
                                        "5px"
                                    }}
                                  />

                                </td>

                                <td>{item.name}</td>

                                <td>
                                  {
                                    item.category
                                      ?.name
                                  }
                                </td>

                                <td>
                                  {item.price.toLocaleString(
                                    "vi-VN"
                                  )}đ
                                </td>

                                <td>

                                  <span
                                    className={`badge ${getProductQuantity(item.id) > 0
                                      ? getProductQuantity(item.id) <= 5
                                        ? "bg-warning text-dark"
                                        : "bg-success"
                                      : "bg-danger"
                                      }`}
                                  >

                                    {
                                      getProductQuantity(item.id) > 0
                                        ? getProductQuantity(item.id)
                                        : "Hết hàng"
                                    }

                                  </span>

                                </td>

                                <td>
                                  {
                                    item.description
                                  }
                                </td>

                                <td>

                                  <button
                                    className="btn btn-info"
                                    onClick={() =>
                                      viewDetail(
                                        item
                                      )
                                    }
                                  >

                                    Xem

                                  </button>

                                </td>

                              </tr>

                            )
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

                          <li
                            className={`page-item ${currentPage === 1
                              ? "disabled"
                              : ""
                              }`}
                          >

                            <button
                              className="page-link"
                              onClick={() =>
                                setCurrentPage(
                                  currentPage - 1
                                )
                              }
                            >
                              Trước
                            </button>

                          </li>

                          {
                            [...Array(totalPages)].map(
                              (_, index) => (

                                <li
                                  key={index}
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
                                    {index + 1}
                                  </button>

                                </li>

                              )
                            )
                          }

                          <li
                            className={`page-item ${currentPage ===
                              totalPages
                              ? "disabled"
                              : ""
                              }`}
                          >

                            <button
                              className="page-link"
                              onClick={() =>
                                setCurrentPage(
                                  currentPage + 1
                                )
                              }
                            >
                              Sau
                            </button>

                          </li>

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
            tabIndex="-1"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Chi tiết sản phẩm
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>

                </div>

                <div className="modal-body">

                  <div className="text-center mb-3">

                    <img
                      src={
                        typeof formData.image ===
                          "string"
                          ? `${API_URL}${formData.image}`
                          : formData.image
                            ? URL.createObjectURL(
                              formData.image
                            )
                            : ""
                      }
                      alt={formData.name}
                      width="150"
                      className="rounded"
                    />

                  </div>

                  <div className="mb-3">

                    <label>ID sản phẩm</label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        productDetail?.id || ""
                      }
                      disabled
                    />

                  </div>

                  <div className="mb-3">

                    <label>Tên sách</label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>Thể loại</label>

                    <select
                      className="form-control"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                    >

                      <option value="">
                        -- Chọn thể loại --
                      </option>

                      {
                        categories.map(
                          (item) => (

                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>

                          )
                        )
                      }

                    </select>

                  </div>

                  <div className="mb-3">

                    <label>Giá</label>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>
                      Ảnh sản phẩm
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>Mô tả</label>

                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                    ></textarea>

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
            tabIndex="-1"
            style={{
              backgroundColor:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Thêm sản phẩm
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeAddModal}
                  ></button>

                </div>

                <div className="modal-body">

                  <div className="mb-3">

                    <label>Tên sách</label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>Thể loại</label>

                    <select
                      className="form-control"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                    >

                      <option value="">
                        -- Chọn thể loại --
                      </option>

                      {
                        categories.map(
                          (item) => (

                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}
                            </option>

                          )
                        )
                      }

                    </select>

                  </div>

                  <div className="mb-3">

                    <label>Giá</label>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>
                      Ảnh sản phẩm
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />

                  </div>

                  <div className="mb-3">

                    <label>Mô tả</label>

                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                    ></textarea>

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
                    onClick={handleAddProduct}
                  >
                    Thêm sản phẩm
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

export default Product