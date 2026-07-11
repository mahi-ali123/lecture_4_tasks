import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Upload, History, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    averageScore: 0,
    bestScore: 0
  });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    // Attempt to load from local storage fallback
    const localHistory = JSON.parse(localStorage.getItem('thumblytics_history') || '[]');
    
    if (localHistory.length > 0) {
      const total = localHistory.length;
      const avg = Math.round(localHistory.reduce((acc: number, item: any) => acc + item.score, 0) / total);
      const best = Math.max(...localHistory.map((item: any) => item.score));
      
      setStats({ total, averageScore: avg, bestScore: best });
      setRecent(localHistory.slice(0, 3));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
        </div>
        <Link 
          to="/upload" 
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" /> New Analysis
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
          label="Total Analyses"
          value={stats.total.toString()}
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          label="Avg. Click Potential"
          value={stats.averageScore > 0 ? `${stats.averageScore}/100` : "-"}
        />
        <StatCard 
          icon={<Star className="w-5 h-5 text-amber-500" />}
          label="Best Score"
          value={stats.bestScore > 0 ? `${stats.bestScore}/100` : "-"}
        />
        <StatCard 
          icon={<History className="w-5 h-5 text-purple-500" />}
          label="Credits Remaining"
          value="Unlimited"
          sub="Pro Plan Active"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Uploads</h2>
            <Link to="/history" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {recent.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 mb-3 opacity-20" />
                <p>No thumbnails analyzed yet.</p>
                <Link to="/upload" className="text-primary mt-2 hover:underline">Upload your first image</Link>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recent.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                        {item.image_data && <img src={item.image_data} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm truncate max-w-[200px]">{item.filename}</div>
                        <div className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold">{item.score}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">Score</div>
                      </div>
                      <Link to={`/report/${item.id}`} className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <Link to="/upload" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">Analyze Thumbnail</div>
                <div className="text-xs text-muted-foreground">Upload and score a new image</div>
              </div>
            </Link>
            
            <Link to="/compare" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">Compare (A/B Test)</div>
                <div className="text-xs text-muted-foreground">Test two thumbnails side-by-side</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub?: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-muted">
          {icon}
        </div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
