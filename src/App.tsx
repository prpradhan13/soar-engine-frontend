import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const HomePage = lazy(() => import("@/pages/HomePage"));
const CloudAlertPage = lazy(() => import("@/pages/CloudAlertPage"));

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/cloud-alerts",
      element: <CloudAlertPage />,
    },
  ])
  
  return (
    <Suspense fallback="Loading...">
      <Toaster />
      <RouterProvider router={router} />
    </Suspense>
  )
}
