'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTasksStore } from '@/store/tasks-store';
import { User, users } from '@/mock-data/users';
import { CheckIcon, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useId, useState } from 'react';

interface AssigneeSelectorProps {
   user: User | null;
   taskId: string;
   showLabel?: boolean;
}

export function AssigneeSelector({ user, taskId, showLabel = true }: AssigneeSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<string | null>(user?.id || null);

   const { updateTaskAssignee } = useTasksStore();

   useEffect(() => {
      setValue(user?.id || null);
   }, [user?.id]);

   const handleAssigneeChange = (userId: string) => {
      setValue(userId);
      setOpen(false);

      if (taskId) {
         const newUser = users.find((u) => u.id === userId);
         if (newUser) {
            updateTaskAssignee(taskId, newUser);
         }
      }
   };

   const selectedUser = value ? users.find((u) => u.id === value) : null;

   return (
      <div>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className={
                     showLabel
                        ? 'w-full justify-start gap-2 h-8 px-2 font-normal'
                        : 'size-7 flex items-center justify-center'
                  }
                  size={showLabel ? 'sm' : 'icon'}
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
               >
                  {selectedUser ? (
                     <>
                        <Avatar className={showLabel ? 'size-5' : 'size-4'}>
                           <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                           <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {showLabel && <span className="text-sm">{selectedUser.name}</span>}
                     </>
                  ) : (
                     <>
                        <UserPlus className="h-4 w-4" />
                        {showLabel && <span className="text-sm">Assign</span>}
                     </>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="border-input w-48 p-0" align="start">
               <Command>
                  <CommandInput placeholder="Assign to..." />
                  <CommandList>
                     <CommandEmpty>No user found.</CommandEmpty>
                     <CommandGroup>
                        {users.map((user) => (
                           <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={handleAssigneeChange}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Avatar className="size-5">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 <span className="text-xs">{user.name}</span>
                              </div>
                              {value === user.id && <CheckIcon size={14} className="ml-auto" />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
}
