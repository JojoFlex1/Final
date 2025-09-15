"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Home, QrCode, MapPin, Upload, Award, User, Wallet, Menu, Leaf, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Scan Bin", href: "/scan", icon: QrCode },
  { name: "Find Bins", href: "/bins", icon: MapPin },
  { name: "Submit Waste", href: "/submit", icon: Upload },
  { name: "Leaderboard", href: "/leaderboard", icon: Award },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Wallet", href: "/wallet", icon: Wallet },
]

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">RELOOP</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn("gap-2", isActive && "bg-primary text-primary-foreground")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Points (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-semibold">1,250</span>
              <span className="text-sm text-muted-foreground">pts</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Eco Champion
            </Badge>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
  <SheetHeader>
    <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
    <SheetDescription className="sr-only">
      Side sheet with navigation links and user points
    </SheetDescription>
  </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {/* User Points (Mobile) */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-semibold">1,250 pts</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Eco Champion
                  </Badge>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-12",
                            isActive && "bg-primary text-primary-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
