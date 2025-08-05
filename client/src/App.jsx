import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Pages
import ClientHome from "./pages/ClientHome";
import FreelancerHome from "./pages/FreelancerHome";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PostJob from "./pages/PostJob";
import DashboardJobs from "./pages/DashboardJobs";
import AllJobs from "./pages/AllJobs";
import JobDetail from "./pages/JobDetail";
import OrdersPage from "./pages/OrdersPage";
import DashboardOrders from "./pages/DashboardOrders";
import Message from "./pages/Message";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import MyGigs from "./pages/MyGigs";
import PurchasedGigs from "./pages/client/PurchasedGigs";
import CategoryPage from "./pages/CategoryPage";
import DashboardClient from "./pages/client/DashboardClient";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageGigs from "./pages/admin/ManageGigs";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import MyApplications from "./pages/MyApplications";
import GigApplicants from "./pages/GigApplicants";
import ChatPage from "./pages/ChatPage";
import ReviewForm from "./components/ReviewForm";

// Components
import PrivateRoute from "./components/PrivateRoute";
import LeaveReview from "./components/LeaveReview";
import StarRating from "./components/StarRating";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Toaster position="top-center" reverseOrder={false} />
      {user && <Navbar />}

      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/dashboard" element={<DashboardJobs />} />
        <Route path="/all-jobs" element={<AllJobs />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/my-orders" element={<DashboardOrders />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/inbox" element={<ChatPage />} />

        {/* ✅ Review Form Route */}
        <Route
          path="/gigs/:gigId/order/:orderId/review"
          element={<ReviewForm />}
        />
       <Route path="/client-home" element={<ClientHome />} />
       <Route path="/freelancer-home" element={<FreelancerHome />} />


        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/gigs" element={<ManageGigs />} />

        {/* Client Routes */}
        <Route path="/dashboard/client" element={<DashboardClient />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/gig/:gigId/applicants" element={<GigApplicants />} />
        <Route
          path="/client/purchased-gigs"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <PurchasedGigs />
            </PrivateRoute>
          }
        />

        {/* Freelancer Routes */}
        <Route
          path="/freelancer-dashboard"
          element={
            <PrivateRoute role="freelancer">
              <FreelancerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mygigs"
          element={
            <PrivateRoute>
              <MyGigs />
            </PrivateRoute>
          }
        />

        {/* Chat */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Message />
            </PrivateRoute>
          }
        />

        {/* Leave Review (Optional, if used elsewhere) */}
        <Route
          path="/leave-review/:orderId"
          element={
            <PrivateRoute>
              <LeaveReview />
            </PrivateRoute>
          }
        />

        {/* Standalone Star Rating Demo (Optional) */}
        <Route path="/star-rating" element={<StarRating />} />

        {/* Payment */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
