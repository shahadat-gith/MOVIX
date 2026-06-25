import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/40 bg-surface/20 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden shadow-glow-primary/20">
                <img src="/logo.png" alt="MOVIX" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold font-display text-text tracking-wide">MOVIX</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">Discover movies like never before with AI-powered semantic search. Find your next favorite film in seconds.</p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface-light/50 text-text-muted hover:text-white hover:bg-surface-light border border-border/30 transition-all"><FiGithub className="w-4 h-4" /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface-light/50 text-text-muted hover:text-white hover:bg-surface-light border border-border/30 transition-all"><FiTwitter className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text uppercase tracking-widest border-l-2 border-primary pl-2">Explore</h3>
            <div className="flex flex-col gap-2.5">
              {[{ to: "/", label: "Home" }, { to: "/movies", label: "Browse Movies" }, { to: "/search", label: "AI Search" }].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-text-muted hover:text-primary-light transition-colors w-fit">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text uppercase tracking-widest border-l-2 border-secondary pl-2">Genres</h3>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"].map((genre) => (
                <Link key={genre} to={`/movies?genre=${genre}`} className="text-xs px-2.5 py-1 rounded-md bg-surface-light/40 text-text-muted hover:text-primary-light hover:bg-primary/10 border border-border/20 transition-all">{genre}</Link>
              ))}
            </div>
          </div>

          {/* Legal / Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text uppercase tracking-widest border-l-2 border-accent pl-2">Legal</h3>
            <div className="flex flex-col gap-2.5">
              {[{ to: "/privacy", label: "Privacy Policy" }, { to: "/terms", label: "Terms & Conditions" }, { to: "/contact", label: "Contact Us" }].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-text-muted hover:text-primary-light transition-colors w-fit">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} MOVIX. All rights reserved.</p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-light/30 border border-border/20">
            <span>Made with</span><FiHeart className="w-3 h-3 text-danger fill-danger" /><span>using TMDB API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;