import ProductList from "./components/ProductList"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { useState } from "react"

const Home = () => {
  const [selectedCategory] = useState("all");
  const [selectedPrice] = useState("all");

  return (
    <div className="px-0 mx-0 w-100">
      <Header />
      <div className="bestseller-area pt-50 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12 col-12">
              <div className="bestseller-content">
                <h1>Tác giả bán chạy nhất</h1>
                <h2>J. K. <br />Rowling</h2>
                <p className="categories">Thể loại:<a href="/">Sách</a> , <a href="/">Sách nói</a></p>
                <p>
                  J. K. Rowling là tác giả nổi tiếng người Anh, được biết đến qua bộ truyện Harry Potter. Sách của bà mang màu sắc phép thuật, phiêu lưu và truyền tải nhiều thông điệp về tình bạn, lòng dũng cảm và sự trưởng thành.
                </p>
                <div className="social-author">
                  <ul>
                    <li><a href="/"><i className="fa fa-facebook"></i></a></li>
                    <li><a href="/"><i className="fa fa-twitter"></i></a></li>
                  </ul>
                </div>
              </div>

              <div className="banner-img-2">
                <a href="/"><img src="/img/banner/6.jpg" alt="banner" /></a>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 col-12">
              <div className="bestseller-active d-flex justify-content-center">
                <div className="bestseller-total">
                  <div className="single-bestseller">
                    <div className="bestseller-img">
                      <a href="/"><img src="/img/product/14.jpg" alt="book" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="banner-area banner-res-large pt-20 pb-40">
        <div className="container">
          <div className="row">

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="single-banner mb-30">
                <div className="banner-img">
                  <a href="/"><img src="/img/banner/1.png" alt="banner" /></a>
                </div>

                <div className="banner-text">
                  <h4>Miễn phí vận chuyển</h4>
                  <p>Cho tất cả đơn hàng trên $500</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="single-banner mb-30">
                <div className="banner-img">
                  <a href="/"><img src="/img/banner/2.png" alt="banner" /></a>
                </div>

                <div className="banner-text">
                  <h4>Cam kết hoàn tiền</h4>
                  <p>Đảm bảo hoàn tiền 100%</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="single-banner mb-30">
                <div className="banner-img">
                  <a href="/"><img src="/img/banner/3.png" alt="banner" /></a>
                </div>

                <div className="banner-text">
                  <h4>Thanh toán khi nhận hàng</h4>
                  <p>Thanh toán nhanh chóng và tiện lợi</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="single-banner mb-30">
                <div className="banner-img">
                  <a href="/"><img src="/img/banner/4.png" alt="banner" /></a>
                </div>

                <div className="banner-text">
                  <h4>Hỗ trợ khách hàng</h4>
                  <p>Gọi cho chúng tôi: + 0123.4567.89</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="new-book-area pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title bt text-center pt-50 mb-30 section-title-res">
                <h2>Sách nổi bật</h2>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <ProductList
              selectedCategory={selectedCategory}
              selectedPrice={selectedPrice}
              random={true}
            />
          </div>
        </div>
      </div>

      <div className="banner-static-area bg pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="banner-shadow-hover xs-mb">
                <a href="/"><img src="/img/banner/8.jpg" alt="banner" /></a>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="banner-shadow-hover">
                <a href="/"><img src="/img/banner/9.jpg" alt="banner" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home