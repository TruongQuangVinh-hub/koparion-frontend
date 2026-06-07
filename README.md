# Hệ thống Quản lý Cửa hàng & Bán sách Trực tuyến

Hệ thống được phát triển theo mô hình Client-Server hiện đại: Backend xây dựng bằng **Spring Boot** mạnh mẽ xử lý logic nghiệp vụ, kết hợp với Frontend **ReactJS** và **Bootstrap** mang lại giao diện trực quan, mượt mà và tối ưu trải nghiệm người dùng. 

Dự án hỗ trợ đầy đủ các nghiệp vụ quản lý kho (Nhập hàng từ nhà cung cấp), bán hàng tự động trừ kho (COD / Cổng thanh toán trực tuyến VNPay), và hệ thống quản trị trạng thái đơn hàng toàn diện (Admin Dashboard).

---

## 🚀 Tính năng nổi bật

### 🛒 Luồng Bán Hàng & Đặt Hàng (Giao diện Khách hàng)
* **Mua sắm & Đặt hàng COD:** Giao diện hiển thị danh sách sách trực quan, hỗ trợ bộ lọc và giỏ hàng động (React State). Khi khách hàng đặt hàng COD, hệ thống tự động tính toán tổng tiền và gửi yêu cầu trừ kho theo thời gian thực.
* **Thanh toán Online qua VNPay:** * Tự động sinh URL thanh toán tích hợp cổng VNPay bảo mật.
  * Xử lý IPN / Callback an toàn từ phía Backend, kiểm tra chữ ký và tính toàn vẹn dữ liệu.
  * Frontend cập nhật trạng thái đơn hàng thành `PAID` và hiển thị thông báo kết quả trực quan ngay sau khi thanh toán thành công.

### 📦 Luồng Quản Lý Nhập Hàng (Admin Dashboard)
* **Nhập hàng từ Nhà cung cấp:** Admin thực hiện tạo đơn nhập hàng (`Purchase Order`) qua các form tương tác thông minh trên giao diện. Hệ thống tự động tính tổng chi phí nhập và cộng số lượng sách trực tiếp vào bảng tồn kho (`Inventories`).

### ⚙️ Luồng Quản Trị Trạng Thái Đơn Hàng (Admin Dashboard)
* **Cập nhật trạng thái linh hoạt:** Cung cấp bảng điều khiển (Dashboard) tiện lợi cho Admin dễ dàng theo dõi, lọc và chuyển đổi trạng thái đơn hàng (`PENDING`, `PAID`, `DELIVERED`, `CANCELLED`) chỉ với vài thao tác click chuột.
* **Cơ chế hoàn trả kho tự động:** Khi Admin chuyển trạng thái đơn hàng thành `CANCELLED` (Hủy đơn) trên giao diện, hệ thống tự động bốc tách danh sách chi tiết đơn hàng và hoàn trả (cộng lại) đúng số lượng sách tương ứng vào kho, đồng thời cập nhật số liệu mới nhất lên màn hình quản trị ngay lập tức.

---

## 🛠️ Công nghệ sử dụng

### Backend
* **Framework:** Spring Boot (Java)
* **Security:** Spring Security / JWT (Quản lý xác thực và phân quyền)
* **Data Access:** Spring Data JPA, Hibernate
* **Database:** MySQL / PostgreSQL

### Frontend
* **Library:** ReactJS (Quản lý trạng thái, Single Page Application - SPA)
* **HTTP Client:** Axios (Kết nối và gọi API từ Backend)
* **UI/UX Framework:** Bootstrap (Thiết kế giao diện Responsive, hiển thị tối ưu trên cả Mobile, Tablet và Desktop)
