import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Code, TrendingUp, Star, GitFork, RefreshCw, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { Technology } from "@shared/schema";

export default function Technologies() {
  const { t } = useLanguage();
  
  const { data: technologies, isLoading, refetch } = useQuery({
    queryKey: ["/api/technologies", { limit: 50 }],
  });

  const { data: trendingRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending"],
  });



  const getLanguageRepos = (language: string) => {
    return (trendingRepos as any)?.filter((repo: any) => 
      repo.language?.toLowerCase() === language.toLowerCase()
    ) || [];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
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
            <h1 className="text-2xl font-bold text-foreground">Technologies</h1>
            <p className="text-muted-foreground mt-1">Popular programming languages and frameworks on GitHub</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleRefresh}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last updated: 5 min ago</span>
            </div>
          </div>
        </div>
      </header>

      {/* Technologies Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Technology Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Language Popularity Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="w-10 h-8 rounded-full" />
                      <div>
                        <Skeleton className="w-24 h-5 mb-1" />
                        <Skeleton className="w-32 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-12 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {(technologies as Technology[])?.map((tech, index) => {
                  const languageRepos = getLanguageRepos(tech.name);
                  return (
                    <div key={tech.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-primary w-8">
                          #{index + 1}
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center">
                          {getLanguageInfo(tech.name).icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{tech.name}</h3>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span>{formatNumber(tech.repos_count || 0)} repositories</span>
                            <Badge variant="secondary" className="text-xs">
                              {languageRepos.length} trending
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <Progress 
                            value={tech.percentage || 0} 
                            className="w-32 h-3"
                          />
                          <span className="text-sm font-medium text-foreground w-12 text-right">
                            {tech.percentage || 0}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-400 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{(Math.random() * 5 + 1).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trending Repositories by Technology */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(technologies as Technology[])?.slice(0, 4).map((tech) => {
            const languageRepos = getLanguageRepos(tech.name);
            return (
              <Card key={tech.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getLanguageInfo(tech.name).icon}
                    </div>
                    <span>Trending {tech.name} Repos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reposLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-3 border border-border rounded">
                          <Skeleton className="w-32 h-4 mb-2" />
                          <Skeleton className="w-full h-3 mb-2" />
                          <div className="flex space-x-4">
                            <Skeleton className="w-12 h-3" />
                            <Skeleton className="w-12 h-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : languageRepos.length > 0 ? (
                    <div className="space-y-4">
                      {languageRepos.slice(0, 3).map((repo: any) => (
                        <div
                          key={repo.id}
                          className="p-3 border border-border rounded hover:border-primary/50 transition-colors cursor-pointer group"
                          onClick={() => window.open(repo.url, '_blank')}
                        >
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                            {repo.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {repo.description || "No description available"}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{formatNumber(repo.stars || 0)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GitFork className="w-3 h-3" />
                              <span>{formatNumber(repo.forks || 0)}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-green-400">
                              <TrendingUp className="w-3 h-3" />
                              <span>+{repo.today_stars || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No trending repositories found for {tech.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technology Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {(technologies as Technology[])?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Tracked Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {(technologies as Technology[])?.reduce((acc, tech) => acc + (tech.repos_count || 0), 0).toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {(trendingRepos as any)?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Trending Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {Math.round(((technologies as Technology[])?.reduce((acc, tech) => acc + (tech.percentage || 0), 0) || 0) / ((technologies as Technology[])?.length || 1))}%
                </div>
                <div className="text-sm text-muted-foreground">Average Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}