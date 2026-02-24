import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pill, Activity, Smile, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UpdatesPanel = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [updateType, setUpdateType] = useState("mood");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("updates")
      .select("*")
      .eq("elder_id", user.id)
      .order("created_at", { ascending: false });

    setUpdates(data || []);
  };

  const handleAddUpdate = async () => {
    if (!description.trim()) {
      toast.error("Please describe your update");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("updates").insert({
      elder_id: user.id,
      update_type: updateType,
      description,
    });

    if (error) {
      toast.error("Couldn't save your update. Please try again.");
      return;
    }

    toast.success("Update saved successfully!");
    setDescription("");
    setOpen(false);
    fetchUpdates();
  };

  const updateTypes = {
    mood: { icon: Smile, label: "Mood", color: "bg-accent/15 text-accent-foreground" },
    medication: { icon: Pill, label: "Medication", color: "bg-primary/15 text-primary" },
    exercise: { icon: Activity, label: "Exercise", color: "bg-secondary/30 text-secondary-foreground" },
  };

  const getUpdateConfig = (type: string) => {
    return updateTypes[type as keyof typeof updateTypes] || updateTypes.mood;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/30 to-accent/10 flex items-center justify-center">
            <Clock className="w-7 h-7 text-secondary-foreground" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Daily Updates</h2>
            <p className="text-lg text-muted-foreground">Track your daily wellness and activities</p>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md">
              <Plus className="w-5 h-5" aria-hidden="true" />
              Log Update
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" aria-hidden="true" />
                Add Daily Update
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label htmlFor="type" className="text-lg font-medium">
                  What type of update?
                </Label>
                <Select value={updateType} onValueChange={setUpdateType}>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mood" className="text-lg py-3">
                      <div className="flex items-center gap-3">
                        <Smile className="w-5 h-5" aria-hidden="true" />
                        How I'm Feeling (Mood)
                      </div>
                    </SelectItem>
                    <SelectItem value="medication" className="text-lg py-3">
                      <div className="flex items-center gap-3">
                        <Pill className="w-5 h-5" aria-hidden="true" />
                        Medication Taken
                      </div>
                    </SelectItem>
                    <SelectItem value="exercise" className="text-lg py-3">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5" aria-hidden="true" />
                        Exercise / Activity
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-medium">
                  Tell us more
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Feeling happy today! or Took morning vitamins"
                />
              </div>
              <Button onClick={handleAddUpdate} className="w-full" size="lg">
                <Plus className="w-5 h-5" aria-hidden="true" />
                Save Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Updates List */}
      <div className="grid gap-4">
        {updates.map((update, index) => {
          const config = getUpdateConfig(update.update_type);
          const Icon = config.icon;
          
          return (
            <Card 
              key={update.id} 
              className="shadow-md border-2 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="py-6">
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold capitalize text-foreground">{config.label}</h4>
                    <p className="text-lg text-muted-foreground mt-2 leading-relaxed">{update.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      <time className="text-base">
                        {new Date(update.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {updates.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Updates Yet</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Start tracking your daily wellness by adding your first update.
              </p>
              <Button size="lg" onClick={() => setOpen(true)}>
                <Plus className="w-5 h-5" aria-hidden="true" />
                Add Your First Update
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UpdatesPanel;
