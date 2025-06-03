import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Users, 
  MapPin, 
  Building, 
  BookOpen, 
  Github,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  TrendingUp,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Sparkles,
  Target,
  Globe
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";

export default function UserSearch() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get query from URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = urlParams.get('q') || '';

  // Trending users for suggestions
  const { data: suggestedUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 12 }],
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/github/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchQuery.trim() })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSearchResults(result);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-background border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Developer Search
                  </h1>
                  <p className="text-muted-foreground">
                    Find and explore GitHub developers worldwide
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
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

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for GitHub users by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-24 h-14 text-lg bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary/40"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Search Results */}
          {searchResults && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Search Results
                </h2>
                <Badge variant="secondary">
                  Found: {searchResults.username}
                </Badge>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={searchResults.avatar_url} alt={searchResults.name || searchResults.username} />
                      <AvatarFallback className="text-2xl">
                        {(searchResults.name || searchResults.username)?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{searchResults.name || searchResults.username}</h3>
                        <Badge variant="outline">@{searchResults.username}</Badge>
                      </div>
                      
                      {searchResults.bio && (
                        <p className="text-muted-foreground mb-4">{searchResults.bio}</p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{formatNumber(searchResults.followers || 0)} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{searchResults.public_repos || 0} repositories</span>
                        </div>
                        {searchResults.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{searchResults.location}</span>
                          </div>
                        )}
                        {searchResults.company && (
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{searchResults.company}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <Link href={`/user-details/${searchResults.username}`}>
                          <Button>
                            View Profile
                          </Button>
                        </Link>
                        <Button variant="outline" asChild>
                          <a href={searchResults.html_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub Profile
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Trending Developers */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Discover Developers
                </h2>
                <p className="text-muted-foreground">Popular developers you might want to follow</p>
              </div>
              <Link href="/top">
                <Button variant="outline" size="sm">
                  View All Developers
                </Button>
              </Link>
            </div>

            {usersLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      {viewMode === "grid" ? (
                        <div className="text-center">
                          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                          <Skeleton className="w-24 h-5 mx-auto mb-2" />
                          <Skeleton className="w-32 h-4 mx-auto mb-4" />
                          <Skeleton className="w-20 h-8 mx-auto" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="w-32 h-5 mb-2" />
                            <Skeleton className="w-48 h-4" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {(suggestedUsers as any[])?.map((user) => (
                  <Link key={user.id} href={`/user-details/${user.username}`}>
                    <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className={viewMode === "grid" ? "p-6" : "p-4"}>
                        {viewMode === "grid" ? (
                          /* Grid View */
                          <div className="text-center">
                            <Avatar className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <AvatarImage src={user.avatar_url || ''} alt={user.name || user.username} />
                              <AvatarFallback className="text-lg">
                                {(user.name || user.username)?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {user.name || user.username}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">@{user.username}</p>
                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
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
                        ) : (
                          /* List View */
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 group-hover:scale-110 transition-transform">
                              <AvatarImage src={user.avatar_url || ''} alt={user.name || user.username} />
                              <AvatarFallback>
                                {(user.name || user.username)?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                  {user.name || user.username}
                                </h3>
                                <Badge variant="outline" className="text-xs">@{user.username}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{formatNumber(user.followers || 0)} followers</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" />
                                  <span>{user.public_repos || 0} repos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Search Tips */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Search Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Search by Username</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the exact GitHub username to find a specific developer.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Explore Suggestions</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse trending developers below to discover new talent.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Profile Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on any profile to view detailed analytics and insights.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Real-time Data</h4>
                  <p className="text-sm text-muted-foreground">
                    All data is fetched in real-time from GitHub's official API.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
    </div>
  );
}