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
  Award,
  Github,
  Sparkles,
  Target,
  Globe
} from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { GithubUser } from "@shared/schema";

export default function UserDetails() {
  const params = useParams();
  const username = params.username;
  const { t } = useLanguage();

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 30 }]
  });

  const { data: repositories } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }]
  });

  const { data: technologies } = useQuery({
    queryKey: ["/api/technologies", { limit: 50 }]
  });

  // Find current user from the users list
  const currentUser = (allUsers as GithubUser[])?.find(u => u.username === username);

  // Generate analytics data for the user
  const generateUserAnalytics = (user: GithubUser) => {
    const followers = user.followers || 0;
    const repos = user.public_repos || 0;
    
    return {
      skillsRadar: [
        { skill: 'Frontend', value: Math.min(90, 30 + (repos * 2)) },
        { skill: 'Backend', value: Math.min(85, 25 + (repos * 1.8)) },
        { skill: 'Mobile', value: Math.min(70, 20 + (repos * 1.5)) },
        { skill: 'DevOps', value: Math.min(80, 35 + (repos * 1.2)) },
        { skill: 'Data Science', value: Math.min(75, 15 + (repos * 1.8)) },
        { skill: 'AI/ML', value: Math.min(60, 10 + (repos * 1.3)) }
      ],
      languageStats: [
        { name: 'JavaScript', value: Math.min(40, 10 + (repos * 0.8)), color: '#F7DF1E' },
        { name: 'Python', value: Math.min(35, 8 + (repos * 0.7)), color: '#3776AB' },
        { name: 'TypeScript', value: Math.min(30, 5 + (repos * 0.6)), color: '#3178C6' },
        { name: 'Java', value: Math.min(25, 3 + (repos * 0.5)), color: '#ED8B00' },
        { name: 'Go', value: Math.min(20, 2 + (repos * 0.4)), color: '#00ADD8' }
      ],
      activityData: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        commits: Math.floor(Math.random() * 20) + 5,
        reviews: Math.floor(Math.random() * 10) + 2
      })),
      contributionLevel: followers > 10000 ? 'Expert' : followers > 1000 ? 'Advanced' : followers > 100 ? 'Intermediate' : 'Beginner',
      rankPosition: Math.floor(Math.random() * 1000) + 1,
      influence: Math.min(100, (followers / 1000) * 10 + (repos / 10) * 5)
    };
  };

  if (usersLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-3 space-y-6">
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/top">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Top
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">User not found</h1>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Developer Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The user "{username}" could not be found in our database.
              </p>
              <Link href="/search">
                <Button>
                  Search for Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const analytics = generateUserAnalytics(currentUser);
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border px-6 py-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/top">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Top
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Github className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Developer Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* User Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32 border-4 border-primary/20">
                    <AvatarImage src={currentUser.avatar_url || ''} alt={currentUser.name || currentUser.username} />
                    <AvatarFallback className="text-2xl">
                      {(currentUser.name || currentUser.username)?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">{currentUser.name || currentUser.username}</h2>
                    <p className="text-muted-foreground">@{currentUser.username}</p>
                    <Badge variant="outline" className="text-xs">
                      {analytics.contributionLevel} Developer
                    </Badge>
                  </div>

                  {currentUser.bio && (
                    <p className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
                      {currentUser.bio}
                    </p>
                  )}

                  <div className="w-full space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{formatNumber(currentUser.followers || 0)} followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{currentUser.public_repos || 0} repositories</span>
                    </div>
                    {currentUser.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{currentUser.location}</span>
                      </div>
                    )}
                    {currentUser.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span>{currentUser.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {format(new Date(currentUser.created_at || ''), 'MMM yyyy')}</span>
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Global Rank</span>
                      <span className="font-semibold">#{analytics.rankPosition}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Influence Score</span>
                      <span className="font-semibold">{analytics.influence.toFixed(1)}/100</span>
                    </div>
                    <Progress value={analytics.influence} className="h-2" />
                  </div>

                  <Button className="w-full" asChild>
                    <a href={`https://github.com/${currentUser.username}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Followers</p>
                          <p className="text-2xl font-bold">{formatNumber(currentUser.followers || 0)}</p>
                        </div>
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Repositories</p>
                          <p className="text-2xl font-bold">{currentUser.public_repos || 0}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Following</p>
                          <p className="text-2xl font-bold">{formatNumber(currentUser.following || 0)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Language Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Language Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.languageStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.languageStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="space-y-4">
                        {analytics.languageStats.map((lang, index) => (
                          <div key={lang.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: lang.color }}
                              />
                              <span className="font-medium">{lang.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{lang.value} repos</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Weekly Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="commits" fill="#3B82F6" name="Commits" />
                        <Bar dataKey="reviews" fill="#10B981" name="Reviews" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Skills Radar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={analytics.skillsRadar}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar 
                          name="Skills" 
                          dataKey="value" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.3} 
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analytics.skillsRadar.map((skill) => (
                    <Card key={skill.skill}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{skill.skill}</h3>
                          <span className="text-sm text-muted-foreground">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-900 dark:text-yellow-100">Top Contributor</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-200">High activity level</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Star className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100">Code Quality</p>
                          <p className="text-sm text-blue-700 dark:text-blue-200">Well-maintained repositories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Globe className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-100">Open Source</p>
                          <p className="text-sm text-green-700 dark:text-green-200">Active in community</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contribution Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Repository Quality</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Code Consistency</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Community Impact</span>
                          <span className="font-medium">{Math.min(100, (currentUser.followers || 0) / 100)}%</span>
                        </div>
                        <Progress value={Math.min(100, (currentUser.followers || 0) / 100)} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}