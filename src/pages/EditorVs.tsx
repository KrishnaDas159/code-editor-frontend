import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, Copy, MessageCircle, Users, Send, LogOut, Play } from "lucide-react";
const backendURL = import.meta.env.VITE_BACK_URL?.replace(/^http/, "ws");
const httpBackendURL = import.meta.env.VITE_BACK_URL;



const socket = io(backendURL, {
  transports: ["websocket"],
  reconnection: true,
});

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

const RAPIDAPI_HEADERS = {
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "6be36155e5msh6c375f71982ed58p1c2e60jsn2f088498d187",
  "Content-Type": "application/json",
};

const EditorVs = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const [code, setCode] = useState("// Start coding here...");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [roomId, setRoomId] = useState(sessionId || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputHeight, setOutputHeight] = useState(150);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const isDragging = useRef(false);
  const monacoRef = useRef(null);
  
  const [userName] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
      return storedUser?.name || `Guest-${Math.floor(Math.random() * 1000)}`;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return `Guest-${Math.floor(Math.random() * 1000)}`;
    }
  });

  // Supported themes (must match Settings component)
  const supportedThemes = [
    "vs-dark",
    "vs",
    "hc-black",
    "monokai",
    "github-dark",
    "dracula",
  ];

  // Define custom themes (identical to Settings)
  const defineCustomThemes = (monaco) => {
    try {
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
    } catch (err) {
      console.error("Error defining custom themes:", err);
      setError("Failed to define editor themes.");
    }
  };

  // Load saved theme and listen for changes
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("editorTheme") || "vs-dark";
      if (supportedThemes.includes(savedTheme)) {
        setEditorTheme(savedTheme);
      } else {
        setEditorTheme("vs-dark");
        localStorage.setItem("editorTheme", "vs-dark");
      }

      const handleStorageChange = (e) => {
        if (e.key === "editorTheme" && e.newValue && supportedThemes.includes(e.newValue)) {
          setEditorTheme(e.newValue);
        }
      };
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    } catch (err) {
      console.error("Error in theme loading useEffect:", err);
      setError("Failed to load theme. Using default.");
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error in chat scroll useEffect:", err);
    }
  }, [messages]);

  // Fetch session
  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided. Please check the URL.");
      return;
    }
    axios
      .get(`${httpBackendURL}/api/sessions/${sessionId}`)
      .then((res) => {
        setRoomId(res.data._id || sessionId);
        setSelectedLanguage(res.data.language || "typescript");
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
        setError("Failed to fetch session data. Please try again.");
      });
  }, [sessionId]);

  // Socket events
  useEffect(() => {
    if (!roomId) return;

    try {
      socket.emit("join", { roomId, userName });

      socket.on("chatHistory", (msgs) => {
        setMessages(Array.isArray(msgs) ? msgs : []);
      });
      socket.on("receiveMessage", (msg) => {
        setMessages((prev) => (Array.isArray(prev) ? [...prev, msg] : [msg]));
      });
      socket.on("codeUpdate", (newCode) => {
        setCode(typeof newCode === "string" ? newCode : code);
      });
      socket.on("userTyping", (user) => {
        if (user !== userName) {
          setTyping(`${user} is typing...`);
          setTimeout(() => setTyping(""), 2000);
        }
      });
      socket.on("languageUpdate", (newLang) => {
        setSelectedLanguage(typeof newLang === "string" ? newLang : selectedLanguage);
      });
      socket.on("userJoined", (usersInRoom) => {
        const uniqueUsers = Array.isArray(usersInRoom) ? [...new Set(usersInRoom)] : [];
        setUsers(
          uniqueUsers.map((u, i) => ({
            id: i.toString(),
            name: typeof u === "string" ? u : "Unknown",
            avatar: typeof u === "string" ? u.slice(0, 2).toUpperCase() : "UN",
          }))
        );
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError("Failed to connect to collaboration server.");
      });

      return () => {
        socket.emit("leaveRoom", { roomId, userName });
        socket.removeAllListeners();
      };
    } catch (err) {
      console.error("Error in socket useEffect:", err);
      setError("Failed to initialize collaboration features.");
    }
  }, [roomId, userName]);

  // Editor mount handler
  const handleEditorDidMount = (editor, monaco) => {
    try {
      monacoRef.current = monaco;
      defineCustomThemes(monaco);
      const savedTheme = localStorage.getItem("editorTheme") || "vs-dark";
      if (supportedThemes.includes(savedTheme)) {
        monaco.editor.setTheme(savedTheme);
      } else {
        monaco.editor.setTheme("vs-dark");
        localStorage.setItem("editorTheme", "vs-dark");
      }
      console.log("Editor mounted with theme:", savedTheme);
    } catch (err) {
      console.error("Error in handleEditorDidMount:", err);
      setError("Failed to initialize code editor.");
    }
  };

  // Apply theme when editorTheme changes
  useEffect(() => {
    try {
      if (monacoRef.current) {
        console.log("Applying theme in EditorVs:", editorTheme);
        monacoRef.current.editor.setTheme(editorTheme);
      }
    } catch (err) {
      console.error("Error applying theme:", err);
      setError("Failed to apply editor theme.");
    }
  }, [editorTheme]);

  // Handlers
  const handleCodeChange = (newCode) => {
    try {
      setCode(newCode || "");
      socket.emit("codeChange", { roomId, code: newCode });
      socket.emit("typing", { roomId, userName });
    } catch (err) {
      console.error("Error in handleCodeChange:", err);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    try {
      setSelectedLanguage(newLanguage);
      socket.emit("languageChange", { roomId, language: newLanguage });
      axios.put(`${httpBackendURL}/api/sessions/${roomId}`, { language: newLanguage }).catch((err) => {
        console.error("Error updating language:", err);
      });
    } catch (err) {
      console.error("Error in handleLanguageChange:", err);
    }
  };

  const handleLeaveSession = () => {
    try {
      socket.emit("leaveRoom", { roomId, userName });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error in handleLeaveSession:", err);
      navigate("/dashboard");
    }
  };

  const sendMessage = () => {
    try {
      if (!chatMessage.trim()) return;
      socket.emit("sendMessage", { roomId, userName, message: chatMessage });
      setChatMessage("");
    } catch (err) {
      console.error("Error in sendMessage:", err);
    }
  };

  // Run code
  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const languageMap = { javascript: 63, typescript: 74, python: 71, java: 62, cpp: 54 };
      const langId = languageMap[selectedLanguage] || 63;
      const res = await axios.post(
        JUDGE0_API,
        { source_code: code, language_id: langId, stdin: "" },
        { headers: RAPIDAPI_HEADERS }
      );
      const result = res.data;
      setOutput(result.stdout || result.stderr || result.compile_output || "No output");
    } catch (err) {
      console.error("Error running code:", err);
      setOutput("Error running code. Check console.");
    } finally {
      setIsRunning(false);
    }
  };

  // Drag output panel
  const handleMouseDown = (e) => {
    try {
      isDragging.current = true;
      const startY = e.clientY;
      const startHeight = outputHeight;
      document.body.style.cursor = "row-resize";

      const handleMouseMove = (moveEvent) => {
        if (!isDragging.current) return;
        const deltaY = moveEvent.clientY - startY;
        const newHeight = Math.min(Math.max(80, startHeight - deltaY), 500);
        setOutputHeight(newHeight);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "default";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } catch (err) {
      console.error("Error in handleMouseDown:", err);
    }
  };

  // Render error message if something goes wrong
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="hero" className="mt-4" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold font-mono">CodeSync</span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Session:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{roomId || "Loading..."}</code>
            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(roomId)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={runCode}
            size="sm"
            variant="default"
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" /> {isRunning ? "Running..." : "Run Code"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeaveSession}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Leave
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT - Editor + Output */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Language Selector */}
          <div className="h-10 bg-muted/30 border-b border-border/30 flex items-center px-4">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40 h-7 bg-background border-border/50 text-xs">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Editor + Output */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={selectedLanguage}
                theme={editorTheme}
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                options={{ fontSize: 14, minimap: { enabled: true }, automaticLayout: true, wordWrap: "on" }}
                beforeMount={(monaco) => {
                  defineCustomThemes(monaco);
                }}
              />
              {typing && (
                <div className="absolute bottom-2 left-4 bg-black/70 text-white px-3 py-1 text-xs rounded">
                  {typing}
                </div>
              )}
            </div>

            <div
              className="h-2 cursor-row-resize bg-border hover:bg-primary/50 transition-colors"
              onMouseDown={handleMouseDown}
            />

            <div
              className="bg-black text-white p-3 text-sm overflow-auto border-t border-border/50 font-mono"
              style={{ height: `${outputHeight}px` }}
            >
              <strong>Output:</strong>
              <pre className="whitespace-pre-wrap mt-2">{output}</pre>
            </div>
          </div>
        </div>

        {/* RIGHT - Users / Chat */}
        <div className="w-80 bg-card/30 border-l border-border/50 flex flex-col">
          {/* Tabs */}
          <div className="h-12 border-b border-border/50 flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 text-sm ${
                activeTab === "users" ? "bg-background border-b-2 border-primary" : "hover:bg-muted/50"
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" /> Users
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 text-sm ${
                activeTab === "chat" ? "bg-background border-b-2 border-primary" : "hover:bg-muted/50"
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-1" /> Chat
            </button>
          </div>

          {activeTab === "users" ? (
            <ScrollArea className="flex-1 p-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${msg.userName === userName ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block px-3 py-2 rounded-lg ${
                        msg.userName === userName ? "bg-primary text-white" : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="text-xs opacity-75 mb-1">{msg.userName}</div>
                      <div className="text-sm">{msg.message}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-border/40 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button size="sm" variant="default" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorVs;

