import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  icon: string;
  title: string;
  value: number;
  growth: string;
  color: string;
  isLoading?: boolean;
}

export default function MetricCard({
  icon,
  title,
  value,
  growth,
  color,
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Skeleton className="w-6 h-6" />
          </div>
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-24 h-8 mb-1" />
        <Skeleton className="w-32 h-4" />
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <Card className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <span className="text-lg" role="img" aria-label={title}>
            {icon}
          </span>
        </div>
        <div className="flex items-center text-green-400 text-sm">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span>{growth}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">
        {formatNumber(value)}
      </div>
      <div className="text-muted-foreground text-sm">{title}</div>
    </Card>
  );
}
