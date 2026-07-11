import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const HistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Attempt to load from local storage fallback
    const localHistory = JSON.parse(localStorage.getItem('thumblytics_history') || '[]');
    setHistory(localHistory);
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('thumblytics_history', JSON.stringify(updated));
  };

  const filteredHistory = history.filter(item => 
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
          <p className="text-muted-foreground mt-1">Review and compare your past thumbnails.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[70vh]">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4 bg-muted/20">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by filename..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <button className="flex items-center gap-2 h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap w-full sm:w-auto">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <Search className="w-8 h-8 opacity-20" />
              <p>No history records found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="group relative bg-background border border-border rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-primary/30">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {item.image_data ? (
                      <img src={item.image_data} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Preview</div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur ${
                        item.score >= 80 ? 'bg-green-500/90 text-white' : 
                        item.score >= 60 ? 'bg-amber-500/90 text-white' : 
                        'bg-destructive/90 text-white'
                      }`}>
                        {item.score}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-sm truncate mb-1" title={item.filename}>{item.filename}</h3>
                    <div className="text-xs text-muted-foreground mb-4">
                      {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <Link 
                        to={`/report/${item.id}`} 
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        View Report <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
