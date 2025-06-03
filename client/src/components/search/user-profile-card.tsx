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
  Calendar
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
                <h2 className="text-2xl font-bold text-foreground">{user.name || user.username}</h2>
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
                            className={`text-xs px-2 py-1 ${getLanguageColor(repo.language)} text-white`}
                          >
                            {repo.language}
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
