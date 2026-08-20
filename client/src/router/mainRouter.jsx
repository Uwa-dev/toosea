import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "../components/Layout/Layout";
import Load from "../components/reuse/Load.jsx";
import ProtectedRoute from "./protectRoutes";
import AuthRouter from "./AuthRouter";
import PublicLayout from "../components/Layout/PublicLayout.jsx";
import AuthLayout from "../components/Layout/AuthLayout/AuthLayout.jsx";




// import ScrollToTop from "../components/ScrollToTop.jsx";

const Dashboard = lazy(() => import("../pages/Public/Dashboard/dashboard.jsx"));
const About = lazy(() => import("../pages/Public/About/about.jsx"));
const Rooms = lazy(() => import("../pages/Public/Rooms/Rooms.jsx"));
const Contact = lazy(() => import("../pages/Public/Contact/contact.jsx"));
const Services = lazy(() => import("../pages/Public/Services/services.jsx"));
const Gallery = lazy(() => import("../pages/Public/Gallery/gallery.jsx"));
const RoomDetail = lazy(() => import("../pages/Public/Roomsdetail/roomdetail.jsx"));
// const NoPage = lazy(() => import("../pages/Public/NoPage/NoPage.jsx"))
const ReceptDashboard = lazy(() => import("../pages/Receptionist/ReceptDashboard/ReceptDashboard.jsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/Dashboard/AdminDashboard.jsx"));
const AllUsers = lazy(() => import('../pages/Admin/AllUsers/AllUsers.jsx'));
const CreateUsers = lazy(() => import("../pages/Admin/CreateUsers/CreateUsers.jsx"));
const Login = lazy(() => import("../pages/Public/Auth/Login.jsx"));
const ManagerDashboard = lazy(() => import("../pages/Manager/Dashboard/ManagerDashboard.jsx"));
const ViewSingleStaff = lazy(() => import("../pages/Admin/Staff/Staff.jsx"));
const CreateApartment = lazy(() => import("../pages/Admin/CreateApartment/Create.jsx"));
const ViewApartments = lazy(() => import("../pages/Admin/ViewApartments/ViewApartment.jsx"));
const SingleApartment = lazy(() => import("../pages/Admin/SingleApartment/SingleApartment.jsx"));
const PaymentVerification = lazy(() => import("../pages/Public/PaymentVerification/PaymentVerification.jsx"));
const CreateBooking = lazy(() => import("../pages/Receptionist/CreateBooking/CreateBooking.jsx"));
const TodaysBookings = lazy(() => import("../pages/Receptionist/TodaysBookings/TodaysBookings.jsx"));
const BookingDetails = lazy(() => import("../pages/Receptionist/BookingDetails/BookingDetails.jsx"));
const CheckedIn = lazy(() => import("../pages/Receptionist/CheckedIn/CheckedIn.jsx"));
const AllApartments = lazy(() => import("../pages/Receptionist/AllApartments/AllApartments.jsx"));
const MonthlyBookings = lazy(() => import("../pages/Admin/MonthBookings/MonthBookings.jsx"));
const YearlyBookings = lazy(() => import("../pages/Admin/YearlyBookings/YearlyBookings.jsx"));
const ApartmentImages = lazy(() => import("../pages/Admin/UploadApartmentImage/ApartmentImages.jsx"));
const ChangePassword = lazy(() => import("../pages/Public/ChangePassword/ChangePassword.jsx"));
const PendingApprovals = lazy(() => import("../pages/Admin/PendingApprovals/PendingApprovals.jsx"));
const AllApprovals = lazy(() => import("../pages/Admin/AllApprovals/AllApprovals.jsx"))

const routesConfig = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element:  <Dashboard />
      },  {
        path: "about",
        element: <About />
      }, {
        path: "rooms",
        element: <Rooms />
      },  {
        path: "contact",
        element: <Contact />
      }, {
        path: "services",
        element: <Services />
      }, {
        path: "gallery",
        element: <Gallery />
      }, {
        path: "roomdetails/:id",
        element: <RoomDetail />
      }, {
        path: "/payment/verify",
        element: <PaymentVerification />
      },
      //  {
      //   path: "*",           // Catch-all for unknown routes
      //   element: <NoPage />,
      // },
    ]
  }, {
    path: "/receptionist",
    element: (
      <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ReceptDashboard />
      }, {
        path: "walkin",
        element: <CreateBooking />
      }, {
        path: "todaybookings",
        element: <TodaysBookings />
      }, {
        path: "bookings/:id",
        element: <BookingDetails />
      }, {
        path: "checkedinguests",
        element: <CheckedIn />
      }, {
        path: "products",
        element: <AllApartments />
      }
    ]
  }, {
    path: "/login",
    element: <Login />,
  }, {
    path: "/change-password",
    element: (
      <ProtectedRoute
        allowedRoles={[
          "OWNER",
          "MANAGER",
          "RECEPTIONIST",
        ]}
      >
        <ChangePassword />
      </ProtectedRoute>
    ),
  },{
    path:"/admin",
    element: (
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      }, {
        path: "allusers",
        element: <AllUsers />
      }, {
        path: "createusers",
        element: <CreateUsers />
      }, {
        path: "apartments",
        element: <CreateApartment />
      } , {
        path: "apartmentsview",
        element: <ViewApartments />
      }, {
        path: "staff/:id",
        element: <ViewSingleStaff />
      }, {
        path: "apartment/:id",
        element: <SingleApartment />
      }, {
        path: "monthly",
        element: <MonthlyBookings />
      }, {
        path: "yearly",
        element: <YearlyBookings />
      }, {
        path: "apartment/:id/images",
        element: <ApartmentImages />
      }, {
        path: "pendingapprovals",
        element: <PendingApprovals />
      }, {
        path: "allapprovals",
        element: <AllApprovals />
      }
    ]
  }, {
    path:"/manager",
    element: (
      <ProtectedRoute allowedRoles={["MANAGER"]}>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ManagerDashboard />
      }, {
        path: "createusers",
        element: <CreateUsers />
      }, {
        path: "apartments/create",
        element: <CreateApartment />
      }, {
        path: "staff",
        element: <AllUsers />
      }, {
        path: "apartments",
        element: <AllApartments />
      }, {
        path: "bookings/today",
        element: <TodaysBookings />
      }, {
        path: "bookings/month",
        element: <MonthlyBookings />
      }, 
    ]
  }
]

export const mainRouter = createBrowserRouter(routesConfig);