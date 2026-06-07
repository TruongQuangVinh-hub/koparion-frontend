import axios from "./AxiosSetup";

export const fetchProductsAPI = () => {
  let res = axios.get('/inventory')
  return res;
}

export const fetchProductsAdminAPI = () => {
  let res = axios.get('/products')
  return res;
}

export const fetchCategoriesAPI = () => {
  let res = axios.get('/categories')
  return res;
}

export const checkoutByCustomerAPI = (data) => {
  let res = axios.post('/transactions/checkout', data)
  return res;
}

export const uploadProductAPI = (
  name,
  price,
  description,
  categoryId,
  image
) => {

  const formData = new FormData()

  formData.append("image", image)

  let res = axios.post(
    `/products/upload?name=${encodeURIComponent(name)}&price=${price}&description=${encodeURIComponent(description)}&categoryId=${categoryId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )

  return res
}

export const updateProductAPI = (
  id,
  name,
  price,
  description,
  image
) => {

  const formData = new FormData()

  // nếu có chọn ảnh mới thì mới append
  if (image instanceof File) {
    formData.append("image", image)
  }

  let res = axios.put(

    `/products/upload/${id}?name=${encodeURIComponent(name)}&price=${price}&description=${encodeURIComponent(description)}`,

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )

  return res
}

export const deleteProductAPI = (id) => {
  let res = axios.delete(`/products/${id}`)
  return res
}

export const fetchOrdersAPI = () => {
  let res = axios.get('/transactions/orders')
  return res;
}

export const fetchLowStockAPI = () => {
  let res = axios.get('/inventory/low-stock')
  return res;
}

export const fetchSuppliersAPI = async () => {

  const res = await axios.get("/suppliers")

  return res
}

export const uploadSuppliersAPI = async (
  name,
  phone
) => {

  const res = await axios.post(
    "/suppliers",
    {
      name,
      phone
    }
  )

  return res.data
}

export const updateSuppliersAPI = async (
  id,
  name,
  phone
) => {

  const res = await axios.put(
    `/suppliers/${id}`,
    {
      name,
      phone
    }
  )

  return res.data
}

export const deleteSuppliersAPI = async (id) => {

  const res = await axios.delete(
    `/suppliers/${id}`
  )

  return res.data
}

export const uploadPurchaseAPI = async (data) => {
  const res = await axios.post(
    `/transactions/purchase-import`,
    data
  )
  return res
}

export const fetchPurchaseAPI = async () => {
  const res = await axios.get(
    `/purchase-orders`
  )
  return res
}

export const fetchDetailPurchaseAPI = async (id) => {
  const res = await axios.get(
    `/transactions/purchase-import/${id}/details`
  )
  return res
}

export const fetchDetailOrderAPI = async (orderId) => {
  const res = await axios.get(
    `/order-details/order/${orderId}`
  )
  return res
}

export const updateOrderDetailAPI = async (
  id,
  status
) => {

  const res = await axios.put(
    `/transactions/orders/${id}/status`,
    {
      orderStatus: status
    }
  )

  return res.data
}