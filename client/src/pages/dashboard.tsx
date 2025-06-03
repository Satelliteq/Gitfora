import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/dashboard/metric-card";
import ActivityChart from "@/components/dashboard/activity-chart";
import TechnologyList from "@/components/dashboard/technology-list";
import TrendingRepos from "@/components/dashboard/trending-repos";
import RisingUsers from "@/components/dashboard/rising-users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  Search, 
  Clock, 
  TrendingUp, 
  Users, 
  Code, 
  Star,
  BarChart3,
  Zap,
  Target,
  ArrowRight,
  Github,
  Calendar,
  Activity,
  Globe,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ["/api/technologies", { limit: 5 }],
  });

  const { data: trendingRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 5 }],
  });

  const { data: risingUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 5 }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRefresh = () => {
    refetchMetrics();
  };

  const metricCards = [
    {
      icon: "👥",
      title: "Active GitHub Users",
      type: "users",
      color: "text-primary"
    },
    {
      icon: "📦",
      title: "Total Repositories",
      type: "repositories",
      color: "text-green-500"
    },
    {
      icon: "💻",
      title: "Technologies Tracked",
      type: "technologies",
      color: "text-blue-500"
    },
    {
      icon: "⭐",
      title: "Stars Collected",
      type: "stars",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Modern Header */}
      <header className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">GitHub Analytics</h1>
                  <p className="text-sm text-muted-foreground">Real-time developer insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {new Date().toLocaleTimeString()}</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                  Live
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 h-9 text-sm"
                />
                <Button type="submit" size="sm" className="h-9">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricCards.map((card, index) => {
              const metricData = (metrics as any)?.find((m: any) => m.metric_type === card.type);
              return (
                <MetricCard
                  key={card.type}
                  icon={card.icon}
                  title={card.title}
                  value={metricData?.total || 0}
                  growth={metricData?.growth_percentage || "+0%"}
                  color={card.color}
                  isLoading={metricsLoading}
                />
              );
            })}
          </div>

          {/* Activity Chart */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Activity Trends</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Last 7 Days
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ActivityChart />
            </CardContent>
          </Card>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Hot Repositories */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-base">Hot Repositories</CardTitle>
                  </div>
                  <Link href="/trending">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View All <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <TrendingRepos 
                  repositories={trendingRepos as any || []} 
                  isLoading={reposLoading} 
                />
              </CardContent>
            </Card>

            {/* Top Developers */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base">Top Developers</CardTitle>
                  </div>
                  <Link href="/top">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View All <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <RisingUsers 
                  users={risingUsers as any || []} 
                  isLoading={usersLoading} 
                />
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-purple-500" />
                    <CardTitle className="text-base">Tech Stack</CardTitle>
                  </div>
                  <Link href="/technologies">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View All <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <TechnologyList 
                  technologies={technologies as any || []} 
                  isLoading={techLoading} 
                />
              </CardContent>
            </Card>
            
          </div>

          {/* Quick Actions */}
          <Card className="shadow-sm border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Discover More</h3>
                    <p className="text-xs text-muted-foreground">Explore trending projects and connect with developers</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/discover">
                    <Button variant="default" size="sm" className="h-8 text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Explore
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Search className="w-3 h-3 mr-1" />
                      Search
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </main>
    </div>
  );
}