import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import UserSearchForm from "@/components/search/user-search-form";
import UserProfileCard from "@/components/search/user-profile-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { ArrowLeft, Search, Users, TrendingUp } from "lucide-react";

export default function UserSearch() {
  const [, setLocation] = useLocation();
  const [searchedUser, setSearchedUser] = useState<string | null>(null);
  const { t } = useLanguage();

  // Get query parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';

  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/github/search", searchedUser],
    enabled: !!searchedUser,
    queryFn: async () => {
      const response = await fetch("/api/github/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: searchedUser }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search user");
      }
      
      return response.json();
    },
  });

  const { data: userRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/github/users", searchedUser, "repos"],
    enabled: !!searchedUser && !!userData,
  });

  const handleSearch = (username: string) => {
    setSearchedUser(username);
    // Update URL without navigation
    window.history.replaceState({}, '', `/search?q=${encodeURIComponent(username)}`);
  };

  // Handle initial search from URL parameter
  useState(() => {
    if (initialQuery) {
      setSearchedUser(initialQuery);
    }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Search</h1>
              <p className="text-muted-foreground mt-1">Search and analyze GitHub users</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <UserSearchForm 
            onSearch={handleSearch} 
            initialValue={initialQuery}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">Error: {(error as Error).message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {userData && (
            <div className="mt-6">
              <UserProfileCard 
                user={userData} 
                repositories={userRepos || []}
                isLoadingRepos={reposLoading}
              />
            </div>
          )}
          
          {searchedUser && !userData && !isLoading && !error && (
            <div className="mt-6 text-center py-12">
              <p className="text-muted-foreground">No user found with username "{searchedUser}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
