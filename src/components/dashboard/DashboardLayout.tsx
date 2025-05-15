import { useState } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/ModeToggle"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Home, Users, Coins, Plus, Settings, Power, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarNavItems = [
  {
    title: "Visão geral",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Mimos",
    href: "/dashboard/mimos",
    icon: Coins,
  },
  {
    title: "Fãs",
    href: "/dashboard/fans",
    icon: Users,
  },
  {
    title: "Conteúdo",
    href: "/dashboard/conteudo",
    icon: MessageSquare,
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { creator } = useDashboard()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`bg-card border-r border-border w-64 flex-none py-4 px-2 md:px-4 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-secondary">
              <Home className="h-4 w-4" />
              <span>Início</span>
            </Link>
            <Separator />
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-secondary"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
            <Separator />
            <Link
              to="/dashboard/mimos/novo"
              className="group px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-secondary transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Novo pacote</span>
            </Link>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
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
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex items-center space-x-4">
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
                <DropdownMenuItem onClick={logout}>
                  <Power className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 py-6 px-4 sm:px-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
