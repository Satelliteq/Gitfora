import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Star, 
  GitFork, 
  TrendingUp, 
  Hash, 
  BookOpen,
  Code
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";

export default function Discover() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [timeRange, setTimeRange] = useState("weekly");

  const { data: trendingRepos, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["/api/repositories/trending", timeRange]
  });

  const { data: technologies } = useQuery({
    queryKey: ["/api/technologies"]
  });

  const topics = [
    "machine-learning", "web-development", "mobile", "data-science", 
    "artificial-intelligence", "blockchain", "cybersecurity", "cloud-computing",
    "devops", "frontend", "backend", "fullstack", "react", "vue", "angular",
    "python", "javascript", "typescript", "go", "rust", "kotlin", "swift"
  ];

  const filteredRepos = (trendingRepos as any[])?.filter((repo: any) => {
    if (searchQuery && !repo.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !repo.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedLanguage && selectedLanguage !== "all" && repo.language !== selectedLanguage) {
      return false;
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{t("discover")}</h1>
          <p className="text-sm text-muted-foreground">Explore trending repositories and discover new technologies</p>
        </div>

        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">{t("trending")}</TabsTrigger>
            <TabsTrigger value="topics">{t("topics")}</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search trending repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {(technologies as any[])?.slice(0, 20).map((tech: any) => (
                          <SelectItem key={tech.name} value={tech.name}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-28 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t("daily")}</SelectItem>
                        <SelectItem value="weekly">{t("weekly")}</SelectItem>
                        <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {isLoadingTrending ? (
                Array.from({ length: 10 }, (_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredRepos.length > 0 ? (
                filteredRepos.map((repo: any, index: number) => {
                  const langInfo = getLanguageInfo(repo.language);
                  return (
                    <Card key={repo.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 text-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <a 
                                href={repo.html_url || repo.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline"
                              >
                                {repo.full_name || repo.name}
                              </a>
                              <Badge variant="secondary" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                #{index + 1}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {repo.description || "No description available"}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {repo.language && (
                                <div className="flex items-center gap-1">
                                  {langInfo.icon}
                                  <span>{langInfo.name}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                <span>{(repo.stargazers_count || repo.stars || 0).toLocaleString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <GitFork className="h-3 w-3" />
                                <span>{(repo.forks_count || repo.forks || 0).toLocaleString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <span>Built by</span>
                                <span className="font-medium">{repo.owner || "Unknown"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-medium mb-1">No repositories found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  {t("explore_topics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {topics.map((topic) => (
                    <Badge 
                      key={topic}
                      variant="outline" 
                      className="justify-center py-2 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      #{topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(technologies as any[])?.slice(0, 12).map((tech: any) => {
                const langInfo = getLanguageInfo(tech.name);
                return (
                  <Card key={tech.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {langInfo.icon}
                        <h3 className="font-medium">{langInfo.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {tech.repos_count || 0} repositories
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Code className="h-3 w-3" />
                        <span>{tech.percentage || 0}% usage</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Machine Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Discover machine learning libraries, frameworks, and tools
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["TensorFlow", "PyTorch", "Scikit-learn", "Pandas"].map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Web Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Modern web development frameworks and libraries
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["React", "Vue", "Angular", "Next.js"].map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}