// The Commissioner - Bottom Tab Navigation
// Sports-themed mobile navigation

import React from 'react';
import { Trophy, BarChart3, MessageCircle, User } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  chatMessageCount?: number;
}

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab,
  onTabChange,
  chatMessageCount = 0,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'fantasy',
      label: 'Fantasy',
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      id: 'scores',
      label: 'Scores',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageCircle className="h-5 w-5" />,
      badge: chatMessageCount > 0 ? chatMessageCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-panelLt dark:bg-panel border-t border-border shadow-card z-50">
      <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] transition-all active:scale-95 ${
                isActive
                  ? 'text-sport-blue bg-sport-blue/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-whistle-light/10'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-sport-red rounded-pill flex items-center justify-center">
                    <span className="text-xs font-bold text-cream">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  </div>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};