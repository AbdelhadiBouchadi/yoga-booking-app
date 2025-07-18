"use client";

import { BookingStatsType } from "@/app/data/bookings/get-bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  AlertCircle,
} from "lucide-react";

interface BookingStatsProps {
  initialStats: BookingStatsType;
}

export default function BookingStats({ initialStats }: BookingStatsProps) {
  const stats = [
    {
      title: "Total Bookings",
      value: initialStats.total,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Confirmed",
      value: initialStats.confirmed,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: initialStats.pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Cancelled",
      value: initialStats.cancelled,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Completed",
      value: initialStats.completed,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "No Show",
      value: initialStats.noShow,
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
