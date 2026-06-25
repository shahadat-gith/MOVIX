import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetails from "../pages/MovieDetails";
import Search from "../pages/Search";
import NotFound from "../pages/NotFound";

const movieRoutes = {
  element: <MainLayout />,
  children: [
    { path: "/", element: <Home /> },
    { path: "/movies", element: <Movies /> },
    { path: "/movie/:id", element: <MovieDetails /> },
    { path: "/search", element: <Search /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default movieRoutes;
