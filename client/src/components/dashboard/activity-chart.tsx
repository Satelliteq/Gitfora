import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityChart() {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ["/api/activity/weekly"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>GitHub Activity Trends</CardTitle>
            <Skeleton className="w-32 h-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-64" />
        </CardContent>
      </Card>
    );
  }

  const chartData = activityData?.labels?.map((label: string, index: number) => ({
    name: label,
    repositories: activityData.datasets[0]?.data[index] || 0,
    users: activityData.datasets[1]?.data[index] || 0,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">GitHub Activity Trends</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-32 bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="repositories"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Repository Activity"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                name="User Registrations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
