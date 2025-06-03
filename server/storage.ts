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

    // Initialize comprehensive technologies including languages, frameworks, databases
    const defaultTechnologies = [
      // Programming Languages
      { name: 'JavaScript', icon: 'fab fa-js-square', color: '#F7DF1E', percentage: 85, repos_count: 2847102 },
      { name: 'Python', icon: 'fab fa-python', color: '#3776AB', percentage: 78, repos_count: 2345891 },
      { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6', percentage: 72, repos_count: 1987543 },
      { name: 'Java', icon: 'fab fa-java', color: '#ED8B00', percentage: 65, repos_count: 1765432 },
      { name: 'C#', icon: 'fas fa-hashtag', color: '#239120', percentage: 58, repos_count: 1543210 },
      { name: 'Go', icon: 'fas fa-bolt', color: '#00ADD8', percentage: 45, repos_count: 987654 },
      { name: 'Rust', icon: 'fas fa-gear', color: '#000000', percentage: 38, repos_count: 765432 },
      { name: 'Ruby', icon: 'fab fa-ruby', color: '#CC342D', percentage: 42, repos_count: 654321 },
      { name: 'PHP', icon: 'fab fa-php', color: '#777BB4', percentage: 55, repos_count: 1234567 },
      { name: 'C++', icon: 'fas fa-code', color: '#00599C', percentage: 35, repos_count: 543210 },
      { name: 'C', icon: 'fas fa-code', color: '#A8B9CC', percentage: 32, repos_count: 432109 },
      { name: 'Swift', icon: 'fab fa-swift', color: '#FA7343', percentage: 28, repos_count: 321098 },
      { name: 'Kotlin', icon: 'fas fa-mobile-alt', color: '#0095D5', percentage: 31, repos_count: 398765 },
      { name: 'Dart', icon: 'fas fa-dart-board', color: '#0175C2', percentage: 25, repos_count: 287654 },
      
      // Frontend Frameworks
      { name: 'React', icon: 'fab fa-react', color: '#61DAFB', percentage: 67, repos_count: 1876543 },
      { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#4FC08D', percentage: 54, repos_count: 1345678 },
      { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031', percentage: 48, repos_count: 1098765 },
      { name: 'Svelte', icon: 'fas fa-fire', color: '#FF3E00', percentage: 22, repos_count: 234567 },
      { name: 'Next.js', icon: 'fas fa-forward', color: '#000000', percentage: 43, repos_count: 876543 },
      { name: 'Nuxt.js', icon: 'fas fa-mountain', color: '#00DC82', percentage: 18, repos_count: 198765 },
      { name: 'Gatsby', icon: 'fas fa-rocket', color: '#663399', percentage: 15, repos_count: 165432 },
      
      // Backend Frameworks
      { name: 'Express.js', icon: 'fas fa-server', color: '#000000', percentage: 52, repos_count: 1123456 },
      { name: 'Django', icon: 'fas fa-python', color: '#092E20', percentage: 41, repos_count: 876543 },
      { name: 'Flask', icon: 'fas fa-flask', color: '#000000', percentage: 35, repos_count: 654321 },
      { name: 'Spring Boot', icon: 'fas fa-leaf', color: '#6DB33F', percentage: 39, repos_count: 798765 },
      { name: 'Laravel', icon: 'fab fa-laravel', color: '#FF2D20', percentage: 33, repos_count: 567890 },
      { name: 'Ruby on Rails', icon: 'fab fa-ruby', color: '#CC0000', percentage: 28, repos_count: 456789 },
      { name: 'ASP.NET Core', icon: 'fas fa-microsoft', color: '#512BD4', percentage: 26, repos_count: 398765 },
      { name: 'FastAPI', icon: 'fas fa-lightning', color: '#009688', percentage: 21, repos_count: 287654 },
      
      // Databases
      { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791', percentage: 44, repos_count: 987654 },
      { name: 'MySQL', icon: 'fas fa-database', color: '#4479A1', percentage: 48, repos_count: 1098765 },
      { name: 'MongoDB', icon: 'fas fa-leaf', color: '#47A248', percentage: 38, repos_count: 765432 },
      { name: 'Redis', icon: 'fas fa-memory', color: '#DC382D', percentage: 32, repos_count: 543210 },
      { name: 'SQLite', icon: 'fas fa-database', color: '#003B57', percentage: 29, repos_count: 432109 },
      { name: 'MariaDB', icon: 'fas fa-database', color: '#003545', percentage: 18, repos_count: 234567 },
      { name: 'Elasticsearch', icon: 'fas fa-search', color: '#005571', percentage: 15, repos_count: 187654 },
      { name: 'CouchDB', icon: 'fas fa-couch', color: '#E42528', percentage: 8, repos_count: 98765 },
      
      // Mobile Development
      { name: 'React Native', icon: 'fab fa-react', color: '#61DAFB', percentage: 34, repos_count: 654321 },
      { name: 'Flutter', icon: 'fas fa-mobile', color: '#02569B', percentage: 28, repos_count: 456789 },
      { name: 'Ionic', icon: 'fas fa-mobile-alt', color: '#3880FF', percentage: 19, repos_count: 234567 },
      { name: 'Xamarin', icon: 'fas fa-mobile', color: '#3498DB', percentage: 12, repos_count: 156789 },
      
      // DevOps & Cloud
      { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED', percentage: 56, repos_count: 1234567 },
      { name: 'Kubernetes', icon: 'fas fa-ship', color: '#326CE5', percentage: 42, repos_count: 876543 },
      { name: 'AWS', icon: 'fab fa-aws', color: '#FF9900', percentage: 38, repos_count: 765432 },
      { name: 'Azure', icon: 'fab fa-microsoft', color: '#0078D4', percentage: 29, repos_count: 456789 },
      { name: 'Google Cloud', icon: 'fab fa-google', color: '#4285F4', percentage: 24, repos_count: 345678 },
      { name: 'Terraform', icon: 'fas fa-layer-group', color: '#623CE4', percentage: 18, repos_count: 234567 },
      
      // AI/ML Libraries
      { name: 'TensorFlow', icon: 'fas fa-brain', color: '#FF6F00', percentage: 36, repos_count: 687654 },
      { name: 'PyTorch', icon: 'fas fa-fire', color: '#EE4C2C', percentage: 31, repos_count: 567890 },
      { name: 'scikit-learn', icon: 'fas fa-chart-line', color: '#F7931E', percentage: 28, repos_count: 456789 },
      { name: 'Pandas', icon: 'fas fa-table', color: '#150458', percentage: 33, repos_count: 598765 },
      { name: 'NumPy', icon: 'fas fa-calculator', color: '#013243', percentage: 35, repos_count: 634567 }
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

    // Initialize comprehensive GitHub users data
    const sampleUsers = [
      { username: 'torvalds', name: 'Linus Torvalds', avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4', followers: 180000, following: 0, public_repos: 6, bio: 'Creator of Linux and Git', location: 'Portland, OR', company: 'Linux Foundation', blog: null },
      { username: 'gaearon', name: 'Dan Abramov', avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4', followers: 95000, following: 171, public_repos: 72, bio: 'Working on @reactjs. Co-author of Redux and Create React App.', location: 'London, UK', company: '@facebook', blog: 'https://overreacted.io' },
      { username: 'addyosmani', name: 'Addy Osmani', avatar_url: 'https://avatars.githubusercontent.com/u/110953?v=4', followers: 42000, following: 1705, public_repos: 115, bio: 'Engineering Manager @ Google working on Chrome', location: 'Mountain View, CA', company: 'Google', blog: 'https://addyosmani.com' },
      { username: 'sindresorhus', name: 'Sindre Sorhus', avatar_url: 'https://avatars.githubusercontent.com/u/170270?v=4', followers: 38000, following: 45, public_repos: 1200, bio: 'Open source maintainer, Node.js expert', location: 'Oslo, Norway', company: null, blog: 'https://sindresorhus.com' },
      { username: 'tj', name: 'TJ Holowaychuk', avatar_url: 'https://avatars.githubusercontent.com/u/25254?v=4', followers: 35000, following: 12, public_repos: 280, bio: 'Creator of Express.js and many other tools', location: 'Victoria, BC', company: null, blog: 'https://tjholowaychuk.com' },
      { username: 'yyx990803', name: 'Evan You', avatar_url: 'https://avatars.githubusercontent.com/u/499550?v=4', followers: 48000, following: 15, public_repos: 95, bio: 'Creator of Vue.js', location: 'Singapore', company: 'Independent', blog: 'https://evanyou.me' },
      { username: 'jashkenas', name: 'Jeremy Ashkenas', avatar_url: 'https://avatars.githubusercontent.com/u/4732?v=4', followers: 25000, following: 120, public_repos: 85, bio: 'Creator of Backbone.js, Underscore.js, CoffeeScript', location: 'New York, NY', company: 'The New York Times', blog: null },
      { username: 'defunkt', name: 'Chris Wanstrath', avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4', followers: 21000, following: 208, public_repos: 107, bio: 'Co-founder of GitHub', location: 'San Francisco, CA', company: 'GitHub', blog: 'https://chriswanstrath.com' },
      { username: 'mdo', name: 'Mark Otto', avatar_url: 'https://avatars.githubusercontent.com/u/98681?v=4', followers: 28000, following: 168, public_repos: 90, bio: 'Creator of Bootstrap', location: 'San Francisco, CA', company: 'GitHub', blog: 'https://markdotto.com' },
      { username: 'fat', name: 'Jacob Thornton', avatar_url: 'https://avatars.githubusercontent.com/u/169705?v=4', followers: 15000, following: 95, public_repos: 45, bio: 'Co-creator of Bootstrap', location: 'San Francisco, CA', company: 'Medium', blog: null },
      { username: 'mikeal', name: 'Mikeal Rogers', avatar_url: 'https://avatars.githubusercontent.com/u/579?v=4', followers: 12000, following: 312, public_repos: 156, bio: 'Open source advocate, creator of request module', location: 'San Francisco, CA', company: 'Protocol Labs', blog: 'https://mikealrogers.com' },
      { username: 'jeresig', name: 'John Resig', avatar_url: 'https://avatars.githubusercontent.com/u/761?v=4', followers: 32000, following: 89, public_repos: 67, bio: 'Creator of jQuery', location: 'Brooklyn, NY', company: 'Khan Academy', blog: 'https://johnresig.com' },
      { username: 'schacon', name: 'Scott Chacon', avatar_url: 'https://avatars.githubusercontent.com/u/70?v=4', followers: 18000, following: 145, public_repos: 234, bio: 'Co-founder of GitHub, Git expert', location: 'San Francisco, CA', company: 'GitHub', blog: 'https://scottchacon.com' },
      { username: 'dhh', name: 'David Heinemeier Hansson', avatar_url: 'https://avatars.githubusercontent.com/u/2741?v=4', followers: 45000, following: 0, public_repos: 78, bio: 'Creator of Ruby on Rails', location: 'Chicago, IL', company: 'Basecamp', blog: 'https://dhh.dk' },
      { username: 'taylorotwell', name: 'Taylor Otwell', avatar_url: 'https://avatars.githubusercontent.com/u/463230?v=4', followers: 24000, following: 0, public_repos: 89, bio: 'Creator of Laravel', location: 'Little Rock, AR', company: 'Laravel', blog: 'https://taylorotwell.com' },
      { username: 'mxstbr', name: 'Max Stoiber', avatar_url: 'https://avatars.githubusercontent.com/u/7525670?v=4', followers: 16000, following: 234, public_repos: 145, bio: 'Creator of styled-components', location: 'Vienna, Austria', company: 'Gatsby', blog: 'https://mxstbr.com' },
      { username: 'wesbos', name: 'Wes Bos', avatar_url: 'https://avatars.githubusercontent.com/u/176013?v=4', followers: 22000, following: 45, public_repos: 156, bio: 'Full Stack Developer & Teacher', location: 'Hamilton, ON', company: 'Independent', blog: 'https://wesbos.com' },
      { username: 'kentcdodds', name: 'Kent C. Dodds', avatar_url: 'https://avatars.githubusercontent.com/u/1500684?v=4', followers: 19000, following: 78, public_repos: 234, bio: 'JavaScript and React expert, educator', location: 'Utah, USA', company: 'Independent', blog: 'https://kentcdodds.com' },
      { username: 'getify', name: 'Kyle Simpson', avatar_url: 'https://avatars.githubusercontent.com/u/150330?v=4', followers: 17000, following: 23, public_repos: 123, bio: 'Author of You Dont Know JS', location: 'Austin, TX', company: 'Independent', blog: 'https://me.getify.com' },
      { username: 'paulirish', name: 'Paul Irish', avatar_url: 'https://avatars.githubusercontent.com/u/39191?v=4', followers: 26000, following: 312, public_repos: 189, bio: 'Developer advocate at Google Chrome', location: 'Mountain View, CA', company: 'Google', blog: 'https://paulirish.com' },
      { username: 'feross', name: 'Feross Aboukhadijeh', avatar_url: 'https://avatars.githubusercontent.com/u/121766?v=4', followers: 14000, following: 89, public_repos: 267, bio: 'Creator of WebTorrent, StandardJS', location: 'Palo Alto, CA', company: 'Independent', blog: 'https://feross.org' },
      { username: 'Rich-Harris', name: 'Rich Harris', avatar_url: 'https://avatars.githubusercontent.com/u/1162160?v=4', followers: 20000, following: 156, public_repos: 178, bio: 'Creator of Svelte and Rollup', location: 'New York, NY', company: 'The New York Times', blog: 'https://rich-harris.dev' },
      { username: 'ryanflorence', name: 'Ryan Florence', avatar_url: 'https://avatars.githubusercontent.com/u/100200?v=4', followers: 15000, following: 234, public_repos: 145, bio: 'Co-creator of React Router and Reach UI', location: 'Salt Lake City, UT', company: 'React Training', blog: 'https://ryanflorence.com' },
      { username: 'bradtraversy', name: 'Brad Traversy', avatar_url: 'https://avatars.githubusercontent.com/u/5550850?v=4', followers: 13000, following: 67, public_repos: 289, bio: 'Web developer and educator', location: 'Massachusetts, USA', company: 'Traversy Media', blog: 'https://traversymedia.com' },
      { username: 'mpj', name: 'Mattias Petter Johansson', avatar_url: 'https://avatars.githubusercontent.com/u/994739?v=4', followers: 11000, following: 123, public_repos: 134, bio: 'Creator of Fun Fun Function', location: 'Stockholm, Sweden', company: 'Independent', blog: 'https://youtube.com/funfunfunction' },
      { username: 'ThePrimeagen', name: 'Michael Paulson', avatar_url: 'https://avatars.githubusercontent.com/u/4458174?v=4', followers: 25000, following: 45, public_repos: 167, bio: 'Software engineer and content creator', location: 'Utah, USA', company: 'Netflix', blog: 'https://theprimeagen.tv' },
      { username: 'jakearchibald', name: 'Jake Archibald', avatar_url: 'https://avatars.githubusercontent.com/u/93594?v=4', followers: 18000, following: 234, public_repos: 123, bio: 'Developer advocate at Google Chrome', location: 'Brighton, UK', company: 'Google', blog: 'https://jakearchibald.com' },
      { username: 'BrendanEich', name: 'Brendan Eich', avatar_url: 'https://avatars.githubusercontent.com/u/10565?v=4', followers: 52000, following: 12, public_repos: 34, bio: 'Creator of JavaScript', location: 'Palo Alto, CA', company: 'Brave Software', blog: 'https://brendaneich.com' },
      { username: 'substack', name: 'James Halliday', avatar_url: 'https://avatars.githubusercontent.com/u/12631?v=4', followers: 16000, following: 189, public_repos: 567, bio: 'Node.js modules creator', location: 'Oakland, CA', company: 'Independent', blog: 'https://substack.net' },
      { username: 'remy', name: 'Remy Sharp', avatar_url: 'https://avatars.githubusercontent.com/u/13700?v=4', followers: 12000, following: 256, public_repos: 234, bio: 'Creator of JSBin, web developer', location: 'Brighton, UK', company: 'Left Logic', blog: 'https://remysharp.com' }
    ];

    sampleUsers.forEach(user => {
      const id = this.currentGithubUserId++;
      const githubUser: GithubUser = {
        id,
        username: user.username,
        name: user.name || null,
        avatar_url: user.avatar_url || null,
        followers: user.followers || null,
        following: user.following || null,
        public_repos: user.public_repos || null,
        bio: user.bio || null,
        location: user.location || null,
        company: user.company || null,
        blog: user.blog || null,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.githubUsers.set(user.username.toLowerCase(), githubUser);
    });

    // Initialize comprehensive repositories data
    const sampleRepositories = [
      { github_id: 908531752, name: 'next.js', full_name: 'vercel/next.js', description: 'The React Framework for Production', language: 'JavaScript', stars: 125000, forks: 28000, today_stars: 142, owner: 'vercel' },
      { github_id: 10270250, name: 'react', full_name: 'facebook/react', description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.', language: 'JavaScript', stars: 228000, forks: 46500, today_stars: 95, owner: 'facebook' },
      { github_id: 11730342, name: 'vue', full_name: 'vuejs/vue', description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.', language: 'TypeScript', stars: 207000, forks: 33700, today_stars: 78, owner: 'vuejs' },
      { github_id: 83222441, name: 'angular', full_name: 'angular/angular', description: 'Deliver web apps with confidence', language: 'TypeScript', stars: 95800, forks: 25200, today_stars: 62, owner: 'angular' },
      { github_id: 165262382, name: 'svelte', full_name: 'sveltejs/svelte', description: 'Cybernetically enhanced web apps', language: 'TypeScript', stars: 78600, forks: 4100, today_stars: 89, owner: 'sveltejs' },
      { github_id: 27193779, name: 'tensorflow', full_name: 'tensorflow/tensorflow', description: 'An Open Source Machine Learning Framework for Everyone', language: 'Python', stars: 185000, forks: 74100, today_stars: 156, owner: 'tensorflow' },
      { github_id: 65600975, name: 'pytorch', full_name: 'pytorch/pytorch', description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration', language: 'Python', stars: 81900, forks: 22000, today_stars: 134, owner: 'pytorch' },
      { github_id: 44838949, name: 'kubernetes', full_name: 'kubernetes/kubernetes', description: 'Production-Grade Container Scheduling and Management', language: 'Go', stars: 109000, forks: 39200, today_stars: 98, owner: 'kubernetes' },
      { github_id: 13491895, name: 'docker', full_name: 'moby/moby', description: 'Moby Project - a collaborative project for the container ecosystem', language: 'Go', stars: 68400, forks: 18700, today_stars: 67, owner: 'moby' },
      { github_id: 8514, name: 'rails', full_name: 'rails/rails', description: 'Ruby on Rails', language: 'Ruby', stars: 55900, forks: 21500, today_stars: 45, owner: 'rails' },
      { github_id: 458058, name: 'bootstrap', full_name: 'twbs/bootstrap', description: 'The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.', language: 'JavaScript', stars: 170000, forks: 78500, today_stars: 123, owner: 'twbs' },
      { github_id: 16563587, name: 'express', full_name: 'expressjs/express', description: 'Fast, unopinionated, minimalist web framework for node.', language: 'JavaScript', stars: 65000, forks: 15800, today_stars: 87, owner: 'expressjs' },
      { github_id: 49609581, name: 'laravel', full_name: 'laravel/laravel', description: 'Laravel is a web application framework with expressive, elegant syntax.', language: 'PHP', stars: 78100, forks: 24000, today_stars: 76, owner: 'laravel' },
      { github_id: 24832401, name: 'django', full_name: 'django/django', description: 'The Web framework for perfectionists with deadlines.', language: 'Python', stars: 79000, forks: 31500, today_stars: 112, owner: 'django' },
      { github_id: 1863329, name: 'spring-boot', full_name: 'spring-projects/spring-boot', description: 'Spring Boot', language: 'Java', stars: 74600, forks: 40700, today_stars: 89, owner: 'spring-projects' },
      { github_id: 3544490, name: '.NET', full_name: 'dotnet/core', description: '.NET is a cross-platform runtime for cloud, mobile, desktop, and IoT apps.', language: 'C#', stars: 21000, forks: 4900, today_stars: 65, owner: 'dotnet' },
      { github_id: 896335270, name: 'rust', full_name: 'rust-lang/rust', description: 'Empowering everyone to build reliable and efficient software.', language: 'Rust', stars: 96800, forks: 12500, today_stars: 178, owner: 'rust-lang' },
      { github_id: 31792824, name: 'go', full_name: 'golang/go', description: 'The Go programming language', language: 'Go', stars: 123000, forks: 17500, today_stars: 145, owner: 'golang' },
      { github_id: 5470, name: 'jquery', full_name: 'jquery/jquery', description: 'jQuery JavaScript Library', language: 'JavaScript', stars: 59100, forks: 20600, today_stars: 34, owner: 'jquery' },
      { github_id: 943149, name: 'lodash', full_name: 'lodash/lodash', description: 'A modern JavaScript utility library delivering modularity, performance, & extras.', language: 'JavaScript', stars: 59700, forks: 7000, today_stars: 42, owner: 'lodash' },
      { github_id: 2126244, name: 'moment', full_name: 'moment/moment', description: 'Parse, validate, manipulate, and display dates in javascript.', language: 'JavaScript', stars: 47900, forks: 7200, today_stars: 28, owner: 'moment' },
      { github_id: 588, name: 'redux', full_name: 'reduxjs/redux', description: 'Predictable state container for JavaScript apps', language: 'TypeScript', stars: 60600, forks: 15500, today_stars: 56, owner: 'reduxjs' },
      { github_id: 63537259, name: 'tailwindcss', full_name: 'tailwindlabs/tailwindcss', description: 'A utility-first CSS framework for rapid UI development.', language: 'JavaScript', stars: 81900, forks: 4100, today_stars: 167, owner: 'tailwindlabs' },
      { github_id: 18133, name: 'webpack', full_name: 'webpack/webpack', description: 'A bundler for javascript and friends.', language: 'JavaScript', stars: 64500, forks: 8800, today_stars: 78, owner: 'webpack' },
      { github_id: 65625612, name: 'vite', full_name: 'vitejs/vite', description: 'Next generation frontend tooling. It is fast!', language: 'TypeScript', stars: 67600, forks: 6100, today_stars: 189, owner: 'vitejs' },
      { github_id: 209599, name: 'homebrew-core', full_name: 'Homebrew/homebrew-core', description: 'Default formulae for the missing package manager for macOS (or Linux)', language: 'Ruby', stars: 13600, forks: 12300, today_stars: 23, owner: 'Homebrew' },
      { github_id: 18159, name: 'atom', full_name: 'atom/atom', description: 'The hackable text editor', language: 'JavaScript', stars: 60100, forks: 17400, today_stars: 12, owner: 'atom' },
      { github_id: 41881900, name: 'vscode', full_name: 'microsoft/vscode', description: 'Visual Studio Code', language: 'TypeScript', stars: 163000, forks: 28900, today_stars: 245, owner: 'microsoft' },
      { github_id: 27804, name: 'linux', full_name: 'torvalds/linux', description: 'Linux kernel source tree', language: 'C', stars: 179000, forks: 53400, today_stars: 289, owner: 'torvalds' },
      { github_id: 2325298, name: 'git', full_name: 'git/git', description: 'Git Source Code Mirror', language: 'C', stars: 52000, forks: 25400, today_stars: 67, owner: 'git' },
      { github_id: 83844720, name: 'deno', full_name: 'denoland/deno', description: 'A modern runtime for JavaScript and TypeScript.', language: 'Rust', stars: 94800, forks: 5200, today_stars: 123, owner: 'denoland' },
      { github_id: 23096959, name: 'electron', full_name: 'electron/electron', description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS', language: 'C++', stars: 113000, forks: 15200, today_stars: 89, owner: 'electron' },
      { github_id: 50130219, name: 'flutter', full_name: 'flutter/flutter', description: 'Flutter makes it easy and fast to build beautiful apps for mobile and beyond', language: 'Dart', stars: 165000, forks: 27200, today_stars: 198, owner: 'flutter' },
      { github_id: 44409029, name: 'react-native', full_name: 'facebook/react-native', description: 'A framework for building native applications using React', language: 'C++', stars: 118000, forks: 24200, today_stars: 134, owner: 'facebook' },
      { github_id: 32553920, name: 'ionic-framework', full_name: 'ionic-team/ionic-framework', description: 'A powerful cross-platform UI toolkit for building native-quality iOS, Android, and Progressive Web Apps with HTML, CSS, and JavaScript.', language: 'TypeScript', stars: 51000, forks: 13600, today_stars: 45, owner: 'ionic-team' },
      { github_id: 16563, name: 'node', full_name: 'nodejs/node', description: 'Node.js JavaScript runtime', language: 'JavaScript', stars: 106000, forks: 29000, today_stars: 156, owner: 'nodejs' },
      { github_id: 3687540, name: 'yarn', full_name: 'yarnpkg/yarn', description: 'The 1.x line is frozen - features and bugfixes now happen on https://github.com/yarnpkg/berry', language: 'JavaScript', stars: 41500, forks: 2800, today_stars: 23, owner: 'yarnpkg' },
      { github_id: 19816070, name: 'npm', full_name: 'npm/cli', description: 'the package manager for JavaScript', language: 'JavaScript', stars: 8400, forks: 3100, today_stars: 34, owner: 'npm' },
      { github_id: 3687540, name: 'babel', full_name: 'babel/babel', description: 'Babel is a compiler for writing next generation JavaScript.', language: 'TypeScript', stars: 43200, forks: 5600, today_stars: 67, owner: 'babel' },
      { github_id: 4687843, name: 'eslint', full_name: 'eslint/eslint', description: 'Find and fix problems in your JavaScript code.', language: 'JavaScript', stars: 24900, forks: 4500, today_stars: 45, owner: 'eslint' },
      { github_id: 68672648, name: 'prettier', full_name: 'prettier/prettier', description: 'Prettier is an opinionated code formatter.', language: 'JavaScript', stars: 49200, forks: 4300, today_stars: 78, owner: 'prettier' },
      { github_id: 123456789, name: 'mongodb', full_name: 'mongodb/mongo', description: 'The MongoDB Database', language: 'C++', stars: 26100, forks: 5700, today_stars: 89, owner: 'mongodb' },
      { github_id: 234567890, name: 'postgres', full_name: 'postgres/postgres', description: 'Mirror of the official PostgreSQL GIT repository.', language: 'C', stars: 15800, forks: 4600, today_stars: 67, owner: 'postgres' },
      { github_id: 345678901, name: 'redis', full_name: 'redis/redis', description: 'Redis is an in-memory database that persists on disk.', language: 'C', stars: 66100, forks: 23800, today_stars: 123, owner: 'redis' },
      { github_id: 456789012, name: 'mysql-server', full_name: 'mysql/mysql-server', description: 'MySQL Server, the worlds most popular open source database.', language: 'C++', stars: 10900, forks: 2100, today_stars: 45, owner: 'mysql' },
      { github_id: 567890123, name: 'graphql', full_name: 'graphql/graphql-js', description: 'A reference implementation of GraphQL for JavaScript', language: 'JavaScript', stars: 20100, forks: 2000, today_stars: 56, owner: 'graphql' },
      { github_id: 678901234, name: 'apollo-server', full_name: 'apollographql/apollo-server', description: 'GraphQL server for Express, Connect, Hapi, Koa and more', language: 'TypeScript', stars: 13800, forks: 2000, today_stars: 34, owner: 'apollographql' },
      { github_id: 789012345, name: 'prisma', full_name: 'prisma/prisma', description: 'Next-generation ORM for Node.js & TypeScript | PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, MongoDB and CockroachDB', language: 'TypeScript', stars: 39200, forks: 1500, today_stars: 167, owner: 'prisma' },
      { github_id: 890123456, name: 'strapi', full_name: 'strapi/strapi', description: 'The leading open-source headless CMS.', language: 'JavaScript', stars: 63000, forks: 7900, today_stars: 134, owner: 'strapi' },
      { github_id: 901234567, name: 'firebase-tools', full_name: 'firebase/firebase-tools', description: 'The Firebase Command Line Tools', language: 'TypeScript', stars: 4000, forks: 930, today_stars: 23, owner: 'firebase' },
      { github_id: 912345678, name: 'supabase', full_name: 'supabase/supabase', description: 'The open source Firebase alternative.', language: 'TypeScript', stars: 71400, forks: 6900, today_stars: 234, owner: 'supabase' }
    ];

    sampleRepositories.forEach(repo => {
      const id = this.currentRepoId++;
      const repository: Repository = {
        id,
        github_id: repo.github_id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || null,
        language: repo.language || null,
        stars: repo.stars,
        forks: repo.forks,
        today_stars: repo.today_stars,
        owner: repo.owner,
        url: `https://github.com/${repo.full_name}`,
        growth_percentage: `+${((repo.today_stars / repo.stars) * 100).toFixed(1)}%`,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.repositories.set(id, repository);
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
