import React from "react";
import { useFormContext } from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils/cn";



export function getNestedError(errors: any, path: string): any {
  const keys = path.split('.');
  let current = errors;
  
  for (const key of keys) {
    if (current?.[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

// --------------------------------------------
// 1. FormField (injects id + error into children)
// --------------------------------------------
export function FormField({ name, children }: { name: string; children: React.ReactNode }) {
  const form = useFormContext();
  const error = form.formState.errors[name];
  const id = React.useId();

  return (
     <div className="flex flex-col gap-1">
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;

        // cast child to ReactElement<any> so TS allows arbitrary props
        return React.cloneElement(child as React.ReactElement<any>, {
          id,
          "data-error": !!error,
          error,
        });
      })}
    </div>

  );
}

// --------------------------------------------
// 2. Label
// --------------------------------------------
export const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { id?: string }
>(({ id, className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      htmlFor={id}
        className={cn(
        "absolute left-2 top-2.5 text-sm text-gray-500 transition-all duration-200 pointer-events-none",
        "peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500",
        "peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-blue-500",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// --------------------------------------------
// 3. Control (Slot → forwards props to input)
// --------------------------------------------
export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & { error?: any }
>(({ className, error, ...props }, ref) => {
  return (
    <Slot
      ref={ref}
      className={cn(
        "w-full rounded-md border p-2 text-sm outline-none transition",
        error
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300 focus:border-blue-500",
        className
      )}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// --------------------------------------------
// 4. Error message
// --------------------------------------------
export function FormMessage({ error }: { error?: any }) {
  if (!error) return null;

  return (
    <p className="text-xs text-red-600 mt-1">
      {String(error.message)}
    </p>
  );
}
