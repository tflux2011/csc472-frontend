import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PolicyListPage from "./pages/PolicyListPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddPolicy from "./pages/AddPolicy";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./utils/Layout";
import PolicySinglePage from "./pages/PolicySinglePage";
import EditPolicy from "./pages/EditPolicy";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/policies" element={<PolicyListPage />} />
          <Route path="/policies/:id" element={<PolicySinglePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Route */}
          <Route path="/" element={<Layout />}>
          <Route
            path="/dashboard/add-policy"
            element={
              <ProtectedRoute>
                <AddPolicy />
              </ProtectedRoute>
            }
          />
           <Route
            path="/dashboard/edit-policy/:id"
            element={
              <ProtectedRoute>
                <EditPolicy />
              </ProtectedRoute>
            }
          />
           <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;