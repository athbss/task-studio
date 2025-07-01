'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, Triangle } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';

interface EstimateSelectorProps {
   estimate?: number;
   taskId: string;
   showLabel?: boolean;
}

const estimates = [
   { value: 1, label: '1/10', complexity: 'Low' },
   { value: 2, label: '2/10', complexity: 'Low' },
   { value: 3, label: '3/10', complexity: 'Low' },
   { value: 4, label: '4/10', complexity: 'Low' },
   { value: 5, label: '5/10', complexity: 'Medium' },
   { value: 6, label: '6/10', complexity: 'Medium' },
   { value: 7, label: '7/10', complexity: 'Medium' },
   { value: 8, label: '8/10', complexity: 'High' },
   { value: 9, label: '9/10', complexity: 'High' },
   { value: 10, label: '10/10', complexity: 'High' },
];

export function EstimateSelector({ estimate, taskId, showLabel = false }: EstimateSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<number | undefined>(estimate);

   useEffect(() => {
      setValue(estimate);
   }, [estimate]);

   const handleEstimateChange = (estimateValue: string) => {
      const newEstimate = parseInt(estimateValue, 10);
      setValue(newEstimate);
      setOpen(false);

      // TODO: Call API to update task estimate
      console.log(`Updating estimate for ${taskId} to ${newEstimate}`);
   };

   const selectedEstimate = estimates.find((est) => est.value === value);

   if (showLabel) {
      return (
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="w-full justify-start gap-2 h-8 px-2 font-normal"
                  size="sm"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
               >
                  <Triangle className="h-4 w-4" />
                  <span className="text-sm">
                     {selectedEstimate ? selectedEstimate.label : 'Set estimate'}
                  </span>
               </Button>
            </PopoverTrigger>
            <PopoverContent className="border-input w-full min-w-[200px] p-0" align="end">
               <Command>
                  <CommandList>
                     <CommandEmpty>No estimate found.</CommandEmpty>
                     <CommandGroup>
                        {estimates.map((item) => (
                           <CommandItem
                              key={item.value}
                              value={item.value.toString()}
                              onSelect={handleEstimateChange}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Triangle
                                    className={cn(
                                       'h-4 w-4',
                                       item.value >= 8
                                          ? 'text-red-500'
                                          : item.value >= 5
                                            ? 'text-yellow-500'
                                            : 'text-green-500'
                                    )}
                                 />
                                 <span>{item.label}</span>
                                 <span className="text-xs text-muted-foreground">
                                    {item.complexity}
                                 </span>
                              </div>
                              {value === item.value && <CheckIcon size={16} className="ml-auto" />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      );
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               id={id}
               className="size-7 flex items-center justify-center"
               size="icon"
               variant="ghost"
               role="combobox"
               aria-expanded={open}
            >
               <Triangle className="text-muted-foreground size-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="border-input w-full min-w-[200px] p-0" align="start">
            <Command>
               <CommandList>
                  <CommandEmpty>No estimate found.</CommandEmpty>
                  <CommandGroup>
                     {estimates.map((item) => (
                        <CommandItem
                           key={item.value}
                           value={item.value.toString()}
                           onSelect={handleEstimateChange}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <Triangle
                                 className={cn(
                                    'h-4 w-4',
                                    item.value >= 8
                                       ? 'text-red-500'
                                       : item.value >= 5
                                         ? 'text-yellow-500'
                                         : 'text-green-500'
                                 )}
                              />
                              <span>{item.label}</span>
                           </div>
                           {value === item.value && <CheckIcon size={16} className="ml-auto" />}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
