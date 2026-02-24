import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VoiceRecorder from "./VoiceRecorder";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm so happy to chat with you today. Share your thoughts, memories, or anything on your mind. I'm here to listen and respond with care.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message: input },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Store the text Q&A pair in conversations table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("conversations").insert({
          elder_id: user.id,
          question: input,
          answer: data.response,
          conversation_type: "text",
          language: "English"
        });
      }
    } catch (error: any) {
      toast.error("I couldn't respond. Please try again.");
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px]">
      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-6 pb-4" role="log" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              } animate-fade-in`}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                message.role === "user" 
                  ? "bg-primary/15" 
                  : "bg-secondary/20"
              }`}>
                {message.role === "user" ? (
                  <User className="w-6 h-6 text-primary" aria-hidden="true" />
                ) : (
                  <Bot className="w-6 h-6 text-secondary-foreground" aria-hidden="true" />
                )}
              </div>
              
              {/* Message Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border"
                }`}
              >
                <p className="text-lg leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-secondary-foreground" aria-hidden="true" />
              </div>
              <div className="bg-muted rounded-2xl px-5 py-4 border">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-label="Thinking..." />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex gap-3 mt-6 pt-4 border-t">
        <VoiceRecorder onTranscript={(text) => setInput(text)} />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message here..."
          disabled={loading}
          className="flex-1"
          aria-label="Type your message"
        />
        <Button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
          size="icon"
          className="w-14 h-14"
          aria-label="Send message"
        >
          <Send className="w-6 h-6" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatbot;
