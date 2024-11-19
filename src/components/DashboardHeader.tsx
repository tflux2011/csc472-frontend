import { useAuth } from "../contexts/AuthContext";

const DashboardHeader = () => {
    const { user, logout } = useAuth();
    return (    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-gray-700">Welcome, {user?.email}!</div>
        <div className="flex items-center">
          <button onClick={logout}>Log out</button>
        </div>
      </header> );
}
 
export default DashboardHeader;