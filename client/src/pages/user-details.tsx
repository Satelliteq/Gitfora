import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ArrowLeft,
  MapPin,
  Building,
  Calendar,
  ExternalLink,
  Star,
  GitFork,
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  Code,
  Award
} from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";

export default function UserDetails() {
  const { username } = useParams();
  const { t } = useLanguage();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/github/user", username],
    enabled: !!username
  });

  const { data: allUsers } = useQuery({
    queryKey: ["/api/users/rising", { limit: 30 }]
  });

  const { data: repositories } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }]
  });

  const { data: technologies } = useQuery({
    queryKey: ["/api/technologies", { limit: 50 }]
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
            <Link href="/user-search">
              <Button>Go Back to Search</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userData = user as any;
  const allUsersArray = (allUsers as any[]) || [];
  const reposArray = (repositories as any[]) || [];
  const techsArray = (technologies as any[]) || [];

  // Calculate user statistics and comparisons
  const getUserRanking = () => {
    const sortedUsers = allUsersArray.sort((a, b) => (b.followers || 0) - (a.followers || 0));
    const userIndex = sortedUsers.findIndex(u => u.username === userData.username);
    return userIndex >= 0 ? userIndex + 1 : null;
  };

  const getPercentileRank = (value: number, allValues: number[]) => {
    const sorted = allValues.sort((a, b) => a - b);
    const rank = sorted.findIndex(v => v >= value);
    return rank >= 0 ? Math.round((rank / sorted.length) * 100) : 0;
  };

  const userStats = {
    followers: userData.followers || 0,
    following: userData.following || 0,
    publicRepos: userData.public_repos || 0,
    ranking: getUserRanking()
  };

  const allFollowers = allUsersArray.map(u => u.followers || 0);
  const allRepos = allUsersArray.map(u => u.public_repos || 0);

  const comparisonData = [
    {
      metric: 'Followers',
      user: userStats.followers,
      average: Math.round(allFollowers.reduce((a, b) => a + b, 0) / allFollowers.length),
      percentile: getPercentileRank(userStats.followers, allFollowers)
    },
    {
      metric: 'Repositories',
      user: userStats.publicRepos,
      average: Math.round(allRepos.reduce((a, b) => a + b, 0) / allRepos.length),
      percentile: getPercentileRank(userStats.publicRepos, allRepos)
    }
  ];

  const skillsRadarData = [
    { skill: 'Popularity', value: Math.min((userStats.followers / 1000) * 10, 100) },
    { skill: 'Activity', value: Math.min((userStats.publicRepos / 10) * 20, 100) },
    { skill: 'Network', value: Math.min((userStats.following / 100) * 30, 100) },
    { skill: 'Influence', value: Math.min((userStats.followers / 500) * 15, 100) },
    { skill: 'Productivity', value: Math.min((userStats.publicRepos / 20) * 25, 100) }
  ];

  const getDeveloperTier = () => {
    if (userStats.followers > 50000) return { tier: "Elite", color: "bg-purple-500", description: "Top 1% developer" };
    if (userStats.followers > 10000) return { tier: "Expert", color: "bg-blue-500", description: "Top 5% developer" };
    if (userStats.followers > 1000) return { tier: "Advanced", color: "bg-green-500", description: "Top 20% developer" };
    if (userStats.followers > 100) return { tier: "Rising", color: "bg-yellow-500", description: "Growing developer" };
    return { tier: "Newcomer", color: "bg-gray-500", description: "Getting started" };
  };

  const developerTier = getDeveloperTier();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Developer Profile Analysis</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={userData.avatar_url} alt={userData.name || userData.username} />
                    <AvatarFallback className="text-2xl">
                      {(userData.name || userData.username)?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">{userData.name || userData.username}</h2>
                    <p className="text-sm text-muted-foreground">@{userData.username}</p>
                    <Badge className={`${developerTier.color} text-white`}>
                      {developerTier.tier}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{developerTier.description}</p>
                  </div>

                  {userData.bio && (
                    <p className="text-sm text-center text-muted-foreground">{userData.bio}</p>
                  )}

                  <div className="space-y-2 w-full">
                    {userData.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{userData.location}</span>
                      </div>
                    )}
                    {userData.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4" />
                        <span>{userData.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {format(new Date(userData.created_at || Date.now()), 'MMM yyyy')}</span>
                    </div>
                  </div>

                  {userStats.ranking && (
                    <div className="text-center p-3 bg-muted rounded-lg w-full">
                      <div className="text-lg font-bold text-primary">#{userStats.ranking}</div>
                      <div className="text-xs text-muted-foreground">Global Ranking</div>
                    </div>
                  )}

                  <Button className="w-full" asChild>
                    <a href={`https://github.com/${userData.username}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Followers</span>
                  <span className="font-bold">{userStats.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Following</span>
                  <span className="font-bold">{userStats.following.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Repositories</span>
                  <span className="font-bold">{userStats.publicRepos.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Skills Radar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Developer Skills Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={skillsRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">{userStats.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{userStats.publicRepos}</div>
                      <div className="text-sm text-muted-foreground">Repositories</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">{userStats.following}</div>
                      <div className="text-sm text-muted-foreground">Following</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Community Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {comparisonData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.metric}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.percentile}th percentile
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded">
                              <div className="text-lg font-bold text-blue-600">{item.user.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">You</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded">
                              <div className="text-lg font-bold text-gray-600">{item.average.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Average</div>
                            </div>
                          </div>
                          <Progress value={item.percentile} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Technology Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {techsArray.slice(0, 9).map((tech, index) => {
                        const langInfo = getLanguageInfo(tech.name);
                        return (
                          <div key={index} className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors">
                            <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                              {langInfo.icon}
                            </div>
                            <div className="font-medium text-sm">{tech.name}</div>
                            <div className="text-xs text-muted-foreground">{tech.percentage}% adoption</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}