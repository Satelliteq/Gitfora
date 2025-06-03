import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface UserSearchFormProps {
  onSearch: (username: string) => void;
  initialValue?: string;
  isLoading?: boolean;
}

export default function UserSearchForm({ 
  onSearch, 
  initialValue = "", 
  isLoading = false 
}: UserSearchFormProps) {
  const [username, setUsername] = useState(initialValue);

  useEffect(() => {
    setUsername(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter GitHub username (e.g., octocat)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            <Button 
              type="submit" 
              disabled={!username.trim() || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Search for any GitHub user to view their profile, repositories, and statistics.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
