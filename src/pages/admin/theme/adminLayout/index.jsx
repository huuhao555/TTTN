import { memo } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sideBar";
const AdminLayout = (props) => {
  return (
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
  );
};
export default memo(AdminLayout);
