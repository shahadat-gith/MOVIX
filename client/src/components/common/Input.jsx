import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, icon, className = "", ...props }, ref) => {
    const hasIcon = !!icon;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              {typeof icon === "function"
                ? icon({ className: "w-5 h-5" })
                : icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-surface border border-border rounded-lg
              text-text placeholder-text-muted/50
              transition-all duration-200
              focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
              ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-2.5
              ${error ? "border-danger focus:border-danger focus:ring-danger/30" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
