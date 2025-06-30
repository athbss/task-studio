'use client';

import {
   Archive,
   ChevronRight,
   CopyMinus,
   GitBranch,
   LayoutGrid,
   Link as LinkIcon,
   MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';

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
import { useTags } from '@/hooks/use-taskmaster-queries';
import { Skeleton } from '@/components/ui/skeleton';

export function NavTags() {
   const { data: tagsData, isLoading, error } = useTags();
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

   return (
      <SidebarGroup>
         <SidebarGroupLabel>Tags</SidebarGroupLabel>
         <SidebarMenu>
            {tagsData.map((tag) => {
               const isCurrentTagPath = pathname === `/tag/${tag.name}`;
               const isTasksActive = isCurrentTagPath && viewType === 'list';
               const isBoardActive = isCurrentTagPath && viewType === 'board';

               return (
                  <Collapsible
                     key={tag.name}
                     asChild
                     defaultOpen={true}
                     className="group/collapsible"
                  >
                     <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                           <SidebarMenuButton
                              tooltip={tag.name}
                              className="flex items-center gap-2"
                           >
                              <GitBranch className="size-4 shrink-0" />
                              <span className="text-sm font-medium truncate flex-1 text-left">
                                 {tag.name === 'master' ? 'main' : tag.name}
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
               );
            })}
         </SidebarMenu>
      </SidebarGroup>
   );
}
