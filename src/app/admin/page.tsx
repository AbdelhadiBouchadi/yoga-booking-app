import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import {
  getDashboardStats,
  getBookingChartData,
  getAdminLessons,
} from "../data/admin/stats";

export default async function Page() {
  const [stats, chartData, lessons] = await Promise.all([
    getDashboardStats(),
    getBookingChartData(),
    getAdminLessons(),
  ]);

  return (
    <>
      <SectionCards stats={stats} />
      <ChartAreaInteractive data={chartData} />
      <DataTable lessons={lessons} />
    </>
  );
}
