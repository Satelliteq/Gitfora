import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Code, 
  Users, 
  BarChart3,
  Github,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "User Search", href: "/search", icon: Search },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Technologies", href: "/technologies", icon: Code },
  { name: "Top Users", href: "/users", icon: Users },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Github className="text-sidebar-primary-foreground w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Gitfora</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">U</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-sidebar-foreground">Demo User</div>
            <div className="text-xs text-sidebar-foreground/60">@demouser</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
