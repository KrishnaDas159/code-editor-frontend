
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Code, Plus, Clock, Users, Settings, FileText, Search, Filter, MoreHorizontal, Star } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const temp = import.meta.env.VITE_BACK_URL;


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("Token not found");

        const [createdRes, joinedRes] = await Promise.all([
          axios.get(`${temp}/api/sessions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${temp}/api/sessions/joined`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const createdSessions = Array.isArray(createdRes.data)
          ? createdRes.data.map((s) => ({
              id: s._id,
              name: s.name || "Untitled Session",
              language: s.language || "Unknown",
              lastEdited: new Date(s.updatedAt).toLocaleString(),
              collaborators: s.collaborators || [],
              isActive: s.isActive || false,
              type: "created",
            }))
          : [];

        const joinedSessions = Array.isArray(joinedRes.data)
          ? joinedRes.data.map((s) => ({
              id: s._id,
              name: s.name || "Untitled Session",
              language: s.language || "Unknown",
              lastEdited: new Date(s.updatedAt).toLocaleString(),
              collaborators: s.collaborators || [],
              isActive: s.isActive || false,
              type: "joined",
            }))
          : [];

        setRecentSessions([...createdSessions, ...joinedSessions]);
      } catch (err) {
        console.error("Failed to fetch sessions:", err.response?.data || err);
        setRecentSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      await axios.delete(`${temp}/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecentSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Failed to delete session:", err.response?.data || err);
    }
  };

  const handleSaveSession = async (session, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      await axios.post(
        `${temp}/api/savesessions/save`,
        { sessionId: session.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`Session "${session.name}" saved successfully`);
    } catch (err) {
      console.error("Failed to save session:", err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card/30 backdrop-blur-sm border-r border-border/50 h-screen sticky top-0">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-mono">CodeSync</span>
            </Link>
            <nav className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/editor">
                  <Code className="h-4 w-4" />
                  Sessions
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/saved-projects">
                  <Star className="h-4 w-4" />
                  Saved Projects
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your coding sessions and collaborations
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/editor">
                    <Plus className="h-4 w-4" />
                    Start New Session
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/editor">
                    <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                          <Plus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">New Session</h3>
                          <p className="text-sm text-muted-foreground">
                            Start collaborative coding
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/join">
                    <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Join Session</h3>
                          <p className="text-sm text-muted-foreground">
                            Enter session code
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                {/* Recent Sessions */}
                <Card className="bg-gradient-card border-border/50 h-[500px] flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Sessions</CardTitle>
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-muted rounded-lg" />
                        ))}
                      </div>
                    ) : recentSessions.length === 0 ? (
                      <p className="text-center text-muted-foreground">
                        No recent sessions found.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {recentSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/editorvs/${session.id}`)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Code className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{session.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {session.type === "created" ? "Created" : "Joined"}
                                  </Badge>
                                  {session.isActive && (
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                      <span className="text-xs text-success">Live</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline" className="text-xs">{session.language}</Badge>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {session.lastEdited}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                {session.collaborators.slice(0, 3).map((c, i) => (
                                  <Avatar key={i} className="h-8 w-8 border-2 border-background">
                                    <AvatarFallback className="text-xs bg-gradient-primary text-white">{c}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {session.collaborators.length > 3 && (
                                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">
                                      +{session.collaborators.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Delete button */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => handleDeleteSession(session.id, e)}
                              >
                                Delete
                              </Button>

                              {/* Save button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleSaveSession(session, e)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sessions Created</span>
                      <span className="font-semibold">{recentSessions.filter(s => s.type === "created").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sessions Joined</span>
                      <span className="font-semibold">{recentSessions.filter(s => s.type === "joined").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Sessions</span>
                      <span className="font-semibold">{recentSessions.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;










