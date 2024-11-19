import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      
        <Outlet /> {/* This will render the current route's component */}
      
    </div>
  );
};

export default Layout;