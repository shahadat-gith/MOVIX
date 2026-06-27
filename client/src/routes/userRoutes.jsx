import MainLayout from "../components/layout/MainLayout";
import Watchlist from "../pages/Watchlist";
import Recommendations from "../pages/Recommendations";
import Settings from "../pages/Settings";

const userRoutes = {
  element: <MainLayout />,
  children: [
    {
      path: "/watchlist",
      element: <Watchlist />,
    },
    {
      path: "/recommended",
      element: <Recommendations />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
  ],
};

export default userRoutes;
