import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
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
    );
  }

  return (
    <div className="space-y-3">
      {technologies.slice(0, 5).map((tech) => {
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
      {technologies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No technology data available
        </div>
      )}
    </div>
  );
}