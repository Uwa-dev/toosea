import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "../components/Layout/Layout";
import Load from "../components/reuse/Load.jsx";
// import ProtectedRoute from "./protectRoutes";
// import AuthRouter from "./AuthRouter";
import PublicLayout from "../components/Layout/PublicLayout.jsx";
import AuthLayout from "../components/Layout/AuthLayout/AuthLayout.jsx";
// import ScrollToTop from "../components/ScrollToTop.jsx";

const Dashboard = lazy(() => import("../pages/Public/Dashboard/dashboard.jsx"));
const About = lazy(() => import("../pages/Public/About/about.jsx"))
// const NoPage = lazy(() => import("../pages/Public/NoPage/NoPage.jsx"))
const ReceptDashboard = lazy(() => import("../pages/Receptionist/ReceptDashboard/ReceptDashboard.jsx"))

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
      },
      //  {
      //   path: "*",           // Catch-all for unknown routes
      //   element: <NoPage />,
      // },
    ]
  }, {
    path: "/receptionist",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <ReceptDashboard />
      }
    ]
  }
]

export const mainRouter = createBrowserRouter(routesConfig);