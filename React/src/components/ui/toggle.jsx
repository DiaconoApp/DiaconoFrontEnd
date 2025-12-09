import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, 

const Toggle = React.forwardRef,
  React.ComponentPropsWithoutRef & VariantProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
