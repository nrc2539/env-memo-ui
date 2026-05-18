import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import LandingPage from "@/features/landing";
import { authRoutes } from "./features/auth/authRoutes";
import { projectRoutes } from "./features/project/projectRoutes";
import { settingRoutes } from "./features/setting/settingRoutes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    ...authRoutes,
    ...projectRoutes,
    ...settingRoutes,
  ]);
  return <RouterProvider router={router} />;
}

export default App;
