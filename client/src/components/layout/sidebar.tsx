import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Code, 
  Users, 
  BarChart3,
  Github,
  Compass,
  Languages,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { 
      key: "dashboard", 
      name: "Dashboard", 
      href: "/", 
      icon: LayoutDashboard,
      description: "Overview & metrics",
      color: "text-blue-500"
    },
    { 
      key: "discover", 
      name: "Discover", 
      href: "/discover", 
      icon: Compass,
      description: "Explore new content",
      color: "text-purple-500"
    },
    { 
      key: "userSearch", 
      name: "Search", 
      href: "/search", 
      icon: Search,
      description: "Find developers",
      color: "text-green-500"
    },
    { 
      key: "analytics", 
      name: "Analytics", 
      href: "/analytics", 
      icon: BarChart3,
      description: "Deep insights",
      color: "text-orange-500"
    },
    { 
      key: "trending", 
      name: "Trending", 
      href: "/trending", 
      icon: TrendingUp,
      description: "What's hot now",
      color: "text-red-500"
    },
    { 
      key: "technologies", 
      name: "Technologies", 
      href: "/technologies", 
      icon: Code,
      description: "Languages & tools",
      color: "text-indigo-500"
    },
    { 
      key: "top", 
      name: "Top", 
      href: "/top", 
      icon: Users,
      description: "Best developers & repos",
      color: "text-pink-500"
    },
  ];

  return (
    <aside className="w-80 bg-gradient-to-b from-background to-muted/30 border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
              <Github className="text-primary-foreground w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gitfora
            </span>
            <p className="text-xs text-muted-foreground">GitHub Analytics</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Navigation
          </p>
          
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.key} href={item.href}>
                <div
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-primary/10",
                    isActive 
                      ? "bg-primary/15 text-primary shadow-sm border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted/50 group-hover:bg-primary/10"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium",
                        isActive ? "text-primary" : "group-hover:text-foreground"
                      )}>
                        {item.name}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-primary/60" />
                      )}
                    </div>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-primary/70" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Language Selector */}
      <div className="p-4 border-t border-border/50">
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Preferences
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="tr">TR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Live
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Version Info */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono font-medium">v2.1.0</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-muted-foreground">Data</span>
            <span className="font-medium text-green-600">Real-time</span>
          </div>
        </div>
      </div>
    </aside>
  );
}