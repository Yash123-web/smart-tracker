import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, type UsersResponse, type UsersQuery } from "@shared/schema";
import { z } from "zod";

const usersQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get users with search, filter, and pagination
  app.get("/api/users", async (req, res) => {
    try {
      const query = usersQuerySchema.parse(req.query);
      
      const { users, total } = await storage.getUsers({
        search: query.search,
        status: query.status,
        role: query.role,
        page: query.page,
        pageSize: query.pageSize,
      });

      const page = query.page || 1;
      const pageSize = query.pageSize || 10;
      const totalPages = Math.ceil(total / pageSize);

      const response: UsersResponse = {
        users,
        total,
        page,
        pageSize,
        totalPages,
      };

      res.json(response);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Get single user
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const updateData = insertUserSchema.partial().parse(req.body);
      
      // Check if email already exists for another user
      if (updateData.email) {
        const existingUser = await storage.getUserByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }

      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deleted = await storage.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
