import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-surface/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold font-display text-text">MOVIX</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Discover movies like never before with AI-powered semantic search.
              Find your next favorite film in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/movies", label: "Browse Movies" },
                { to: "/search", label: "AI Search" },
                { to: "/auth?mode=login", label: "Sign In" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-text-muted hover:text-primary-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Action",
                "Comedy",
                "Drama",
                "Horror",
                "Sci-Fi",
                "Thriller",
              ].map((genre) => (
                <Link
                  key={genre}
                  to={`/movies?genre=${genre}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-light text-text-muted hover:text-primary-light hover:bg-primary/10 border border-border/30 transition-all"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} MOVIX. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            Made with <FiHeart className="w-3 h-3 text-danger" /> using TMDB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
