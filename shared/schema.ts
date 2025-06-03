import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const github_users = pgTable("github_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  name: text("name"),
  avatar_url: text("avatar_url"),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  public_repos: integer("public_repos").default(0),
  bio: text("bio"),
  location: text("location"),
  company: text("company"),
  blog: text("blog"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  github_id: integer("github_id").notNull(),
  name: text("name").notNull(),
  full_name: text("full_name").notNull(),
  description: text("description"),
  owner: text("owner").notNull(),
  language: text("language"),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  today_stars: integer("today_stars").default(0),
  growth_percentage: text("growth_percentage"),
  url: text("url").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  percentage: integer("percentage").default(0),
  repos_count: integer("repos_count").default(0),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const dashboard_metrics = pgTable("dashboard_metrics", {
  id: serial("id").primaryKey(),
  metric_type: text("metric_type").notNull(), // 'users', 'repositories', 'stars', 'activity'
  total: integer("total").notNull(),
  growth_percentage: text("growth_percentage"),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGithubUserSchema = createInsertSchema(github_users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTechnologySchema = createInsertSchema(technologies).omit({
  id: true,
  updated_at: true,
});

export const insertDashboardMetricSchema = createInsertSchema(dashboard_metrics).omit({
  id: true,
  updated_at: true,
});

export const githubUserSearchSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GithubUser = typeof github_users.$inferSelect;
export type InsertGithubUser = z.infer<typeof insertGithubUserSchema>;
export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Technology = typeof technologies.$inferSelect;
export type InsertTechnology = z.infer<typeof insertTechnologySchema>;
export type DashboardMetric = typeof dashboard_metrics.$inferSelect;
export type InsertDashboardMetric = z.infer<typeof insertDashboardMetricSchema>;
export type GithubUserSearch = z.infer<typeof githubUserSearchSchema>;
