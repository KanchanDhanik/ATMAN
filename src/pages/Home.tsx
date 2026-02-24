import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Sparkles, ArrowRight, Phone, Star, Mic, MessageSquare, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroElders from "@/assets/hero-elders.jpg";
import featureVoice from "@/assets/feature-voice.jpg";
import featureMemories from "@/assets/feature-memories.jpg";
import featureFamily from "@/assets/feature-family.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section 
        id="main-content"
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-gentle" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-6 py-12 md:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/15 text-primary border border-primary/20 shadow-sm">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span className="text-lg font-medium">Preserving Wisdom, Connecting Hearts</span>
              </div>
              
              {/* Main Heading - Large and readable */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-readable">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  ElderConnect
                </span>
              </h1>
              
              {/* Subtitle - Clear and simple */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                Your AI companion for <span className="text-primary">meaningful conversations</span> and 
                <span className="text-accent"> preserving memories</span> for your loved ones.
              </p>

              {/* CTA Buttons - Large and prominent */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button size="xl" className="group shadow-lg hover-glow" asChild>
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to="/login">
                    <Phone className="w-6 h-6" aria-hidden="true" />
                    Sign In
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent fill-accent" aria-hidden="true" />
                  <span className="text-lg">Trusted by Families</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-lg">Private & Secure</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="animate-fade-in relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img 
                  src={heroElders} 
                  alt="Happy elderly people connecting with family through technology"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
              </div>
              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-lg border animate-scale-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Voice Chat</p>
                    <p className="text-muted-foreground">Speak naturally</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-lg border animate-scale-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">With Love</p>
                    <p className="text-muted-foreground">Made for elders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 md:py-28" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl md:text-5xl font-bold text-center mb-6 text-readable">
          How ElderConnect Helps You
        </h2>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Simple, caring technology designed especially for seniors
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 - Voice */}
          <article className="group bg-card rounded-3xl border-2 border-transparent shadow-md hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover-lift overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={featureVoice} 
                alt="Elderly person having a voice conversation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 -mt-14 relative bg-card border-4 border-card shadow-lg">
                <Mic className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Voice Companion</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Talk naturally with a friendly AI that listens, understands your emotions, and responds with warmth.
              </p>
            </div>
          </article>

          {/* Feature Card 2 - Memories */}
          <article className="group bg-card rounded-3xl border-2 border-transparent shadow-md hover:shadow-xl hover:border-secondary/30 transition-all duration-300 hover-lift overflow-hidden" style={{ animationDelay: "100ms" }}>
            <div className="h-48 overflow-hidden">
              <img 
                src={featureMemories} 
                alt="Hands writing in a memory book with photos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/15 flex items-center justify-center mb-6 -mt-14 relative bg-card border-4 border-card shadow-lg">
                <BookOpen className="w-7 h-7 text-secondary-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Memory Keeper</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Save your life stories, wisdom, and precious memories safely for your loved ones to cherish forever.
              </p>
            </div>
          </article>

          {/* Feature Card 3 - Family */}
          <article className="group bg-card rounded-3xl border-2 border-transparent shadow-md hover:shadow-xl hover:border-accent/30 transition-all duration-300 hover-lift overflow-hidden" style={{ animationDelay: "200ms" }}>
            <div className="h-48 overflow-hidden">
              <img 
                src={featureFamily} 
                alt="Multi-generational family connected together"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/25 to-accent/10 flex items-center justify-center mb-6 -mt-14 relative bg-card border-4 border-card shadow-lg">
                <Users className="w-7 h-7 text-accent-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Family Bond</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your family can access all your conversations and wisdom anytime, keeping everyone connected.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-6 py-16 md:py-24" aria-labelledby="mission-heading">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-card p-10 md:p-16 rounded-3xl border shadow-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Heart className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Our Promise to You</span>
          </div>
          <h2 id="mission-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-readable">
            Your Stories Matter
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            We believe every elder has a lifetime of wisdom worth sharing. ElderConnect helps you 
            <span className="text-primary font-medium"> stay connected</span>, 
            <span className="text-accent font-medium"> feel heard</span>, and 
            <span className="text-secondary-foreground font-medium"> leave a lasting legacy</span> of love for your family.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link to="/register">
              Start Your Journey
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold text-foreground">ElderConnect</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Made with love for our elders. © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
