"use client"

import { Home, Swords, List, User, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Swords, label: "wars", href: "/wars" },
  { icon: List, label: "tokens", href: "/listings" },
  { icon: User, label: "profile", href: "/profile" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-r border-border/50 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 lg:block lg:w-24">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-border/50">
          <Link href="/" className="flex flex-col items-center gap-1">
            <Zap className="h-6 w-6 text-primary glow-text" />
            <span className="text-xs font-[var(--font-press-start-2p)] text-primary glow-text">TUG</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-2 cyber-grid">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center gap-y-1 rounded-lg p-2 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-primary/20 text-primary glow-text border border-primary/30"
                  : "hover:bg-primary/20 hover:text-primary hover:scale-105 hover:border hover:border-primary/30",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-border/50 p-2">
          <div className="flex flex-col items-center gap-y-1">
            <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/30" />
            <div className="flex flex-col items-center">
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
