import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Star,
  GitFork,
  Code,
  Users,
  Building,
  Globe,
  Award,
  Zap,
  Target
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";

export default function LanguageDetails() {
  const { language } = useParams();
  const { t } = useLanguage();

  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ["/api/technologies", { limit: 50 }]
  });

  const { data: repositories, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }]
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users/rising", { limit: 30 }]
  });

  if (techLoading || reposLoading) {
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
                <Skeleton className="h-32 w-32 mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto" />
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

  const techsArray = (technologies as any[]) || [];
  const reposArray = (repositories as any[]) || [];
  const usersArray = (users as any[]) || [];

  const currentTech = techsArray.find(tech => 
    tech.name.toLowerCase() === language?.toLowerCase()
  );

  if (!currentTech) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Language Not Found</h2>
            <p className="text-muted-foreground mb-4">The language you're looking for doesn't exist in our database.</p>
            <Link href="/technologies">
              <Button>Browse Technologies</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const langInfo = getLanguageInfo(currentTech.name);
  
  // Get language-specific repositories
  const languageRepos = reposArray.filter(repo => 
    repo.language && repo.language.toLowerCase() === currentTech.name.toLowerCase()
  );

  // Calculate statistics
  const totalStars = languageRepos.reduce((sum, repo) => sum + (repo.stars || 0), 0);
  const totalForks = languageRepos.reduce((sum, repo) => sum + (repo.forks || 0), 0);
  const avgStars = languageRepos.length ? Math.round(totalStars / languageRepos.length) : 0;

  // Compare with other languages
  const languageComparison = techsArray
    .filter(tech => tech.name !== currentTech.name)
    .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    .slice(0, 8)
    .map(tech => ({
      name: tech.name,
      percentage: tech.percentage || 0,
      repos: tech.repos_count || 0
    }));

  // Add current language to comparison
  const comparisonData = [
    {
      name: currentTech.name,
      percentage: currentTech.percentage || 0,
      repos: currentTech.repos_count || 0,
      isCurrent: true
    },
    ...languageComparison.map(lang => ({ ...lang, isCurrent: false }))
  ].sort((a, b) => b.percentage - a.percentage);

  // Growth trend simulation
  const growthData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    adoption: Math.max(0, (currentTech.percentage || 0) + Math.sin(i * 0.5) * 5 + (i * 2)),
    repos: Math.floor(((currentTech.repos_count || 0) / 12) * (i + 1) + Math.random() * 1000)
  }));

  // Categories for the language
  const getLanguageCategory = (name: string) => {
    const categories = {
      'JavaScript': ['Frontend', 'Backend', 'Full-Stack'],
      'Python': ['Data Science', 'AI/ML', 'Backend'],
      'TypeScript': ['Frontend', 'Backend', 'Full-Stack'],
      'Java': ['Enterprise', 'Backend', 'Android'],
      'C#': ['Desktop', 'Web', 'Game Dev'],
      'Go': ['Backend', 'DevOps', 'Cloud'],
      'Rust': ['Systems', 'WebAssembly', 'Performance'],
      'Ruby': ['Web', 'Scripting', 'DevOps'],
      'PHP': ['Web', 'Backend', 'CMS'],
      'Swift': ['iOS', 'macOS', 'Mobile'],
      'Kotlin': ['Android', 'Backend', 'Cross-platform']
    };
    return categories[name as keyof typeof categories] || ['Programming'];
  };

  const languageCategories = getLanguageCategory(currentTech.name);

  const getLanguageDescription = (name: string) => {
    const descriptions = {
      'JavaScript': 'The language of the web, powering both frontend and backend development with unmatched versatility.',
      'Python': 'A powerful, readable language dominating data science, AI, and rapid development across domains.',
      'TypeScript': 'JavaScript with static typing, bringing enterprise-level development practices to web applications.',
      'Java': 'Enterprise-grade language known for reliability, performance, and extensive ecosystem.',
      'C#': 'Microsoft\'s flagship language for modern application development across platforms.',
      'Go': 'Google\'s efficient language designed for cloud computing and scalable systems.',
      'Rust': 'Systems programming language focused on safety, speed, and concurrency.',
      'Ruby': 'Developer-friendly language emphasizing simplicity and productivity.',
      'PHP': 'Web-focused language powering a significant portion of the internet.',
      'Swift': 'Apple\'s modern language for iOS, macOS, and beyond.',
      'Kotlin': 'Modern language combining Java compatibility with enhanced features.'
    };
    return descriptions[name as keyof typeof descriptions] || 'A programming language with various applications.';
  };

  const marketShareData = [
    { name: currentTech.name, value: currentTech.percentage || 0, color: langInfo.color },
    { name: 'Others', value: 100 - (currentTech.percentage || 0), color: '#E5E7EB' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/technologies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Technologies
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Language Deep Dive</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Language Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center text-4xl">
                  {langInfo.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentTech.name}</h2>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {languageCategories.map((category, index) => (
                    <Badge key={index} variant="secondary" style={{ backgroundColor: langInfo.color, color: 'white' }}>
                      {category}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {getLanguageDescription(currentTech.name)}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-primary">{currentTech.percentage}%</div>
                    <div className="text-xs text-muted-foreground">Market Share</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-primary">#{techsArray.findIndex(t => t.name === currentTech.name) + 1}</div>
                    <div className="text-xs text-muted-foreground">Ranking</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Language Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Repositories
                  </span>
                  <span className="font-bold">{(currentTech.repos_count || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Total Stars
                  </span>
                  <span className="font-bold">{totalStars.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2">
                    <GitFork className="h-4 w-4" />
                    Total Forks
                  </span>
                  <span className="font-bold">{totalForks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Avg Stars/Repo
                  </span>
                  <span className="font-bold">{avgStars.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Market Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <div className="text-2xl font-bold" style={{ color: langInfo.color }}>
                    {currentTech.percentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">Market Share</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Adoption Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="adoption"
                            stroke={langInfo.color}
                            fill={langInfo.color}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-xl font-bold">{currentTech.percentage}%</div>
                      <div className="text-sm text-muted-foreground">Adoption</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-xl font-bold">{languageRepos.length}</div>
                      <div className="text-sm text-muted-foreground">Active Repos</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <div className="text-xl font-bold">+{Math.floor(Math.random() * 20 + 10)}%</div>
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-xl font-bold">{Math.floor((currentTech.repos_count || 0) / 10)}</div>
                      <div className="text-sm text-muted-foreground">Active Devs</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Language Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="percentage"
                            fill={(entry) => entry?.isCurrent ? langInfo.color : '#E5E7EB'}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparisonData.slice(0, 6).map((lang, index) => {
                        const isHigher = lang.percentage > (currentTech.percentage || 0);
                        const difference = Math.abs(lang.percentage - (currentTech.percentage || 0));
                        return (
                          <div key={index} className={`p-4 rounded-lg border ${lang.isCurrent ? 'border-primary bg-primary/5' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                  {getLanguageInfo(lang.name).icon}
                                </div>
                                <span className="font-medium">{lang.name}</span>
                                {lang.isCurrent && <Badge variant="secondary">Current</Badge>}
                              </div>
                              <div className="flex items-center gap-2">
                                {!lang.isCurrent && (
                                  <>
                                    {isHigher ? (
                                      <TrendingUp className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4 text-green-500" />
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                      {difference.toFixed(1)}% {isHigher ? 'ahead' : 'behind'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Progress value={lang.percentage} className="flex-1 mr-4" />
                              <span className="text-sm font-medium">{lang.percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Repository Growth Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="repos"
                            stroke={langInfo.color}
                            strokeWidth={3}
                            dot={{ fill: langInfo.color }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Growth Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly Growth</span>
                        <span className="font-bold text-green-600">+{Math.floor(Math.random() * 15 + 5)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Developer Interest</span>
                        <span className="font-bold text-blue-600">High</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Enterprise Adoption</span>
                        <span className="font-bold text-purple-600">{Math.floor(Math.random() * 40 + 60)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Job Market Demand</span>
                        <span className="font-bold text-orange-600">Strong</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Future Outlook</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200">
                          Strong Growth Trajectory
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Expected to maintain upward trend
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          High Developer Satisfaction
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Consistently rated highly by developers
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          Enterprise Ready
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          Suitable for large-scale applications
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ecosystem" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Top Repositories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {languageRepos.slice(0, 8).map((repo, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="font-medium">{repo.full_name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {repo.description || 'No description available'}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span>{(repo.stars || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-4 w-4" />
                              <span>{(repo.forks || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Ecosystem Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Community Activity</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Documentation Quality</span>
                            <span className="text-sm font-medium">88%</span>
                          </div>
                          <Progress value={88} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Package Ecosystem</span>
                            <span className="text-sm font-medium">95%</span>
                          </div>
                          <Progress value={95} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Learning Resources</span>
                            <span className="text-sm font-medium">90%</span>
                          </div>
                          <Progress value={90} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Tool Support</span>
                            <span className="text-sm font-medium">87%</span>
                          </div>
                          <Progress value={87} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Performance</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} />
                        </div>
                      </div>
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