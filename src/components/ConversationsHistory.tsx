import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Mic, 
  Search, 
  Calendar, 
  Heart, 
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Bot
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Conversation {
  id: string;
  elder_id: string;
  question: string;
  answer: string;
  conversation_type: string | null;
  emotion: string | null;
  language: string | null;
  created_at: string | null;
}

interface ConversationsHistoryProps {
  showAll?: boolean;
  limit?: number;
}

const getEmotionEmoji = (emotion: string | null): string => {
  const emotions: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    anxious: "😰",
    calm: "😌",
    excited: "🤩",
    neutral: "😐"
  };
  return emotion ? emotions[emotion] || "😐" : "😐";
};

const ConversationsHistory = ({ showAll = true, limit = 50 }: ConversationsHistoryProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "voice" | "text">("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchConversations();
  }, [limit]);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchQuery, filterType]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

      if (limit) {
        query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setConversations(data || []);
    } catch (error: any) {
      toast.error("Failed to load conversations");
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterConversations = () => {
    let filtered = [...conversations];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(c => c.conversation_type === filterType);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c => 
          c.question.toLowerCase().includes(query) || 
          c.answer.toLowerCase().includes(query)
      );
    }

    setFilteredConversations(filtered);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const voiceCount = conversations.filter(c => c.conversation_type === "voice").length;
  const textCount = conversations.filter(c => c.conversation_type === "text").length;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-primary" />
              Conversations Database
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              All conversations with your elders - voice and text chats saved here
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Mic className="w-4 h-4 mr-2" />
              {voiceCount} Voice
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              {textCount} Text
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-12 text-lg h-14"
            />
          </div>
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
            <TabsList className="h-14">
              <TabsTrigger value="all" className="text-base px-6 h-12">
                <Filter className="w-4 h-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="voice" className="text-base px-6 h-12">
                <Mic className="w-4 h-4 mr-2" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="text" className="text-base px-6 h-12">
                <MessageSquare className="w-4 h-4 mr-2" />
                Text
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl">No conversations found</p>
                <p className="text-base mt-2">Conversations will appear here as your elders chat</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isExpanded = expandedIds.has(conversation.id);
                
                return (
                  <Card 
                    key={conversation.id} 
                    className={`transition-all duration-300 hover:shadow-md cursor-pointer ${
                      conversation.conversation_type === "voice" 
                        ? "border-l-4 border-l-secondary bg-secondary/5" 
                        : "border-l-4 border-l-primary bg-primary/5"
                    }`}
                    onClick={() => toggleExpanded(conversation.id)}
                  >
                    <CardContent className="p-5">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={conversation.conversation_type === "voice" ? "secondary" : "default"}
                            className="text-sm px-3 py-1"
                          >
                            {conversation.conversation_type === "voice" ? (
                              <><Mic className="w-3 h-3 mr-1" /> Voice</>
                            ) : (
                              <><MessageSquare className="w-3 h-3 mr-1" /> Text</>
                            )}
                          </Badge>
                          {conversation.emotion && (
                            <Badge variant="outline" className="text-sm">
                              {getEmotionEmoji(conversation.emotion)} {conversation.emotion}
                            </Badge>
                          )}
                          {conversation.language && conversation.language !== "English" && (
                            <Badge variant="outline" className="text-sm">
                              🌐 {conversation.language}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(conversation.created_at)}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {/* Question Preview */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Elder asked:</p>
                          <p className={`text-lg leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
                            {conversation.question}
                          </p>
                        </div>
                      </div>

                      {/* Answer - shown when expanded */}
                      {isExpanded && (
                        <div className="flex items-start gap-3 mt-4 pt-4 border-t animate-fade-in">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">AI responded:</p>
                            <p className="text-lg leading-relaxed text-foreground">
                              {conversation.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Load More */}
        {filteredConversations.length >= limit && (
          <div className="text-center pt-4">
            <Button variant="outline" size="lg" onClick={() => fetchConversations()}>
              Refresh Conversations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsHistory;
