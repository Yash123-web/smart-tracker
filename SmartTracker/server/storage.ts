import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUsers(options: {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    users: User[];
    total: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleUsers: InsertUser[] = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        role: "admin",
        status: "active",
        lastLogin: "2 hours ago",
        dateJoined: "Jan 15, 2024"
      },
      {
        name: "Alice Davis",
        email: "alice.davis@example.com",
        role: "user",
        status: "active",
        lastLogin: "1 day ago",
        dateJoined: "Dec 8, 2023"
      },
      {
        name: "Mike Wilson",
        email: "mike.wilson@example.com",
        role: "moderator",
        status: "pending",
        lastLogin: "Never",
        dateJoined: "Jan 20, 2024"
      },
      {
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        role: "editor",
        status: "inactive",
        lastLogin: "3 weeks ago",
        dateJoined: "Nov 30, 2023"
      },
      {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "user",
        status: "active",
        lastLogin: "5 hours ago",
        dateJoined: "Oct 12, 2023"
      },
      {
        name: "Emily Chen",
        email: "emily.chen@example.com",
        role: "user",
        status: "active",
        lastLogin: "30 minutes ago",
        dateJoined: "Feb 3, 2024"
      },
      {
        name: "David Miller",
        email: "david.miller@example.com",
        role: "admin",
        status: "active",
        lastLogin: "1 hour ago",
        dateJoined: "Sep 15, 2023"
      },
      {
        name: "Lisa Garcia",
        email: "lisa.garcia@example.com",
        role: "editor",
        status: "inactive",
        lastLogin: "1 week ago",
        dateJoined: "Nov 22, 2023"
      },
      {
        name: "Tom Anderson",
        email: "tom.anderson@example.com",
        role: "moderator",
        status: "pending",
        lastLogin: "Never",
        dateJoined: "Feb 10, 2024"
      },
      {
        name: "Maria Rodriguez",
        email: "maria.rodriguez@example.com",
        role: "user",
        status: "active",
        lastLogin: "3 hours ago",
        dateJoined: "Jan 5, 2024"
      },
      {
        name: "Kevin Thompson",
        email: "kevin.thompson@example.com",
        role: "user",
        status: "inactive",
        lastLogin: "2 weeks ago",
        dateJoined: "Dec 1, 2023"
      },
      {
        name: "Anna White",
        email: "anna.white@example.com",
        role: "editor",
        status: "active",
        lastLogin: "6 hours ago",
        dateJoined: "Oct 28, 2023"
      }
    ];

    for (const userData of sampleUsers) {
      this.createUser(userData);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser = { ...existingUser, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getUsers(options: {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    users: User[];
    total: number;
  }> {
    let filteredUsers = Array.from(this.users.values());

    // Apply search filter
    if (options.search && options.search.trim()) {
      const searchTerm = options.search.toLowerCase().trim();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (options.status && options.status.trim()) {
      filteredUsers = filteredUsers.filter(user => user.status === options.status);
    }

    // Apply role filter
    if (options.role && options.role.trim()) {
      filteredUsers = filteredUsers.filter(user => user.role === options.role);
    }

    const total = filteredUsers.length;

    // Apply pagination
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total,
    };
  }
}

export const storage = new MemStorage();
