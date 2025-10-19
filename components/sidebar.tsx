"use client"

import { Home, FolderOpen, Sparkles, Users, ImageIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Home", icon: Home, id: "home" },
  { name: "Albums", icon: FolderOpen, id: "albums" },
  { name: "Shared", icon: Users, id: "shared" },
  { name: "Library", icon: ImageIcon, id: "library" },
]

interface SidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border/50 glass-effect z-50">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg animated-gradient flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Echo
            </span>
          </div>
        </div>

        <TooltipProvider>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <Tooltip key={item.name} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-accent/10 text-sidebar-accent-foreground shadow-md border border-primary/20"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:shadow-sm",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Go to {item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </TooltipProvider>

        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">You</p>
              <p className="text-xs text-muted-foreground truncate">user@echo.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
