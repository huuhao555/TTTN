import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/index";
import Footer from "../footer/index";
const UserLayout = (props) => {
  return (
    <div {...props}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
export default memo(UserLayout);
