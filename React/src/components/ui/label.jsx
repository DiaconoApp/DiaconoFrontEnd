import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, 

const Label = React.forwardRef,
  React.ComponentPropsWithoutRef & VariantProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
