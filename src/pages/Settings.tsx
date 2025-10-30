import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Code,
  User,
  Palette,
  Settings as SettingsIcon,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const USER_ID = localStorage.getItem("userId");

  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("editorTheme") || "vs-dark"
  );

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const avatarColors = [
    { name: "blue", class: "bg-blue-500" },
    { name: "green", class: "bg-green-500" },
    { name: "purple", class: "bg-purple-500" },
    { name: "pink", class: "bg-pink-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "red", class: "bg-red-500" },
  ];

  const themes = [
    { id: "vs-dark", name: "VS Code Dark", description: "Classic dark theme" },
    { id: "vs", name: "VS Code Light", description: "Clean light theme" },
    { id: "hc-black", name: "High Contrast Black", description: "High contrast dark theme" },
    { id: "monokai", name: "Monokai", description: "Popular dark theme" },
    { id: "github-dark", name: "GitHub Dark", description: "GitHub’s dark theme" },
    { id: "dracula", name: "Dracula", description: "Dark theme with purple accents" },
  ];

  // Define custom Monaco themes
  const defineCustomThemes = (monaco) => {
    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#282a36",
        "editor.foreground": "#f8f8f2",
      },
    });

    monaco.editor.defineTheme("github-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
      },
    });

    monaco.editor.defineTheme("monokai", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#f8f8f2",
      },
    });
  };

  // Monaco editor mount handler
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineCustomThemes(monaco);

    const savedTheme = localStorage.getItem("editorTheme") || selectedTheme;
    monaco.editor.setTheme(savedTheme);
  };

  //  Fetch user details when page loads
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const USER_ID = user?._id;
  if (!USER_ID) return;

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUsername(data.name || "Unknown");
      if (data.theme) setSelectedTheme(data.theme);
      if (data.color) setSelectedColor(data.color);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  fetchUser();
}, []);


  //  Apply theme when changed
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(selectedTheme);
      localStorage.setItem("editorTheme", selectedTheme);
    }
  }, [selectedTheme]);

  // Save profile to backend
  const saveProfile = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${USER_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username, // matches backend
      }),
    });

    if (!res.ok) throw new Error("Failed to update user");
    const data = await res.json();

    const user = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, name: data.name })
    );

    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Error updating profile.");
  }
};


  //  Save theme locally
  const saveTheme = () => {
    localStorage.setItem("editorTheme", selectedTheme);
    alert(`Theme "${themes.find((t) => t.id === selectedTheme)?.name}" saved!`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-primary" />
              <span className="font-semibold">Settings</span>
            </div>
          </div>

          <Link to="/dashboard" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold font-mono">CodeSync</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your coding experience and manage your account
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Profile Settings
              </CardTitle>
              <CardDescription>
                Update your display name and avatar color
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback
                    className={`${
                      avatarColors.find((c) => c.name === selectedColor)?.class
                    } text-white text-xl`}
                  >
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{username}</p>
                  <p className="text-sm text-muted-foreground">
                    This is how others will see you
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  This will be your display name in collaborations
                </p>
              </div>

              <div className="space-y-3">
                <Label>Avatar Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {avatarColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button variant="hero" className="w-full" onClick={saveProfile}>
                <Save className="h-4 w-4" /> Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" /> Editor Theme
              </CardTitle>
              <CardDescription>
                Choose your preferred coding theme
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedTheme === theme.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-border bg-background/50"
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                    {selectedTheme === theme.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              ))}

              <Button variant="hero" className="w-full" onClick={saveTheme}>
                <Save className="h-4 w-4" /> Save Theme
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Editor Preview */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Editor Preview</CardTitle>
            <CardDescription>See your selected theme in action</CardDescription>
          </CardHeader>
          <CardContent>
            <Editor
              height="450px"
              defaultLanguage="javascript"
              defaultValue="// Start coding..."
              onMount={handleEditorDidMount}
              theme={selectedTheme}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;



