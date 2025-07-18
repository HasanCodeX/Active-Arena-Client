import "react-toastify/dist/ReactToastify.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthProvider from "./context/Provider/AuthProvider";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import About from "./routes/About";
import AllCourtsPage from "./routes/AllCourtsPage";
import Support from "./routes/Support";
import Contact from "./routes/Contact";

// User Dashboard
import UserProfile from "./pages/dashboard/user/UserProfile";
import UserPendingBookings from "./pages/dashboard/user/UserPendingBookings";
import UserAnnouncements from "./pages/dashboard/user/UserAnnouncements";

// Member Dashboard
import MemberProfile from "./pages/dashboard/member/MemberProfile";
import MemberApprovedBookings from "./pages/dashboard/member/MemberApprovedBookings";
import MemberConfirmedBookings from "./pages/dashboard/member/MemberConfirmedBookings";
import PaymentPage from "./pages/dashboard/member/PaymentPage";
import PaymentHistory from "./pages/dashboard/member/PaymentHistory";

// Admin Dashboard
import AdminProfile from "./pages/dashboard/admin/AdminProfile";
import ManageBookingsApproval from "./pages/dashboard/admin/ManageBookingsApproval";
import ManageMembers from "./pages/dashboard/admin/ManageMembers";
import ManageAllUsers from "./pages/dashboard/admin/ManageAllUsers";
import ManageCourts from "./pages/dashboard/admin/ManageCourts";
import ManageConfirmedBookings from "./pages/dashboard/admin/ManageConfirmedBookings";
import ManageCoupons from "./pages/dashboard/admin/ManageCoupons";
import MakeAnnouncement from "./pages/dashboard/admin/MakeAnnouncement";

import Loading from "./components/Loading";
import { useRole } from "./hooks/useRole";

// Role-based route wrapper
const RoleRoute = ({ allowedRoles, children }) => {
  const { role, isLoading } = useRole();
  if (isLoading) return <Loading />;
  return allowedRoles.includes(role) ? children : <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "about", element: <About /> },
      { path: "all-courts", element: <AllCourtsPage /> },
      { path: "contact", element: <Contact /> },
      { path: "support", element: <Support /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Overview /> },

      // User Routes
      {
        path: "user-profile",
        element: (
          <RoleRoute allowedRoles={["user"]}>
            <UserProfile />
          </RoleRoute>
        ),
      },
      {
        path: "pending-bookings",
        element: (
          <RoleRoute allowedRoles={["user", "member"]}>
            <UserPendingBookings />
          </RoleRoute>
        ),
      },
      {
        path: "announcements",
        element: (
          <RoleRoute allowedRoles={["user", "member", "admin"]}>
            <UserAnnouncements />
          </RoleRoute>
        ),
      },

      // Member Routes
      {
        path: "member-profile",
        element: (
          <RoleRoute allowedRoles={["member"]}>
            <MemberProfile />
          </RoleRoute>
        ),
      },
      {
        path: "approved-bookings",
        element: (
          <RoleRoute allowedRoles={["member"]}>
            <MemberApprovedBookings />
          </RoleRoute>
        ),
      },
      {
        path: "confirmed-bookings",
        element: (
          <RoleRoute allowedRoles={["member"]}>
            <MemberConfirmedBookings />
          </RoleRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <RoleRoute allowedRoles={["member"]}>
            <PaymentPage />
          </RoleRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <RoleRoute allowedRoles={["member"]}>
            <PaymentHistory />
          </RoleRoute>
        ),
      },

      // Admin Routes
      {
        path: "admin-profile",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </RoleRoute>
        ),
      },
      {
        path: "manage-bookings", // Pending approval bookings list
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageBookingsApproval />
          </RoleRoute>
        ),
      },
      {
        path: "manage-confirmed-bookings", // Confirmed bookings list
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageConfirmedBookings />
          </RoleRoute>
        ),
      },
      {
        path: "manage-members",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageMembers />
          </RoleRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageAllUsers />
          </RoleRoute>
        ),
      },
      {
        path: "manage-courts",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageCourts />
          </RoleRoute>
        ),
      },
      {
        path: "manage-coupons",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageCoupons />
          </RoleRoute>
        ),
      },
      {
        path: "make-announcement",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <MakeAnnouncement />
          </RoleRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-center" autoClose={1500} />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
