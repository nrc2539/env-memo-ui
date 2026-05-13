import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import AppLayout from "./components/layout/AppLayout";
import Projects from "./features/dashboard/Projects";
import ProjectDetail from "./features/dashboard/ProjectDetail";
import Settings from "./features/dashboard/Settings";
import { authRoutes } from "./features/auth/authRoutes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello App</div>,
    },
    ...authRoutes,
    {
      path: "/dashboard",
      element: <AppLayout />,
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
