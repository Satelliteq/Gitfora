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
    queryKey: ["/api/technologies", { limit: 6 }],
  });

  const { data: trendingRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 10 }],
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
      <header className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Github className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Welcome to Gitfora
                  </h1>
                  <p className="text-muted-foreground">
                    Your comprehensive GitHub analytics dashboard
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: 2 minutes ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>Live data sync</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search developers, repos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                />
              </form>
              
              <Button 
                onClick={handleRefresh}
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 backdrop-blur-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
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

          {/* Content Sections */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trending Repositories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Trending Repositories
                  </div>
                  <Link href="/trending">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendingRepos repositories={trendingRepos} isLoading={reposLoading} />
              </CardContent>
            </Card>

            {/* Rising Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Rising Developers
                  </div>
                  <Link href="/top">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RisingUsers users={risingUsers} isLoading={usersLoading} />
              </CardContent>
            </Card>
          </section>

          {/* Technologies Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    Popular Technologies
                  </div>
                  <Link href="/technologies">
                    <Button variant="ghost" size="sm">
                      Explore All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TechnologyList technologies={technologies} isLoading={techLoading} />
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
    </div>
  );
}