import { memo } from "react";
import "./style.scss";
const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <img
              src={require("../../../../assets/users/6.png")}
              alt="Logo Header"
            />
          </div>

          <div className="col-lg-3">
            <h2>Tổng đài hỗ trợ</h2>
            <p>
              Gọi mua: <span className="highlight">1900 232 460</span> (8:00 -
              21:30)
            </p>
            <p>
              Khiếu nại: <span className="highlight">1800 1062</span> (8:00 -
              21:30)
            </p>
            <p>
              Bảo hành: <span className="highlight">1900 232 464</span> (8:00 -
              21:00)
            </p>
          </div>
          <div className="col-lg-3">
            <h2>Về công ty</h2>
            <ul>
              <li>Giới thiệu công ty (MWG.vn)</li>
              <li>Tuyển dụng</li>
              <li>Gửi góp ý, khiếu nại</li>
              <li>Tìm siêu thị (2.961 shop)</li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h2>Thông tin khác</h2>
            <ul>
              <li>Tích điểm Quà tặng VIP</li>
              <li>Lịch sử mua hàng</li>
              <li>Đăng ký bán hàng CTV chiết khấu cao</li>
              <li>Tìm hiểu về mua trả chậm</li>
              <li>Chính sách bảo hành</li>
            </ul>
          </div>

          <div className="footer__bottom">
            <p>© 2025. Địa chỉ... Email: nhom5.tttn@vaa.edu.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Footer);
