import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { getLanguageInfo } from "@/lib/language-logos";
import type { Technology } from "@shared/schema";

interface TechnologyListProps {
  technologies: Technology[];
  isLoading?: boolean;
}

export default function TechnologyList({ technologies, isLoading = false }: TechnologyListProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("top_technologies")}</CardTitle>
            <Skeleton className="w-16 h-6" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-6 h-6 rounded-lg" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-20 h-2" />
                  <Skeleton className="w-8 h-4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }



  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t("top_technologies")}</CardTitle>
          <Link href="/technologies">
            <Button variant="link" className="text-primary hover:text-primary/80 p-0 text-sm">
              {t("view_all")}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {technologies.slice(0, 10).map((tech) => {
            const langInfo = getLanguageInfo(tech.name);
            return (
              <div key={tech.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {langInfo.icon}
                  </div>
                  <span className="text-foreground font-medium text-sm">{langInfo.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress 
                    value={tech.percentage || 0} 
                    className="w-20 h-2"
                  />
                  <span className="text-muted-foreground text-xs w-8 text-right">
                    {tech.percentage || 0}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
