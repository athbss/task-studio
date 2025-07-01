'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { RiSlackLine } from '@remixicon/react';

export default function Notifications() {
   const [notifications, setNotifications] = useState({
      teamTaskAdded: false,
      taskCompleted: false,
      taskAddedToTriage: false,
   });

   const handleCheckboxChange = (key: keyof typeof notifications) => {
      setNotifications((prev) => ({
         ...prev,
         [key]: !prev[key],
      }));
   };

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8 relative"
               aria-label="Notifications"
            >
               <Bell className="h-4 w-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80 p-0" align="end">
            <div className="px-4 pt-3 pb-3">
               <h3 className="text-sm font-medium mb-3">Inbox notifications</h3>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label
                        htmlFor="team-task-added"
                        className="text-xs text-muted-foreground cursor-pointer flex-1"
                     >
                        A task is added to the team
                     </label>
                     <Checkbox
                        id="team-task-added"
                        checked={notifications.teamTaskAdded}
                        onCheckedChange={() => handleCheckboxChange('teamTaskAdded')}
                     />
                  </div>

                  <div className="flex items-center justify-between">
                     <label
                        htmlFor="task-completed"
                        className="text-xs text-muted-foreground cursor-pointer flex-1"
                     >
                        A task is marked completed or canceled
                     </label>
                     <Checkbox
                        id="task-completed"
                        checked={notifications.taskCompleted}
                        onCheckedChange={() => handleCheckboxChange('taskCompleted')}
                     />
                  </div>

                  <div className="flex items-center justify-between">
                     <label
                        htmlFor="task-triage"
                        className="text-xs text-muted-foreground cursor-pointer flex-1"
                     >
                        A task is added to the triage queue
                     </label>
                     <Checkbox
                        id="task-triage"
                        checked={notifications.taskAddedToTriage}
                        onCheckedChange={() => handleCheckboxChange('taskAddedToTriage')}
                     />
                  </div>
               </div>
            </div>

            <div className="border-t py-2 px-4 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <RiSlackLine className="size-4" />
                  <span className="text-xs font-medium">Slack notifications</span>
               </div>
               <Button size="xs" variant="outline">
                  Configure
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   );
}
