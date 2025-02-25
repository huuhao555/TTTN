import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/index";
import Footer from "../footer/index";
import UserProvider from "../../../../middleware/UserContext";
const UserLayout = (props) => {
  return (
    <UserProvider>
      <div {...props}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </UserProvider>
  );
};
export default memo(UserLayout);
