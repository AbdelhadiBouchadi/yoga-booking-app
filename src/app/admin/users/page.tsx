import React from "react";
import { getUsers } from "./actions";
import { Users } from "lucide-react";
import { UsersDataTable } from "@/components/admin/users/UsersDataTable";

export default async function UsersPage() {
  const data = await getUsers();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-muted-foreground">
            Manage all users in your system
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span>{data.length} total users</span>
        </div>

        <UsersDataTable data={data} />
      </div>
    </div>
  );
}
