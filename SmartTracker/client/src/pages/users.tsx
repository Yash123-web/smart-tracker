import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserFilters } from "@/components/user-filters";
import { UserTable } from "@/components/user-table";
import { Pagination } from "@/components/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { UsersResponse, User } from "@shared/schema";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { data, isLoading, refetch } = useQuery<UsersResponse>({
    queryKey: ['/api/users', {
      search: debouncedSearchTerm,
      status: statusFilter,
      role: roleFilter,
      page: currentPage,
      pageSize: pageSize,
    }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey as [string, any];
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${url}?${searchParams.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return response.json();
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setCurrentPage(1);
    setSelectedUsers(new Set());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: number, selected: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (selected) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && data?.users) {
      const allUserIds = new Set(data.users.map(user => user.id));
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleEditUser = (user: User) => {
    console.log("Edit user:", user);
    // Implementation for edit user modal/form
  };

  const handleViewUser = (user: User) => {
    console.log("View user:", user);
    // Implementation for view user modal/details
  };

  const handleDeleteUser = (user: User) => {
    console.log("Delete user:", user);
    // Implementation for delete user confirmation
  };

  const resultsText = useMemo(() => {
    if (!data) return "Loading...";
    
    const { users, total, page, pageSize } = data;
    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, total);
    
    return `Showing ${startIndex} to ${endIndex} of ${total} users`;
  }, [data]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-600">Manage and view all users with advanced search and filtering capabilities</p>
        </div>

        {/* Controls Section */}
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          roleFilter={roleFilter}
          onRoleChange={handleRoleChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span>{resultsText}</span>
          </div>
          <div className="text-sm text-slate-500">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* User Table */}
        <UserTable
          users={data?.users || []}
          isLoading={isLoading}
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
          onDeleteUser={handleDeleteUser}
        />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            pageSize={data.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 flex items-center gap-4">
            <span className="text-sm text-slate-600">{selectedUsers.size} users selected</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Edit
              </button>
              <button className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                Delete
              </button>
              <button 
                onClick={() => setSelectedUsers(new Set())}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
