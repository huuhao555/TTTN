import { memo } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar-admin">
      <ul>
        <li>
          <Link>Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};
export default memo(SideBar);
