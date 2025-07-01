'use client';

import { cn } from '@/lib/utils';

interface SubtaskProgressProps {
   completed: number;
   total: number;
   className?: string;
}

export function SubtaskProgress({ completed, total, className }: SubtaskProgressProps) {
   if (total === 0) return null;

   const percentage = (completed / total) * 100;
   const radius = 7;
   const strokeWidth = 2;
   const circumference = 2 * Math.PI * radius;
   const strokeDashoffset = circumference - (percentage / 100) * circumference;

   return (
      <div className={cn('flex items-center gap-1.5', className)}>
         <div className="relative inline-flex size-[14px]">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
               {/* Background circle */}
               <circle
                  cx="8"
                  cy="8"
                  r={radius}
                  fill="none"
                  strokeWidth={strokeWidth}
                  stroke="hsl(var(--border))"
                  className="transition-all duration-200"
               />
               {/* Progress circle - using a green color similar to Linear */}
               <circle
                  cx="8"
                  cy="8"
                  r={radius}
                  fill="none"
                  strokeWidth={strokeWidth}
                  stroke={percentage === 100 ? 'hsl(142 76% 36%)' : 'hsl(var(--muted-foreground))'}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 8 8)"
                  className="transition-all duration-300"
               />
            </svg>
         </div>
         <span className="text-xs text-muted-foreground font-medium">
            {completed}/{total}
         </span>
      </div>
   );
}
