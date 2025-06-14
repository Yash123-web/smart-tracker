import { useState } from "react";
import { Edit, Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@shared/schema";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: Set<number>;
  onSelectUser: (userId: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onViewUser,
  onDeleteUser,
}: UserTableProps) {
  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));
  const someSelected = users.some(user => selectedUsers.has(user.id));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800", 
      pending: "bg-amber-100 text-amber-800"
    };
    
    const dotStyles = {
      active: "bg-green-400",
      inactive: "bg-red-400",
      pending: "bg-amber-400"
    };

    return (
      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotStyles[status as keyof typeof dotStyles] || dotStyles.pending}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleStyles = {
      admin: "bg-blue-100 text-blue-800",
      user: "bg-purple-100 text-purple-800",
      moderator: "bg-amber-100 text-amber-800",
      editor: "bg-emerald-100 text-emerald-800"
    };

    return (
      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[role as keyof typeof roleStyles] || roleStyles.user}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary/10 text-primary",
      "bg-purple-100 text-purple-600",
      "bg-green-100 text-green-600",
      "bg-red-100 text-red-600",
      "bg-indigo-100 text-indigo-600",
      "bg-pink-100 text-pink-600",
      "bg-yellow-100 text-yellow-600",
      "bg-cyan-100 text-cyan-600"
    ];
    
    const index = name.length % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-slate-600">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-12 text-center">
          <div className="text-slate-400 mb-4">
            <Eye className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="px-6 py-4 w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                  aria-label="Select all users"
                />
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                User
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Login
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date Joined
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="px-6 py-4">
                  <Checkbox
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={(checked) => onSelectUser(user.id, checked as boolean)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAvatarColor(user.name)}`}>
                        <span className="font-medium text-sm">{getInitials(user.name)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-slate-500">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-slate-500">
                  {user.dateJoined}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditUser(user)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewUser(user)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteUser(user)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
