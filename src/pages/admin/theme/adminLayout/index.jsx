import { memo } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sideBar";
import { UserProvider } from "../../../../middleware/UserContext";
const AdminLayout = (props) => {
  return (
    <UserProvider>
      <div {...props}>
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
export default memo(AdminLayout);
