import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Users, Shield, User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"elder" | "family" | "admin">("elder");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success("Welcome to ElderConnect! Setting up your account...");
    } catch (error: any) {
      toast.error(error.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "elder",
      icon: Heart,
      title: "Elder",
      description: "I want to share my stories and connect with an AI companion",
      color: "primary"
    },
    {
      value: "family",
      icon: Users,
      title: "Family Member",
      description: "I want to stay connected with my elder's wisdom",
      color: "secondary"
    },
    {
      value: "admin",
      icon: Shield,
      title: "Administrator",
      description: "I manage the platform for my organization",
      color: "accent"
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-2xl relative shadow-xl border-2 animate-scale-in">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold">Create Your Account</CardTitle>
            <CardDescription className="text-lg mt-2">
              Join ElderConnect and start building meaningful connections
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-lg font-medium flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                Your Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg font-medium flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                Create Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password (6+ characters)"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-sm text-muted-foreground">
                Use at least 6 characters for security
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">I am joining as a...</Label>
              <RadioGroup value={role} onValueChange={(value: any) => setRole(value)} className="space-y-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = role === option.value;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex items-start gap-4 border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Icon className={`w-7 h-7 ${isSelected ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-semibold">{option.title}</span>
                          {isSelected && <Check className="w-5 h-5 text-primary" aria-hidden="true" />}
                        </div>
                        <p className="text-muted-foreground mt-1">{option.description}</p>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full group" 
              size="xl" 
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create My Account
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </Button>

            <div className="text-center space-y-4 pt-4">
              <p className="text-lg text-muted-foreground">
                Already have an account?
              </p>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link to="/login">
                  Sign In Instead
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
