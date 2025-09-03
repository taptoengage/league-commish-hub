// The Commissioner - League Dashboard Page
// Main mobile-first fantasy football dashboard

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, Calendar } from 'lucide-react';
import { LeagueDashboardDTO, ChatPreviewData } from '@/types/league';
import { mockLeagueService } from '@/services/mockLeagueService';
import { MatchupCard } from '@/components/referee/MatchupCard';
import { QuickStatsRow } from '@/components/referee/QuickStatsRow';
import { ChatPreview } from '@/components/referee/ChatPreview';
import { WeekSelector } from '@/components/referee/WeekSelector';
import { BottomTabNavigation } from '@/components/referee/BottomTabNavigation';

export const LeagueDashboard: React.FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [dashboardData, setDashboardData] = useState<LeagueDashboardDTO | null>(null);
  const [chatData, setChatData] = useState<ChatPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('fantasy');

  const loadDashboardData = async (force = false) => {
    if (!leagueId) return;
    
    if (force) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [dashboard, chat] = await Promise.all([
        mockLeagueService.getLeagueDashboard(leagueId, currentWeek),
        mockLeagueService.getChatPreview(leagueId),
      ]);

      setDashboardData(dashboard);
      setChatData(chat);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [leagueId, currentWeek]);

  const handleWeekChange = (week: number) => {
    setCurrentWeek(week);
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const handleOpenChat = () => {
    setActiveTab('chat');
    // TODO: Navigate to full chat view
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Loading skeletons */}
          <div className="space-y-3">
            <div className="h-8 bg-whistle-light/20 rounded-card animate-pulse" />
            <div className="h-6 bg-whistle-light/20 rounded-card animate-pulse w-3/4" />
          </div>
          
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-referee p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-whistle-light/20 rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 bg-whistle-light/20 rounded animate-pulse w-24" />
                    <div className="h-3 bg-whistle-light/20 rounded animate-pulse w-16" />
                  </div>
                </div>
                <div className="h-6 w-8 bg-whistle-light/20 rounded-pill animate-pulse" />
                <div className="flex items-center space-x-3">
                  <div className="space-y-1 text-right">
                    <div className="h-4 bg-whistle-light/20 rounded animate-pulse w-24" />
                    <div className="h-3 bg-whistle-light/20 rounded animate-pulse w-16" />
                  </div>
                  <div className="h-10 w-10 bg-whistle-light/20 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="h-2 bg-whistle-light/20 rounded-pill animate-pulse" />
            </div>
          ))}
        </div>
        <BottomTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center space-y-4">
          <div className="text-display text-2xl">Oops!</div>
          <p className="text-muted-foreground">
            Even the refs are confused. Try again?
          </p>
          <button onClick={handleRefresh} className="btn-primary">
            Retry
          </button>
        </div>
        <BottomTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-2xl">
                {dashboardData.league.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Season {dashboardData.league.season}</span>
                {lastUpdated && (
                  <>
                    <span>•</span>
                    <span>Updated {formatLastUpdated(lastUpdated)}</span>
                  </>
                )}
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary p-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Week Selector */}
          <WeekSelector
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
          />
        </div>

        {/* Alert Bar - Placeholder */}
        <div className="card-referee p-3 bg-sport-amber/10 border-sport-amber/20">
          <div className="flex items-center gap-2">
            <div className="chip-referee bg-sport-amber/20 text-sport-amber">
              <span className="font-bold">Commissioner Notice</span>
            </div>
            <span className="text-sm">
              League dues due by Week 3. Pay up or get benched! 💸
            </span>
          </div>
        </div>

        {/* Matchups */}
        <div className="space-y-3">
          <h2 className="text-heading text-lg font-bold">
            Week {currentWeek} Matchups
          </h2>
          <div className="space-y-3">
            {dashboardData.matchups.map((matchup) => (
              <MatchupCard
                key={matchup.id}
                matchup={matchup}
                onTap={(matchup) => {
                  // TODO: Open matchup detail sheet
                  console.log('Open matchup detail:', matchup.id);
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStatsRow stats={dashboardData.quickStats} />

        {/* Chat Preview */}
        {chatData && (
          <ChatPreview 
            data={chatData} 
            onOpenChat={handleOpenChat}
          />
        )}

        {/* Bottom padding for fixed navigation */}
        <div className="h-4" />
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomTabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        chatMessageCount={chatData?.totalCount}
      />
    </div>
  );
};