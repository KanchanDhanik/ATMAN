import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LogOut, Search, Heart, Clock, TrendingUp, MessageSquare, Database, BookOpen, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ConversationsHistory from "@/components/ConversationsHistory";
import elderTechImage from "@/assets/elder-tech.jpg";
const FamilyDashboard = () => {
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalMemories: 0, totalConversations: 0, recentActivity: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMemoriesAndUpdates = async () => {
      const { data: memoriesData } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: updatesData } = await supabase
        .from("updates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const { count: memoriesCount } = await supabase
        .from("memories")
        .select("*", { count: "exact", head: true });

      const { count: conversationsCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true });

      setMemories(memoriesData || []);
      setUpdates(updatesData || []);
      setStats({
        totalMemories: memoriesCount || 0,
        totalConversations: conversationsCount || 0,
        recentActivity: (updatesData?.length || 0) + (memoriesData?.length || 0),
      });
    };

    fetchMemoriesAndUpdates();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .or(`question.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false });

      setSearchResults(data || []);
      
      if (!data || data.length === 0) {
        toast.info("No wisdom found for this query. Try different keywords.");
      }
    } catch (error: any) {
      toast.error("Failed to search wisdom");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="border-b bg-card/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
              <img src={elderTechImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Users className="w-7 h-7 text-primary" />
                Family Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">Welcome back, {profile?.full_name}</p>
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
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Total Memories</p>
                  <p className="text-4xl font-bold text-primary">{stats.totalMemories}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
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
                </div>
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Recent Activity</p>
                  <p className="text-4xl font-bold text-accent">{stats.recentActivity}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-accent" />
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
            <TabsTrigger value="memories" className="text-lg px-8 h-12">
              <BookOpen className="w-5 h-5" />
              Memories
            </TabsTrigger>
            <TabsTrigger value="updates" className="text-lg px-8 h-12">
              <Clock className="w-5 h-5" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Database Tab - Full Conversations History */}
          <TabsContent value="database" className="animate-fade-in">
            <ConversationsHistory showAll={true} limit={100} />
          </TabsContent>

          {/* Memories Tab */}
          <TabsContent value="memories" className="animate-fade-in">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Heart className="w-7 h-7 text-primary" />
                  Elder Memories
                </CardTitle>
                <CardDescription className="text-lg">
                  Precious memories and stories shared by your elders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {memories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No memories saved yet</p>
                    <p className="text-base mt-2">Memories will appear here as elders share them</p>
                  </div>
                ) : (
                  memories.map((memory) => (
                    <Card key={memory.id} className="border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-xl font-bold">{memory.title}</h4>
                          <Badge variant="secondary">
                            {new Date(memory.created_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">{memory.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="animate-fade-in">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="w-7 h-7 text-secondary-foreground" />
                  Activity Log
                </CardTitle>
                <CardDescription className="text-lg">
                  Recent activities and updates from your elders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {updates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No updates yet</p>
                    <p className="text-base mt-2">Activity updates will appear here</p>
                  </div>
                ) : (
                  updates.map((update) => (
                    <Card key={update.id} className="border-l-4 border-l-secondary bg-secondary/5 hover:bg-secondary/10 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold capitalize">{update.update_type}</h4>
                          <Badge variant="outline">
                            {new Date(update.created_at).toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-lg text-muted-foreground">{update.description}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FamilyDashboard;
