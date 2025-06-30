'use client';

import { usePathname } from 'next/navigation';
import { useIssueViewStore } from '@/store/issue-view-store';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
   Search,
   Plus,
   Users,
   ArrowLeft,
   MoreHorizontal,
   Star,
   ChevronUp,
   ChevronDown,
   MoreVertical,
   SlidersHorizontal,
   LayoutGrid,
   LayoutList,
} from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Badge } from '@/components/ui/badge';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSearchStore } from '@/store/search-store';
import Notifications from '@/components/layout/headers/issues/notifications';
import { Filter } from '@/components/layout/headers/issues/filter';
import { useCurrentTagWithTasks } from '@/hooks/use-taskmaster-queries';
import { cn } from '@/lib/utils';

interface HeaderConfig {
   title: string;
   showSearch?: boolean;
   showCount?: boolean;
   showNotifications?: boolean;
   actionButton?: {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      onClick: () => void;
   };
   showOptions?: boolean;
}

export function UnifiedHeader() {
   const pathname = usePathname();
   const { isOpen: isIssueViewOpen, closeIssue, selectedIssueId } = useIssueViewStore();
   const { isSearchOpen, toggleSearch, closeSearch, setSearchQuery, searchQuery } =
      useSearchStore();
   const [viewType, setViewType] = useQueryState('view', {
      defaultValue: 'list',
      parse: (value) => (value === 'board' || value === 'list' ? value : 'list'),
   });
   const currentTagData = useCurrentTagWithTasks();

   // Search refs
   const searchInputRef = useRef<HTMLInputElement>(null);
   const searchContainerRef = useRef<HTMLDivElement>(null);
   const previousValueRef = useRef<string>('');

   // Get tag from pathname
   const pathSegments = pathname.split('/');
   const isTagRoute = pathSegments[1] === 'tag';
   const currentTag = isTagRoute ? pathSegments[2] : null;

   // Search effects
   useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
         searchInputRef.current.focus();
      }
   }, [isSearchOpen]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target as Node) &&
            isSearchOpen
         ) {
            if (searchQuery.trim() === '') {
               closeSearch();
            }
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isSearchOpen, closeSearch, searchQuery]);

   // Determine the current page
   const getPageType = () => {
      if (isIssueViewOpen) return 'issue-detail';
      if (pathname === '/issues') return 'issues';
      if (pathname === '/projects') return 'projects';
      if (pathname === '/members') return 'members';
      if (pathname === '/settings') return 'settings';
      if (isTagRoute) return 'tag-issues';
      return 'unknown';
   };

   const pageType = getPageType();

   // Get configuration based on page type
   const getHeaderConfig = (): HeaderConfig => {
      switch (pageType) {
         case 'issue-detail':
            return {
               title: '',
               showSearch: false,
               showCount: false,
               showNotifications: false,
               showOptions: false,
            };
         case 'issues':
         case 'tag-issues':
            return {
               title: currentTag || 'Issues',
               showSearch: true,
               showCount: true,
               showNotifications: true,
               showOptions: true,
            };
         case 'projects':
            return {
               title: 'Projects',
               showCount: true,
               actionButton: {
                  label: 'Create project',
                  icon: Plus,
                  onClick: () => console.log('Create project'),
               },
               showOptions: true,
            };
         case 'members':
            return {
               title: 'Members',
               showCount: true,
               actionButton: {
                  label: 'Invite',
                  icon: Users,
                  onClick: () => console.log('Invite member'),
               },
               showOptions: true,
            };
         case 'settings':
            return {
               title: 'Settings',
               showOptions: false,
            };
         default:
            return {
               title: 'Page',
               showOptions: false,
            };
      }
   };

   const config = getHeaderConfig();

   // Get current task for issue detail view
   const getCurrentTask = () => {
      if (!selectedIssueId || !isIssueViewOpen) return null;

      const idParts = selectedIssueId.split('-');
      let numericId: number;

      if (idParts.length > 1) {
         numericId = parseInt(idParts[idParts.length - 1]);
      } else {
         numericId = parseInt(idParts[0]);
      }

      if (isNaN(numericId)) return null;

      return currentTagData.tasks.find((t) => t.id === numericId);
   };

   const currentTask = getCurrentTask();

   // Render issue detail header
   if (pageType === 'issue-detail' && currentTask) {
      return (
         <header className="w-full flex flex-col border-b">
            <div className="flex items-center justify-between px-6 py-3">
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={closeIssue} className="h-8 w-8">
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="text-xs font-mono">
                     {currentTag?.toUpperCase() || 'MASTER'}-{currentTask.id}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                     <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                     <Star className="h-4 w-4" />
                  </Button>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronUp className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className="h-4 w-4" />
                     </Button>
                  </div>

                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium">Properties</span>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div>
         </header>
      );
   }

   // Render standard header
   return (
      <header className="w-full flex flex-col border-b">
         {/* Header Nav */}
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            {config.showSearch ? (
               <>
                  <SidebarTrigger className="" />
                  <div className="flex items-center gap-2">
                     {isSearchOpen ? (
                        <div
                           ref={searchContainerRef}
                           className="relative flex items-center justify-center w-64 transition-all duration-200 ease-in-out"
                        >
                           <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                           <Input
                              type="search"
                              ref={searchInputRef}
                              value={searchQuery}
                              onChange={(e) => {
                                 previousValueRef.current = searchQuery;
                                 const newValue = e.target.value;
                                 setSearchQuery(newValue);

                                 if (previousValueRef.current && newValue === '') {
                                    const inputEvent = e.nativeEvent as InputEvent;
                                    if (
                                       inputEvent.inputType !== 'deleteContentBackward' &&
                                       inputEvent.inputType !== 'deleteByCut'
                                    ) {
                                       closeSearch();
                                    }
                                 }
                              }}
                              placeholder="Search issues..."
                              className="pl-8 h-7 text-sm"
                              onKeyDown={(e) => {
                                 if (e.key === 'Escape') {
                                    if (searchQuery.trim() === '') {
                                       closeSearch();
                                    } else {
                                       setSearchQuery('');
                                    }
                                 }
                              }}
                           />
                        </div>
                     ) : (
                        <>
                           <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleSearch}
                              className="h-8 w-8"
                              aria-label="Search"
                           >
                              <Search className="h-4 w-4" />
                           </Button>
                           <Notifications />
                        </>
                     )}
                  </div>
               </>
            ) : (
               <>
                  <div className="flex items-center gap-2">
                     <SidebarTrigger className="" />
                     <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{config.title}</span>
                        {config.showCount && (
                           <span className="text-xs bg-accent rounded-md px-1.5 py-1">
                              {currentTagData.tasks.length}
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     {config.actionButton && (
                        <Button
                           className="relative"
                           size="xs"
                           variant="secondary"
                           onClick={config.actionButton.onClick}
                        >
                           <config.actionButton.icon className="size-4" />
                           <span className="hidden sm:inline ml-1">
                              {config.actionButton.label}
                           </span>
                        </Button>
                     )}
                  </div>
               </>
            )}
         </div>

         {/* Header Options */}
         {config.showOptions && (
            <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
               <Filter />
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button className="relative" size="xs" variant="secondary">
                        <SlidersHorizontal className="size-4 mr-1" />
                        Display
                        {viewType === 'board' && (
                           <span className="absolute right-0 top-0 w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 flex p-3 gap-2" align="end">
                     <DropdownMenuItem
                        onClick={() => setViewType('list')}
                        className={cn(
                           'w-full text-xs border border-accent flex flex-col gap-1',
                           viewType === 'list' ? 'bg-accent' : ''
                        )}
                     >
                        <LayoutList className="size-4" />
                        List
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => setViewType('board')}
                        className={cn(
                           'w-full text-xs border border-accent flex flex-col gap-1',
                           viewType === 'board' ? 'bg-accent' : ''
                        )}
                     >
                        <LayoutGrid className="size-4" />
                        Board
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         )}
      </header>
   );
}
