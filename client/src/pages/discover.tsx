import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Compass,
  Star,
  TrendingUp,
  Users,
  Code,
  Zap,
  Target,
  BookOpen,
  GitFork,
  Eye,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Trophy,
  Rocket,
  Globe,
  Heart
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { GithubUser, Repository, Technology } from "@shared/schema";

export default function Discover() {
  const { t } = useLanguage();

  const { data: featuredUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 8 }],
  });

  const { data: trendingRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 12 }],
  });

  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ["/api/technologies", { limit: 20 }],
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

  const collections = [
    {
      id: 1,
      title: "Rising Stars",
      description: "Developers gaining momentum in the community",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      count: 25,
      category: "users"
    },
    {
      id: 2,
      title: "Trending Projects",
      description: "Repositories with explosive growth this week",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      count: 50,
      category: "repos"
    },
    {
      id: 3,
      title: "Tech Innovators",
      description: "Leading contributors in cutting-edge technologies",
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      count: 30,
      category: "users"
    },
    {
      id: 4,
      title: "Hot Languages",
      description: "Programming languages dominating the scene",
      icon: <Code className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      count: 15,
      category: "tech"
    }
  ];

  const trendingTopics = [
    { name: "AI/ML", count: 1247, trending: "+25%" },
    { name: "Web3", count: 892, trending: "+18%" },
    { name: "DevOps", count: 756, trending: "+12%" },
    { name: "Mobile", count: 634, trending: "+8%" },
    { name: "Cloud", count: 523, trending: "+15%" },
    { name: "Security", count: 445, trending: "+22%" }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Compass className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Discover
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the most innovative developers, trending repositories, and emerging technologies shaping the future of code
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">125K+</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Stars Given</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Featured Collections */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Featured Collections
                </h2>
                <p className="text-muted-foreground">Curated content for every developer</p>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${collection.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {collection.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {collection.count} items
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Trending Topics */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Trending Topics
              </h2>
              <Link href="/analytics">
                <Button variant="outline" size="sm">
                  View Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingTopics.map((topic, index) => (
                <Card key={index} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-bold mb-1">{topic.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{formatNumber(topic.count)} repos</div>
                    <div className="flex items-center justify-center text-green-500 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {topic.trending}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Developers */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Featured Developers
              </h2>
              <Link href="/top">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {usersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Skeleton className="w-16 h-16 rounded-full mb-4" />
                        <Skeleton className="w-24 h-5 mb-2" />
                        <Skeleton className="w-32 h-4 mb-4" />
                        <Skeleton className="w-20 h-6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(featuredUsers as GithubUser[])?.slice(0, 8).map((user) => (
                  <Link key={user.id} href={`/user-details/${user.username}`}>
                    <Card className="hover:border-primary/50 transition-colors group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform">
                            <AvatarImage src={user.avatar_url || ''} alt={user.name || user.username} />
                            <AvatarFallback className="text-lg">
                              {(user.name || user.username)?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {user.name || user.username}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">@{user.username}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{formatNumber(user.followers || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{user.public_repos || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Hot Repositories */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Hot Repositories
              </h2>
              <Link href="/trending">
                <Button variant="outline" size="sm">
                  View Trending
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {reposLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="w-32 h-5 mb-2" />
                      <Skeleton className="w-full h-4 mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="w-16 h-6" />
                        <Skeleton className="w-12 h-6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(trendingRepos as Repository[])?.slice(0, 6).map((repo) => {
                  const langInfo = getLanguageInfo(repo.language);
                  return (
                    <Card key={repo.id} className="hover:border-primary/50 transition-colors group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6">
                              {langInfo.icon}
                            </div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                              {repo.name}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {repo.description || "No description available"}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{formatNumber(repo.stars || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              <span>{formatNumber(repo.forks || 0)}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {repo.language}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Popular Technologies */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                Popular Technologies
              </h2>
              <Link href="/technologies">
                <Button variant="outline" size="sm">
                  Explore All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {techLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="w-8 h-8 mx-auto mb-2" />
                      <Skeleton className="w-16 h-4 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(technologies as Technology[])?.slice(0, 12).map((tech) => {
                  const langInfo = getLanguageInfo(tech.name);
                  return (
                    <Link key={tech.id} href={`/language-details/${tech.name.toLowerCase()}`}>
                      <Card className="hover:border-primary/50 transition-colors group cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform">
                            {langInfo.icon}
                          </div>
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">
                            {tech.name}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}