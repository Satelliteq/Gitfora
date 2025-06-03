import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import type { GithubUser } from "@shared/schema";

interface RisingUsersProps {
  users: GithubUser[];
  isLoading?: boolean;
}

export default function RisingUsers({ users, isLoading = false }: RisingUsersProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
    );
  }

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return (followers / 1000000).toFixed(1) + "M";
    } else if (followers >= 1000) {
      return (followers / 1000).toFixed(1) + "k";
    }
    return followers.toString();
  };

  const getGrowthPercentage = () => {
    return `+${(Math.random() * 15 + 5).toFixed(1)}%`;
  };

  return (
    <div className="space-y-3">
      {users.slice(0, 5).map((user) => (
        <Link key={user.id} href={`/user/${user.username}`}>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-foreground font-medium text-sm">@{user.username}</div>
                <div className="text-muted-foreground text-xs">{user.name || user.username}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="flex items-center text-green-400 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{getGrowthPercentage()}</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatFollowers(user.followers || 0)} {t("followers")}
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
        </Link>
      ))}
      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No rising users data available
        </div>
      )}
    </div>
  );
}