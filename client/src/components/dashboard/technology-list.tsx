import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import type { Technology } from "@shared/schema";

interface TechnologyListProps {
  technologies: Technology[];
  isLoading?: boolean;
}

export default function TechnologyList({ technologies, isLoading = false }: TechnologyListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Technologies</CardTitle>
            <Skeleton className="w-16 h-6" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-24 h-2" />
                  <Skeleton className="w-8 h-4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTechnologyIcon = (name: string) => {
    const icons: Record<string, string> = {
      JavaScript: "🟨",
      Python: "🐍",
      TypeScript: "🔷",
      Java: "☕",
      "C#": "#️⃣",
      React: "⚛️",
      Vue: "💚",
      Angular: "🅰️",
      Node: "💚",
    };
    return icons[name] || "💻";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top Technologies</CardTitle>
          <Button variant="link" className="text-primary hover:text-primary/80 p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: tech.color || "#8B5CF6" }}
                >
                  <span role="img" aria-label={tech.name}>
                    {getTechnologyIcon(tech.name)}
                  </span>
                </div>
                <span className="text-foreground font-medium">{tech.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Progress 
                  value={tech.percentage || 0} 
                  className="w-24 h-2"
                />
                <span className="text-muted-foreground text-sm w-8 text-right">
                  {tech.percentage || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
