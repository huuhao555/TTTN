import { memo } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sideBar/index";
import { UserProvider } from "../../../../../middleware/UserContext";
import Header from "../../../../users/theme/header";
const ProfileLayout = (props) => {
  return (
    <UserProvider>
      <div {...props}>
        <Header />

        <div className="row">
          <div className="col-lg-3">
            <SideBar />
          </div>
          <div className="col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
    </UserProvider>
  );
};
export default memo(ProfileLayout);
