// The Commissioner - Chat Preview Component
// Comic strip styled message preview

import React from 'react';
import { ChatPreviewData } from '@/types/league';
import { RefereeAvatar } from './RefereeAvatar';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface ChatPreviewProps {
  data: ChatPreviewData;
  onOpenChat?: () => void;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ data, onOpenChat }) => {
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-3">
      {/* Header with message count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-sport-blue" />
          <h2 className="text-heading text-lg font-bold">League Chat</h2>
          <div className="chip-referee">
            {data.totalCount} messages
          </div>
        </div>
        
        <button
          onClick={onOpenChat}
          className="btn-secondary text-xs flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Recent messages */}
      <div className="space-y-2">
        {data.messages.length === 0 ? (
          <div className="card-referee p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Quiet? Even your bench players talk more than this.
            </p>
          </div>
        ) : (
          data.messages.map((message) => (
            <div
              key={message.id}
              className="card-referee p-3 flex items-start gap-3"
            >
              <RefereeAvatar
                src={message.userAvatar}
                fallback={getInitials(message.userName)}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-heading">
                    {message.userName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat composer stub */}
      <div 
        className="card-referee p-3 cursor-pointer hover:shadow-insetStrong transition-all"
        onClick={onOpenChat}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-whistle-light dark:bg-stripe flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-whistle-dark" />
          </div>
          <span className="text-muted-foreground text-sm">
            Drop some trash talk...
          </span>
        </div>
      </div>
    </div>
  );
};