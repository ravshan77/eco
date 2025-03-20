import { ChevronDown, Home, Inbox, Search, Settings, Users, LucideIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import Logo from "../assets/logo.svg"

interface SubMenuItem {
  title: string
  url: string
}

interface MenuItem {
  title: string
  url?: string
  icon?: LucideIcon
  submenuKey?: string
  submenu?: SubMenuItem[]
}

const items: MenuItem[] = [
  {
    title: "Bosh sahifa",
    url: "/",
    icon: Home,
  },
  {
    title: "Ma'lumotlar",
    icon: Inbox,
    submenuKey: "information",
    submenu: [
      {
        title: "Bo'limlar",
        url: "/informations/sections",
      },
      {
        title: "Lavozimlar",
        url: "/informations/positions",
      },
      // {
      //   title: "Bajarilayotgan",
      //   url: "/tasks/in-progress",
      // },
      // {
      //   title: "Bajarilgan",
      //   url: "/tasks/completed",
      // },
    ],
  },
  {
    title: "Topshiriqlar",
    icon: Inbox,
    submenuKey: "tasks",
    submenu: [
      {
        title: "Xodimlarga topshiriq berish",
        url: "/tasks",
      },
      {
        title: "Yangi topshiriqlar",
        url: "/tasks  ",
      },
      {
        title: "Bajarilayotgan",
        url: "/tasks/in-progress",
      },
      {
        title: "Bajarilgan",
        url: "/tasks/completed",
      },
    ],
  },
  {
    title: "Xodimlar",
    icon: Users,
    submenuKey: "workers",
    submenu: [
      {
        title: "Barcha xodimlar",
        url: "/workers",
      },
    ],
  },
  {
    title: "Qidiruv",
    url: "/search",
    icon: Search,
  },
  {
    title: "Sozlamalar",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { isOpen, toggle } = useSidebar()
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set(['tasks', 'workers']))
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const sidebarRef = useRef<HTMLElement>(null)

  // Check if current path matches any submenu item
  const isSubmenuItemActive = useCallback((item: MenuItem) => {
    if (!item.submenu) return false
    return item.submenu.some(subItem => location.pathname === subItem.url)
  }, [location.pathname])

  // Initial setup for mobile devices
  useEffect(() => {
    if (isMobile && isOpen) {
      toggle()
    }
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024
      setIsMobile(newIsMobile)
      if (newIsMobile && isOpen) {
        toggle()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, toggle])

  // Handle route change on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      toggle()
    }
  }, [location.pathname, isMobile, toggle])

  // Handle click outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggle()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isOpen, toggle])

  const handleItemClick = (item: MenuItem | SubMenuItem) => {
    if ('submenu' in item && item.submenuKey) {
      setOpenSubmenus(prev => {
        const newSet = new Set(prev)
        if (newSet.has(item.submenuKey!)) {
          newSet.delete(item.submenuKey!)
        } else {
          newSet.add(item.submenuKey!)
        }
        return newSet
      })
    } else if ('url' in item && item.url) {
      navigate(item.url)
      if (isMobile && isOpen) {
        toggle()
      }
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (<div className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" onClick={() => toggle()}/>)}
      
      <aside ref={sidebarRef} className={cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card", "transition-transform duration-300 ease-in-out", isOpen ? "w-64 shadow-lg" : "w-0 lg:w-[70px]", isMobile && !isOpen && "-translate-x-full", isMobile && isOpen && "translate-x-0")}>
        {/* Sidebar header */}
        <div className="flex h-14 items-center border-b justify-center">
          <img src={Logo} alt="Logo" className="w-full h-full mt-2" />
          {/* <h2 className={cn("font-semibold truncate transition-all duration-300 px-4", isOpen ? "text-lg" : "text-sm text-center w-full")}>
            {isOpen ? "Admin Panel" : "A-P"}
          </h2> */}
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2">
            {items.map((item) => (
              <div key={item.title}>
                <Button variant="ghost" className={cn("w-full", isOpen ? "justify-between px-4" : "justify-center p-2", "hover:bg-accent hover:text-accent-foreground", (location.pathname === item.url || isSubmenuItemActive(item)) && "bg-accent text-accent-foreground")} onClick={() => handleItemClick(item)} >
                  <span className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                    {isOpen && <span className="truncate">{item.title}</span>}
                  </span>
                  {isOpen && item.submenu && (
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", openSubmenus.has(item.submenuKey!) && "rotate-180" )} />
                  )}
                </Button>
                {isOpen && item.submenu && item.submenuKey && openSubmenus.has(item.submenuKey) && (
                  <div className="mt-1 ml-4 grid gap-1">
                    {item.submenu.map((subitem) => (
                      <Button key={subitem.title} variant="ghost" onClick={() => handleItemClick(subitem)} className={cn("w-full justify-start", "hover:bg-accent hover:text-accent-foreground", location.pathname === subitem.url && "bg-accent text-accent-foreground" )}>
                        {subitem.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
} 