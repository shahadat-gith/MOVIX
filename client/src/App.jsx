import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import movieRoutes from "./routes/movieRoutes";

import userRoutes from "./routes/userRoutes";

const App = () => {
  const routing = useRoutes([ movieRoutes, userRoutes]);

  return (
    <AuthProvider>
      <MovieProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#121826",
              color: "#f8fafc",
              border: "1px solid #263042",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f8fafc",
              },
            },
          }}
        />
        {routing}
      </MovieProvider>
    </AuthProvider>
  );
};

export default App;
