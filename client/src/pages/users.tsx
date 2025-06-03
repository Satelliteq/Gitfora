import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  ExternalLink, 
  MapPin, 
  Building, 
  BookOpen,
  UserPlus,
  Star,
  RefreshCw,
  Calendar,
  Award,
  Crown,
  Code,
  GitFork,
  Trophy
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { GithubUser } from "@shared/schema";

export default function Top() {
  const { t } = useLanguage();

  const { data: topUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 30 }],
  });

  const { data: topRepositories, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }],
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

  const getUserTier = (followers: number) => {
    if (followers >= 100000) return { tier: "Elite", color: "bg-purple-500", icon: "👑" };
    if (followers >= 50000) return { tier: "Expert", color: "bg-blue-500", icon: "⭐" };
    if (followers >= 10000) return { tier: "Advanced", color: "bg-green-500", icon: "🏆" };
    if (followers >= 1000) return { tier: "Rising", color: "bg-yellow-500", icon: "🚀" };
    return { tier: "Newcomer", color: "bg-gray-500", icon: "🌱" };
  };

  const getGrowthPercentage = () => {
    return `+${(Math.random() * 25 + 5).toFixed(1)}%`;
  };

  const handleRefresh = () => {
    // Refresh functionality can be implemented here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Top Content
              </h1>
            </div>
            <p className="text-muted-foreground">Discover the most influential developers and starred repositories</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              className="border-primary/20 hover:bg-primary/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Updated 3 min ago</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Top Developers
            </TabsTrigger>
            <TabsTrigger value="repositories" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Top Repositories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Top GitHub Developers</span>
                  <Badge variant="secondary" className="ml-2">
                    {(topUsers as GithubUser[])?.length || 0} developers
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
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
                    {(topUsers as GithubUser[])?.slice(0, 10).map((user, index) => {
                      const tier = getUserTier(user.followers || 0);
                      return (
                        <Link key={user.id} href={`/user-details/${user.username}`}>
                          <Card className="hover:border-primary/50 transition-colors group cursor-pointer">
                            <CardContent className="p-6">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <div className="text-lg font-bold text-primary w-8">
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
                                    <Badge className={`${tier.color} text-white text-xs`}>
                                      <span className="mr-1">{tier.icon}</span>
                                      {tier.tier}
                                    </Badge>
                                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                                      <TrendingUp className="w-3 h-3" />
                                      <span>{getGrowthPercentage()}</span>
                                    </div>
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
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repositories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Top Repositories</span>
                  <Badge variant="secondary" className="ml-2">
                    {(topRepositories as any[])?.length || 0} repositories
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reposLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="h-5 w-48 bg-muted rounded mb-2" />
                              <div className="h-4 w-32 bg-muted rounded mb-3" />
                              <div className="h-4 w-full bg-muted rounded" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(topRepositories as any[])?.slice(0, 10).map((repo, index) => {
                      const langInfo = getLanguageInfo(repo.language);
                      return (
                        <Card key={repo.id} className="hover:border-primary/50 transition-colors group">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                                    {repo.full_name}
                                  </h3>
                                  <div className="w-4 h-4">
                                    {langInfo.icon}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {repo.description || "No description available"}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    <span>{formatNumber(repo.stars || 0)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <GitFork className="h-4 w-4" />
                                    <span>{formatNumber(repo.forks || 0)}</span>
                                  </div>
                                  <Badge variant="secondary">{repo.language}</Badge>
                                </div>
                              </div>
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
        </Tabs>
      </div>
    </div>
  );
}