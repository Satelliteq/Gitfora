import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, GitFork, TrendingUp, ExternalLink } from "lucide-react";
import type { Repository } from "@shared/schema";

interface TrendingReposProps {
  repositories: Repository[];
  isLoading?: boolean;
}

export default function TrendingRepos({ repositories, isLoading = false }: TrendingReposProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trending Repositories</CardTitle>
            <Skeleton className="w-16 h-6" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-16 h-5" />
                </div>
                <Skeleton className="w-full h-4 mb-2" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-3" />
                  <Skeleton className="w-12 h-3" />
                  <Skeleton className="w-12 h-3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
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
    };
    return colors[language || ""] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Trending Repositories</CardTitle>
          <Button variant="link" className="text-primary hover:text-primary/80 p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {repo.full_name}
                    </h4>
                    {repo.language && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 ${getLanguageColor(repo.language)} text-white`}
                      >
                        {repo.language}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
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
          ))}
          {repositories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No trending repositories available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
