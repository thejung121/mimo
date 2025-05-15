
import { toast as sonnerToast, Toast } from "sonner";
import { ReactNode } from "react";

type ToastProps = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
  [key: string]: any;
};

export const toasts: Array<{
  id: string | number;
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
}> = [];

export function toast({ title, description, variant = "default", ...props }: ToastProps) {
  const id = sonnerToast(title as string, {
    description,
    ...props,
  });

  toasts.push({
    id,
    title,
    description,
    variant,
  });

  return id;
}

export function dismiss(toastId?: string) {
  sonnerToast.dismiss(toastId);
  
  const index = toasts.findIndex((t) => t.id === toastId);
  if (index !== -1) {
    toasts.splice(index, 1);
  }
}

export const useToast = () => {
  return {
    toast,
    dismiss,
    toasts,
  };
};
