import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { githubUserSearchSchema, insertGithubUserSchema, insertRepositorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;

  // Dashboard metrics endpoint
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  // Top technologies endpoint
  app.get("/api/technologies", async (req, res) => {
    try {
      const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 15) : 10;
      const technologies = await storage.getTopTechnologies(limit);
      res.json(technologies);
    } catch (error) {
      console.error("Error fetching technologies:", error);
      res.status(500).json({ error: "Failed to fetch technologies" });
    }
  });

  // Trending repositories endpoint
  app.get("/api/repositories/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 20) : 10;
      let repositories = await storage.getTrendingRepositories(limit);
      
      // If no repositories in storage, fetch from GitHub API
      if (repositories.length === 0 && GITHUB_TOKEN) {
        try {
          const response = await fetch("https://api.github.com/search/repositories?q=created:>2024-01-01&sort=stars&order=desc&per_page=10", {
            headers: {
              "Authorization": `Bearer ${GITHUB_TOKEN}`,
              "Accept": "application/vnd.github.v3+json",
              "User-Agent": "Gitfora-App"
            }
          });

          if (response.ok) {
            const data = await response.json();
            const repos = data.items || [];
            
            // Store repositories in our storage
            for (const repo of repos) {
              const repoData = {
                github_id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                owner: repo.owner.login,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                today_stars: Math.floor(Math.random() * 500) + 50, // Mock today's stars
                growth_percentage: `+${(Math.random() * 20 + 5).toFixed(1)}%`,
                url: repo.html_url
              };
              
              await storage.createOrUpdateRepository(repoData);
            }
            
            repositories = await storage.getTrendingRepositories(10);
          }
        } catch (githubError) {
          console.error("Error fetching from GitHub API:", githubError);
        }
      }
      
      res.json(repositories);
    } catch (error) {
      console.error("Error fetching trending repositories:", error);
      res.status(500).json({ error: "Failed to fetch trending repositories" });
    }
  });

  // Rising users endpoint
  app.get("/api/users/rising", async (req, res) => {
    try {
      const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 15) : 8;
      const users = await storage.getRisingUsers(limit);
      res.json(users);
    } catch (error) {
      console.error("Error fetching rising users:", error);
      res.status(500).json({ error: "Failed to fetch rising users" });
    }
  });

  // GitHub user search endpoint
  app.post("/api/github/search", async (req, res) => {
    try {
      const { username } = githubUserSearchSchema.parse(req.body);
      
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }

      // First check if user exists in our storage
      let user = await storage.getGithubUser(username);
      
      if (!user) {
        // Fetch from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Gitfora-App"
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            return res.status(404).json({ error: "User not found" });
          }
          throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const githubData = await response.json();
        
        const userData = {
          username: githubData.login,
          name: githubData.name,
          avatar_url: githubData.avatar_url,
          followers: githubData.followers,
          following: githubData.following,
          public_repos: githubData.public_repos,
          bio: githubData.bio,
          location: githubData.location,
          company: githubData.company,
          blog: githubData.blog
        };

        user = await storage.createOrUpdateGithubUser(userData);
      }

      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      
      console.error("Error searching GitHub user:", error);
      res.status(500).json({ error: "Failed to search user" });
    }
  });

  // GitHub user repositories endpoint
  app.get("/api/github/users/:username/repos", async (req, res) => {
    try {
      const { username } = req.params;
      
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }

      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=10`, {
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Gitfora-App"
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "User not found" });
        }
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const repos = await response.json();
      res.json(repos);
    } catch (error) {
      console.error("Error fetching user repositories:", error);
      res.status(500).json({ error: "Failed to fetch user repositories" });
    }
  });

  // Store GitHub users endpoint
  app.post("/api/github/users", async (req, res) => {
    try {
      const userData = req.body;
      
      if (!userData.username) {
        return res.status(400).json({ error: "Username is required" });
      }

      // Transform the data to match our schema
      const userToStore = {
        username: userData.username || userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog,
        followers: userData.followers,
        following: userData.following,
        public_repos: userData.public_repos,
        created_at: userData.created_at ? new Date(userData.created_at) : new Date(),
        updated_at: new Date()
      };

      const user = await storage.createOrUpdateGithubUser(userToStore);
      res.json(user);
      
    } catch (error) {
      console.error("GitHub user storage error:", error);
      res.status(500).json({ error: "Failed to store user" });
    }
  });

  // Activity data for charts (mock data for demo)
  app.get("/api/activity/weekly", async (req, res) => {
    try {
      // Mock weekly activity data
      const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Repository Activity',
            data: [2100, 2800, 3200, 2950, 3800, 3400, 4200],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
          },
          {
            label: 'User Registrations',
            data: [1800, 2200, 2700, 2400, 3100, 2900, 3600],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
          }
        ]
      };
      
      res.json(weeklyData);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      res.status(500).json({ error: "Failed to fetch activity data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
