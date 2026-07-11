import React from "react";
import { BarChart3 } from "lucide-react";

export const ComparePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Compare Mode</h1>
        <p className="text-muted-foreground">A/B test two thumbnails to see which one has higher click potential.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Pro Feature</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Comparison mode is available exclusively on the Pro plan. Upgrade today to unlock A/B testing and advanced export features.
        </p>
        <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
};
