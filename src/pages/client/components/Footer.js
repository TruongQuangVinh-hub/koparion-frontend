const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #111827, #1f2937)"
      }}
    >
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="footer-top-menu bb-2">
                <nav>
                  <ul>
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/">Chính sách Quyền riêng tư</a></li>
                    <li><a href="/">Liên hệ</a></li>
                  </ul>
                </nav>
              </div>

            </div>
          </div>
        </div>
      </div>


      <div className="footer-mid ptb-50">
        <div className="container">
          <div className="row">

            <div className="col-lg-8 col-md-12">
              <div className="row">

                <div className="col-lg-4 col-md-4 col-12">
                  <div className="single-footer br-2 xs-mb">

                    <div className="footer-title mb-20">
                      <h3>Sản phẩm</h3>
                    </div>

                    <div className="footer-mid-menu">
                      <ul>
                        <li><a href="/">Về chúng tôi</a></li>
                        <li><a href="/">Giảm giá</a></li>
                        <li><a href="/">Sản phẩm mới</a></li>
                        <li><a href="/">Bán chạy nhất</a></li>
                      </ul>
                    </div>

                  </div>
                </div>


                <div className="col-lg-4 col-md-4 col-12">
                  <div className="single-footer br-2 xs-mb">

                    <div className="footer-title mb-20">
                      <h3>Công ty của chúng tôi</h3>
                    </div>

                    <div className="footer-mid-menu">
                      <ul>
                        <li><a href="/">Liên hệ</a></li>
                        <li><a href="/">Sơ đồ trang</a></li>
                        <li><a href="/">Cửa hàng</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <div className="single-footer mrg-sm">
                <div className="footer-title mb-20">
                  <h3>THÔNG TIN CỬA HÀNG</h3>
                </div>

                <div className="footer-contact">
                  <p className="adress">
                    <span>Công ty</span>
                    100 Cộng Hoà, Tp HCM.
                  </p>
                  <p><span>Gọi ngay:</span> 0123456789</p>
                  <p><span>Email:</span> truongquangvinh@gmail.com</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>


      <div className="footer-bottom">
        <div className="container">
          <div className="row bt-2">

            <div className="col-lg-6 col-md-6 col-12">
              <div className="copy-right-area">
                <p>
                  <strong>Koparion</strong>
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <div className="payment-img text-end">
                <a href="/"><img src="/img/1.png" alt="payment" /></a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer