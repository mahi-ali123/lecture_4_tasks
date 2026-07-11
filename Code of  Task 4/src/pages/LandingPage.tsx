import React from "react";
import { Link } from "react-router";
import { ArrowRight, BarChart2, Eye, Zap, Layers, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Gemini Vision Powered Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Increase Your Clicks with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">AI</span>.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what makes a good thumbnail. Get instant, data-driven feedback on clarity, emotion, composition, and click potential before you publish.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1"
            >
              Analyze Your First Thumbnail <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to optimize thumbnails</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our AI analyzes your thumbnails across 15+ distinct visual parameters to predict click potential.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Eye className="w-6 h-6 text-blue-500" />}
              title="Visual Clarity"
              description="Ensure your subject stands out and the text is instantly readable, even on mobile screens."
            />
            <FeatureCard 
              icon={<BarChart2 className="w-6 h-6 text-green-500" />}
              title="Click Potential Score"
              description="Get a score out of 100 based on weighted visual signals proven to drive engagement."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Emotional Impact"
              description="Analyze facial expressions and color palettes to estimate curiosity, shock, or urgency."
            />
            <FeatureCard 
              icon={<Layers className="w-6 h-6 text-purple-500" />}
              title="A/B Comparison"
              description="Upload two thumbnails and let the AI determine the winner before you publish."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6 text-rose-500" />}
              title="Actionable Feedback"
              description="Receive clear strengths, weaknesses, and a specific checklist to improve your design."
            />
          </div>
        </div>
      </section>
      
      {/* Pricing placeholder */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-12">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl border border-border bg-card text-left">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect to test the waters</p>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 5 analyses per day</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Basic reporting</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center rounded-xl border border-primary text-primary font-medium hover:bg-primary/5 transition-colors">Get Started</Link>
            </div>
            <div className="p-8 rounded-3xl border-2 border-primary bg-card text-left relative shadow-xl shadow-primary/10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">For serious creators</p>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited analyses</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Comparison Mode</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Export PDF reports</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> History tracking</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">Upgrade to Pro</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
