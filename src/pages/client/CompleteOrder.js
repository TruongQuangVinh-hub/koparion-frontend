import Header from "./components/Header"
import Footer from "./components/Footer"
import { Link } from "react-router-dom"

const CompleteOrder = () => {

  return (
    <>
      <div className="px-0 mx-0 w-100">

        <Header />

        <div
          className="d-flex align-items-center justify-content-center py-4"
          style={{
            minHeight: "20vh",
            backgroundColor: "#f8f9fa"
          }}
        >

          <div
            className="bg-white shadow-lg rounded-4 p-4 text-center"
            style={{
              maxWidth: "600px",
              width: "100%"
            }}
          >

            {/* SUCCESS ICON */}
            <div className="mb-3">

              <div
                className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#198754"
                }}
              >

                <i
                  className="fa fa-check text-white"
                  style={{
                    fontSize: "28px"
                  }}
                ></i>

              </div>

            </div>

            {/* TITLE */}
            <h2
              className="fw-bold mb-3"
              style={{
                color: "#198754"
              }}
            >
              Thanh toán thành công!
            </h2>

            {/* DESCRIPTION */}
            <p
              className="text-muted mb-3"
              style={{
                lineHeight: "1.8",
                fontSize: "16px"
              }}
            >

              Cảm ơn bạn đã mua hàng tại cửa hàng sách của chúng tôi.
              Đơn hàng của bạn đã được ghi nhận và sẽ được xử lý trong thời gian sớm nhất.

            </p>

            {/* ORDER STATUS */}
            <div
              className="bg-light rounded-3 p-4 mb-2"
            >

              <div className="row text-start">

                <div className="col-6 mb-3">

                  <small className="text-muted d-block">
                    Trạng thái đơn hàng
                  </small>

                  <span className="fw-bold text-success">
                    Thành công
                  </span>

                </div>

                <div className="col-6 mb-3">

                  <small className="text-muted d-block">
                    Phương thức thanh toán
                  </small>

                  <span className="fw-bold">
                    Đã thanh toán
                  </span>

                </div>

                <div className="col-12">

                  <small className="text-muted d-block">
                    Thời gian
                  </small>

                  <span className="fw-bold">
                    {new Date().toLocaleString("vi-VN")}
                  </span>

                </div>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">

              <Link
                to="/"
                className="btn btn-dark px-4 py-3"
              >

                <i className="fa fa-home me-2"></i>

                Về trang chủ

              </Link>

              <Link
                to="/category"
                className="btn btn-outline-dark px-4 py-3"
              >

                <i className="fa fa-shopping-bag me-2"></i>

                Tiếp tục mua sắm

              </Link>

            </div>

          </div>

        </div>

        <Footer />

      </div>
    </>
  )
}

export default CompleteOrder