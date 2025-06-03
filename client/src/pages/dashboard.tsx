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
          
          {/* Quick Stats */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Platform Overview
                </h2>
                <p className="text-muted-foreground">Real-time insights into GitHub ecosystem</p>
              </div>
              <Link href="/analytics">
                <Button variant="outline" size="sm" className="hover:bg-primary/10">
                  View Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricCards.map((card, index) => (
                <MetricCard
                  key={card.type}
                  icon={card.icon}
                  title={card.title}
                  value={metrics?.find(m => m.metric_type === card.type)?.total || 0}
                  growth={`+${(Math.random() * 15 + 5).toFixed(1)}%`}
                  color={card.color}
                  isLoading={metricsLoading}
                />
              ))}
            </div>
          </section>

          {/* Activity Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Weekly Activity Trends
                    <Badge variant="secondary" className="ml-2">Live</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityChart />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/discover">
                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                      <Globe className="w-4 h-4 mr-2" />
                      Discover New Content
                    </Button>
                  </Link>
                  <Link href="/trending">
                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Trending
                    </Button>
                  </Link>
                  <Link href="/top">
                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                      <Users className="w-4 h-4 mr-2" />
                      Top Developers
                    </Button>
                  </Link>
                  <Link href="/technologies">
                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                      <Code className="w-4 h-4 mr-2" />
                      Explore Technologies
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Data Sources</span>
                    <Badge variant="outline">GitHub API</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Update Frequency</span>
                    <Badge variant="outline">Real-time</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <Badge variant="outline" className="text-green-600">99.9%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

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

        </div>
      </main>
    </div>
  );
}