'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/ui/label';
import { TreeNode } from '@/types/backend-types';
import { useCreateMenu, useUpdateMenu } from '@/hooks/use-menu';
import { useEffect, useState } from 'react';
import { IconPickerDialog } from '@/components/icon-picker-dialog';
import { z } from 'zod';

// NOTE: No .default() here — that causes Zod v4 input/output type divergence
// which breaks @hookform/resolvers type inference. Defaults are set in useForm.
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  path: z.string().min(1, 'Path is required'),
  icon: z.string().optional(),
  funcOrder: z.number().min(0),
  parentId: z.number().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface MenuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parent: TreeNode | null;
  editItem?: TreeNode | null;
}

export function MenuFormDialog({ open, onOpenChange, parent, editItem }: MenuFormDialogProps) {
  const isEdit = !!editItem;
  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const [showIconPicker, setShowIconPicker] = useState(false);

  // ... (form initialization remains same)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      path: '',
      icon: '',
      funcOrder: 0,
      parentId: parent?.functionId ?? null,
    },
  });

  useEffect(() => {
    if (open) {
      if (editItem) {
        form.reset({
          name: editItem.name ?? '',
          path: editItem.path ?? '',
          icon: editItem.icon ?? '',
          funcOrder: editItem.funcOrder ?? 0,
          parentId: null,
        });
      } else {
        form.reset({
          name: '',
          path: parent?.path ?? '',
          icon: '',
          funcOrder: 0,
          parentId: parent?.functionId ?? null,
        });
      }
    }
  }, [open, editItem, parent, form]);

  const onSubmit = (data: FormValues) => {
    if (isEdit && editItem) {
      const updatedNode: TreeNode = {
        ...editItem,
        name: data.name,
        path: data.path,
        icon: data.icon,
        funcOrder: data.funcOrder,
      };
      updateMutation.mutate(updatedNode, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      const newNode: TreeNode = {
        name: data.name,
        path: data.path,
        icon: data.icon,
        funcOrder: data.funcOrder,
      };
      createMutation.mutate(
        { menu: newNode, parentId: data.parentId ?? 0 },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const currentIcon = form.watch('icon');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update menu details.'
                : `Add a new menu item ${parent ? `under "${parent.name}"` : 'at root'}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register('name')} placeholder="Menu Name" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="path">Path</Label>
              <Input id="path" {...form.register('path')} placeholder="/route-path" />
              {form.formState.errors.path && (
                <p className="text-sm text-destructive">{form.formState.errors.path.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (Lucide)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowIconPicker(true)}
                >
                  {currentIcon ? (
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">Selected:</span>
                      <span className="font-medium">{currentIcon}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select Icon...</span>
                  )}
                </Button>
                {currentIcon && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => form.setValue('icon', '')}
                    title="Clear Icon"
                  >
                    <span className="sr-only">Clear</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                )}
              </div>
              <input type="hidden" {...form.register('icon')} />
              {form.formState.errors.icon && (
                <p className="text-sm text-destructive">{form.formState.errors.icon.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="funcOrder">Order</Label>
              <Input
                id="funcOrder"
                type="number"
                {...form.register('funcOrder', { valueAsNumber: true })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <IconPickerDialog
        open={showIconPicker}
        onOpenChange={setShowIconPicker}
        onSelect={(iconName) => form.setValue('icon', iconName)}
      />
    </>
  );
}
