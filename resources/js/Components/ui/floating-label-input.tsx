import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

const inputVariants = {
  default: "",
  filled: "bg-gray-100 border-gray-300",
  underline: "border-0 border-b-2 rounded-none rounded-t-md focus-visible:ring-0 focus-visible:border-emerald-600",
  error: "border-0 border-b-2 rounded-none border-red-600 rounded-t-md focus-visible:ring-0 focus-visible:border-red-600",
};

const labelVariants = {
  default: "text-gray-500",
  filled: "text-gray-500",
  underline: "text-gray-500 peer-focus:text-emerald-600",
  error: "text-red-600 peer-focus:text-red-600",
};

type Variant = keyof typeof inputVariants;

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  variant?: Variant;
};

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ id, label, className, variant = "default", ...props }, ref) => (
    <div className="relative">
      <Input
        id={id}
        ref={ref}
        placeholder=" "
        className={cn('peer', inputVariants[variant], className)}
        {...props}
      />
      <Label
        htmlFor={id}
        className={cn(
          'absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-transparent px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text',
          labelVariants[variant]
        )}
      >
        {label}
      </Label>
    </div>
  )
);
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput };