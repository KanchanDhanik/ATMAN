import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, LogOut, MessageSquare, Clock, Mic, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AIChatbot from "@/components/AIChatbot";
import MemoriesSection from "@/components/MemoriesSection";
import UpdatesPanel from "@/components/UpdatesPanel";
import VoiceAssistant from "@/components/VoiceAssistant";
import elderTechImage from "@/assets/elder-tech.jpg";

const ElderDashboard = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
              <img src={elderTechImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">ElderConnect</h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, <span className="text-primary font-medium">{profile?.full_name || "Friend"}</span>
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={signOut}
            className="gap-3"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-3xl border shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
            <span className="text-lg font-medium text-primary">Your AI Companion is Ready</span>
          </div>
          <p className="text-xl text-muted-foreground">
            Choose how you'd like to connect today. Talk, type, or explore your memories.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="voice" className="space-y-8">
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-3">
            <TabsTrigger value="voice" className="py-4">
              <Mic className="w-6 h-6" aria-hidden="true" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="py-4">
              <MessageSquare className="w-6 h-6" aria-hidden="true" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="memories" className="py-4">
              <Heart className="w-6 h-6" aria-hidden="true" />
              <span className="hidden sm:inline">Memories</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="py-4">
              <Clock className="w-6 h-6" aria-hidden="true" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="animate-fade-in">
            <Card className="shadow-lg border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">Voice Assistant</CardTitle>
                    <CardDescription className="text-lg">
                      Just speak naturally — I'm listening
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <VoiceAssistant />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="animate-fade-in">
            <Card className="shadow-lg border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-secondary-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">AI Companion</CardTitle>
                    <CardDescription className="text-lg">
                      Share your thoughts, memories, and wisdom. I'm here to listen.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AIChatbot />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memories" className="animate-fade-in">
            <MemoriesSection />
          </TabsContent>

          <TabsContent value="updates" className="animate-fade-in">
            <UpdatesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ElderDashboard;
