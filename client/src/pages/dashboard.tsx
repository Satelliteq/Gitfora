import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/dashboard/metric-card";
import ActivityChart from "@/components/dashboard/activity-chart";
import TechnologyList from "@/components/dashboard/technology-list";
import TrendingRepos from "@/components/dashboard/trending-repos";
import RisingUsers from "@/components/dashboard/rising-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Clock } from "lucide-react";
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
      icon: "🔀",
      title: "Total Repositories",
      type: "repositories", 
      color: "text-blue-400"
    },
    {
      icon: "⭐",
      title: "Daily Stars Given",
      type: "stars",
      color: "text-yellow-400"
    },
    {
      icon: "📈",
      title: "Activity Score",
      type: "activity",
      color: "text-green-400"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">GitHub analytics and trending insights</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search GitHub users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 bg-muted border-border"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </form>
            
            <Button 
              onClick={handleRefresh}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: 5 min ago</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card) => {
            const metric = (metrics as any[])?.find((m: any) => m.metric_type === card.type);
            return (
              <MetricCard
                key={card.type}
                icon={card.icon}
                title={card.title}
                value={metric?.total || 0}
                growth={metric?.growth_percentage || "+0%"}
                color={card.color}
                isLoading={metricsLoading}
              />
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart />
          <TechnologyList technologies={(technologies as any[]) || []} isLoading={techLoading} />
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendingRepos repositories={(trendingRepos as any[]) || []} isLoading={reposLoading} />
          <RisingUsers users={(risingUsers as any[]) || []} isLoading={usersLoading} />
        </div>
      </div>
    </div>
  );
}
