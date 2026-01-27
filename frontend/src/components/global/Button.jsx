import { forwardRef } from 'react';
import clsx from 'clsx';

const Button = forwardRef(
  ({ children, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={clsx(
          'px-4 py-2 rounded-lg font-medium transition',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
