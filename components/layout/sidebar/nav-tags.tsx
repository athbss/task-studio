'use client';

import {
   Archive,
   ChevronRight,
   CircleDot,
   CopyMinus,
   GitBranch,
   LayoutGrid,
   Link as LinkIcon,
   MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { motion, LayoutGroup } from 'motion/react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuAction,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useTags, useCurrentTag } from '@/hooks/use-taskmaster-queries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

export function NavTags() {
   const { data: tagsData, isLoading, error } = useTags();
   const { data: currentTagData } = useCurrentTag();
   const pathname = usePathname();
   const [viewType, setViewType] = useQueryState('view', {
      defaultValue: 'list',
      parse: (value) => (value === 'board' || value === 'list' ? value : 'list'),
      history: 'push',
   });

   if (isLoading) {
      return (
         <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarMenu>
               <SidebarMenuItem>
                  <Skeleton className="h-8 w-full" />
               </SidebarMenuItem>
               <SidebarMenuItem>
                  <Skeleton className="h-8 w-full" />
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      );
   }

   if (error || !tagsData) {
      return (
         <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarMenu>
               <SidebarMenuItem>
                  <div className="text-sm text-muted-foreground px-3 py-2">Failed to load tags</div>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      );
   }

   // Sort tags to put current tag first
   const sortedTags = [...tagsData].sort((a, b) => {
      const aIsCurrent = currentTagData?.currentTag === a.name;
      const bIsCurrent = currentTagData?.currentTag === b.name;

      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;
      return 0;
   });

   return (
      <SidebarGroup>
         <SidebarGroupLabel>Tags</SidebarGroupLabel>
         <SidebarMenu>
            <LayoutGroup>
               {sortedTags.map((tag) => {
                  const isCurrentTagPath = pathname === `/tag/${tag.name}`;
                  const isTasksActive = isCurrentTagPath && viewType === 'list';
                  const isBoardActive = isCurrentTagPath && viewType === 'board';
                  const isCurrentTag = currentTagData?.currentTag === tag.name;

                  return (
                     <motion.div
                        key={tag.name}
                        layout
                        transition={{
                           layout: { type: 'spring', bounce: 0.3, duration: 0.6 },
                        }}
                     >
                        <Collapsible asChild defaultOpen={true} className="group/collapsible">
                           <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                 <SidebarMenuButton
                                    tooltip={tag.name}
                                    className="flex items-center gap-2"
                                 >
                                    {isCurrentTag ? (
                                       <CircleDot className="size-4 shrink-0 text-primary" />
                                    ) : (
                                       <GitBranch className="size-4 shrink-0" />
                                    )}
                                    <span
                                       className={cn(
                                          'text-sm truncate flex-1 text-left',
                                          isCurrentTag ? 'font-medium' : 'font-normal'
                                       )}
                                    >
                                       {tag.name === 'master' ? 'master' : tag.name}
                                    </span>
                                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                                       {tag.taskCount}
                                    </span>
                                    <span className="w-3 shrink-0">
                                       <ChevronRight className="w-full transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </span>
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <SidebarMenuAction asChild showOnHover>
                                             <div>
                                                <MoreHorizontal />
                                                <span className="sr-only">More</span>
                                             </div>
                                          </SidebarMenuAction>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent
                                          className="w-48 rounded-lg"
                                          side="right"
                                          align="start"
                                       >
                                          <DropdownMenuItem
                                             onClick={() => {
                                                // In future: switch to this tag
                                             }}
                                          >
                                             <GitBranch className="size-4" />
                                             <span>Switch to tag</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                             <LinkIcon className="size-4" />
                                             <span>Copy tag name</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem>
                                             <Archive className="size-4" />
                                             <span>View completed tasks</span>
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                 <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                       <SidebarMenuSubButton asChild isActive={isTasksActive}>
                                          <Link
                                             href={`/tag/${tag.name}`}
                                             onClick={(e) => {
                                                if (isCurrentTagPath) {
                                                   e.preventDefault();
                                                   setViewType('list');
                                                }
                                             }}
                                          >
                                             <CopyMinus size={14} />
                                             <span>Tasks</span>
                                          </Link>
                                       </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                       <SidebarMenuSubButton asChild isActive={isBoardActive}>
                                          <Link
                                             href={`/tag/${tag.name}?view=board`}
                                             onClick={(e) => {
                                                if (isCurrentTagPath) {
                                                   e.preventDefault();
                                                   setViewType('board');
                                                }
                                             }}
                                          >
                                             <LayoutGrid size={14} />
                                             <span>Board</span>
                                          </Link>
                                       </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                 </SidebarMenuSub>
                              </CollapsibleContent>
                           </SidebarMenuItem>
                        </Collapsible>
                     </motion.div>
                  );
               })}
            </LayoutGroup>
         </SidebarMenu>
      </SidebarGroup>
   );
}
