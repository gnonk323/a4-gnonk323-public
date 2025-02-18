import React from "react";
import clsx from "clsx";

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: "primary" |  "danger"
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant="primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={(clsx(
          "px-3 py-2 rounded transition-colors",
          {
            "bg-blue-700 hover:bg-blue-600 text-white": variant === "primary",
            "border border-red-700 px-3 py-2 rounded-md text-red-700 hover:bg-red-100": variant === "danger",
          },
          className
        ))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;