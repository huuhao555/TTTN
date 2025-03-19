import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/index";
import Footer from "../footer/index";
import { UserProvider } from "../../../../middleware/UserContext";
import Breadcrumbs from "../../../../components/breadcrumbs";
import ChatbotWrapper from "../../../../components/ChatbotAsisstant";
const UserLayout = (props) => {
  return (
    <UserProvider>
      <ChatbotWrapper />
      <div {...props}>
        <Header />
        <Breadcrumbs />
        <Outlet />
        <Footer />
      </div>
    </UserProvider>
  );
};
export default memo(UserLayout);
