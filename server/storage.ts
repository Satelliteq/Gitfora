import { 
  users, 
  github_users, 
  repositories, 
  technologies, 
  dashboard_metrics,
  type User, 
  type InsertUser,
  type GithubUser,
  type InsertGithubUser,
  type Repository,
  type InsertRepository,
  type Technology,
  type InsertTechnology,
  type DashboardMetric,
  type InsertDashboardMetric
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // GitHub user methods
  getGithubUser(username: string): Promise<GithubUser | undefined>;
  createOrUpdateGithubUser(user: InsertGithubUser): Promise<GithubUser>;
  getRisingUsers(limit?: number): Promise<GithubUser[]>;
  
  // Repository methods
  getTrendingRepositories(limit?: number): Promise<Repository[]>;
  createOrUpdateRepository(repo: InsertRepository): Promise<Repository>;
  
  // Technology methods
  getTopTechnologies(limit?: number): Promise<Technology[]>;
  updateTechnology(tech: InsertTechnology): Promise<Technology>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<DashboardMetric[]>;
  updateDashboardMetric(metric: InsertDashboardMetric): Promise<DashboardMetric>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private githubUsers: Map<string, GithubUser>;
  private repositories: Map<number, Repository>;
  private technologies: Map<string, Technology>;
  private dashboardMetrics: Map<string, DashboardMetric>;
  private currentUserId: number;
  private currentGithubUserId: number;
  private currentRepoId: number;
  private currentTechId: number;
  private currentMetricId: number;

  constructor() {
    this.users = new Map();
    this.githubUsers = new Map();
    this.repositories = new Map();
    this.technologies = new Map();
    this.dashboardMetrics = new Map();
    this.currentUserId = 1;
    this.currentGithubUserId = 1;
    this.currentRepoId = 1;
    this.currentTechId = 1;
    this.currentMetricId = 1;
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default dashboard metrics
    const defaultMetrics = [
      { metric_type: 'users', total: 2847102, growth_percentage: '+12.5%' },
      { metric_type: 'repositories', total: 15708931, growth_percentage: '+8.3%' },
      { metric_type: 'stars', total: 7415644, growth_percentage: '+15.7%' },
      { metric_type: 'activity', total: 10847, growth_percentage: '+23.1%' }
    ];

    defaultMetrics.forEach(metric => {
      const id = this.currentMetricId++;
      const dashboardMetric: DashboardMetric = {
        id,
        ...metric,
        updated_at: new Date()
      };
      this.dashboardMetrics.set(metric.metric_type, dashboardMetric);
    });

    // Initialize default technologies
    const defaultTechnologies = [
      { name: 'JavaScript', icon: 'fab fa-js-square', color: '#F7DF1E', percentage: 85, repos_count: 2847102 },
      { name: 'Python', icon: 'fab fa-python', color: '#3776AB', percentage: 78, repos_count: 2345891 },
      { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6', percentage: 72, repos_count: 1987543 },
      { name: 'Java', icon: 'fab fa-java', color: '#ED8B00', percentage: 65, repos_count: 1765432 },
      { name: 'C#', icon: 'fas fa-hashtag', color: '#239120', percentage: 58, repos_count: 1543210 }
    ];

    defaultTechnologies.forEach(tech => {
      const id = this.currentTechId++;
      const technology: Technology = {
        id,
        ...tech,
        updated_at: new Date()
      };
      this.technologies.set(tech.name, technology);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGithubUser(username: string): Promise<GithubUser | undefined> {
    return this.githubUsers.get(username.toLowerCase());
  }

  async createOrUpdateGithubUser(insertUser: InsertGithubUser): Promise<GithubUser> {
    const existing = await this.getGithubUser(insertUser.username);
    
    if (existing) {
      const updated: GithubUser = {
        ...existing,
        ...insertUser,
        updated_at: new Date()
      };
      this.githubUsers.set(insertUser.username.toLowerCase(), updated);
      return updated;
    } else {
      const id = this.currentGithubUserId++;
      const user: GithubUser = {
        id,
        ...insertUser,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.githubUsers.set(insertUser.username.toLowerCase(), user);
      return user;
    }
  }

  async getRisingUsers(limit: number = 10): Promise<GithubUser[]> {
    return Array.from(this.githubUsers.values())
      .sort((a, b) => (b.followers || 0) - (a.followers || 0))
      .slice(0, limit);
  }

  async getTrendingRepositories(limit: number = 10): Promise<Repository[]> {
    return Array.from(this.repositories.values())
      .sort((a, b) => (b.today_stars || 0) - (a.today_stars || 0))
      .slice(0, limit);
  }

  async createOrUpdateRepository(insertRepo: InsertRepository): Promise<Repository> {
    const existing = Array.from(this.repositories.values())
      .find(repo => repo.github_id === insertRepo.github_id);
    
    if (existing) {
      const updated: Repository = {
        ...existing,
        ...insertRepo,
        updated_at: new Date()
      };
      this.repositories.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentRepoId++;
      const repo: Repository = {
        id,
        ...insertRepo,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.repositories.set(id, repo);
      return repo;
    }
  }

  async getTopTechnologies(limit: number = 10): Promise<Technology[]> {
    return Array.from(this.technologies.values())
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
      .slice(0, limit);
  }

  async updateTechnology(insertTech: InsertTechnology): Promise<Technology> {
    const existing = this.technologies.get(insertTech.name);
    
    if (existing) {
      const updated: Technology = {
        ...existing,
        ...insertTech,
        updated_at: new Date()
      };
      this.technologies.set(insertTech.name, updated);
      return updated;
    } else {
      const id = this.currentTechId++;
      const tech: Technology = {
        id,
        ...insertTech,
        updated_at: new Date()
      };
      this.technologies.set(insertTech.name, tech);
      return tech;
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetric[]> {
    return Array.from(this.dashboardMetrics.values());
  }

  async updateDashboardMetric(insertMetric: InsertDashboardMetric): Promise<DashboardMetric> {
    const existing = this.dashboardMetrics.get(insertMetric.metric_type);
    
    if (existing) {
      const updated: DashboardMetric = {
        ...existing,
        ...insertMetric,
        updated_at: new Date()
      };
      this.dashboardMetrics.set(insertMetric.metric_type, updated);
      return updated;
    } else {
      const id = this.currentMetricId++;
      const metric: DashboardMetric = {
        id,
        ...insertMetric,
        updated_at: new Date()
      };
      this.dashboardMetrics.set(insertMetric.metric_type, metric);
      return metric;
    }
  }
}

export const storage = new MemStorage();
