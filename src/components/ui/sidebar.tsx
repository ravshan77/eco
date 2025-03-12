import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// const SIDEBAR_WIDTH = 280
// const SIDEBAR_COLLAPSED_WIDTH = 80
// const SIDEBAR_COOKIE = "sidebar-state"

const sidebarVariants = cva(
  "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-r border-border",
        ghost: "border-transparent",
      },
      state: {
        expanded: "w-[280px]",
        collapsed: "w-[80px]",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "expanded",
    },
  }
)

const sidebarVariantsMobile = cva(
  "fixed top-0 left-0 z-40 h-screen transition-transform bg-background border-r",
  {
    variants: {
      side: {
        left: "left-0",
        right: "right-0",
      },
      variant: {
        default: "bg-background",
        transparent: "bg-transparent",
      },
      collapsible: {
        icon: "w-[64px] data-[open=true]:w-[256px]",
        full: "w-[256px]",
      },
    },
    defaultVariants: {
      side: "left",
      variant: "default",
      collapsible: "full",
    },
  }
)

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
  isSubMenuOpen: { [key: string]: boolean }
  toggleSubMenu: (key: string) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isSubMenuOpen, setIsSubMenuOpen] = React.useState<{ [key: string]: boolean }>({})

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const toggleSubMenu = React.useCallback((key: string) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, isSubMenuOpen, toggleSubMenu }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

export function Sidebar({ className, variant, state, ...props }: SidebarProps) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={cn(
        sidebarVariants({ variant, state: isOpen ? "expanded" : "collapsed" }),
        className
      )}
      {...props}
    />
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()
  
  return (
    <div
      className={cn(
        "flex h-16 items-center gap-3 border-b px-4",
        isOpen ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-14 items-center border-t px-4", className)}
      {...props}
    />
  )
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto py-6", className)}
      {...props}
    />
  )
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-2 px-3", className)}
      {...props}
    />
  )
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // const { isOpen } = useSidebar()
  
  return (
    <div
      className={cn(
        "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2",
        className
      )}
      {...props}
    />
  )
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  isSubmenu?: boolean
  submenuKey?: string
}

export function SidebarMenuItem({
  className,
  icon: Icon,
  children,
  isSubmenu,
  submenuKey,
  ...props
}: SidebarMenuItemProps) {
  const { isOpen, toggleSubMenu } = useSidebar()
  // const isCurrentSubmenuOpen = submenuKey ? isSubMenuOpen[submenuKey] : false


  return (
    <div
      className={cn(
        "group relative flex items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
        isSubmenu && "pl-10",
        className
      )}
      onClick={() => submenuKey && toggleSubMenu(submenuKey)}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-5 w-5",
            isOpen ? "mr-3" : "mx-auto"
          )}
        />
      )}
      {(isOpen || isSubmenu) && children}
    </div>
  )
}

export function SidebarSubmenu({
  className,
  children,
  submenuKey,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { submenuKey: string }) {
  const { isSubMenuOpen } = useSidebar()
  const isOpen = isSubMenuOpen[submenuKey]

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-screen" : "max-h-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1", className)}
      {...props}
    />
  )
}

export function SidebarMenuButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("flex w-full items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", className)}
      {...props}
    />
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, isOpen } = useSidebar()

  return (
    <button
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 hover:bg-accent/20",
        className
      )}
      onClick={toggle}
      {...props}
    >
      <svg
        className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  )
}

interface SidebarMobileProps extends React.HTMLAttributes<HTMLDivElement> {
  side: "left" | "right"
  variant: "default" | "transparent"
  collapsible: "icon" | "full"
}

export function SidebarMobile({
  className,
  side,
  variant,
  collapsible,
  ...props
}: SidebarMobileProps) {
  const { isOpen } = useSidebar()

  return (
    <aside
      data-open={isOpen}
      className={cn(
        sidebarVariantsMobile({ side, variant, collapsible }),
        className
      )}
      {...props}
    />
  )
} 