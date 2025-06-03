import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Award
} from "lucide-react";
import type { GithubUser } from "@shared/schema";

export default function Top() {
  const { data: risingUsers, isLoading, refetch } = useQuery({
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
    refetch();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Top GitHub Users</h1>
            <p className="text-muted-foreground mt-1">Discover influential developers and rising stars</p>
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
              <span>Last updated: 3 min ago</span>
            </div>
          </div>
        </div>
      </header>

      {/* Users Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* User Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Rising GitHub Stars</span>
              <Badge variant="secondary" className="ml-2">
                {(risingUsers as GithubUser[])?.length || 0} users
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-20 h-6" />
                          </div>
                          <Skeleton className="w-24 h-4 mb-2" />
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-16 h-4" />
                            <Skeleton className="w-16 h-4" />
                            <Skeleton className="w-20 h-4" />
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton className="w-16 h-6 mb-1" />
                          <Skeleton className="w-20 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {(risingUsers as GithubUser[])?.map((user, index) => {
                  const tier = getUserTier(user.followers || 0);
                  return (
                    <Card key={user.id} className="hover:border-primary/50 transition-colors group">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div className="text-lg font-bold text-primary w-8">
                              #{index + 1}
                            </div>
                            <div className="relative">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                  {user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-card flex items-center justify-center">
                                <span className="text-xs">🔥</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {user.name || user.username}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className={`${tier.color} text-white text-xs px-2 py-1`}
                              >
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
                                <UserPlus className="w-4 h-4" />
                                <span className="font-medium">{formatNumber(user.following || 0)}</span>
                                <span>following</span>
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
                              {user.company && (
                                <div className="flex items-center space-x-1">
                                  <Building className="w-4 h-4" />
                                  <span>{user.company}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(`https://github.com/${user.username}`, '_blank')}
                            >
                              View Profile
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(`https://github.com/${user.username}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {(!risingUsers || (risingUsers as GithubUser[])?.length === 0) && !isLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                      <p className="text-muted-foreground">
                        Check back later for trending GitHub users and rising stars.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">
                    {(risingUsers as GithubUser[])?.length || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                  <p className="text-2xl font-bold">
                    {formatNumber((risingUsers as GithubUser[])?.reduce((acc, user) => acc + (user.followers || 0), 0) || 0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Repositories</p>
                  <p className="text-2xl font-bold">
                    {formatNumber((risingUsers as GithubUser[])?.reduce((acc, user) => acc + (user.public_repos || 0), 0) || 0)}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Elite Users</p>
                  <p className="text-2xl font-bold">
                    {(risingUsers as GithubUser[])?.filter(user => (user.followers || 0) >= 100000).length || 0}
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}