import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, GitFork, TrendingUp, ExternalLink, Eye, Calendar, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";

export default function Trending() {
  const [language, setLanguage] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const { t } = useLanguage();

  const { data: trendingRepos, isLoading: reposLoading, refetch } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }],
  });

  // Filter repositories based on selected language
  const filteredRepos = useMemo(() => {
    const repos = (trendingRepos as any[]) || [];
    if (language === "all") return repos;
    
    return repos.filter((repo: any) => 
      repo.language && repo.language.toLowerCase() === language.toLowerCase()
    );
  }, [trendingRepos, language]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      Ruby: "bg-red-600",
      PHP: "bg-indigo-500",
      Swift: "bg-orange-600",
      Kotlin: "bg-purple-600",
      Dart: "bg-blue-600",
      Vue: "bg-green-600",
      React: "bg-cyan-600",
    };
    return colors[language || ""] || "bg-gray-500";
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trending Repositories</h1>
            <p className="text-muted-foreground mt-1">Discover the most popular repositories on GitHub</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleRefresh}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last updated: 10 min ago</span>
            </div>
          </div>
        </div>
      </header>

      {/* Trending Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {reposLoading ? (
            <div className="space-y-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div>
                            <Skeleton className="w-48 h-5 mb-1" />
                            <Skeleton className="w-32 h-4" />
                          </div>
                          <Skeleton className="w-20 h-6" />
                        </div>
                        <Skeleton className="w-full h-4 mb-4" />
                        <div className="flex items-center space-x-6">
                          <Skeleton className="w-16 h-4" />
                          <Skeleton className="w-16 h-4" />
                          <Skeleton className="w-20 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRepos.length} of {(trendingRepos as any[])?.length || 0} repositories
                  {language !== "all" && ` for ${language}`}
                </p>
              </div>
              {filteredRepos?.map((repo: any, index: number) => (
                <Card key={repo.id} className="hover:border-primary/50 transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center text-muted-foreground text-sm">
                            <span className="text-lg font-bold text-primary mr-2">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {repo.full_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">by {repo.owner}</p>
                          </div>
                          {repo.language && (
                            <Badge 
                              variant="secondary" 
                              className={`${getLanguageColor(repo.language)} text-white`}
                            >
                              {repo.language}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {repo.description || "No description available"}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{formatNumber(repo.stars || 0)}</span>
                            <span>stars</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <GitFork className="w-4 h-4" />
                            <span className="font-medium">{formatNumber(repo.forks || 0)}</span>
                            <span>forks</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">+{repo.today_stars || 0}</span>
                            <span>stars today</span>
                          </div>
                          {repo.growth_percentage && (
                            <div className="flex items-center space-x-1 text-green-400">
                              <span className="font-medium">{repo.growth_percentage}</span>
                              <span>growth</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(repo.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(repo.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!trendingRepos || (trendingRepos as any)?.length === 0) && !reposLoading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No trending repositories found</h3>
                    <p className="text-muted-foreground">
                      Try refreshing or check back later for trending repositories.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}