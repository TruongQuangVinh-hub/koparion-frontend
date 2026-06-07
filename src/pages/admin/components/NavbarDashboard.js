const NavbarDashboard = () => {

  const handleLogout = () => {
    localStorage.setItem(
      "auth",
      JSON.stringify(false)
    )
    window.location.href = "/admin"
  }

  return (
    <>
      <nav
        className="
          navbar
          navbar-expand
          topbar
          mb-4
          static-top
        "
        style={{
          background: "#ffffff",
          height: "78px",
          padding: "0 24px",
          borderBottom: "1px solid #eef2f7",
          boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
          zIndex: "100"
        }}
      >

        {/* LEFT */}
        <div className="d-flex align-items-center">

          {/* SIDEBAR TOGGLE */}
          <button
            id="sidebarToggleTop"
            className="
              btn
              d-md-none
              rounded-circle
              mr-3
            "
            style={{
              width: "42px",
              height: "42px",
              background: "#f1f5f9",
              border: "none"
            }}
          >
            <i className="fa fa-bars text-dark"></i>
          </button>

          {/* LOGO */}
          <div className="d-flex align-items-center">

            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "20px",
                boxShadow: "0 10px 25px rgba(79,70,229,0.25)"
              }}
            >
              <i className="fas fa-book-open"></i>
            </div>

            <div className="ml-3 d-none d-md-block">

              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                  lineHeight: "22px"
                }}
              >
                KOPARION
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "2px"
                }}
              >
                Bookstore Admin Dashboard
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <ul className="navbar-nav ml-auto align-items-center">
          {/* NOTIFICATION */}
          <li className="nav-item mr-3">

            <button
              className="btn position-relative"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}
            >

              <i
                className="fas fa-bell"
                style={{
                  color: "#475569",
                  fontSize: "16px"
                }}
              ></i>

              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: "2px solid #fff"
                }}
              ></span>

            </button>

          </li>

          {/* MESSAGE */}
          <li className="nav-item mr-3 d-none d-md-block">

            <button
              className="btn"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}
            >

              <i
                className="fas fa-envelope"
                style={{
                  color: "#475569",
                  fontSize: "16px"
                }}
              ></i>

            </button>

          </li>

          {/* USER */}
          <li className="nav-item dropdown no-arrow">

            <a
              className="
                nav-link
                dropdown-toggle
                d-flex
                align-items-center
              "
              href="/"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{
                background: "#f8fafc",
                borderRadius: "16px",
                padding: "8px 14px",
                border: "1px solid #e2e8f0"
              }}
            >

              <div className="text-right mr-3 d-none d-lg-block">

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#0f172a",
                    lineHeight: "18px"
                  }}
                >
                  Trương Quang Vinh
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8"
                  }}
                >
                  Administrator
                </div>

              </div>

              <img
                className="img-profile rounded-circle"
                src="/img/undraw_profile.svg"
                alt="avatar"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "cover",
                  border: "2px solid #e2e8f0"
                }}
              />

            </a>

            {/* DROPDOWN */}
            <div
              className="
                dropdown-menu
                dropdown-menu-right
                shadow
                animated--grow-in
                border-0
              "
              aria-labelledby="userDropdown"
              style={{
                minWidth: "220px",
                borderRadius: "16px",
                padding: "12px"
              }}
            >

              <button
                onClick={() => { handleLogout() }}
                className="
                  dropdown-item
                  d-flex
                  align-items-center
                "
                style={{
                  borderRadius: "12px",
                  padding: "12px 14px",
                  transition: "0.2s"
                }}
              >

                <i className="fas fa-sign-out-alt mr-2 text-danger"></i>

                <span
                  style={{
                    fontWeight: "500"
                  }}
                >
                  Đăng xuất
                </span>

              </button>

            </div>

          </li>

        </ul>

      </nav>
    </>
  )
}

export default NavbarDashboard