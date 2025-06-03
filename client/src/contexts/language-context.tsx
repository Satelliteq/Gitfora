import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "tr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    discover: "Discover",
    userSearch: "User Search",
    analytics: "Analytics",
    trending: "Trending",
    technologies: "Technologies",
    topUsers: "Top Users",
    
    // Dashboard
    totalUsers: "Total Users",
    totalRepositories: "Total Repositories",
    totalStars: "Total Stars",
    totalForks: "Total Forks",
    activityChart: "Development Activity",
    trendingRepositories: "Trending Repositories",
    risingDevelopers: "Rising Developers",
    popularTechnologies: "Popular Technologies",
    
    // Discover
    exploreGitHub: "Explore GitHub",
    searchPlaceholder: "Search repositories, users, or topics...",
    repositories: "Repositories",
    developers: "Developers",
    topics: "Topics",
    allLanguages: "All Languages",
    today: "Today",
    thisWeek: "This week",
    thisMonth: "This month",
    noResultsFound: "No results found",
    tryAdjustingFilters: "Try adjusting your filters or search terms.",
    
    // User Search
    searchForUsers: "Search for GitHub Users",
    searchUsers: "Search Users",
    developerAnalytics: "Developer Analytics",
    communityReach: "Community Reach",
    repositoryActivity: "Repository Activity",
    engagementRate: "Engagement Rate",
    developerGrowth: "Developer Growth",
    popularRepositories: "Popular Repositories",
    
    // Common
    followers: "followers",
    following: "following",
    repos: "repositories",
    activity: "activity",
    stars: "stars",
    forks: "forks",
    viewOnGitHub: "View on GitHub",
    view: "View",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh",
    updatedNow: "Updated now",
    results: "results",
    language: "Language",
  },
  tr: {
    // Navigation
    dashboard: "Ana Panel",
    discover: "Keşfet",
    userSearch: "Kullanıcı Arama",
    analytics: "Analitik",
    trending: "Trend",
    technologies: "Teknolojiler",
    topUsers: "En İyi Kullanıcılar",
    
    // Dashboard
    totalUsers: "Toplam Kullanıcı",
    totalRepositories: "Toplam Depo",
    totalStars: "Toplam Yıldız",
    totalForks: "Toplam Fork",
    activityChart: "Geliştirme Aktivitesi",
    trendingRepositories: "Trend Depolar",
    risingDevelopers: "Yükselen Geliştiriciler",
    popularTechnologies: "Popüler Teknolojiler",
    
    // Discover
    exploreGitHub: "GitHub'ı Keşfet",
    searchPlaceholder: "Depo, kullanıcı veya konu ara...",
    repositories: "Depolar",
    developers: "Geliştiriciler",
    topics: "Konular",
    allLanguages: "Tüm Diller",
    today: "Bugün",
    thisWeek: "Bu hafta",
    thisMonth: "Bu ay",
    noResultsFound: "Sonuç bulunamadı",
    tryAdjustingFilters: "Filtrelerinizi veya arama terimlerinizi ayarlamayı deneyin.",
    
    // User Search
    searchForUsers: "GitHub Kullanıcıları Ara",
    searchUsers: "Kullanıcı Ara",
    developerAnalytics: "Geliştirici Analitiği",
    communityReach: "Topluluk Erişimi",
    repositoryActivity: "Depo Aktivitesi",
    engagementRate: "Katılım Oranı",
    developerGrowth: "Geliştirici Büyümesi",
    popularRepositories: "Popüler Depolar",
    
    // Common
    followers: "takipçi",
    following: "takip",
    repos: "depo",
    activity: "aktivite",
    stars: "yıldız",
    forks: "fork",
    viewOnGitHub: "GitHub'da Görüntüle",
    view: "Görüntüle",
    search: "Ara",
    filter: "Filtrele",
    refresh: "Yenile",
    updatedNow: "Şimdi güncellendi",
    results: "sonuç",
    language: "Dil",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "tr")) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const translationKeys = translations[language] as Record<string, string>;
    return translationKeys[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}