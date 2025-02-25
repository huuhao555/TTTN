import { memo } from "react";
import "./style.scss";

const SlideHomePage = () => {
  return (
    <div className="slide-home">
      <div className="container">
        <img
          src={require("../../assets/users/slide/banner1.png")}
          alt="banner"
        />
      </div>
    </div>
  );
};
export default memo(SlideHomePage);
