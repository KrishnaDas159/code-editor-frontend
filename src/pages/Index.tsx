import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Users, Code, Zap, Github, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-coding.jpg";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-mono">CodeSync</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Code together
                  <br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    in real time
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Collaborate on code with your team instantly. Share sessions, edit together, 
                  and build amazing projects in real-time.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" asChild>
                <Link to="/auth">
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Create New Session
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/auth">
                  <Users className="h-5 w-5" />
                  Join Session
                </Link>
              </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                  <span>Real-time collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  <span>Instant sync</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary/20 rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Collaborative coding workspace" 
                className="relative rounded-3xl shadow-card border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start coding together in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold">Create Session</h3>
                <p className="text-muted-foreground">
                  Start a new coding session and get a shareable link instantly
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold">Invite Team</h3>
                <p className="text-muted-foreground">
                  Share the session link with your teammates to join instantly
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold">Code Together</h3>
                <p className="text-muted-foreground">
                  See changes in real-time and collaborate seamlessly
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for Developers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for seamless collaborative coding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Ultra-low latency collaboration with instant synchronization
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Multi-User</h3>
              <p className="text-muted-foreground">
                Support for unlimited collaborators with user awareness
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Share2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Easy Sharing</h3>
              <p className="text-muted-foreground">
                Share sessions instantly with simple links - no signup required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-bold font-mono">CodeSync</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
              <span className="text-sm text-muted-foreground">
                Built with ❤️ for developers
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;