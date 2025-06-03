import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import Dashboard from "@/pages/dashboard";
import UserSearch from "@/pages/user-search";
import UserProfile from "@/pages/user-profile";
import UserDetails from "@/pages/user-details";
import LanguageDetails from "@/pages/language-details";
import Analytics from "@/pages/analytics";
import Trending from "@/pages/trending";
import Technologies from "@/pages/technologies";
import Top from "@/pages/users";
import Discover from "@/pages/discover";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/discover" component={Discover} />
          <Route path="/search" component={UserSearch} />
          <Route path="/user/:username" component={UserProfile} />
          <Route path="/user-details/:username" component={UserDetails} />
          <Route path="/language-details/:language" component={LanguageDetails} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/trending" component={Trending} />
          <Route path="/technologies" component={Technologies} />
          <Route path="/users" component={Top} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
