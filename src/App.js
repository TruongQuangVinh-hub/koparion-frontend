import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/client/Home'
import Cart from './pages/client/Cart'
import Category from './pages/client/Category'
import Checkout from './pages/client/Checkout'
import NotFound from './pages/client/NotFound'
import CompleteOrder from './pages/client/CompleteOrder'

import ChatBox from './pages/client/components/ChatBox'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Product from './pages/admin/Product'
import Order from './pages/admin/Order'
import Inventory from './pages/admin/Inventory'
import Supplier from './pages/admin/Supplier'
import Purchase from './pages/admin/Purchase'

const AppContent = () => {

  const location = useLocation()

  const auth = JSON.parse(
    localStorage.getItem("auth")
  )

  // kiểm tra có phải route admin không
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      <Routes>

        {/* Client */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category" element={<Category />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/complete-order" element={<CompleteOrder />} />

        {/* Login */}
        <Route
          path="/admin"
          element={
            auth
              ? <Navigate to="/admin/dashboard" />
              : <Login />
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            auth
              ? <Dashboard />
              : <Navigate to="/admin" />
          }
        />

        <Route
          path="/admin/product"
          element={
            auth
              ? <Product />
              : <Navigate to="/admin" />
          }
        />

        <Route
          path="/admin/order"
          element={
            auth
              ? <Order />
              : <Navigate to="/admin" />
          }
        />

        <Route
          path="/admin/inventory"
          element={
            auth
              ? <Inventory />
              : <Navigate to="/admin" />
          }
        />

        <Route
          path="/admin/supplier"
          element={
            auth
              ? <Supplier />
              : <Navigate to="/admin" />
          }
        />

        <Route
          path="/admin/purchase"
          element={
            auth
              ? <Purchase />
              : <Navigate to="/admin" />
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {!isAdminRoute && <ChatBox />}

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
      />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App