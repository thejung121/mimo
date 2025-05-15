
import { toast as sonnerToast } from "sonner"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const toasts: ToasterToast[] = []

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function toast({
  title,
  description,
  variant,
  ...props
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
} & Omit<ToasterToast, "id">) {
  const id = generateId()
  const toast: ToasterToast = {
    id,
    title,
    description,
    variant,
    ...props,
  }

  toasts.push(toast)

  if (toasts.length > TOAST_LIMIT) {
    toasts.shift()
  }
  
  const options: any = { id }
  
  if (variant === "destructive") {
    options.style = { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }
  }

  return sonnerToast(title as string, {
    description: description as string,
    ...options
  })
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId)
      }
    },
    toasts: [...toasts], // Export toasts array
  }
}
