import { Bell, MessageSquare, Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { isOpen, toggle } = useSidebar()

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "transition-all duration-300")}>
      <div className={cn("flex h-14 items-center transition-all duration-300", isOpen ? "lg:pl-0" : "lg:pl-[0px]")}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggle} aria-label="Toggle sidebar" >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Right side actions - always visible */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  3
                </span>
              </Button>

              <Button variant="ghost" size="icon" className="relative" aria-label="Messages">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  5
                </span>
              </Button>

              <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "light" ? (<Moon className="h-5 w-5" />) : (<Sun className="h-5 w-5" />)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}