import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./auth/LoginForm";
import DashboardContent from "./dashboard/DashboardContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User, Settings } from "lucide-react";

const Home = () => {
  // Authentication state - in a real app, this would be managed by an auth provider
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user data
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=john",
  };

  const handleLogin = (values: { email: string; password: string }) => {
    // Mock authentication - in a real app, this would call an API
    if (values.email && values.password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="/apex-logo.svg"
                  alt="Apex Numismatics"
                  className="h-8 w-8"
                />
                <h1 className="text-xl font-bold hidden md:block">
                  Apex Numismatics Fund
                </h1>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Button variant="ghost">Dashboard</Button>
                <Button variant="ghost">Performance</Button>
                <Button variant="ghost">Holdings</Button>
                <Button variant="ghost">Transactions</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t p-4 bg-background">
                <nav className="flex flex-col space-y-3">
                  <Button variant="ghost" className="justify-start">
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Performance
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Holdings
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Transactions
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Profile
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </nav>
              </div>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 px-2 md:px-4 lg:px-6">
            <DashboardContent />
          </main>

          {/* Footer */}
          <footer className="border-t py-4 bg-card">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Rare Coins Investment Portal. All
              rights reserved.
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <img
                  src="/apex-logo.svg"
                  alt="Apex Numismatics"
                  className="h-16 w-16"
                />
              </div>
              <h1 className="text-2xl font-bold text-center mb-6">
                Rare Coins Investment Portal
              </h1>
              <LoginForm onLogin={handleLogin} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
