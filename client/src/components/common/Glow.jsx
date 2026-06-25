const Glow = ({
  children,
  color = "primary",
  size = "md",
  className = "",
}) => {
  const colors = {
    primary: "bg-primary/20",
    secondary: "bg-secondary/20",
    accent: "bg-accent/20",
  };

  const sizes = {
    sm: "w-32 h-32 blur-3xl",
    md: "w-48 h-48 blur-3xl",
    lg: "w-64 h-64 blur-[100px]",
    xl: "w-96 h-96 blur-[120px]",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          absolute -z-10 rounded-full animate-pulse
          ${colors[color]} ${sizes[size]}
        `}
      />
      {children}
    </div>
  );
};

export default Glow;
