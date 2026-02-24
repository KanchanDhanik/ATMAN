import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LogOut, Users, MessageSquare, Heart, Activity, Database, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import UserManagement from "@/components/UserManagement";
import ConversationsHistory from "@/components/ConversationsHistory";
import elderTechImage from "@/assets/elder-tech.jpg";

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversations: 0,
    totalMemories: 0,
    totalUpdates: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: conversationsCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true });

      const { count: memoriesCount } = await supabase
        .from("memories")
        .select("*", { count: "exact", head: true });

      const { count: updatesCount } = await supabase
        .from("updates")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalConversations: conversationsCount || 0,
        totalMemories: memoriesCount || 0,
        totalUpdates: updatesCount || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="border-b bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-accent/20 shadow-md">
              <img src={elderTechImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Shield className="w-7 h-7 text-accent" />
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">Welcome, {profile?.full_name}</p>
            </div>
          </div>
          <Button variant="outline" size="lg" onClick={signOut} className="text-lg">
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Total Users</p>
                  <p className="text-4xl font-bold text-primary">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground mt-1">Registered members</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Conversations</p>
                  <p className="text-4xl font-bold text-secondary-foreground">{stats.totalConversations}</p>
                  <p className="text-sm text-muted-foreground mt-1">AI interactions</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Memories</p>
                  <p className="text-4xl font-bold text-accent">{stats.totalMemories}</p>
                  <p className="text-sm text-muted-foreground mt-1">Moments saved</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Activity</p>
                  <p className="text-4xl font-bold text-primary">{stats.totalUpdates}</p>
                  <p className="text-sm text-muted-foreground mt-1">Daily updates</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="database" className="space-y-6">
          <TabsList className="h-16 p-1.5">
            <TabsTrigger value="database" className="text-lg px-8 h-12">
              <Database className="w-5 h-5" />
              Conversations Database
            </TabsTrigger>
            <TabsTrigger value="users" className="text-lg px-8 h-12">
              <Users className="w-5 h-5" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-lg px-8 h-12">
              <Settings className="w-5 h-5" />
              System Overview
            </TabsTrigger>
          </TabsList>

          {/* Database Tab */}
          <TabsContent value="database" className="animate-fade-in">
            <ConversationsHistory showAll={true} limit={200} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="animate-fade-in">
            <UserManagement />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="animate-fade-in">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Settings className="w-7 h-7 text-primary" />
                  System Status
                </CardTitle>
                <CardDescription className="text-lg">
                  Monitor the health of all platform services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-primary/5 rounded-2xl border hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xl font-bold">Platform Status</p>
                    <p className="text-lg text-muted-foreground">All systems operational</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-green-600">Online</span>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-secondary/5 rounded-2xl border hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xl font-bold">AI Service</p>
                    <p className="text-lg text-muted-foreground">Running smoothly</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-green-600">Active</span>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-accent/5 rounded-2xl border hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xl font-bold">Database</p>
                    <p className="text-lg text-muted-foreground">Connected and healthy</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-green-600">Healthy</span>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
