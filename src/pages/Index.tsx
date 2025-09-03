// The Commissioner - Landing Page
// Meet The Commissioner with referee branding

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, MessageCircle, BarChart3, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleEnterLeague = () => {
    // For demo purposes, navigate to a mock league
    navigate('/league/demo-league');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          {/* Main branding */}
          <div className="space-y-4">
            <div className="inline-block p-4 rounded-card bg-stripe/10 dark:bg-cream/10 border-2 border-dashed border-stripe/20">
              <Trophy className="h-16 w-16 text-sport-amber mx-auto" />
            </div>
            
            <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Meet The <br />
              <span className="text-sport-red">Commissioner</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The ruthless AI banter master your fantasy football league never knew it needed
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <button 
              onClick={handleEnterLeague}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Enter Your League
            </button>
            
            <p className="text-sm text-muted-foreground">
              Ready to get schooled by the refs? 📯
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <div className="card-referee p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-card bg-sport-green/10">
              <BarChart3 className="h-6 w-6 text-sport-green" />
            </div>
            <h3 className="text-heading text-lg font-bold">Live Matchups</h3>
            <p className="text-sm text-muted-foreground">
              Trading card style matchups with win probabilities that update faster than a flag throw
            </p>
          </div>

          <div className="card-referee p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-card bg-sport-blue/10">
              <MessageCircle className="h-6 w-6 text-sport-blue" />
            </div>
            <h3 className="text-heading text-lg font-bold">League Banter</h3>
            <p className="text-sm text-muted-foreground">
              Real-time trash talk that makes your bench players look chatty
            </p>
          </div>

          <div className="card-referee p-6 text-center space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="inline-flex p-3 rounded-card bg-sport-red/10">
              <Zap className="h-6 w-6 text-sport-red" />
            </div>
            <h3 className="text-heading text-lg font-bold">Referee Stats</h3>
            <p className="text-sm text-muted-foreground">
              Quick stats that hit harder than a penalty flag
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 space-y-4">
          <div className="chip-referee inline-block">
            Mobile-First • Real-Time • Trash Talk Approved
          </div>
          
          <p className="text-xs text-muted-foreground">
            Fantasy football just got a referee upgrade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
