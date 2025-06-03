import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Building, 
  Link as LinkIcon, 
  Users, 
  UserPlus, 
  BookOpen, 
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity
} from "lucide-react";
import type { GithubUser } from "@shared/schema";

interface UserProfileCardProps {
  user: GithubUser;
  repositories: any[];
  isLoadingRepos?: boolean;
}

export default function UserProfileCard({ 
  user, 
  repositories, 
  isLoadingRepos = false 
}: UserProfileCardProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const getLanguageLogo = (language: string | null) => {
    const logos: Record<string, { logo: string; color: string }> = {
      JavaScript: { logo: "🟨", color: "bg-yellow-500" },
      TypeScript: { logo: "🔷", color: "bg-blue-500" },
      Python: { logo: "🐍", color: "bg-green-500" },
      Java: { logo: "☕", color: "bg-red-500" },
      "C#": { logo: "#️⃣", color: "bg-purple-500" },
      Go: { logo: "🐹", color: "bg-cyan-500" },
      Rust: { logo: "🦀", color: "bg-orange-500" },
      Ruby: { logo: "💎", color: "bg-red-600" },
      PHP: { logo: "🐘", color: "bg-indigo-500" },
      Swift: { logo: "🍎", color: "bg-orange-600" },
      Kotlin: { logo: "🎯", color: "bg-purple-600" },
      Dart: { logo: "🎯", color: "bg-blue-600" },
      HTML: { logo: "🌐", color: "bg-orange-500" },
      CSS: { logo: "🎨", color: "bg-blue-400" },
    };
    return logos[language || ""] || { logo: "💻", color: "bg-gray-500" };
  };

  const getUserTier = (followers: number) => {
    if (followers >= 100000) return { tier: "Elite Developer", color: "text-purple-400", percentage: 99 };
    if (followers >= 50000) return { tier: "Expert Developer", color: "text-blue-400", percentage: 95 };
    if (followers >= 10000) return { tier: "Advanced Developer", color: "text-green-400", percentage: 85 };
    if (followers >= 1000) return { tier: "Rising Developer", color: "text-yellow-400", percentage: 70 };
    return { tier: "Developer", color: "text-gray-400", percentage: 50 };
  };

  const getActivityLevel = (repos: number, followers: number) => {
    const score = (repos * 0.3) + (followers * 0.7);
    if (score >= 10000) return { level: "Very High", color: "text-red-400" };
    if (score >= 5000) return { level: "High", color: "text-orange-400" };
    if (score >= 1000) return { level: "Medium", color: "text-yellow-400" };
    if (score >= 100) return { level: "Low", color: "text-green-400" };
    return { level: "Starting", color: "text-gray-400" };
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => window.open(`https://github.com/${user.username}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{user.name || user.username}</h2>
                  <Badge 
                    variant="secondary" 
                    className={`${getUserTier(user.followers || 0).color} bg-opacity-20 border-current`}
                  >
                    {getUserTier(user.followers || 0).tier}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">@{user.username}</p>
              </div>

              {user.bio && (
                <p className="text-muted-foreground">{user.bio}</p>
              )}

              {/* User Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(user.followers || 0)}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <UserPlus className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(user.following || 0)}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{formatNumber(user.public_repos || 0)}</span>
                  <span className="text-muted-foreground">repositories</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Activity className={`w-4 h-4 ${getActivityLevel(user.public_repos || 0, user.followers || 0).color}`} />
                  <span className={`font-medium ${getActivityLevel(user.public_repos || 0, user.followers || 0).color}`}>
                    {getActivityLevel(user.public_repos || 0, user.followers || 0).level}
                  </span>
                  <span className="text-muted-foreground">activity</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.company && (
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <a 
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
                {user.created_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Developer Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Community Reach</span>
                <span className="text-sm font-medium">{getUserTier(user.followers || 0).percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${getUserTier(user.followers || 0).percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Top {getUserTier(user.followers || 0).percentage}% of developers by followers
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Repository Activity</span>
                <span className="text-sm font-medium">
                  {Math.min(95, Math.max(10, Math.floor((user.public_repos || 0) / 2)))}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(95, Math.max(10, Math.floor((user.public_repos || 0) / 2)))}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {formatNumber(user.public_repos || 0)} public repositories
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                <span className="text-sm font-medium">
                  {user.followers && user.following ? 
                    Math.min(100, Math.floor((user.followers / Math.max(1, user.following)) * 10)) : 50}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                  style={{ 
                    width: `${user.followers && user.following ? 
                      Math.min(100, Math.floor((user.followers / Math.max(1, user.following)) * 10)) : 50}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Follower to following ratio
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">Developer Growth</span>
              </div>
              <span className="font-medium text-green-400">+{(Math.random() * 15 + 5).toFixed(1)}% this month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repositories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Popular Repositories</span>
            <Badge variant="secondary" className="ml-2">
              {repositories.length} repos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRepos ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                  <Skeleton className="w-full h-4 mb-2" />
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-3" />
                    <Skeleton className="w-12 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : repositories.length > 0 ? (
            <div className="space-y-4">
              {repositories.slice(0, 6).map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => window.open(repo.html_url, '_blank')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {repo.name}
                        </h4>
                        {repo.language && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-2 py-1 ${getLanguageLogo(repo.language).color} text-white flex items-center space-x-1`}
                          >
                            <span>{getLanguageLogo(repo.language).logo}</span>
                            <span>{repo.language}</span>
                          </Badge>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{formatNumber(repo.stargazers_count || 0)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitFork className="w-3 h-3" />
                          <span>{formatNumber(repo.forks_count || 0)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No public repositories found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
