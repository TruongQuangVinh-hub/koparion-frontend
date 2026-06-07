import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleChangeUsername = (event) => {
    setUsername(event)
  }

  const handleChangePassword = (event) => {
    setPassword(event)
  }

  const handleLogin = async () => {

    if (username === "" || password === "") {
      toast.error("Vui lòng nhập tên người dùng và mật khẩu.")
      return
    }

    const adminUsername = "admin"
    const adminPassword = "123456"

    if (
      username === adminUsername &&
      password === adminPassword
    ) {

      localStorage.setItem(
        "auth",
        JSON.stringify(true)
      )

      window.location.href = "/admin/dashboard"

    } else {
      toast.error("Sai tài khoản hoặc mật khẩu")
    }
  }

  useEffect(() => {

    const auth = JSON.parse(
      localStorage.getItem("auth")
    )

    if (auth) {
      navigate("/admin/dashboard")
    }

  })

  return (
    <>
      <div
        className="container-fluid"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #4f46e5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px"
        }}
      >

        <div className="row justify-content-center w-100">

          <div className="col-xl-4 col-lg-5 col-md-7">

            <div
              className="
                card
                border-0
                shadow-lg
                overflow-hidden
              "
              style={{
                borderRadius: "28px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)"
              }}
            >

              <div className="card-body p-0">

                <div className="p-5">

                  {/* LOGO */}
                  <div className="text-center mb-4">

                    <div
                      style={{
                        width: "85px",
                        height: "85px",
                        borderRadius: "24px",
                        background:
                          "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow:
                          "0 12px 30px rgba(79,70,229,0.35)"
                      }}
                    >

                      <i
                        className="fas fa-book-open"
                        style={{
                          fontSize: "34px",
                          color: "#fff"
                        }}
                      ></i>

                    </div>

                    <h1
                      className="mb-2"
                      style={{
                        fontSize: "30px",
                        fontWeight: "800",
                        color: "#0f172a"
                      }}
                    >
                      KOPARION
                    </h1>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "15px",
                        marginBottom: "0"
                      }}
                    >
                      Đăng nhập vào hệ thống quản trị
                    </p>

                  </div>

                  {/* USERNAME */}
                  <div className="form-group mb-4">

                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#334155",
                        marginBottom: "10px"
                      }}
                    >
                      Tên người dùng
                    </label>

                    <div
                      className="d-flex align-items-center"
                      style={{
                        height: "56px",
                        background: "#f8fafc",
                        borderRadius: "16px",
                        padding: "0 18px",
                        border: "1px solid #e2e8f0"
                      }}
                    >

                      <i
                        className="fas fa-user"
                        style={{
                          color: "#94a3b8",
                          fontSize: "15px"
                        }}
                      ></i>

                      <input
                        value={username}
                        onChange={(event) => {
                          handleChangeUsername(
                            event.target.value
                          )
                        }}
                        type="text"
                        className="form-control border-0 shadow-none bg-transparent"
                        placeholder="Nhập tên người dùng"
                        style={{
                          fontSize: "15px"
                        }}
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div className="form-group mb-4">

                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#334155",
                        marginBottom: "10px"
                      }}
                    >
                      Mật khẩu
                    </label>

                    <div
                      className="d-flex align-items-center"
                      style={{
                        height: "56px",
                        background: "#f8fafc",
                        borderRadius: "16px",
                        padding: "0 18px",
                        border: "1px solid #e2e8f0"
                      }}
                    >

                      <i
                        className="fas fa-lock"
                        style={{
                          color: "#94a3b8",
                          fontSize: "15px"
                        }}
                      ></i>

                      <input
                        value={password}
                        onChange={(event) => {
                          handleChangePassword(
                            event.target.value
                          )
                        }}
                        type="password"
                        className="form-control border-0 shadow-none bg-transparent"
                        placeholder="Nhập mật khẩu"
                        style={{
                          fontSize: "15px"
                        }}
                      />

                    </div>

                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      handleLogin()
                    }}
                    className="
                      btn
                      btn-block
                      text-white
                    "
                    style={{
                      height: "56px",
                      borderRadius: "16px",
                      fontWeight: "700",
                      fontSize: "16px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      boxShadow:
                        "0 12px 25px rgba(79,70,229,0.35)"
                    }}
                  >

                    <i className="fas fa-sign-in-alt mr-2"></i>

                    Đăng nhập

                  </button>

                  {/* FOOTER */}
                  <div
                    className="text-center mt-4"
                    style={{
                      fontSize: "13px",
                      color: "#94a3b8"
                    }}
                  >
                    © 2026 Koparion Book Store
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Login