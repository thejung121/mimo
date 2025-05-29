
import { useState, useEffect } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/ModeToggle"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { Home, Users, Coins, Plus, Settings, LogOut, MessageSquare, User, Layout, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import MimoLogo from "@/components/MimoLogo"

const sidebarNavItems = [
  {
    title: "Visão geral",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "Mimos",
    href: "/dashboard/mimos",
    icon: Coins
  },
  {
    title: "Fãs",
    href: "/dashboard/fans",
    icon: Users
  },
  {
    title: "Recompensas",
    href: "/dashboard/conteudo",
    icon: MessageSquare
  },
  {
    title: "Minha Página",
    href: "/dashboard/minha-pagina",
    icon: Layout
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { creator } = useDashboard()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      console.log('No user found in dashboard, redirecting to login');
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location, isClient]);

  // Close sidebar when clicking on a link on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById('mobile-sidebar')
        const trigger = document.getElementById('sidebar-trigger')
        
        if (sidebar && !sidebar.contains(e.target as Node) && 
            trigger && !trigger.contains(e.target as Node)) {
          setIsSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isSidebarOpen])

  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  if (!isClient || !user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "fixed md:relative top-0 left-0 z-50 h-full w-64 max-w-[80vw] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 min-h-[60px]">
          <div className="truncate">
            <MimoLogo size="small" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden flex-shrink-0"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 px-2 py-3">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
              onClick={handleLinkClick}
            >
              <Home className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium truncate">Início</span>
            </Link>
            
            <Separator className="my-2" />
            
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors font-medium text-sm",
                  location.pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
            
            <Separator className="my-2" />
            
            <Link
              to="/dashboard/pacotes/novo"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-primary text-sm"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Nova recompensa</span>
            </Link>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full min-w-0">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between min-h-[60px] w-full">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Button 
              id="sidebar-trigger"
              variant="ghost" 
              size="icon" 
              className="md:hidden flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="md:hidden min-w-0 flex-1">
              <MimoLogo size="small" />
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            <span className="text-xs font-medium hidden sm:block truncate max-w-[120px]">
              {user?.name || creator?.name || 'Bem-vindo'}
            </span>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full flex-shrink-0">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={creator?.avatar || user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 z-50">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/configuracoes')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 md:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 w-full min-w-0 overflow-x-hidden">
          <div className="w-full max-w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
