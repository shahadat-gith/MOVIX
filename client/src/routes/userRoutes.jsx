import MainLayout from "../components/layout/MainLayout";
import Watchlist from "../pages/Watchlist";
import Recommendations from "../pages/Recommendations";

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
  ],
};

export default userRoutes;
