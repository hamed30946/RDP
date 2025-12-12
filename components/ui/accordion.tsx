'use client'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

export const Accordion = AccordionPrimitive.Root
export const AccordionItem = AccordionPrimitive.Item
export const AccordionTrigger = ({ className, children, ...props }: AccordionPrimitive.AccordionTriggerProps) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      className={cn('flex flex-1 items-center justify-between py-3 text-left text-sm font-medium', className)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)

export const AccordionContent = ({ className, children, ...props }: AccordionPrimitive.AccordionContentProps) => (
  <AccordionPrimitive.Content className={cn('pt-2 text-sm text-slate-600 dark:text-slate-300', className)} {...props}>
    {children}
  </AccordionPrimitive.Content>
)
