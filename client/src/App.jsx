import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import ScrollToTop from "./components/others/ScrollToTop";
import movieRoutes from "./routes/movieRoutes";
import userRoutes from "./routes/userRoutes";

const App = () => {
  const routing = useRoutes([movieRoutes, userRoutes]);

  return (
    <AuthProvider>
      <MovieProvider>
        <ScrollToTop />
        <Toaster position="top-center" />
        {routing}
      </MovieProvider>
    </AuthProvider>
  );
};

export default App;