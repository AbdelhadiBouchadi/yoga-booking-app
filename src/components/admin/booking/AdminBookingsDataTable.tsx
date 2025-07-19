"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconEye,
  IconTrash,
  IconUser,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCheck,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import {
  updateBookingStatus,
  markAttendance,
  deleteBooking,
} from "@/app/data/bookings/booking-actions";
import { BookingStatus, CancellationReason } from "@/generated/prisma";
import { tryCatch } from "@/hooks/try-catch";
import { AdminBookingType } from "@/app/data/bookings/get-bookings";

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "COMPLETED":
      return "outline";
    case "NO_SHOW":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return <IconCheck className="h-3 w-3" />;
    case "PENDING":
      return <IconClock className="h-3 w-3" />;
    case "CANCELLED":
      return <IconX className="h-3 w-3" />;
    case "COMPLETED":
      return <IconCheck className="h-3 w-3" />;
    case "NO_SHOW":
      return <IconAlertCircle className="h-3 w-3" />;
    default:
      return <IconAlertCircle className="h-3 w-3" />;
  }
};

export function AdminBookingsDataTable({
  data: initialData,
}: {
  data: AdminBookingType[];
}) {
  const router = useRouter();
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [deleteBookingId, setDeleteBookingId] = React.useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const handleViewBooking = (bookingId: string) => {
    router.push(`/admin/bookings/${bookingId}`);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    setIsDeleting(true);
    try {
      const { data: result, error } = await tryCatch(deleteBooking(bookingId));

      if (error) {
        toast.error("Failed to delete booking");
        return;
      }

      if (result.status === "success") {
        toast.success("Booking deleted successfully");
        setDeleteBookingId(null);
        setData((prev) => prev.filter((booking) => booking.id !== bookingId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error("Error deleting booking:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    try {
      const { data: result, error } = await tryCatch(
        updateBookingStatus(bookingId, {
          status: newStatus,
          ...(newStatus === BookingStatus.CANCELLED && {
            cancellationReason: CancellationReason.INSTRUCTOR_CANCELLED,
          }),
        }),
      );

      if (error) {
        toast.error("Failed to update booking status");
        return;
      }

      if (result.status === "success") {
        toast.success("Booking status updated successfully");
        setData((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status: newStatus,
                  ...(newStatus === BookingStatus.CANCELLED && {
                    cancelledAt: new Date(),
                    cancellationReason: CancellationReason.INSTRUCTOR_CANCELLED,
                  }),
                }
              : booking,
          ),
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
  };

  const handleAttendanceUpdate = async (
    bookingId: string,
    attended: boolean,
  ) => {
    try {
      const { data: result, error } = await tryCatch(
        markAttendance({ bookingIds: [bookingId], attended }),
      );

      if (error) {
        toast.error("Failed to mark attendance");
        return;
      }

      if (result.status === "success") {
        toast.success("Attendance marked successfully");
        setData((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  attendanceMarked: true,
                  attended,
                  status: attended
                    ? BookingStatus.COMPLETED
                    : BookingStatus.NO_SHOW,
                }
              : booking,
          ),
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to mark attendance");
      console.error("Error marking attendance:", error);
    }
  };

  const columns: ColumnDef<AdminBookingType>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user",
      header: "Student",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {getUserInitials(booking.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{booking.user.name}</span>
              <span className="text-muted-foreground text-sm">
                {booking.user.email}
              </span>
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "lesson",
      header: "Lesson",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{booking.lesson.titleEn}</span>
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <IconCalendar className="h-3 w-3" />
                {format(new Date(booking.lesson.startTime), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <IconClock className="h-3 w-3" />
                {format(new Date(booking.lesson.startTime), "HH:mm")}
              </div>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <IconMapPin className="h-3 w-3" />
              {booking.lesson.location}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="text-sm">
            {booking.lesson.instructor?.name || "No instructor"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const booking = row.original;
        const currentStatus = booking.status;

        return (
          <Select
            value={currentStatus}
            onValueChange={(newStatus) =>
              handleStatusUpdate(booking.id, newStatus as BookingStatus)
            }
          >
            <SelectTrigger className="hover:bg-input/30 focus-visible:bg-background h-8 w-32 border-transparent bg-transparent shadow-none focus-visible:border">
              <div className="flex items-center gap-2">
                {getStatusIcon(currentStatus)}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">
                <div className="flex items-center gap-2">
                  <IconClock className="h-3 w-3" />
                  Pending
                </div>
              </SelectItem>
              <SelectItem value="CONFIRMED">
                <div className="flex items-center gap-2">
                  <IconCheck className="h-3 w-3" />
                  Confirmed
                </div>
              </SelectItem>
              <SelectItem value="CANCELLED">
                <div className="flex items-center gap-2">
                  <IconX className="h-3 w-3" />
                  Cancelled
                </div>
              </SelectItem>
              <SelectItem value="COMPLETED">
                <div className="flex items-center gap-2">
                  <IconCheck className="h-3 w-3" />
                  Completed
                </div>
              </SelectItem>
              <SelectItem value="NO_SHOW">
                <div className="flex items-center gap-2">
                  <IconAlertCircle className="h-3 w-3" />
                  No Show
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "attendance",
      header: "Attendance",
      cell: ({ row }) => {
        const booking = row.original;
        const lessonPassed = new Date() > new Date(booking.lesson.endTime);

        if (!lessonPassed) {
          return (
            <Badge variant="outline" className="text-xs">
              Not yet
            </Badge>
          );
        }

        if (booking.attendanceMarked) {
          return (
            <Badge
              variant={booking.attended ? "default" : "destructive"}
              className="text-xs"
            >
              {booking.attended ? "Present" : "Absent"}
            </Badge>
          );
        }

        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs"
              onClick={() => handleAttendanceUpdate(booking.id, true)}
            >
              Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs"
              onClick={() => handleAttendanceUpdate(booking.id, false)}
            >
              Absent
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "bookedAt",
      header: "Booked",
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {format(new Date(row.original.bookedAt), "MMM d, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "waitingList",
      header: "Position",
      cell: ({ row }) => {
        const booking = row.original;
        if (booking.isWaitingList) {
          return (
            <Badge variant="secondary" className="text-xs">
              #{booking.position}
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-xs">
            Confirmed
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => handleViewBooking(booking.id)}
                className="cursor-pointer"
              >
                <IconEye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteBookingId(booking.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  function DraggableRow({ row }: { row: Row<AdminBookingType> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.original.id,
    });

    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search bookings..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!deleteBookingId}
        onOpenChange={() => setDeleteBookingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              booking and may affect waiting list positions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteBookingId && handleDeleteBooking(deleteBookingId)
              }
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
