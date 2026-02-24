import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Heart, BookOpen, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MemoriesSection = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("memories")
      .select("*")
      .eq("elder_id", user.id)
      .order("created_at", { ascending: false });

    setMemories(data || []);
  };

  const handleAddMemory = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both the title and your memory");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("memories").insert({
      elder_id: user.id,
      title,
      content,
      memory_type: "text",
    });

    if (error) {
      toast.error("Couldn't save your memory. Please try again.");
      return;
    }

    toast.success("Your memory has been saved!");
    setTitle("");
    setContent("");
    setOpen(false);
    fetchMemories();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
            <Heart className="w-7 h-7 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Cherished Memories</h2>
            <p className="text-lg text-muted-foreground">Preserve your stories for generations</p>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md">
              <Plus className="w-5 h-5" aria-hidden="true" />
              Add New Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" aria-hidden="true" />
                Share a New Memory
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-medium">
                  Give Your Memory a Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., My First Day at School"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="content" className="text-lg font-medium">
                  Share Your Memory
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write about this special moment..."
                  rows={8}
                  className="text-lg resize-none"
                />
              </div>
              <Button onClick={handleAddMemory} className="w-full" size="lg">
                <Heart className="w-5 h-5" aria-hidden="true" />
                Save This Memory
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Memories Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {memories.map((memory, index) => (
          <Card 
            key={memory.id} 
            className="shadow-md border-2 hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold leading-tight">{memory.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time className="text-base">
                      {new Date(memory.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">{memory.content}</p>
            </CardContent>
          </Card>
        ))}

        {memories.length === 0 && (
          <Card className="md:col-span-2 border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Memories Yet</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Start preserving your cherished moments by adding your first memory.
              </p>
              <Button size="lg" onClick={() => setOpen(true)}>
                <Plus className="w-5 h-5" aria-hidden="true" />
                Add Your First Memory
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemoriesSection;
