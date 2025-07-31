import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardStatsType } from "@/app/data/admin/stats";

interface SectionCardsProps {
  stats: DashboardStatsType;
}

export function SectionCards({ stats }: SectionCardsProps) {
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.lessons.current.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.lessons.change >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(stats.lessons.change)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.lessons.change >= 0
              ? "Growing lesson catalog"
              : "Lesson growth slowed"}{" "}
            {stats.lessons.change >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">All published lessons</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.bookings.current.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.bookings.change >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(stats.bookings.change)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.bookings.change >= 0
              ? "Growing bookings"
              : "Bookings declined"}{" "}
            {stats.bookings.change >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            All booking statuses included
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.users.current.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.users.change >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(stats.users.change)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.users.change >= 0
              ? "User growth strong"
              : "User growth slowed"}{" "}
            {stats.users.change >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Total registered active users
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(stats.growth.current)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.growth.change >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(stats.growth.change)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.growth.change >= 0
              ? "Overall growth positive"
              : "Growth needs attention"}{" "}
            {stats.growth.change >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">Combined business metrics</div>
        </CardFooter>
      </Card>
    </div>
  );
}
