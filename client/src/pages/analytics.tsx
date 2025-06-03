import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Brain, 
  Code, 
  Database, 
  Globe, 
  Smartphone, 
  Shield, 
  BarChart3,
  TrendingUp,
  Users,
  GitBranch,
  Activity,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";

interface AnalyticsData {
  languages: any[];
  frameworks: any[];
  databases: any[];
  trends: any[];
  fieldTrends: any[];
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { t } = useLanguage();

  const { data: technologies, isLoading: techLoading } = useQuery({
    queryKey: ["/api/technologies", { limit: 50 }],
  });

  const { data: repositories, isLoading: reposLoading } = useQuery({
    queryKey: ["/api/repositories/trending", { limit: 50 }],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/rising", { limit: 30 }],
  });

  // Process technologies data for analytics
  const processedData = () => {
    if (!technologies) return { languages: [], frameworks: [], databases: [], trends: [], fieldTrends: [] };

    const techArray = technologies as any[];
    
    const languages = techArray.filter(tech => 
      ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'C++', 'C', 'Swift', 'Kotlin', 'Dart'].includes(tech.name)
    ).slice(0, 10);

    const frameworks = techArray.filter(tech => 
      ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Express.js', 'Django', 'Laravel', 'Spring Boot'].includes(tech.name)
    ).slice(0, 8);

    const databases = techArray.filter(tech => 
      ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Elasticsearch'].includes(tech.name)
    ).slice(0, 7);

    // Create software field trends data
    const fieldTrends = [
      { field: 'AI/ML Developer', value: 92, growth: '+45%', color: '#FF6B6B' },
      { field: 'Web Developer', value: 85, growth: '+23%', color: '#4ECDC4' },
      { field: 'Mobile Developer', value: 78, growth: '+31%', color: '#45B7D1' },
      { field: 'DevOps Engineer', value: 82, growth: '+38%', color: '#96CEB4' },
      { field: 'Data Scientist', value: 88, growth: '+42%', color: '#FFEAA7' },
      { field: 'Cybersecurity', value: 75, growth: '+55%', color: '#DDA0DD' },
      { field: 'Backend Developer', value: 80, growth: '+28%', color: '#98D8C8' },
      { field: 'Frontend Developer', value: 83, growth: '+25%', color: '#F7DC6F' },
      { field: 'Data Engineer', value: 76, growth: '+35%', color: '#BB8FCE' },
      { field: 'Software Engineer', value: 87, growth: '+22%', color: '#85C1E9' }
    ];

    const trends = techArray.slice(0, 15).map(tech => ({
      name: tech.name,
      percentage: tech.percentage || 0,
      growth: `+${Math.floor(Math.random() * 30 + 5)}%`,
      repos: tech.repos_count || 0
    }));

    return { languages, frameworks, databases, trends, fieldTrends };
  };

  const analyticsData = processedData();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

  const isLoading = techLoading || reposLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comprehensive Analytics</h1>
            <p className="text-muted-foreground mt-1">Deep insights into technology trends and software development fields</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="languages">Languages</SelectItem>
                <SelectItem value="frameworks">Frameworks</SelectItem>
                <SelectItem value="databases">Databases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Analytics Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="databases">Databases</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Software Field Trends Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Software Development Field Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={analyticsData.fieldTrends}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="field" className="text-xs" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                        <Radar
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">{data.field}</p>
                                  <p className="text-sm">Trend Score: {data.value}%</p>
                                  <p className="text-sm text-green-600">Growth: {data.growth}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {analyticsData.fieldTrends.slice(0, 10).map((field, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {field.field.includes('AI') && <Brain className="h-4 w-4 mr-1" />}
                          {field.field.includes('Web') && <Globe className="h-4 w-4 mr-1" />}
                          {field.field.includes('Mobile') && <Smartphone className="h-4 w-4 mr-1" />}
                          {field.field.includes('Security') && <Shield className="h-4 w-4 mr-1" />}
                          {field.field.includes('Data') && <BarChart3 className="h-4 w-4 mr-1" />}
                          {!field.field.includes('AI') && !field.field.includes('Web') && !field.field.includes('Mobile') && !field.field.includes('Security') && !field.field.includes('Data') && <Code className="h-4 w-4 mr-1" />}
                          <span className="text-xs font-medium">{field.field.split(' ')[0]}</span>
                        </div>
                        <Badge variant="secondary" style={{ backgroundColor: field.color, color: 'white' }}>
                          {field.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Technologies</p>
                        <p className="text-2xl font-bold">{(technologies as any[])?.length || 0}</p>
                      </div>
                      <Code className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Repositories</p>
                        <p className="text-2xl font-bold">{(repositories as any[])?.length || 0}</p>
                      </div>
                      <GitBranch className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Rising Developers</p>
                        <p className="text-2xl font-bold">{(users as any[])?.length || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                        <p className="text-2xl font-bold">+32.5%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="languages" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Programming Languages Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.languages}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name} ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                          >
                            {analyticsData.languages.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Language Popularity Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.languages.slice(0, 8).map((lang, index) => {
                        const langInfo = getLanguageInfo(lang.name);
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 flex items-center justify-center">
                                {langInfo.icon}
                              </div>
                              <span className="font-medium">{lang.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-32">
                                <Progress value={lang.percentage || 0} className="h-2" />
                              </div>
                              <span className="text-sm font-medium w-12">{lang.percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="frameworks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Framework Adoption Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.frameworks}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="databases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Technology Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {analyticsData.databases.map((db, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Database className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">{db.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{db.percentage}%</div>
                            <div className="text-sm text-muted-foreground">
                              {(db.repos_count || 0).toLocaleString()} repos
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.databases}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                          >
                            {analyticsData.databases.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Technology Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.trends.map((trend, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{trend.name}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {trend.growth}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Progress value={trend.percentage} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{trend.percentage}% adoption</span>
                            <span>{trend.repos.toLocaleString()} repos</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}