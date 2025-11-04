import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Link as LinkIcon, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Join = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const temp = import.meta.env.VITE_BACK_URL;


  const handleJoinSession = async () => {
  try {
    setError("");
    setLoading(true);

    let extractedId = sessionCode.trim();
    if (extractedId.includes("/")) {
      extractedId = extractedId.split("/").pop(); // extract ID from link
    }

    if (!extractedId) {
      setError("Please enter a valid session code or link.");
      return;
    }

    const token = localStorage.getItem("token");

    // 1️⃣ Check if session exists
    const res = await axios.get(`${temp}/api/sessions/${extractedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200 && res.data) {
      // 2️⃣ Join the session
      await axios.post(
        `${temp}/api/sessions/${extractedId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Navigate to editor
      navigate(`/editorvs/${extractedId}`);
    } else {
      setError("Session not found. Please check the code.");
    }
  } catch (err) {
    console.error(err);
    setError("Session not found or server error.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <Code className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold font-mono">CodeSync</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Join Session</h1>
            <p className="text-muted-foreground">
              Enter a session code or link to start collaborating
            </p>
          </div>
        </div>

        {/* Join Form */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Enter Session Details</CardTitle>
            <CardDescription>
              Join an existing collaborative coding session
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionCode">Session Code or Link</Label>
                <Input
                  id="sessionCode"
                  placeholder="e.g. abc123def or https://codesync.dev/session/abc123def"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  className="bg-background border-border/50"
                />
                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Ask the session creator for the code or link
                </p>
              </div>

              <Button
                variant="hero"
                className="w-full"
                size="lg"
                disabled={loading}
                onClick={handleJoinSession}
              >
                <ArrowRight className="h-4 w-4" />
                {loading ? "Joining..." : "Join Session"}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard">
                  Continue as Guest
                </Link>
              </Button>

              <p className="text-sm text-muted-foreground">
                Don't have a session code?{" "}
                <Link
                  to="/editor"
                  className="text-primary hover:underline font-medium"
                >
                  Create new session
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Real-time</p>
              <p className="text-xs text-muted-foreground">Live editing</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium">Multi-user</p>
              <p className="text-xs text-muted-foreground">Collaborate</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto">
              <LinkIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Easy join</p>
              <p className="text-xs text-muted-foreground">Just a link</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;


