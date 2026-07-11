import React from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, BarChart, Upload, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Navbar = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BarChart className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">Thumblytics</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/upload" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Upload className="w-4 h-4" /> Analyze
              </Link>
              <Link to="/history" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                History
              </Link>
              <div className="h-4 w-px bg-border mx-2"></div>
              <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border p-4 flex flex-col gap-4 bg-background">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Dashboard</Link>
              <Link to="/upload" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Analyze</Link>
              <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">History</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-sm font-medium text-left flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-primary">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
