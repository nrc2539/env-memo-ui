import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Projects from "./pages/dashboard/Projects";
import ProjectDetail from "./pages/dashboard/ProjectDetail";
import Settings from "./pages/dashboard/Settings";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello App</div>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Projects /> },
        { path: "projects", element: <Projects /> },
        { path: "projects/:projectId", element: <ProjectDetail /> },
        { path: "settings", element: <Settings /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
