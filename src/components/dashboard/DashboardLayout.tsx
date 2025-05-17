
import { useState, useEffect } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/ModeToggle"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { Home, Users, Coins, Plus, Settings, LogOut, MessageSquare, User, Layout } from "lucide-react"
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

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // If no user is logged in, redirect to login page
    if (isClient && !user) {
      console.log('No user found in dashboard, redirecting to login');
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location, isClient]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  // If not client yet or no user, return empty to prevent flash of content
  if (!isClient || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 border-r border-border w-64 flex-none py-4 px-2 md:px-4 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="px-3 py-2 mb-4">
          <MimoLogo size="small" />
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-accent">
              <Home className="h-4 w-4" />
              <span>Início</span>
            </Link>
            <Separator />
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-accent",
                  location.pathname === item.href && "bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
            <Separator />
            <Link
              to="/dashboard/pacotes/novo"
              className="group px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-accent transition-colors"
            >
              <Plus className="h-4 w-4 text-[#F54040]" />
              <span>Nova recompensa</span>
            </Link>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:block">
              {user?.name || creator?.name || 'Bem-vindo'}
            </span>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full aspect-square">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={creator?.avatar || user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
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
        <main className="flex-1 py-6 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  )
}
