const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-primary/20 text-primary-light border-primary/30",
    accent: "bg-accent/20 text-accent-light border-accent/30",
    success: "bg-success/20 text-success border-success/30",
    danger: "bg-danger/20 text-danger border-danger/30",
    outline: "bg-transparent text-text-muted border-border",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 text-xs font-medium
        rounded-full border transition-all duration-200
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
