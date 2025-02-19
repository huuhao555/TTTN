import { memo } from "react";
import "./style.scss";

const SlideHomePage = () => {
  return (
    <div className="container">
      <img src={require("../../assets/users/slide/banner1.png")} alt="banner" />
    </div>
  );
};
export default memo(SlideHomePage);
