import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ExternalLink } from "lucide-react";
import type { GithubUser } from "@shared/schema";

interface RisingUsersProps {
  users: GithubUser[];
  isLoading?: boolean;
}

export default function RisingUsers({ users, isLoading = false }: RisingUsersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rising GitHub Users</CardTitle>
            <Skeleton className="w-16 h-6" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-20 h-4 mb-1" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="w-12 h-4 mb-1" />
                  <Skeleton className="w-16 h-3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return (followers / 1000000).toFixed(1) + "M";
    }
    if (followers >= 1000) {
      return (followers / 1000).toFixed(1) + "K";
    }
    return followers.toString();
  };

  const getGrowthPercentage = () => {
    // Mock growth percentage for demo
    return `+${(Math.random() * 25 + 5).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Rising GitHub Users</CardTitle>
          <Button variant="link" className="text-primary hover:text-primary/80 p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
              onClick={() => window.open(`https://github.com/${user.username}`, '_blank')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="activity-indicator"></div>
                </div>
                <div>
                  <div className="text-foreground font-medium">@{user.username}</div>
                  <div className="text-muted-foreground text-sm">{user.name || 'No name'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>{getGrowthPercentage()}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {formatFollowers(user.followers || 0)} followers
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
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No rising users data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
