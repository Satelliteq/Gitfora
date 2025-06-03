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
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Sidebar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { key: "dashboard", name: t("dashboard"), href: "/", icon: LayoutDashboard },
    { key: "discover", name: t("discover"), href: "/discover", icon: Compass },
    { key: "userSearch", name: t("userSearch"), href: "/search", icon: Search },
    { key: "analytics", name: t("analytics"), href: "/analytics", icon: BarChart3 },
    { key: "trending", name: t("trending"), href: "/trending", icon: TrendingUp },
    { key: "technologies", name: t("technologies"), href: "/technologies", icon: Code },
    { key: "top", name: t("top"), href: "/top", icon: Users },
  ];

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
      
      {/* Language Switcher */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-2 mb-3">
          <Languages className="w-4 h-4 text-sidebar-foreground" />
          <span className="text-sm font-medium text-sidebar-foreground">{t("language")}</span>
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full bg-sidebar border-sidebar-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">🇺🇸 English</SelectItem>
            <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
