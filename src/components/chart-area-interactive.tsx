"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { BookingChartDataType } from "@/app/data/admin/stats";

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
  lessons: {
    label: "Lessons",
  },
  confirmed: {
    label: "Confirmed Bookings",
    color: "hsl(var(--primary))",
  },
  pending: {
    label: "Pending Bookings",
    color: "hsl(var(--secondary))",
  },
  published: {
    label: "Published Lessons",
    color: "hsl(var(--chart-3))",
  },
  draft: {
    label: "Draft Lessons",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: BookingChartDataType;
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("6m");

  const filteredData = React.useMemo(() => {
    let months = 6;
    if (timeRange === "3m") months = 3;
    if (timeRange === "1m") months = 1;
    return data.slice(-months);
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Business Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Monthly bookings and lessons statistics over time
          </span>
          <span className="@[540px]/card:hidden">Monthly statistics</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="6m">Last 6 months</ToggleGroupItem>
            <ToggleGroupItem value="3m">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="1m">Last month</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 6 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="6m" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="1m" className="rounded-lg">
                Last month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillConfirmed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPublished" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-published)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-published)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDraft" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-draft)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-draft)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 2}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              stackId="bookings"
            />
            <Area
              dataKey="confirmed"
              type="natural"
              fill="url(#fillConfirmed)"
              stroke="var(--color-confirmed)"
              stackId="bookings"
            />
            <Area
              dataKey="published"
              type="natural"
              fill="url(#fillPublished)"
              stroke="var(--color-published)"
              stackId="lessons"
            />
            <Area
              dataKey="draft"
              type="natural"
              fill="url(#fillDraft)"
              stroke="var(--color-draft)"
              stackId="lessons"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
