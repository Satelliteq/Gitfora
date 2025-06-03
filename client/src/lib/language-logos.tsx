export interface LanguageInfo {
  icon: string;
  color: string;
  bgColor: string;
  name: string;
}

export const getLanguageInfo = (language: string | null): LanguageInfo => {
  const languageMap: Record<string, LanguageInfo> = {
    javascript: {
      icon: "🟨",
      color: "#F7DF1E",
      bgColor: "bg-yellow-500",
      name: "JavaScript"
    },
    typescript: {
      icon: "🔷",
      color: "#3178C6",
      bgColor: "bg-blue-500",
      name: "TypeScript"
    },
    python: {
      icon: "🐍",
      color: "#3776AB",
      bgColor: "bg-blue-600",
      name: "Python"
    },
    java: {
      icon: "☕",
      color: "#ED8B00",
      bgColor: "bg-orange-500",
      name: "Java"
    },
    "c#": {
      icon: "#️⃣",
      color: "#239120",
      bgColor: "bg-green-600",
      name: "C#"
    },
    csharp: {
      icon: "#️⃣",
      color: "#239120",
      bgColor: "bg-green-600",
      name: "C#"
    },
    go: {
      icon: "🐹",
      color: "#00ADD8",
      bgColor: "bg-cyan-500",
      name: "Go"
    },
    rust: {
      icon: "🦀",
      color: "#CE422B",
      bgColor: "bg-orange-600",
      name: "Rust"
    },
    ruby: {
      icon: "💎",
      color: "#CC342D",
      bgColor: "bg-red-600",
      name: "Ruby"
    },
    php: {
      icon: "🐘",
      color: "#777BB4",
      bgColor: "bg-indigo-500",
      name: "PHP"
    },
    swift: {
      icon: "🍎",
      color: "#FA7343",
      bgColor: "bg-orange-500",
      name: "Swift"
    },
    kotlin: {
      icon: "🎯",
      color: "#7F52FF",
      bgColor: "bg-purple-600",
      name: "Kotlin"
    },
    dart: {
      icon: "🎯",
      color: "#0175C2",
      bgColor: "bg-blue-600",
      name: "Dart"
    },
    "c++": {
      icon: "⚡",
      color: "#00599C",
      bgColor: "bg-blue-700",
      name: "C++"
    },
    cpp: {
      icon: "⚡",
      color: "#00599C",
      bgColor: "bg-blue-700",
      name: "C++"
    },
    c: {
      icon: "🔧",
      color: "#A8B9CC",
      bgColor: "bg-gray-600",
      name: "C"
    },
    html: {
      icon: "🌐",
      color: "#E34F26",
      bgColor: "bg-orange-600",
      name: "HTML"
    },
    css: {
      icon: "🎨",
      color: "#1572B6",
      bgColor: "bg-blue-600",
      name: "CSS"
    },
    shell: {
      icon: "🐚",
      color: "#89E051",
      bgColor: "bg-green-500",
      name: "Shell"
    },
    bash: {
      icon: "🐚",
      color: "#89E051",
      bgColor: "bg-green-500",
      name: "Bash"
    }
  };

  const normalizedLanguage = language?.toLowerCase() || "";
  
  return languageMap[normalizedLanguage] || {
    icon: "💻",
    color: "#6B7280",
    bgColor: "bg-gray-500",
    name: language || "Unknown"
  };
};

export const getAllLanguages = (): string[] => {
  return [
    "JavaScript",
    "TypeScript", 
    "Python",
    "Java",
    "C#",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Dart",
    "C++",
    "C",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "HTML",
    "CSS",
    "Shell",
    "PowerShell"
  ];
};