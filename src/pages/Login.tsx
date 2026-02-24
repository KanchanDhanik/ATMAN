import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;

      toast.success("Welcome back! Signing you in...");
    } catch (error: any) {
      toast.error(error.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative shadow-xl border-2 animate-scale-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-lg mt-2">
              Sign in to continue your journey with ElderConnect
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-8">
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
                aria-describedby="email-hint"
              />
              <p id="email-hint" className="text-sm text-muted-foreground">
                Enter the email you used to create your account
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg font-medium flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full group" 
              size="xl" 
              disabled={loading}
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </Button>

            <div className="text-center space-y-4 pt-4">
              <p className="text-lg text-muted-foreground">
                Don't have an account yet?
              </p>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link to="/register">
                  Create Free Account
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
