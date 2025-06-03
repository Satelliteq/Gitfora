import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  Star, 
  GitFork, 
  Eye, 
  TrendingUp, 
  ExternalLink,
  Calendar,
  RefreshCw,
  Compass,
  Users,
  Code,
  BookOpen
} from "lucide-react";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("repositories");
  const [timeRange, setTimeRange] = useState("this-week");

  const { data: trendingRepos, isLoading: reposLoading, refetch: refetchRepos } = useQuery({
    queryKey: ["/api/repositories/trending"],
  });

  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ["/api/technologies"],
  });

  const { data: risingUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising"],
  });

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
    };
    return logos[language || ""] || { logo: "💻", color: "bg-gray-500" };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const filteredRepos = (trendingRepos as any)?.filter((repo: any) => {
    if (selectedLanguage !== "all" && repo.language?.toLowerCase() !== selectedLanguage.toLowerCase()) {
      return false;
    }
    if (searchQuery && !repo.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !repo.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }) || [];

  const categories = [
    { value: "repositories", label: "Repositories", icon: BookOpen },
    { value: "users", label: "Developers", icon: Users },
    { value: "topics", label: "Topics", icon: Code },
  ];

  const languages = [
    "all", "JavaScript", "TypeScript", "Python", "Java", "Go", 
    "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart"
  ];

  const handleRefresh = () => {
    refetchRepos();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Compass className="w-6 h-6" />
              <span>Discover</span>
            </h1>
            <p className="text-muted-foreground mt-1">Explore trending projects, developers, and technologies</p>
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
              <span>Updated now</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search repositories, users, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Language Filter */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  <div className="flex items-center space-x-2">
                    {lang !== "all" && <span>{getLanguageLogo(lang).logo}</span>}
                    <span>{lang === "all" ? "All Languages" : lang}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {selectedCategory === "repositories" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Trending Repositories</h2>
                <Badge variant="secondary">
                  {filteredRepos.length} results
                </Badge>
              </div>

              {reposLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
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
                <div className="space-y-4">
                  {filteredRepos.map((repo: any, index: number) => (
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
                                  className={`${getLanguageLogo(repo.language).color} text-white flex items-center space-x-1`}
                                >
                                  <span>{getLanguageLogo(repo.language).logo}</span>
                                  <span>{repo.language}</span>
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
                              </div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <GitFork className="w-4 h-4" />
                                <span className="font-medium">{formatNumber(repo.forks || 0)}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">+{repo.today_stars || 0} today</span>
                              </div>
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
                  
                  {filteredRepos.length === 0 && !reposLoading && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No repositories found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your filters or search terms.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedCategory === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Rising Developers</h2>
                <Badge variant="secondary">
                  {(risingUsers as any)?.length || 0} developers
                </Badge>
              </div>

              {usersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div>
                            <Skeleton className="w-24 h-5 mb-1" />
                            <Skeleton className="w-20 h-4" />
                          </div>
                        </div>
                        <Skeleton className="w-full h-4 mb-2" />
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-16 h-4" />
                          <Skeleton className="w-16 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(risingUsers as any)?.map((user: any) => (
                    <Card key={user.id} className="hover:border-primary/50 transition-colors group cursor-pointer"
                          onClick={() => window.open(`https://github.com/${user.username}`, '_blank')}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar_url} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {user.name || user.username}
                            </h3>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        
                        {user.bio && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{user.bio}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{formatNumber(user.followers || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{formatNumber(user.public_repos || 0)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedCategory === "topics" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Popular Technologies</h2>
                <Badge variant="secondary">
                  {(technologies as any)?.length || 0} technologies
                </Badge>
              </div>

              {techLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6 text-center">
                        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                        <Skeleton className="w-20 h-5 mb-2 mx-auto" />
                        <Skeleton className="w-24 h-4 mx-auto" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(technologies as any)?.map((tech: any) => (
                    <Card key={tech.id} className="hover:border-primary/50 transition-colors group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: tech.color || "#8B5CF6" }}
                        >
                          <span>{getLanguageLogo(tech.name).logo}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(tech.repos_count || 0)} repositories
                        </p>
                        <div className="mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {tech.percentage || 0}% popular
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}