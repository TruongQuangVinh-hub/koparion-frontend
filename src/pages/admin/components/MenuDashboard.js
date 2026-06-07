import {
  Link,
  useLocation
} from "react-router-dom"

const MenuDashboard = () => {

  const location = useLocation()

  const menus = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: "fas fa-chart-pie"
    },
    {
      path: "/admin/product",
      name: "Sản phẩm",
      icon: "fas fa-book-open"
    },
    {
      path: "/admin/order",
      name: "Đơn hàng",
      icon: "fas fa-shopping-bag"
    },
    {
      path: "/admin/supplier",
      name: "Nhà cung cấp",
      icon: "fas fa-truck"
    },
    {
      path: "/admin/purchase",
      name: "Nhập hàng",
      icon: "fas fa-cart-plus"
    },
    {
      path: "/admin/inventory",
      name: "Gần hết hàng",
      icon: "fas fa-box-open"
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <div id="wrapper">

        <ul
          className="
            navbar-nav
            sidebar
            sidebar-dark
            accordion
            shadow-lg
          "
          id="accordionSidebar"
          style={{
            minHeight: "100vh",
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            padding: "20px 12px"
          }}
        >

          {/* LOGO */}
          <div
            className="
              d-flex
              flex-column
              align-items-center
              justify-content-center
              mb-4
            "
          >

            <div
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
                boxShadow: "0 8px 20px rgba(99,102,241,0.4)"
              }}
            >
              <i
                className="fas fa-book-reader text-white"
                style={{ fontSize: "26px" }}
              ></i>
            </div>

            <div
              className="text-center text-white fw-bold"
              style={{
                fontSize: "15px",
                lineHeight: "24px",
                letterSpacing: "1px"
              }}
            >
              KOPARION ADMIN
            </div>

          </div>

          <hr
            style={{
              borderColor: "rgba(255,255,255,0.1)"
            }}
          />

          {/* MENU */}
          {
            menus.map((item, index) => {

              const active = isActive(item.path)

              return (
                <li
                  key={index}
                  className="nav-item mb-2"
                >

                  <Link
                    to={item.path}
                    className="nav-link d-flex align-items-center"
                    style={{
                      borderRadius: "14px",
                      padding: "14px 16px",
                      fontWeight: "500",
                      transition: "0.3s",
                      background: active
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "transparent",
                      color: "#fff",
                      boxShadow: active
                        ? "0 8px 18px rgba(99,102,241,0.35)"
                        : "none"
                    }}
                  >

                    <i
                      className={item.icon}
                      style={{
                        fontSize: "18px",
                        width: "28px"
                      }}
                    ></i>

                    <span
                      style={{
                        fontSize: "15px"
                      }}
                    >
                      {item.name}
                    </span>

                  </Link>

                </li>
              )
            })
          }

          {/* FOOTER */}
          <div
            className="mt-auto text-center"
            style={{
              paddingTop: "30px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px"
            }}
          >
            © 2026 Koparion
          </div>

        </ul>

      </div>
    </>
  )
}

export default MenuDashboard