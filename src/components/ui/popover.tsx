import * as React from "react";
import { cn } from "@/lib/utils";

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function Popover({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : internalOpen;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (resolvedOpen && !triggerRef.current?.contains(target) && !contentRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [resolvedOpen, setOpen]);

  return (
    <PopoverContext.Provider value={{ open: resolvedOpen, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, forwardedRef) => {
    const context = React.useContext(PopoverContext);

    if (!context) {
      throw new Error("PopoverTrigger must be used within Popover");
    }

    return (
      <button
        ref={(node) => {
          context.triggerRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        type="button"
        className={cn(className)}
        onClick={(event) => {
          context.setOpen(!context.open);
          onClick?.(event);
        }}
        {...props}
      />
    );
  },
);

PopoverTrigger.displayName = "PopoverTrigger";

function PopoverContent({
  className,
  side = "bottom",
  align = "center",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  const context = React.useContext(PopoverContext);

  if (!context) {
    throw new Error("PopoverContent must be used within Popover");
  }

  if (!context.open) {
    return null;
  }

  const sideClasses = {
    top: "bottom-full mb-2",
    right: "left-full ml-2 top-0",
    bottom: "top-full mt-2",
    left: "right-full mr-2 top-0",
  };

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={context.contentRef}
      className={cn("absolute z-50 rounded-md border bg-white text-popover-foreground shadow-lg", sideClasses[side], alignClasses[align], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
