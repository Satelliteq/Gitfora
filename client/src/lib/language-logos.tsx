import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiOpenjdk, 
  SiSharp, 
  SiGo, 
  SiRust, 
  SiRuby, 
  SiPhp, 
  SiSwift, 
  SiKotlin, 
  SiDart,
  SiCplusplus,
  SiC,
  SiHtml5,
  SiCss3,
  SiGnubash,
  SiPowershell,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiNodedotjs
} from "react-icons/si";

export interface LanguageInfo {
  icon: JSX.Element;
  color: string;
  bgColor: string;
  name: string;
}

export const getLanguageInfo = (language: string | null): LanguageInfo => {
  const languageMap: Record<string, LanguageInfo> = {
    javascript: {
      icon: <SiJavascript className="w-4 h-4" />,
      color: "#F7DF1E",
      bgColor: "bg-yellow-500",
      name: "JavaScript"
    },
    typescript: {
      icon: <SiTypescript className="w-4 h-4" />,
      color: "#3178C6",
      bgColor: "bg-blue-500",
      name: "TypeScript"
    },
    python: {
      icon: <SiPython className="w-4 h-4" />,
      color: "#3776AB",
      bgColor: "bg-blue-600",
      name: "Python"
    },
    java: {
      icon: <SiOpenjdk className="w-4 h-4" />,
      color: "#ED8B00",
      bgColor: "bg-orange-500",
      name: "Java"
    },
    "c#": {
      icon: <SiSharp className="w-4 h-4" />,
      color: "#239120",
      bgColor: "bg-green-600",
      name: "C#"
    },
    csharp: {
      icon: <SiSharp className="w-4 h-4" />,
      color: "#239120",
      bgColor: "bg-green-600",
      name: "C#"
    },
    go: {
      icon: <SiGo className="w-4 h-4" />,
      color: "#00ADD8",
      bgColor: "bg-cyan-500",
      name: "Go"
    },
    rust: {
      icon: <SiRust className="w-4 h-4" />,
      color: "#CE422B",
      bgColor: "bg-orange-600",
      name: "Rust"
    },
    ruby: {
      icon: <SiRuby className="w-4 h-4" />,
      color: "#CC342D",
      bgColor: "bg-red-600",
      name: "Ruby"
    },
    php: {
      icon: <SiPhp className="w-4 h-4" />,
      color: "#777BB4",
      bgColor: "bg-indigo-500",
      name: "PHP"
    },
    swift: {
      icon: <SiSwift className="w-4 h-4" />,
      color: "#FA7343",
      bgColor: "bg-orange-500",
      name: "Swift"
    },
    kotlin: {
      icon: <SiKotlin className="w-4 h-4" />,
      color: "#7F52FF",
      bgColor: "bg-purple-600",
      name: "Kotlin"
    },
    dart: {
      icon: <SiDart className="w-4 h-4" />,
      color: "#0175C2",
      bgColor: "bg-blue-600",
      name: "Dart"
    },
    "c++": {
      icon: <SiCplusplus className="w-4 h-4" />,
      color: "#00599C",
      bgColor: "bg-blue-700",
      name: "C++"
    },
    cpp: {
      icon: <SiCplusplus className="w-4 h-4" />,
      color: "#00599C",
      bgColor: "bg-blue-700",
      name: "C++"
    },
    c: {
      icon: <SiC className="w-4 h-4" />,
      color: "#A8B9CC",
      bgColor: "bg-gray-600",
      name: "C"
    },
    html: {
      icon: <SiHtml5 className="w-4 h-4" />,
      color: "#E34F26",
      bgColor: "bg-orange-600",
      name: "HTML"
    },
    css: {
      icon: <SiCss3 className="w-4 h-4" />,
      color: "#1572B6",
      bgColor: "bg-blue-600",
      name: "CSS"
    },
    shell: {
      icon: <SiGnubash className="w-4 h-4" />,
      color: "#89E051",
      bgColor: "bg-green-500",
      name: "Shell"
    },
    bash: {
      icon: <SiGnubash className="w-4 h-4" />,
      color: "#89E051",
      bgColor: "bg-green-500",
      name: "Bash"
    },
    powershell: {
      icon: <SiPowershell className="w-4 h-4" />,
      color: "#5391FE",
      bgColor: "bg-blue-500",
      name: "PowerShell"
    },
    react: {
      icon: <SiReact className="w-4 h-4" />,
      color: "#61DAFB",
      bgColor: "bg-cyan-400",
      name: "React"
    },
    vue: {
      icon: <SiVuedotjs className="w-4 h-4" />,
      color: "#4FC08D",
      bgColor: "bg-green-500",
      name: "Vue"
    },
    angular: {
      icon: <SiAngular className="w-4 h-4" />,
      color: "#DD0031",
      bgColor: "bg-red-500",
      name: "Angular"
    },
    nodejs: {
      icon: <SiNodedotjs className="w-4 h-4" />,
      color: "#339933",
      bgColor: "bg-green-600",
      name: "Node.js"
    }
  };

  const normalizedLanguage = language?.toLowerCase() || "";
  
  return languageMap[normalizedLanguage] || {
    icon: <span className="w-4 h-4 flex items-center justify-center text-xs">💻</span>,
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