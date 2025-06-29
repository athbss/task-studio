'use client';

import {
   Archive,
   Box,
   ChevronRight,
   CopyMinus,
   GitBranch,
   Link as LinkIcon,
   MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

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

export function NavTeams() {
   const { data: tagsData, isLoading, error } = useTags();
   const { data: currentTagData } = useCurrentTag();
   const currentTag = currentTagData?.currentTag || 'master';

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
               const isCurrentTag = tag.name === currentTag;
               const tagIcon = tag.name === 'master' ? '🏠' : '🏷️';

               return (
                  <Collapsible
                     key={tag.name}
                     asChild
                     defaultOpen={true}
                     className="group/collapsible"
                  >
                     <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                           <SidebarMenuButton tooltip={tag.name} isActive={isCurrentTag}>
                              <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                                 <div className="text-sm">{tagIcon}</div>
                              </div>
                              <span className="text-sm font-medium">
                                 {tag.name === 'master' ? 'General' : tag.name}
                              </span>
                              <span className="ml-auto text-xs text-muted-foreground">
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
                                          console.log('Switch to tag:', tag.name);
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
                                 <SidebarMenuSubButton asChild>
                                    <Link href={`/lndev-ui/tag/${tag.name}`}>
                                       <CopyMinus size={14} />
                                       <span>Tasks</span>
                                    </Link>
                                 </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                 <SidebarMenuSubButton asChild>
                                    <Link href="/lndev-ui/board">
                                       <Box size={14} />
                                       <span>Board</span>
                                    </Link>
                                 </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              {tag.metadata?.description && (
                                 <SidebarMenuSubItem>
                                    <div className="px-3 py-2 text-xs text-muted-foreground">
                                       {tag.metadata.description}
                                    </div>
                                 </SidebarMenuSubItem>
                              )}
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
