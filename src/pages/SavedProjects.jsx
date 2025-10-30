import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";

const SavedProjects = () => {
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3000/api/savesessions/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, []);

  const handleUnsave = async (sessionId, e) => {
    e.stopPropagation(); // ✅ prevent triggering navigation
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:3000/api/savesessions/unsave/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gradient-hero min-h-screen">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-white">Saved Projects</h1>

      {saved.length === 0 ? (
        <p className="text-gray-600">No saved projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((s) => (
            <Card
              key={s._id}
              onClick={() => navigate(`/editorvs/${s._id}`)} // ✅ navigate on click
              className="bg-gradient-card border-border/50 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{s.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{s.language}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-2"
                  onClick={(e) => handleUnsave(s._id, e)} // prevent navigation when deleting
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Last updated: {new Date(s.updatedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProjects;




