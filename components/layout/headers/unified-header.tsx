'use client';

import { usePathname } from 'next/navigation';
import { useTaskViewStore } from '@/store/task-view-store';
import { useEffect, useRef, useState } from 'react';
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
   ListTodo,
   CircleDashed,
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
import { Filter } from '@/components/layout/headers/tasks/filter';
import { useCurrentTagWithTasks, useTags } from '@/hooks/use-taskmaster-queries';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/layout/theme-toggle';

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
   const { isOpen: isTaskViewOpen, closeTask, selectedTaskId } = useTaskViewStore();
   const { isSearchOpen, toggleSearch, closeSearch, setSearchQuery, searchQuery } =
      useSearchStore();
   const [viewType, setViewType] = useQueryState('view', {
      defaultValue: 'list',
      parse: (value) => (value === 'board' || value === 'list' ? value : 'list'),
      history: 'push',
   });
   const [taskFilter, setTaskFilter] = useQueryState('filter', {
      defaultValue: 'all',
      parse: (value) => (value === 'all' || value === 'active' ? value : 'all'),
      history: 'push',
   });
   const currentTagData = useCurrentTagWithTasks();
   const { data: tagsData } = useTags();

   // Local state for input value and debounced search
   const [localSearchValue, setLocalSearchValue] = useState(searchQuery);
   const debouncedSearchValue = useDebounce(localSearchValue, 300);

   // Search refs
   const searchInputRef = useRef<HTMLInputElement>(null);
   const searchContainerRef = useRef<HTMLDivElement>(null);
   const previousValueRef = useRef<string>('');

   // Get tag from pathname
   const pathSegments = pathname.split('/');
   const isTagRoute = pathSegments[1] === 'tag';
   const currentTag = isTagRoute ? pathSegments[2] : null;

   // Update search store when debounced value changes
   useEffect(() => {
      setSearchQuery(debouncedSearchValue);
   }, [debouncedSearchValue, setSearchQuery]);

   // Sync local value with external search query changes
   useEffect(() => {
      setLocalSearchValue(searchQuery);
   }, [searchQuery]);

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
            if (localSearchValue.trim() === '') {
               closeSearch();
               setLocalSearchValue('');
            }
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isSearchOpen, closeSearch, localSearchValue]);

   // Determine the current page
   const getPageType = () => {
      if (isTaskViewOpen) return 'task-detail';
      if (pathname === '/tasks') return 'tasks';
      if (pathname === '/tags') return 'tags';
      if (pathname === '/members') return 'members';
      if (pathname === '/settings') return 'settings';
      if (isTagRoute) return 'tag-tasks';
      return 'unknown';
   };

   const pageType = getPageType();

   // Get configuration based on page type
   const getHeaderConfig = (): HeaderConfig => {
      switch (pageType) {
         case 'task-detail':
            return {
               title: '',
               showSearch: false,
               showCount: false,
               showNotifications: false,
               showOptions: false,
            };
         case 'tasks':
         case 'tag-tasks':
            return {
               title: currentTag || 'Tasks',
               showSearch: true,
               showCount: true,
               showNotifications: true,
               showOptions: true,
            };
         case 'tags':
            return {
               title: 'Tags',
               showCount: true,
               actionButton: {
                  label: 'Create tag',
                  icon: Plus,
                  onClick: () => {},
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
                  onClick: () => {},
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

   // Get current task for task detail view
   const getCurrentTask = () => {
      if (!selectedTaskId || !isTaskViewOpen) return null;

      const idParts = selectedTaskId.split('-');
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

   // Render task detail header
   if (pageType === 'task-detail' && currentTask) {
      return (
         <header className="w-full flex flex-col border-b">
            <div className="flex items-center justify-between px-6 py-3">
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={closeTask} className="h-8 w-8">
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="text-xs font-mono">
                     {currentTag?.toUpperCase() + '-' || ''}
                     {currentTask.id}
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
               <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="hidden font-bold sm:inline-block">
                     Task Studio
                  </span>
               </a>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
               <div className="w-full flex-1 md:w-auto md:flex-none">
                  {/* Add search or other controls here */}
               </div>
               <nav className="flex items-center space-x-2">
                  <LanguageSelector />
                  <ThemeToggle />
               </nav>
            </div>
         </div>
      </header>
   );
}
