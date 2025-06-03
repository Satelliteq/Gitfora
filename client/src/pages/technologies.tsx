import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Code,
  Search,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Zap,
  Target,
  Award,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { Technology } from "@shared/schema";

export default function Technologies() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: technologies, isLoading } = useQuery({
    queryKey: ["/api/technologies", { limit: 100 }],
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

  const filteredTechnologies = (technologies as Technology[])?.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getPopularityLevel = (usage: number) => {
    if (usage >= 90) return { level: "Extremely Popular", color: "bg-red-500", icon: "🔥" };
    if (usage >= 70) return { level: "Very Popular", color: "bg-orange-500", icon: "⭐" };
    if (usage >= 50) return { level: "Popular", color: "bg-yellow-500", icon: "📈" };
    if (usage >= 30) return { level: "Growing", color: "bg-green-500", icon: "🌱" };
    return { level: "Emerging", color: "bg-blue-500", icon: "💎" };
  };

  const getRandomStats = () => ({
    repos: Math.floor(Math.random() * 100000) + 10000,
    developers: Math.floor(Math.random() * 50000) + 5000,
    growth: `+${(Math.random() * 25 + 5).toFixed(1)}%`,
    usage: Math.floor(Math.random() * 100) + 1
  });

  const techCategories = [
    { name: "Frontend", count: 25, color: "from-blue-500 to-cyan-500" },
    { name: "Backend", count: 18, color: "from-green-500 to-emerald-500" },
    { name: "Mobile", count: 12, color: "from-purple-500 to-pink-500" },
    { name: "Data Science", count: 15, color: "from-orange-500 to-red-500" },
    { name: "DevOps", count: 20, color: "from-indigo-500 to-purple-500" },
    { name: "Game Dev", count: 8, color: "from-pink-500 to-rose-500" }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Technologies
              </h1>
            </div>
            <p className="text-muted-foreground">Explore programming languages, frameworks, and tools shaping the future</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <div className="flex items-center rounded-lg border border-border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap gap-4">
          {techCategories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-2`}>
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground">{category.count} technologies</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Languages</p>
                    <p className="text-2xl font-bold text-primary">
                      {(technologies as Technology[])?.length || 0}
                    </p>
                  </div>
                  <Code className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-green-500">2.5M+</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Developers</p>
                    <p className="text-2xl font-bold text-blue-500">12M+</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Growing Fast</p>
                    <p className="text-2xl font-bold text-orange-500">+25%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technologies Grid/List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>All Technologies</span>
                  <Badge variant="secondary" className="ml-2">
                    {filteredTechnologies.length} technologies
                  </Badge>
                </div>
                {searchQuery && (
                  <div className="text-sm text-muted-foreground">
                    Showing results for "{searchQuery}"
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {[...Array(12)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        {viewMode === "grid" ? (
                          <div className="text-center">
                            <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-lg" />
                            <Skeleton className="w-24 h-5 mx-auto mb-2" />
                            <Skeleton className="w-32 h-4 mx-auto mb-4" />
                            <div className="flex justify-center space-x-4">
                              <Skeleton className="w-12 h-4" />
                              <Skeleton className="w-12 h-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <div className="flex-1">
                              <Skeleton className="w-32 h-5 mb-2" />
                              <Skeleton className="w-48 h-4" />
                            </div>
                            <Skeleton className="w-16 h-6" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {filteredTechnologies.map((tech) => {
                    const langInfo = getLanguageInfo(tech.name);
                    const stats = getRandomStats();
                    const popularity = getPopularityLevel(stats.usage);
                    
                    return (
                      <Link key={tech.id} href={`/language-details/${tech.name.toLowerCase()}`}>
                        <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                          <CardContent className={viewMode === "grid" ? "p-6" : "p-4"}>
                            {viewMode === "grid" ? (
                              /* Grid View */
                              <div className="text-center">
                                <div className="relative mb-4">
                                  <div className={`w-16 h-16 mx-auto rounded-lg ${langInfo.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <div className="w-10 h-10">
                                      {langInfo.icon}
                                    </div>
                                  </div>
                                  <div className={`absolute -top-2 -right-2 w-6 h-6 ${popularity.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                    {popularity.icon}
                                  </div>
                                </div>
                                
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                  {tech.name}
                                </h3>
                                
                                <Badge variant="outline" className="mb-4 text-xs">
                                  {popularity.level}
                                </Badge>
                                
                                <div className="space-y-2 text-sm text-muted-foreground">
                                  <div className="flex items-center justify-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <BookOpen className="w-3 h-3" />
                                      <span>{formatNumber(stats.repos)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3" />
                                      <span>{formatNumber(stats.developers)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1 text-green-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stats.growth}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-border">
                                  <Button size="sm" variant="ghost" className="w-full group-hover:bg-primary/10">
                                    Learn More
                                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              /* List View */
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <div className={`w-12 h-12 rounded-lg ${langInfo.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <div className="w-6 h-6">
                                      {langInfo.icon}
                                    </div>
                                  </div>
                                  <div className={`absolute -top-1 -right-1 w-4 h-4 ${popularity.color} rounded-full flex items-center justify-center text-white text-xs`}>
                                    {popularity.icon}
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                                      {tech.name}
                                    </h3>
                                    <Badge variant="outline" className="text-xs">
                                      {popularity.level}
                                    </Badge>
                                    <div className="flex items-center space-x-1 text-green-500 text-sm">
                                      <TrendingUp className="w-3 h-3" />
                                      <span>{stats.growth}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <BookOpen className="w-3 h-3" />
                                      <span>{formatNumber(stats.repos)} repos</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3" />
                                      <span>{formatNumber(stats.developers)} devs</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <div className="text-right text-sm">
                                    <div className="font-medium">{stats.usage}%</div>
                                    <div className="text-xs text-muted-foreground">adoption</div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
              
              {!isLoading && filteredTechnologies.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No technologies found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search query or browsing all technologies.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}