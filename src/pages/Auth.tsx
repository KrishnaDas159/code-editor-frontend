import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Code, Github, Mail, Eye, EyeOff, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const temp = import.meta.env.VITE_BACK_URL;


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin
        ? `${temp}/api/auth/login`
        : `${temp}/api/auth/register`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      
      localStorage.setItem("userId", data._id);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Code Together</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of developers collaborating in real-time. Share ideas, 
              build together, and create amazing projects.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 opacity-50">
            <div className="aspect-square bg-gradient-card rounded-lg border border-border/50 flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="aspect-square bg-gradient-card rounded-lg border border-border/50 flex items-center justify-center">
              <Users className="h-6 w-6 text-success" />
            </div>
            <div className="aspect-square bg-gradient-card rounded-lg border border-border/50 flex items-center justify-center">
              <Github className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-mono">CodeSync</span>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to your account to continue coding"
                : "Join the collaborative coding community"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Continue as Guest</Link>
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
                type="button"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;









