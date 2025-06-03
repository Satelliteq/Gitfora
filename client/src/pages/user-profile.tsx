import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import { 
  Users, 
  GitFork, 
  Star, 
  MapPin, 
  Building, 
  Calendar,
  ExternalLink,
  ArrowLeft,
  TrendingUp,
  Award
} from "lucide-react";
import { format } from "date-fns";

export default function UserProfile() {
  const { username } = useParams();
  const { t } = useLanguage();

  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ["/api/github/user", username],
    enabled: !!username,
    retry: 1
  });

  const { data: repositories, isLoading: isLoadingRepos } = useQuery({
    queryKey: ["/api/github/user/repositories", username],
    enabled: !!username && !!user,
    retry: 1
  });

  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/github/user/analytics", username],
    enabled: !!username && !!user,
    retry: 1
  });

  // Show message if no user data and not loading
  if (!isLoadingUser && !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/search">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("search")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t("userProfile")}</h1>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">{t("userNotFound")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Kullanıcı "{username}" bulunamadı. GitHub API token gerekli olabilir.
              </p>
              <Link href="/search">
                <Button>Başka kullanıcı ara</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">{t("user_not_found")}</h1>
          <p className="text-muted-foreground mb-4">{t("user_not_found_desc")}</p>
          <Link href="/user-search">
            <Button>{t("search_users")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDeveloperTier = (followers: number, repos: number) => {
    if (followers > 1000 && repos > 50) return { tier: "Elite", color: "bg-purple-500" };
    if (followers > 500 && repos > 25) return { tier: "Expert", color: "bg-blue-500" };
    if (followers > 100 && repos > 10) return { tier: "Professional", color: "bg-green-500" };
    return { tier: "Developer", color: "bg-gray-500" };
  };

  const userRepos = (repositories as any[]) || [];
  const userData = (user as any) || {};
  
  const topLanguages = userRepos.reduce((acc: Record<string, number>, repo: any) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedLanguages = Object.entries(topLanguages)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  const totalStars = userRepos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = userRepos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0);
  const developerTier = getDeveloperTier(userData.followers || 0, userData.public_repos || 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/user-search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{t("user_profile")}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
                    <AvatarFallback className="text-2xl">
                      {(user.name || user.login).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">{user.name || user.login}</h2>
                    <p className="text-sm text-muted-foreground">@{user.login}</p>
                    
                    <Badge className={`${developerTier.color} text-white`}>
                      <Award className="h-3 w-3 mr-1" />
                      {developerTier.tier}
                    </Badge>
                  </div>

                  {user.bio && (
                    <p className="text-sm text-center text-muted-foreground">{user.bio}</p>
                  )}

                  <div className="w-full space-y-2 text-sm">
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    {user.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{user.company}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{t("joined")} {format(new Date(user.created_at), "MMM yyyy")}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{user.followers || 0}</div>
                      <div className="text-muted-foreground">{t("followers")}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{user.following || 0}</div>
                      <div className="text-muted-foreground">{t("following")}</div>
                    </div>
                  </div>

                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t("view_on_github")}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">{t("statistics")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("public_repos")}</span>
                  <span className="font-semibold">{user.public_repos || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("total_stars")}</span>
                  <span className="font-semibold">{totalStars}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("total_forks")}</span>
                  <span className="font-semibold">{totalForks}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("top_languages")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedLanguages.map(([language, count]) => {
                    const langInfo = getLanguageInfo(language);
                    return (
                      <div key={language} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="flex-shrink-0">
                          {langInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{langInfo.name}</p>
                          <p className="text-xs text-muted-foreground">{count} {t("repositories")}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Repositories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("popular_repositories")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRepos ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repositories?.slice(0, 6).map((repo: any) => {
                      const langInfo = getLanguageInfo(repo.language);
                      return (
                        <div key={repo.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <a 
                                href={repo.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline"
                              >
                                {repo.name}
                              </a>
                              {repo.description && (
                                <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                {langInfo.icon}
                                <span>{langInfo.name}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{repo.stargazers_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              <span>{repo.forks_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}