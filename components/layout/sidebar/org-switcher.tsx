'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { useConfig } from '@/hooks/use-taskmaster-queries';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { CreateNewTask } from './create-new-task';
import { ThemeToggle } from '../theme-toggle';
import Link from 'next/link';

export function OrgSwitcher() {
   const { data: config } = useConfig();
   const projectName = config?.global?.projectName || 'Taskmaster';
   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <div className="w-full flex gap-1 items-center pt-2">
                  <DropdownMenuTrigger asChild>
                     <SidebarMenuButton
                        size="lg"
                        className="h-8 w-fit data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                     >
                        {/* <div className="flex aspect-square size-6 items-center justify-center rounded bg-primary text-xs text-sidebar-primary-foreground">
                           TM
                        </div> */}
                        <div className="grid text-left text-sm leading-tight">
                           <span className="truncate font-semibold">{projectName}</span>
                        </div>
                        <ChevronDown />
                     </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <div className="flex-1" />

                  <ThemeToggle />

                  <CreateNewTask />
               </div>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuGroup>
                     <DropdownMenuItem asChild>
                        <Link href="/settings">
                           Settings
                           <DropdownMenuShortcut>G then S</DropdownMenuShortcut>
                        </Link>
                     </DropdownMenuItem>
                     {/* <DropdownMenuItem>Invite and manage members</DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>Download desktop app</DropdownMenuItem>
                  </DropdownMenuGroup>
                  {/* <DropdownMenuSeparator />
                  <DropdownMenuSub>
                     <DropdownMenuSubTrigger>Switch Workspace</DropdownMenuSubTrigger>
                     <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           <DropdownMenuItem>
                              {/* <div className="flex text-xs aspect-square size-6 items-center justify-center rounded bg-primary text-sidebar-primary-foreground">
                                 TM
                              </div> */}
                  {/* {projectName}
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>Create or join workspace</DropdownMenuItem>
                           <DropdownMenuItem>Add an account</DropdownMenuItem>
                        </DropdownMenuSubContent>
                     </DropdownMenuPortal>
                  </DropdownMenuSub> */}
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
