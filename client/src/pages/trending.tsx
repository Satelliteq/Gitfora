import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp,
  Star,
  GitFork,
  Calendar,
  Users,
  BookOpen,
  MapPin,
  RefreshCw,
  Filter,
  ArrowUpRight,
  Flame,
  Clock,
  Trophy,
  Zap,
  Target,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { GithubUser, Repository } from "@shared/schema";

export default function Trending() {
  const { t } = useLanguage();

  const { data: trendingRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }],
  });

  const { data: risingUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 30 }],
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const getGrowthIndicator = () => {
    const growth = Math.random() * 30 + 5;
    return `+${growth.toFixed(1)}%`;
  };

  const getHotness = (stars: number, forks: number) => {
    const score = (stars || 0) + (forks || 0) * 2;
    if (score > 10000) return { level: "🔥 Hot", color: "text-red-500" };
    if (score > 5000) return { level: "⚡ Rising", color: "text-orange-500" };
    if (score > 1000) return { level: "📈 Growing", color: "text-yellow-500" };
    return { level: "🌱 New", color: "text-green-500" };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-background border-b border-border px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Trending Now
              </h1>
            </div>
            <p className="text-muted-foreground">Discover what's hot in the developer community right now</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline" className="border-orange-500/20 hover:bg-orange-500/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" variant="outline" className="border-orange-500/20 hover:bg-orange-500/10">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Updated 5 min ago</span>
            </div>
          </div>
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-4xl">
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hot Repos</p>
                  <p className="text-2xl font-bold text-red-500">
                    {(trendingRepos as Repository[])?.filter(repo => (repo.stars || 0) > 5000).length || 0}
                  </p>
                </div>
                <Flame className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rising Stars</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {(risingUsers as GithubUser[])?.filter(user => (user.followers || 0) > 1000).length || 0}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stars</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {formatNumber((trendingRepos as Repository[])?.reduce((acc, repo) => acc + (repo.stars || 0), 0) || 0)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Devs</p>
                  <p className="text-2xl font-bold text-green-500">
                    {formatNumber((risingUsers as GithubUser[])?.reduce((acc, user) => acc + (user.public_repos || 0), 0) || 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="repositories" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="repositories" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Trending Repos
            </TabsTrigger>
            <TabsTrigger value="developers" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Rising Developers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>Trending Repositories</span>
                  <Badge variant="secondary" className="ml-2">
                    {(trendingRepos as Repository[])?.length || 0} repositories
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reposLoading ? (
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Skeleton className="w-48 h-5 mb-2" />
                              <Skeleton className="w-32 h-4 mb-3" />
                              <Skeleton className="w-full h-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(trendingRepos as Repository[])?.slice(0, 20).map((repo, index) => {
                      const langInfo = getLanguageInfo(repo.language);
                      const hotness = getHotness(repo.stars || 0, repo.forks || 0);
                      return (
                        <Card key={repo.id} className="hover:border-primary/50 transition-colors group">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-bold text-orange-500">#{index + 1}</span>
                                  <div className="w-5 h-5">
                                    {langInfo.icon}
                                  </div>
                                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {repo.full_name}
                                  </h3>
                                  <span className={`text-xs ${hotness.color}`}>
                                    {hotness.level}
                                  </span>
                                  <div className="flex items-center text-green-500 text-sm">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    <span>{getGrowthIndicator()}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {repo.description || "No description available"}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="font-medium">{formatNumber(repo.stars || 0)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <GitFork className="h-4 w-4" />
                                    <span>{formatNumber(repo.forks || 0)}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {repo.language}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs">
                                    <Calendar className="w-3 h-3" />
                                    <span>Updated recently</span>
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span>Rising Developers</span>
                  <Badge variant="secondary" className="ml-2">
                    {(risingUsers as GithubUser[])?.length || 0} developers
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-6">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="w-32 h-5 mb-2" />
                              <Skeleton className="w-24 h-4 mb-2" />
                              <Skeleton className="w-16 h-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(risingUsers as GithubUser[])?.slice(0, 15).map((user, index) => (
                      <Link key={user.id} href={`/user-details/${user.username}`}>
                        <Card className="hover:border-primary/50 transition-colors group cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <div className="text-lg font-bold text-orange-500 w-8">
                                  #{index + 1}
                                </div>
                                <div className="relative">
                                  <Avatar className="w-16 h-16">
                                    <AvatarImage src={user.avatar_url || ''} alt={user.name || user.username} />
                                    <AvatarFallback className="text-lg">
                                      {(user.name || user.username)?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    {user.name || user.username}
                                  </h3>
                                  <div className="flex items-center space-x-1 text-green-500 text-sm">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{getGrowthIndicator()}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    Rising Star
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                                
                                {user.bio && (
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>
                                )}
                                
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">{formatNumber(user.followers || 0)}</span>
                                    <span>followers</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-medium">{formatNumber(user.public_repos || 0)}</span>
                                    <span>repos</span>
                                  </div>
                                  {user.location && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{user.location}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-1 text-xs">
                                    <Eye className="w-3 h-3" />
                                    <span>Active now</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}