import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/index";
import Footer from "../footer/index";
import { UserProvider } from "../../../../middleware/UserContext";
import Breadcrumbs from "../../../../components/breadcrumbs";
import ChatbotWrapper from "../../../../components/ChatbotAsisstant";
import ChatComponent from "../../../../components/ChatSocket";
const UserLayout = (props) => {
  return (
    <UserProvider>
      {/* <ChatComponent />
      <ChatbotWrapper /> */}
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
