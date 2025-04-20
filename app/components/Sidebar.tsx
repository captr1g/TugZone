"use client"

import { Home, Swords, List, User, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Arena", href: "/" },
  { icon: Swords, label: "Battles", href: "/wars" },
  { icon: List, label: "Arsenal", href: "/listings" },
  { icon: User, label: "Warrior", href: "/profile" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r border-border/50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:block lg:w-72 shadow-lg z-20">
      <div className="flex h-full flex-col cyber-gradient">
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <Zap className="h-6 w-6 text-primary glow-text" />
            <span className="text-xl font-[var(--font-press-start-2p)] text-primary glow-text">TUG</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4 cyber-grid">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-primary/20 text-primary glow-text border border-primary/30"
                  : "hover:bg-primary/10 hover:text-primary",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-x-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/30" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-primary glow-text">Anonymous</span>
              <span className="text-xs text-muted-foreground">Level 1 Warrior</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
