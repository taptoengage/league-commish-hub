// The Commissioner - Referee-themed Avatar Component
// Circular avatar with referee stripe border

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface RefereeAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export const RefereeAvatar: React.FC<RefereeAvatarProps> = ({
  src,
  alt = 'Team avatar',
  fallback = '?',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Referee stripe border effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-stripe via-whistle-light to-stripe p-0.5">
        <Avatar className={`${sizeClasses[size]} bg-panelLt dark:bg-panel`}>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback className="bg-whistle-light dark:bg-stripe text-stripe dark:text-whistle-light font-semibold">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};