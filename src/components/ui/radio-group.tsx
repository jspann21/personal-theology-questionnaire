import * as React from "react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function RadioGroup({
  className,
  value,
  onValueChange,
  name,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}) {
  const generatedName = React.useId();

  return (
    <RadioGroupContext.Provider value={{ name: name ?? generatedName, value, onValueChange }}>
      <div className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name"> & { value: string }
>(({ className, value, onChange, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);

  return (
    <input
      ref={ref}
      type="radio"
      name={context?.name}
      value={value}
      checked={context?.value === value}
      onChange={(event) => {
        context?.onValueChange?.(event.target.value);
        onChange?.(event);
      }}
      className={cn("h-4 w-4 shrink-0 accent-blue-600 focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  );
});

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
