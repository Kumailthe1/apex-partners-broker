'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onOpenChange, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-4 sm:mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 flex-shrink-0">
              <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            </div>
            <DialogTitle className="text-lg sm:text-xl">Confirm Logout</DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Are you sure you want to logout? You'll need to sign in again to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto sm:flex-initial px-4 py-2.5 sm:py-2 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="w-full sm:w-auto sm:flex-initial px-4 py-2.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:scale-105 transition-transform text-sm sm:text-base"
          >
            Logout
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

