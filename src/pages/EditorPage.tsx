import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@monaco-editor/react";

const EditorPage = () => {
  const navigate = useNavigate(); 
  const { sessionId } = useParams();

  const [sessionName, setSessionName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const [code, setCode] = useState("");

  const supportedLanguages = [
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c++", label: "C++" },
  ];

  const handleStartSession = async () => {
  if (!sessionName) return alert("Please enter a session name");

  try {
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to start a session.");
      return;
    }

    const payload = {
      name: sessionName,
      language: selectedLanguage,
      createdAt: new Date(),
    };

    console.log("🔍 Creating session with payload:", payload);

    const response = await fetch("http://localhost:3000/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("🔍 Backend response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to create session");
    }

    
    localStorage.setItem("sessionId", data._id);

    navigate(`/editorvs/${data._id}`);

  } catch (error) {
    console.error("Error creating session:", error);
    alert(error.message || "Error creating session");
  }
};



  // Editor view if sessionId exists (optional if you still want this route)
  if (sessionId) {
    return (
      <div className="h-screen flex flex-col">
        <header className="h-14 bg-card border-b flex items-center px-6 justify-between">
          <span className="font-bold">{sessionName || "Live Session"}</span>
          <span>{selectedLanguage}</span>
        </header>
        <Editor
          height="100%"
          defaultLanguage={selectedLanguage}
          language={selectedLanguage}
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>
    );
  }

  // Session creation view
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Start New Session</h2>
        <Input
          placeholder="Session Name"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="mb-4"
        />
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full" onClick={handleStartSession}>
          Start Session
        </Button>
      </div>
    </div>
  );
};

export default EditorPage;
