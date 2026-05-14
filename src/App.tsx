import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { authRoutes } from "./features/auth/authRoutes";
import { projectRoutes } from "./features/project/projectRoutes";
import { settingRoutes } from "./features/setting/settingRoutes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello App</div>,
    },
    ...authRoutes,
    ...projectRoutes,
    ...settingRoutes,
  ]);
  return <RouterProvider router={router} />;
}

export default App;
