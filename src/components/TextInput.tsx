import React from "react";
import clsx from "clsx";

type TextInputProps = React.ComponentProps<'input'>;

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={(clsx(
          "border p-2 rounded w-full my-1",
          className
        ))}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

type TextAreaProps = React.ComponentProps<'textarea'>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={(clsx(
          "border p-2 rounded w-full my-1",
          className
        ))}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export {TextInput, TextArea};