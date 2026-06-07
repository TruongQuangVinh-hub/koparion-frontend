import Header from "./components/Header"
import Footer from "./components/Footer"
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Header />

      <div class="section-element-area ptb-70">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="entry-header text-center mb-20">
                <p>Oops! Không tìm thấy trang.</p>
              </div>

              <div class="entry-content text-center mb-30">
                <p>
                  Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
                  Vui lòng kiểm tra lại đường dẫn URL.
                </p>

                <Link to='/'>VỀ TRANG CHỦ</Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default NotFound