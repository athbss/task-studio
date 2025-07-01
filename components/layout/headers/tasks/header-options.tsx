'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ViewType } from '@/store/view-store';
import { LayoutGrid, LayoutList, SlidersHorizontal } from 'lucide-react';
import { Filter } from './filter';
import { useQueryState } from 'nuqs';

export default function HeaderOptions() {
   const [view, setView] = useQueryState('view', {
      defaultValue: 'list',
      parse: (value) => (value === 'board' || value === 'list' ? value : 'list'),
      history: 'push',
   });

   const handleViewChange = (type: ViewType) => {
      setView(type);
   };

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <Filter />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button className="relative" size="xs" variant="secondary">
                  <SlidersHorizontal className="size-4 mr-1" />
                  Display
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 flex p-3 gap-2" align="end">
               <DropdownMenuItem
                  onClick={() => handleViewChange('list')}
                  className={cn(
                     'w-full text-xs border border-accent flex flex-col gap-1',
                     view === 'list' ? 'bg-accent' : ''
                  )}
               >
                  <LayoutList className="size-4" />
                  List
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => handleViewChange('board')}
                  className={cn(
                     'w-full text-xs border border-accent flex flex-col gap-1',
                     view === 'board' ? 'bg-accent' : ''
                  )}
               >
                  <LayoutGrid className="size-4" />
                  Board
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}
