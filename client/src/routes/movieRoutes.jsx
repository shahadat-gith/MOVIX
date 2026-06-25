import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetails from "../pages/MovieDetails";
import Search from "../pages/Search";
import NotFound from "../pages/NotFound";
import Recommendations from "../pages/Recommendations";

const movieRoutes = {
  element: <MainLayout />,
  children: [
    { path: "/", element: <Home /> },
    { path: "/movies", element: <Movies /> },
    { path: "/movie/:id", element: <MovieDetails /> },
    { path: "/search", element: <Search /> },
    { path: "/recomended", element: <Recommendations /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default movieRoutes;
