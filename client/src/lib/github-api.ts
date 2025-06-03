// GitHub API utility functions
export interface GitHubSearchParams {
  q: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'desc' | 'asc';
  per_page?: number;
  page?: number;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPI {
  private token: string | null;

  constructor(token?: string) {
    this.token = token || null;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Gitfora-App',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.fetch(`/users/${username}`);
  }

  async getUserRepos(username: string, options: { 
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubRepository[]> {
    const params = new URLSearchParams();
    
    if (options.sort) params.append('sort', options.sort);
    if (options.direction) params.append('direction', options.direction);
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());

    const queryString = params.toString();
    const endpoint = `/users/${username}/repos${queryString ? `?${queryString}` : ''}`;
    
    return this.fetch(endpoint);
  }

  async searchRepositories(params: GitHubSearchParams) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.q);
    
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.order) searchParams.append('order', params.order);
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.page) searchParams.append('page', params.page.toString());

    return this.fetch(`/search/repositories?${searchParams.toString()}`);
  }

  async getTrendingRepositories(language?: string, since: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const date = new Date();
    const daysAgo = since === 'daily' ? 1 : since === 'weekly' ? 7 : 30;
    date.setDate(date.getDate() - daysAgo);
    
    let query = `created:>${date.toISOString().split('T')[0]}`;
    if (language) {
      query += `+language:${language}`;
    }

    return this.searchRepositories({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
    });
  }

  async searchUsers(params: {
    q: string;
    sort?: 'followers' | 'repositories' | 'joined';
    order?: 'desc' | 'asc';
    per_page?: number;
    page?: number;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.q);
    
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.order) searchParams.append('order', params.order);
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.page) searchParams.append('page', params.page.toString());

    return this.fetch(`/search/users?${searchParams.toString()}`);
  }
}

// Create a default instance
export const githubAPI = new GitHubAPI();
