import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3,
  TrendingUp,
  Users,
  Code,
  Star,
  GitFork,
  Calendar,
  Globe,
  Target,
  Zap,
  Award,
  Sparkles,
  Activity,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { useLanguage } from "@/contexts/language-context";

interface AnalyticsData {
  languages: any[];
  frameworks: any[];
  databases: any[];
  trends: any[];
  fieldTrends: any[];
}

export default function Analytics() {
  const { t } = useLanguage();

  const { data: repositories } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 100 }]
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users/rising", { limit: 50 }]
  });

  const { data: technologies } = useQuery({
    queryKey: ["/api/technologies", { limit: 50 }]
  });

  // API'den gelen verileri dizi olarak varsay
  const repoArray = Array.isArray(repositories) ? repositories : [];
  const userArray = Array.isArray(users) ? users : [];
  const techArray = Array.isArray(technologies) ? technologies : [];

  // Gerçek verilerle languageData oluştur
  const languageData = techArray.map((tech: any) => {
    return {
      name: tech.name,
      popularity: tech.percentage || 0,
      growth: tech.growth_percentage ? parseFloat(tech.growth_percentage) : null,
      repos: tech.repos_count || 0,
      developers: tech.developers || null
    };
  });

  // Gerçek verilerle trendData oluştur
  const trendData = [
    {
      month: "Toplam",
      repositories: repoArray.length,
      developers: userArray.length,
      stars: repoArray.reduce((acc: number, repo: any) => acc + (repo.stars || 0), 0)
    }
  ];

  // Yazılım alanı trendleri (sabit veri)
  const fieldTrends = [
    { field: "Frontend", value: 85, color: "#3B82F6" },
    { field: "Backend", value: 78, color: "#10B981" },
    { field: "Mobile", value: 65, color: "#8B5CF6" },
    { field: "DevOps", value: 72, color: "#F59E0B" },
    { field: "Data Science", value: 68, color: "#EF4444" },
    { field: "AI/ML", value: 82, color: "#06B6D4" }
  ];

  // Radar chart için de backend'den veri gelmiyorsa, bu bölümü kaldır veya sadeleştir

  const formatNumber = (num: number | null | undefined) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
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
      <header className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-background border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Comprehensive insights into GitHub ecosystem trends
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>Real-time data</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated continuously</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Key Metrics */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Key Metrics
              </h2>
              <Badge variant="secondary">Live Data</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Repositories</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatNumber(repoArray.length)}
                      </p>
                    </div>
                    <Globe className="w-12 h-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Developers</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatNumber(userArray.length)}
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Technologies</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {techArray.length}
                      </p>
                    </div>
                    <Code className="w-12 h-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Stars</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {formatNumber(repoArray.reduce((acc: number, repo: any) => acc + (repo.stars || 0), 0))}
                      </p>
                    </div>
                    <Star className="w-12 h-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Growth Trends */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      Growth Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="repositories" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="developers" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Project Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={trendData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="repositories"
                        >
                          <Tooltip />
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </section>

              {/* Field Trends */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Development Field Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {fieldTrends.map((field) => (
                      <div key={field.field} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{field.field}</span>
                          <span className="text-sm text-muted-foreground">{field.value}%</span>
                        </div>
                        <Progress value={field.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="languages" className="space-y-8">
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Language Popularity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={languageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="popularity" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Technology Radar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={languageData as any[]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis />
                        <Radar name="Current" dataKey="popularity" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </section>

              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Top Languages by Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {languageData.slice(0, 6).map((lang, index) => (
                        <Card key={lang.name} className="relative overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold text-lg">{lang.name}</h3>
                              <Badge variant="secondary">#{index + 1}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Popularity</span>
                                <span className="font-medium">{lang.popularity}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Growth</span>
                                <span className="font-medium text-green-600">{lang.growth !== null && lang.growth !== undefined ? `+${lang.growth}%` : "-"}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Repositories</span>
                                <span className="font-medium">{formatNumber(lang.repos)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Developers</span>
                                <span className="font-medium">{lang.developers !== null && lang.developers !== undefined ? formatNumber(lang.developers) : "-"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="trends" className="space-y-8">
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Monthly Activity Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsLineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="repositories" stroke="#3B82F6" strokeWidth={3} />
                        <Line type="monotone" dataKey="developers" stroke="#10B981" strokeWidth={3} />
                        <Line type="monotone" dataKey="stars" stroke="#F59E0B" strokeWidth={3} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="insights" className="space-y-8">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Frontend Development</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        React and Vue.js continue to dominate, with a 15% increase in adoption this quarter.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-900 dark:text-green-100">Backend Technologies</h4>
                      <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                        Node.js and Python are leading backend choices, with Go gaining significant traction.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">Emerging Trends</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-200 mt-1">
                        WebAssembly and edge computing are showing exponential growth in developer interest.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">Next Quarter</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                        AI/ML repositories expected to grow by 25%, with Python maintaining dominance.
                      </p>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <h4 className="font-medium text-indigo-900 dark:text-indigo-100">Developer Growth</h4>
                      <p className="text-sm text-indigo-700 dark:text-indigo-200 mt-1">
                        Remote-first development teams will increase by 30%, driving cloud-native adoption.
                      </p>
                    </div>
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                      <h4 className="font-medium text-teal-900 dark:text-teal-100">Technology Shifts</h4>
                      <p className="text-sm text-teal-700 dark:text-teal-200 mt-1">
                        Serverless architecture adoption will accelerate, especially in enterprise environments.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}